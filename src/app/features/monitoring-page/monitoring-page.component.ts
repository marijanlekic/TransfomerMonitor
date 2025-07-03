import {Component, DestroyRef, inject, OnInit, signal, ViewChild, WritableSignal} from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule, Sort} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {TranslatePipe} from '@ngx-translate/core';
import {combineLatest, debounceTime, map, pairwise, Subject, switchMap} from 'rxjs';
import {ToastrService} from 'ngx-toastr';

import {removeEmptyValuesFromObject} from '@utils/objects';

import {TransformerService} from '@core/services/api/transformer.service';
import {Transformer} from '@core/models/transformer';
import {TableEntry} from '@shared/table-state/ table-state.model';
import {LoadingStateDirective} from '@shared/directives/loading-state.directive';
import {queryToTableState, tableStateToQuery} from '@shared/table-state/table-state.utils';

import {TransformerTableComponent} from './transformer-table/transformer-table-component';
import {VoltageChartComponent} from './voltage-chart/voltage-chart-component';
import {FilterPanelComponent} from './filter-panel/filter-panel.component';
import {MatDivider} from '@angular/material/divider';

@Component({
  standalone: true,
  selector: 'app-monitoring-page',
  imports: [MatButtonToggleModule,
    MatIconModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSortModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    TransformerTableComponent,
    VoltageChartComponent,
    LoadingStateDirective,
    TranslatePipe, FilterPanelComponent, MatDivider
  ],
  template: `
    <!-- Metrics section -->
    <h2 class="section-header">{{ 'PAGES.MONITORING.ANALYTICS' | translate }}</h2>

    <!-- Filtering controls -->
    <app-filter-panel-component [formGroup]="filterTableFormGroup"
                                (filtersReset)="resetAllSelections()">
    </app-filter-panel-component>

    <mat-divider></mat-divider>


    <div class="main-area">

      <!-- Table content -->
      <app-transformer-table-component class="main-item box-shadow rounded-edges"
                                       [appLoadingState]="!transformerList()"
                                       [transformerList]="transformerList()"
                                       [highlightedTransformer]="highlightedTransformer()"
                                       (transformerHighLighted)="highlightedTransformer.set($event)"
                                       (sortChanged)="onSortChange($event)">
      </app-transformer-table-component>

      <!-- Chart content -->
      <app-voltage-chart-component class="main-item box-shadow rounded-edges"
                                   [appLoadingState]="!transformerList()"
                                   [transformerList]="transformerList()"
                                   [highlightedTransformer]="highlightedTransformer()"
                                   (transfomerHighlighted)="highlightedTransformer.set($event)"
                                   [selectedTransformerList]="selectedIds()">
      </app-voltage-chart-component>


    </div>
  `,
  styleUrl: './monitoring-page.component.scss'
})
export class MonitoringPageComponent implements OnInit {

  // /** Component View Queries */
  @ViewChild(TransformerTableComponent, {static: true}) transformerTableComponent!: TransformerTableComponent;

  /** Injected Dependencies */
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toasterService = inject(ToastrService);
  private transformerService = inject(TransformerService);

  /** Filtering form */
  filterTableFormGroup = new FormGroup({
    search: new FormControl<string | undefined>(undefined),
    region: new FormControl<string[] | undefined>(undefined),
    health: new FormControl<string[] | undefined>(undefined)
  });

  /** Sorting form */
  sortFormGroup = new FormGroup({
    sortActive: new FormControl<keyof Transformer | undefined>(undefined),
    sortDirection: new FormControl<'' | 'asc' | 'desc' | null>(null),
  })

  readonly filterParams = ['search', 'health', 'region', 'sortActive', 'sortDirection'];
  readonly selectParams = ['selectedId']

  selectedIds: WritableSignal<number[]> = signal([]);

  highlightedTransformer = signal<number | undefined>(undefined);

  transformerList: WritableSignal<Transformer[] | undefined> = signal(undefined)

  fetchData$ = new Subject<any>();

  constructor() {

  }

  ngOnInit(): void {
    this.listenToFetchStream();
    this.listenToQueryChange();
    this.listenToFormChanges();

    this.initializeState();
  }



