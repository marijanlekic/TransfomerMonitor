import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {DatePipe, DecimalPipe} from '@angular/common';
import {MatIcon, MatIconModule} from '@angular/material/icon';

import {Transformer} from '@core/models/transformer'
  ;
import {TranslatePipe} from '@ngx-translate/core';
import {MatTableModule} from '@angular/material/table';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-voltages-popover-component',
  imports: [
    DatePipe,
    MatIcon,
    TranslatePipe,
    DecimalPipe,
    MatTableModule,
    MatIconModule
  ],
  template: `
    <table mat-table [dataSource]="transformer.lastTenVoltgageReadings" class="mat-elevation-z1 voltage-table">
      <!-- Index column -->
      <ng-container matColumnDef="position">
        <th mat-header-cell *matHeaderCellDef>#</th>
        <td mat-cell *matCellDef="let element; let i = index;">{{ i + 1 }}</td>
      </ng-container>

      <!-- Timestamp Column -->
      <ng-container matColumnDef="date">
        <th mat-header-cell *matHeaderCellDef>{{ 'PRIMITIVES.TIME' | translate }}</th>
        <td mat-cell *matCellDef="let element">{{ element.timestamp | date }}</td>
      </ng-container>

      <!-- Voltage Column -->
      <ng-container matColumnDef="voltage">
        <th mat-header-cell *matHeaderCellDef>{{ 'PRIMITIVES.VOLTAGE' | translate }}</th>
        <td mat-cell *matCellDef="let element">
          <mat-icon class="voltage-icon text-clr-orange-400" inline>bolt</mat-icon>
          {{ element.voltage | number: '1.0-2' }}V
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styleUrl: './voltages-popover.component.scss'
})
export class VoltagesPopoverComponent {

  displayedColumns = ['position', 'date', 'voltage'];

  @Input()
  transformer!: Transformer;

}
