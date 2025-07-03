import {
  ChangeDetectorRef,
  Component,
  computed, inject,
  input,
  InputSignal, NgZone,
  output,
  OutputEmitterRef, QueryList, ViewChild, ViewChildren
} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource, MatTableModule
} from '@angular/material/table';
import {MatSort, MatSortHeader, MatSortModule, Sort} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {LowerCasePipe, UpperCasePipe} from '@angular/common';

import {Transformer} from '@core/models/transformer';

import {VoltagesPopoverComponent} from './voltages-popover-componen/voltages-popover.component';
import {TranslatePipe} from '@ngx-translate/core';

const PAGE_SIZE = 5;

@Component({
  standalone: true,
  selector: 'app-transformer-table-component',
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatRow,
    MatRowDef,
    MatSortModule,
    MatSortHeader,
    MatTable,
    MatMenuModule,
    MatButtonModule,
    VoltagesPopoverComponent,
    LowerCasePipe,
    TranslatePipe,
    UpperCasePipe
  ],
  template: `
    <div class="table-wrapper">
      <!-- Mat Table -->
      <table mat-table matSort [dataSource]="tableDataSource()" (matSortChange)="sortChanged.emit($event)">

        <!-- Index Column -->
        <ng-container matColumnDef="index">
          <th mat-header-cell *matHeaderCellDef> #</th>
          <td mat-cell *matCellDef="let element; let i = index;">{{ i + 1 }}</td>
        </ng-container>

        <!-- Name Column -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="name">{{ 'PRIMITIVES.NAME' | translate }}</th>
          <td mat-cell *matCellDef="let element">
            {{ element.name }}
          </td>
        </ng-container>

        <!-- Region Column -->
        <ng-container matColumnDef="region">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="region"> Region</th>
          <td mat-cell *matCellDef="let element">
            {{ element.region }}
          </td>
        </ng-container>

        <!-- Health Column -->
        <ng-container matColumnDef="health">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="health"> Status</th>
          <td mat-cell *matCellDef="let element">
            <div class="status-cell">
              <div class="status status-{{element.health | lowercase}}"></div>
              {{ 'COMPONENTS.TRANSFORMER_STATUS.' + element.health | uppercase | translate }}
            </div>

          </td>
        </ng-container>

        <!-- Info Column -->
        <ng-container matColumnDef="info">
          <th mat-header-cell *matHeaderCellDef>Info</th>
          <td mat-cell *matCellDef="let element">
            <mat-icon [matMenuTriggerFor]="popoverMenu">info</mat-icon>

            <mat-menu #popoverMenu="matMenu" class="voltages-popover">
              <app-voltages-popover-component [transformer]="element"></app-voltages-popover-component>
            </mat-menu>
          </td>
        </ng-container>

        <!-- Empty Table Column -->
        <tr class="mat-row no-data-row" *matNoDataRow>
          <td class="mat-cell" [attr.colspan]="displayedColumns.length">
            {{ 'PRIMITIVES.NO_DATA' | translate }}
          </td>
        </tr>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row [class.highlighted-row]="row.assetId === highlightedTransformer()"
            (mouseenter)="transformerHighLighted.emit(row.assetId)"
            (mouseleave)="transformerHighLighted.emit(undefined)"
            *matRowDef="let row; columns: displayedColumns;">
        </tr>
      </table>
    </div>

    <!-- Pagination -->
    <mat-paginator [length]="0"
                   [showFirstLastButtons]="true"
                   [pageSize]="pageSize">
    </mat-paginator>
  `,
  styleUrl: './transformer-table-component.scss'
})
export class TransformerTableComponent {

  readonly pageSize = PAGE_SIZE;

  // /** Component View Queries */
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChildren(MatSortHeader) sortHeaders!: QueryList<MatSortHeader>;

  /** Component inputs */
  transformerList: InputSignal<Transformer[] | undefined> = input.required();
  highlightedTransformer: InputSignal<number | undefined> = input();

  /** Component outputs */
  transformerHighLighted = output<number | undefined>()
  sortChanged: OutputEmitterRef<Sort> = output();

  displayedColumns: string[] = ['index', 'name', 'region', 'health', 'info'];

  tableDataSource = computed(() => {

    const tableData = new MatTableDataSource(this.transformerList());

    tableData.paginator = this.paginator;
    this.paginator.firstPage();

    return tableData;

  });

  setSortArrow(active: string  = '', direction: '' | 'desc' | 'asc' = '') {
    this.sort.active = active || '';
    this.sort.direction = direction || '';
  }

  resetSortArrow() {
    this.sort.active = undefined as any;
    this.sort.direction = '';

    // Angular fix to update header arrow
    (this.sort as any)._stateChanges.next();
  }


}