  /**
   * Initialize state from query params or local storage
   */
  initializeState() {

    const activatedRoute = this.route.snapshot.queryParams;
    const hasQueryParams = !!Object.keys(activatedRoute).length;

    // Initially get data from local storage and query params
    const dataFromStorage = JSON.parse(localStorage.getItem('query') || '{}');
    const tableStateFromQueryParams: Partial<TableEntry<Transformer>> = queryToTableState(activatedRoute, this.filterParams);
    const selectedId = activatedRoute['selectedId']?.split(',').map(Number) ?? [];

    // If there are query params we will use data from query, otherwise from storage
    const data = hasQueryParams ? tableStateFromQueryParams : dataFromStorage;

    // Select filters controls
    this.filterTableFormGroup.patchValue({
      search: data.search,
      health: data.filters?.health || [],
      region: data.filters?.region || []
    });

    // Select sort controls
    this.sortFormGroup.patchValue({...data.sort});

    // Select fields that are selected in chart
    this.selectedIds.set(hasQueryParams ? selectedId : dataFromStorage.select || [])

    // If query params are not provided take data from storage and update URL
    if (!hasQueryParams) {

      const {select, ...rest} = dataFromStorage;

      const queryParams = {...tableStateToQuery(rest)};
      const isEmpty = Object.keys(removeEmptyValuesFromObject(queryParams)).length === 0;

      this.router.navigate([], {
        queryParams: {
          ...(!isEmpty ? {...queryParams} : null),
          selectedId: (select || []).join(',') || undefined
        },
        queryParamsHandling: 'merge',
        replaceUrl: true
      }).then();

      if (isEmpty) {
        this.fetchData$.next(dataFromStorage);
      }

      this.transformerTableComponent.setSortArrow(dataFromStorage.sort?.sortActive,
        dataFromStorage.sort?.sortDirection)

      return;

    }

    this.transformerTableComponent.setSortArrow(tableStateFromQueryParams.sort?.sortActive,
      tableStateFromQueryParams.sort?.sortDirection)

    // Update local storage with values from query params
    localStorage.setItem('query', JSON.stringify({...tableStateFromQueryParams, select: selectedId}));

    // Fetch data
    this.fetchData$.next(tableStateFromQueryParams);

  }

  /**
   * Listen for query parameters change
   * @private
   */
  private listenToQueryChange() {
    // To track whether filters are changed or selection
    // If selections is just changed we do not want to fetch data again
    this.route.queryParams.pipe(
      pairwise(),
    ).subscribe(([prev, curr]) => {
      const filterParamsChanged = this.filterParams.some(key => prev[key] !== curr[key]);
      const selectParamsChanged = this.selectParams.some(key => prev[key] !== curr[key]);

      if (filterParamsChanged || selectParamsChanged) {
        const stateFromParams = queryToTableState(curr, this.filterParams);
        const select = curr['selectedId']?.split(',').map(Number) ?? [];

        localStorage.setItem('query', JSON.stringify({...stateFromParams, select}));

        // Only in a case when filters params are changed we will fetch data again
        if (filterParamsChanged) {
          this.fetchData$.next(stateFromParams);
        }

        if (selectParamsChanged) {
          this.selectedIds.set(select);
        }

      }
    });

  }

  /**
   * Listen to fetch stream and fetch data
   * @private
   */
  private listenToFetchStream() {

    this.fetchData$.pipe(
      switchMap((data: TableEntry<Transformer>) => this.transformerService.getTransformers(data)),
      takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.transformerList.set(result);
        },
        error: (err) => {
          this.toasterService.error(err);
        }
      });

  }

  /**
   * Listen to form control changes and update URL
   * @private
   */
  private listenToFormChanges() {

    combineLatest([
      this.filterTableFormGroup.valueChanges,
      this.sortFormGroup.valueChanges
    ]).pipe(
      debounceTime(300),
      map(([form, sort]) => ({
        search: form.search,
        filters: {health: form.health, region: form.region},
        sort
      } as TableEntry<Transformer>))
    ).subscribe((tableState) => {

      this.transformerTableComponent.setSortArrow(tableState.sort?.sortActive,
        tableState.sort?.sortDirection)

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: tableStateToQuery(removeEmptyValuesFromObject(tableState)),
        queryParamsHandling: 'merge'
      }).then();
    });

  }

  onSortChange(sort: Sort) {
    const hasSort = sort.active && sort.direction;
    const sortActive = hasSort ? sort.active as keyof Transformer : null;
    const sortDirection = hasSort ? sort.direction : null;

    this.sortFormGroup.setValue({sortActive, sortDirection});
  }

  /**
   * Reset all filters and selections
   */
  resetAllSelections() {

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {selectedId: null},
      queryParamsHandling: 'merge'
    }).then();

    this.filterTableFormGroup.reset(undefined);
    this.sortFormGroup.reset(undefined);

    this.transformerTableComponent.resetSortArrow()

  }

}
