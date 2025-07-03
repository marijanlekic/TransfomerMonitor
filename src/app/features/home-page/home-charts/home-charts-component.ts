import {ChangeDetectionStrategy, Component, computed, DOCUMENT, inject, input} from '@angular/core';
import {PlotlyComponent} from 'angular-plotly.js';

import {Transformer} from '@core/models/transformer';
import {TRANSFORMER_HEALTH_COLORS} from '@core/constants/transformer-health.map';
import {TransformerHealth} from '@core/models/transformer.enum';

import {LoadingStateDirective} from '@shared/directives/loading-state.directive';
import {ResizeAppPlotlyDirective} from '@shared/directives/plotly-resize.directive';

const CHARTS_CONFIG = {responsive: true, modeBarButtons: [['toImage']], displaylogo: false}

const BAR_CHART_LAYOUT_CONFIG = {
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

const PIE_CHART_LAYOUT_CONFIG = {
  title: {text: 'Status'},
  autosize: true
};

@Component({
  standalone: true,
  selector: 'app-home-page-charts-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PlotlyComponent,
    ResizeAppPlotlyDirective,
    ResizeAppPlotlyDirective,
    LoadingStateDirective
  ],
  template: `
    <div class="charts-card-list">

      <!-- Bar chart showing one transformer with values for latest period -->
      <div class="chart-card box-shadow rounded-edges">
        <plotly-plot class="plotly"
                     [appLoadingState]="!transformerList()"
                     appPlotlyResize
                     [data]="barChartData()"
                     [layout]="barChartLayout"
                     [useResizeHandler]="true"
                     [config]="chartsConfig">
        </plotly-plot>
      </div>

      <!-- Pie chart that shows  distribution of transformer health types -->
      <div class="chart-card box-shadow rounded-edges" [appLoadingState]="!transformerList()">
        <plotly-plot class="plotly"
                     appPlotlyResize
                     [data]="pieChartData()"
                     [layout]="pieChartLayout"
                     [useResizeHandler]="true"
                     [config]="chartsConfig">
        </plotly-plot>
      </div>

    </div>
  `,
  styleUrl: './home-charts-component.scss'
})
export class HomeChartsComponent {

  readonly chartsConfig = CHARTS_CONFIG;
  readonly pieChartLayout = PIE_CHART_LAYOUT_CONFIG;
  barChartLayout = BAR_CHART_LAYOUT_CONFIG;

  /** Injected Dependencies */
  private document = inject(DOCUMENT);

  /** Component inputs */
  transformerList = input<Transformer[] | null>();

  /** Data that is going to be displayed in a chart */
  barChartData = computed(() => {

      const transformerList = this.transformerList() as Transformer[];

      if (!transformerList || !transformerList?.[0]) {
        return [];
      }

      const firstTransformer = transformerList[0];

      // Update chart title
      this.barChartLayout = {
        ...this.barChartLayout,
        title: {text: `${firstTransformer.region}`}
      }

      // Latest dates will be for X axis
      const allDatesInHistory = firstTransformer.lastTenVoltgageReadings
        .map((val) => val.timestamp);

      // Voltages will be for Y axis
      const allVoltagesInFirstTransformer = firstTransformer.lastTenVoltgageReadings
        .map((val) => val.voltage);

      return [{
        x: [...allDatesInHistory],
        y: [...allVoltagesInFirstTransformer],
        type: 'bar'
      }];

    }
  );

  pieChartData = computed(() => {

    const transformerList = this.transformerList() as Transformer[];

    if (!transformerList || !transformerList?.[0]) {
      return [];
    }

    // Map that will count occurrences for each transformation health type
    const map = new Map<TransformerHealth, number>();

    // Sort health types so they are always displayed in the same order
    transformerList.forEach(transform => {
        const value = map.get(transform.health) || 0;
        map.set(transform.health, value + 1);
      })

    const styles = getComputedStyle(this.document.documentElement);

    return [{
      values: [...map.values()],
      labels: [...map.keys()],
      type: 'pie',
      textinfo: 'label+percent',
      insidetextorientation: 'radial',
      textposition: 'inside',
      marker: {
        // Use custom colors so theming is unified across application
        colors: [...map.keys()]
          .map((key: TransformerHealth) => styles.getPropertyValue(TRANSFORMER_HEALTH_COLORS[key]).trim())
      }
    }]

  });

}
