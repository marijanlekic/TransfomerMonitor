import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {TranslatePipe} from '@ngx-translate/core';

import {delay} from 'rxjs';
import {ToastrService} from 'ngx-toastr';

import {TransformerService} from '@core/services/api/transformer.service';
import {Transformer} from '@core/models/transformer';

import {HomeMetricsComponent} from './home-metrics/home-metrics-component';
import {HomeChartsComponent} from './home-charts/home-charts-component';

@Component({
  standalone: true,
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    TranslatePipe,
    HomeMetricsComponent,
    HomeChartsComponent
  ],
  template: `
    <!-- Metrics section -->
    <h2 class="section-header">{{ 'PAGES.HOME.LATEST_METRICS' | translate }}</h2>
    <app-home-page-metrics-component [metricsData]="transformerList()"></app-home-page-metrics-component>

    <!-- Charts section -->
    <h2 class="section-header">{{ 'PAGES.HOME.CHART_DATA' | translate }}</h2>
    <app-home-page-charts-component [transformerList]="transformerList()"></app-home-page-charts-component>
  `,
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {

  /** Injected Dependencies */
  private destroyRef = inject(DestroyRef);
  private toasterService = inject(ToastrService);
  private transformerService = inject(TransformerService);

  transformerList = signal<Transformer[] | null>(null);

  ngOnInit(): void {

    this.transformerService.getTransformers({})
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
      next: (data: Transformer[]) => {
        this.transformerList.set(data);
      },
      error: (err) => {
        this.toasterService.error('Error', err.toString());
      }

    })

  }

}
