import {ChangeDetectionStrategy, Component, inject, input, output} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {TransformerHealth} from '@core/models/transformer.enum';
import {MatInputModule} from '@angular/material/input';
import {MatMiniFabButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';
import {AsyncPipe, UpperCasePipe} from '@angular/common';
import {RegionService} from '@core/services/api/region.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-filter-panel-component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltip,
    MatIconModule,
    MatInputModule,
    TranslatePipe,
    MatMiniFabButton,
    UpperCasePipe,
    AsyncPipe
  ],
  template: `

    <!-- Filter and search columns -->
    <form [formGroup]="formGroup()" class="filter-form">

      <!-- Search Term Control -->
      <mat-form-field appearance="outline" class="filter-item mat-field-shadow">
        <mat-label>{{ 'PRIMITIVES.SEARCH' | translate }}</mat-label>
        <input matInput formControlName="search" placeholder="{{ 'PRIMITIVES.SEARCH' | translate }}..."/>
      </mat-form-field>

      <!-- Filter Health Type Control -->
      <mat-form-field appearance="outline" class="filter-item mat-field-shadow">
        <mat-label>Status</mat-label>
        <mat-select #healthRef formControlName="health" multiple>
          @for (category of transformerHealthTypes; track category) {
            <mat-option
              [value]="category[1]">{{ 'COMPONENTS.TRANSFORMER_STATUS.' + category[1] | uppercase | translate }}
            </mat-option>
          }
        </mat-select>
      </mat-form-field>

      <!-- Filter Region Control -->
      <mat-form-field appearance="outline" class="filter-item mat-field-shadow">
        <mat-label>Region</mat-label>
        <mat-select #regionRef formControlName="region" multiple [matTooltip]="regionRef.value">
          @for (region of regions$ | async; track region) {
            <mat-option [value]="region">{{ region }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <!-- Reset filters button -->
      <button matMiniFab color="primary" [disableRipple]="true" (click)="resetAllSelections()"
              matTooltip="{{'PRIMITIVES.RESET_FILTERS' | translate}}">
        <mat-icon>restart_alt</mat-icon>
      </button>

    </form>

  `,
  styleUrl: './filter-panel.component.scss'
})
export class FilterPanelComponent {

  /** Injected Dependencies */
  private regionService = inject(RegionService);

  formGroup = input.required<FormGroup>();

  /** Types of health (Poor, Good...) */
  transformerHealthTypes = Object.entries(TransformerHealth);

  filtersReset = output();

  regions$ = this.regionService.getRegions();

  constructor() {
  }

  resetAllSelections() {
    this.filtersReset.emit();
  }

}
