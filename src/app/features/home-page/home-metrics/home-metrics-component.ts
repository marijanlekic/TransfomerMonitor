import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {DatePipe, DecimalPipe} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';

import {TranslatePipe} from '@ngx-translate/core';

import {Transformer} from '@core/models/transformer';
import {LoadingStateDirective} from '@shared/directives/loading-state.directive';

@Component({
  standalone: true,
  selector: 'app-home-page-metrics-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    DecimalPipe,
    LoadingStateDirective,
    MatIconModule,
    TranslatePipe,
    MatTooltip
  ],
  template: `
    <!-- Metrics card list   -->
    <div class="metrics-card-list">

      <!-- Date card -->
      <div class="metrics-card box-shadow rounded-edges" [appLoadingState]="!data()">

        <div class="card-content">
          <h3 class="card-header">{{ 'PAGES.HOME.METRICS_DATE' | translate }}</h3>
          <div class="card-value">{{ data()?.date | date }} &nbsp;</div>
        </div>

        <div class="grid-item-icon">
          <mat-icon class="card-icon">calendar_today</mat-icon>
        </div>

      </div>

      <!-- Max voltage card -->
      <div class="metrics-card box-shadow rounded-edges" [appLoadingState]="!data()" classToAdd="animateUpDown"
           matTooltip="{{'PAGES.HOME.MIN_VOLTAGE_TOOLTIP' | translate}}">

        <div class="card-content">
          <h3 class="card-header">{{ 'PAGES.HOME.MAX_VOLTAGE' | translate }}</h3>
          <div class="card-value">{{ data()?.max | number: '1.0-2' }}V</div>
        </div>

        <div class="grid-item-icon animation-object">
          <mat-icon class="card-icon text-clr-red-400">arrow_upward</mat-icon>
        </div>

      </div>

      <!-- Avg voltage card -->
      <div class="metrics-card box-shadow rounded-edges" [appLoadingState]="!data()" classToAdd="animateDownUp"
           matTooltip="{{'PAGES.HOME.MAX_VOLTAGE_TOOLTIP' | translate}}">

        <div class="card-content">
          <h3 class="card-header">{{ 'PAGES.HOME.MIN_VOLTAGE' | translate }}</h3>
          <div class="card-value">{{ data()?.min | number: '1.0-2' }}V</div>
        </div>

        <div class="grid-item-icon animation-object">
          <mat-icon class="card-icon text-clr-green-400">arrow_downward</mat-icon>
        </div>

      </div>

      <!-- Avg voltage card -->
      <div class="metrics-card box-shadow rounded-edges" [appLoadingState]="!data()" classToAdd="animateRotate"
           matTooltip="{{'PAGES.HOME.AVG_VOLTAGE_TOOLTIP' | translate}}">

        <div class="card-content">
          <h3 class="card-header">{{ 'PAGES.HOME.AVERAGE_VOLTAGE' | translate }}</h3>
          <div class="card-value">{{ (data()?.avg)| number: '1.0-2' }}V</div>
        </div>

        <div class="grid-item-icon animation-object">
          <mat-icon class="card-icon text-clr-blue-400">vertical_align_center</mat-icon>
        </div>

      </div>

    </div>
  `,
  styleUrl: './home-metrics-component.scss'
})
export class HomeMetricsComponent {

  /** Component inputs */
  metricsData = input<Transformer[] | null>();

  /** Data that populates cards */
  data = computed<{
    date: string | Date;
    max: number;
    min: number;
    avg: number;
  } | null>(() => {
    const data = this.metricsData();

    if (!data || !data[0]) {
      return null;
    }

    // Get first transformer
    const firstTransformer = data[0];

    // Array of all voltages (flattened from all transformers)
    const allVoltages = data.flatMap(t =>
      t.lastTenVoltgageReadings.map(v => v.voltage));

    return {
      date: firstTransformer.lastTenVoltgageReadings[0].timestamp,
      max: Math.max(...allVoltages),
      min: Math.min(...allVoltages),
      avg: allVoltages.reduce((acc, item) => acc + +item, 0) / allVoltages.length
    };

  })

}
