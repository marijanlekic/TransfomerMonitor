import {ChangeDetectionStrategy, Component, inject, input, output} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDrawerMode, MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';

import {TranslateModule} from '@ngx-translate/core';

import {LanguageService} from '@core/services/language.service';
import {ThemeService, ThemeType} from '@core/services/theme.service';

@Component({
  standalone: true,
  selector: 'app-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    TranslateModule],
  template: `
    <mat-toolbar class="box-shadow">

      <!-- Toggle button to show/hide left sidebar -->
      <div class="toolbar-left">

        @if (sideBarMode() === 'over') {

          @if (!isSideBarOpened()) {
            <button mat-icon-button (click)="toggleChange.emit(true)">
              <mat-icon matTooltip="{{'LAYOUT.TOOLBAR.OPEN_SIDEBAR' | translate}}">menu</mat-icon>
            </button>
          } @else {
            <button mat-icon-button (click)="toggleChange.emit(false)">
              <mat-icon matTooltip="{{'LAYOUT.TOOLBAR.CLOSE_SIDEBAR' | translate}}">close</mat-icon>
            </button>
          }
        }

      </div>

      <!-- Toolbar actions language select, white/dark theme, user profile -->
      <div class="toolbar-actions">

        <!-- Choose language button -->
        <button matIconButton [matMenuTriggerFor]="languageMenu" aria-label="">
          <mat-icon matTooltip="{{'LAYOUT.TOOLBAR.CHOOSE_LANGUAGE'  | translate}}">language</mat-icon>

          <mat-menu #languageMenu="matMenu" xPosition="before">
            <button mat-menu-item (click)="onSelectLanguage('sr')"
                    [class.selected]="translateService.getCurrentLanguage() === 'sr'">
              <mat-icon>flag</mat-icon>
              <span>Srpski</span>
            </button>
            <button mat-menu-item (click)="onSelectLanguage('en')"
                    [class.selected]="translateService.getCurrentLanguage() === 'en'">
              <mat-icon>flag</mat-icon>
              <span>English</span>
            </button>
          </mat-menu>

        </button>

        <!-- Choose theme button -->
        <button matIconButton [matMenuTriggerFor]="menu">

          <mat-icon matTooltip="{{'LAYOUT.TOOLBAR.CHOOSE_THEME'  | translate}}">brightness_medium</mat-icon>

          <mat-menu #menu="matMenu" xPosition="before">
            <button mat-menu-item (click)="onSelectTheme('light')"
                    [class.selected]="themeService.getTheme() === 'light'">
              <mat-icon>light_mode</mat-icon>
              <span>{{ 'LAYOUT.TOOLBAR.LIGHT_THEME'  | translate }}</span>
            </button>
            <button mat-menu-item (click)="onSelectTheme('dark')"
                    [class.selected]="themeService.getTheme() === 'dark'">
              <mat-icon>dark_mode</mat-icon>
              <span>{{ 'LAYOUT.TOOLBAR.DARK_THEME'  | translate }}</span>
            </button>
          </mat-menu>

        </button>

        <!-- User profile button -->
        <button mat-icon-button [matMenuTriggerFor]="avatarMenu" class="avatar-button"
                matTooltip="Profil">

          <img src="assets/images/avatar.png" alt="User Avatar" class="avatar"/>

          <mat-menu #avatarMenu="matMenu" xPosition="before">
            <button mat-menu-item disabled>
              <mat-icon>logout</mat-icon>
              <span>{{ 'LAYOUT.TOOLBAR.LOGOUT'  | translate }}</span>
            </button>
          </mat-menu>

        </button>

      </div>

    </mat-toolbar>
  `,
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {

  /** Injected Dependencies */
  protected themeService = inject(ThemeService);
  protected translateService = inject(LanguageService);

  /** Component inputs */
  sideBarMode = input<MatDrawerMode>('over');
  isSideBarOpened = input<boolean>(false);

  /** Component outputs */
  toggleChange = output<boolean>();

  onSelectLanguage(lang: string) {
    this.translateService.setLanguage(lang);
  }

  onSelectTheme(theme: ThemeType) {
    this.themeService.setTheme(theme)
  }


}
