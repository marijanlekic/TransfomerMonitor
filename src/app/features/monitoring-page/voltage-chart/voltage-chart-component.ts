import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  OnInit,
  output,
} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {ActivatedRoute, Router} from '@angular/router';
import {MatOptionModule, MatPseudoCheckbox} from '@angular/material/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

import {PlotlyComponent} from 'angular-plotly.js';

import {Transformer} from '@core/models/transformer';

import {ResizeAppPlotlyDirective} from '@shared/directives/plotly-resize.directive';
import {TranslatePipe} from '@ngx-translate/core';

const BAR_CHART_LAYOUT_CONFIG = {
  hoverdistance: 30,
  height: 372,
  hovermode: 'closest',
  title: {},
  xaxis: {
    title: 'Date',
    type: 'date',
    tickformat: '%b %d'
  },
  yaxis: {
    title: 'Value',
    type: 'number',
    ticksuffix: 'V'
  },
  autosize: true
}

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-voltage-chart-component',
  imports: [
    PlotlyComponent,
    ResizeAppPlotlyDirective,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatPseudoCheckbox,
    TranslatePipe
  ],
  template: `
    <div class="dropdown">

      <mat-form-field appearance="outline" class="filter-item">
        <mat-label>{{ 'PRIMITIVES.SELECT' | translate }}</mat-label>
        <mat-select #healthRef multiple [formControl]="selectTransformerFormControl">

          <!-- Select/Deselect all option -->
          <mat-option class="hide-material-checkbox" (click)="onToggleSelectAll(); $event.stopPropagation()">
            <mat-pseudo-checkbox [state]=" areAllSelected ? 'checked': 'unchecked'"></mat-pseudo-checkbox>
            {{ areAllSelected ? ('PRIMITIVES.DESELECT_ALL' | translate) : ('PRIMITIVES.SELECT_ALL' | translate) }}
          </mat-option>

          <!--All options -->
          @for (option of transformerList(); track $index) {
            <mat-option [value]="option.assetId">{{ option.name }}</mat-option>
          }

        </mat-select>
      </mat-form-field>

    </div>

    <!-- Bar chart showing one transformer with values for latest period -->
    <div class="chart-card">

      <plotly-plot class="plotly"
                   [appPlotlyResize]="transformerList()"
                   [data]="barChartData()"
                   [layout]="barChartLayout"
                   (hover)="onHoverChartLine($event)"
                   (unhover)="onUnHoverChartLine()"
                   [useResizeHandler]="true"
                   [config]="chartConfig">
      </plotly-plot>

    </div>

  `,
  styleUrl: './voltage-chart-component.scss'
})
export class VoltageChartComponent implements OnInit {

  readonly barChartLayout = BAR_CHART_LAYOUT_CONFIG;
  readonly chartConfig = {responsive: true, modeBarButtons: [['toImage']], displaylogo: false}

  /** Injected Dependencies */
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  /** Component inputs */
  transformerList: InputSignal<Transformer[] | undefined> = input.required();
  selectedTransformerList: InputSignal<number[]> = input.required();
  highlightedTransformer: InputSignal<number | undefined> = input();

  /** Component outputs */
  transfomerHighlighted = output<number | undefined>();

  selectTransformerFormControl = new FormControl();

  /** Returns true if all checkboxes are selected */
  get areAllSelected() {
    const selected = (this.selectTransformerFormControl.value || []).filter(Boolean);
    return selected.length === this.transformerList()?.length;
  }

  /** Data that is going to be displayed in a chart */
  barChartData = computed(() => {

    const transformerList = this.transformerList() || [];
    const selectedTransformerList = this.selectedTransformerList() || [];
    const highlightedTransformer = this.highlightedTransformer();

    // Filter data if selected are not in the list of transformers
    return transformerList
      .filter(row => !selectedTransformerList.length || selectedTransformerList.includes(row.assetId))
      .map((transform) => {

        const readings = transform.lastTenVoltgageReadings;

        return {
          x: [...readings.map(r => r.timestamp)],
          y: [...readings.map(r => +r.voltage)],
          mode: 'lines+markers',
          opacity: highlightedTransformer !== undefined ? (highlightedTransformer === transform.assetId ? 1 : 0.2) : 1,
          name: transform.name,
          id: transform.assetId,
          hovertemplate: '%{x} - %{y}'
        }

      });

  })

  private effect = effect(() => {

    // On transformer or selection change update form control (add/remove selections)
    const selectedTransformer = this.transformerList()?.filter(row =>
      this.selectedTransformerList().includes(row.assetId))
      .map(a => a.assetId);

    this.selectTransformerFormControl.setValue(selectedTransformer, {emitEvent: false});

    // If there are no transformers disable select input
    if (this.transformerList()?.length) {
      this.selectTransformerFormControl.enable({emitEvent: false})
    } else {
      this.selectTransformerFormControl.disable({emitEvent: false})
    }

  });

  ngOnInit(): void {

    // On change selection update query parameters in URL
    this.selectTransformerFormControl.valueChanges.subscribe((values) => {

      const selectedIdList = values.join(',').length ? values.join(',') : null;

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {selectedId: selectedIdList},
        queryParamsHandling: 'merge'
      }).then();

    })

  }

  /** Triggered when user hovers chart line */
  onHoverChartLine(event: any) {
    const hoveredLineId = event.points[0].data.id;
    this.transfomerHighlighted.emit(hoveredLineId);
  }

  /** Triggered when user unHovers chart line */
  onUnHoverChartLine() {
    this.transfomerHighlighted.emit(undefined);
  }

  /** Triggered when user click on Select/Unselect all option */
  onToggleSelectAll() {
    const selectedValues = this.areAllSelected ? [] : [...(this.transformerList()?.map(a => a.assetId) || [])]
    this.selectTransformerFormControl.setValue(selectedValues);
  }

}
