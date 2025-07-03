import {AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, output, ViewChild} from '@angular/core';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {RouterModule, RouterOutlet} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {BreakpointObserver} from '@angular/cdk/layout';
import {MatListModule} from '@angular/material/list';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {delay} from 'rxjs';
import {TranslateModule} from '@ngx-translate/core';
import {routeLoadAnimation} from '../../animations/router.animation';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatSidenavModule,
    MatDividerModule,
    MatIconModule,
    RouterModule,
    TranslateModule,
    MatListModule
  ],
  animations: [routeLoadAnimation],
  template: `
    <mat-sidenav-container>

      <!-- Left sidebar -->
      <mat-sidenav #sidenav="matSidenav" class="box-shadow" (openedChange)="sideOpenedChange.emit($event)">

        <!-- Sidebar avatar -->
        <img class="avatar" src="assets/images/camlin-logo.jpeg" alt="Camlin group logo"/>

        <!-- Sidebar title -->
        <h4 class="name">Camlin Group</h4>

        <!-- Sidebar designation -->
        <p class="designation"> infrastructure monitoring</p>

        <mat-divider></mat-divider>

        <!-- Nav list block -->
        <mat-nav-list class="nav-list">

          <a mat-list-item routerLink="/home" routerLinkActive="active-link">
            <mat-icon matListItemIcon class="link-icon">home</mat-icon>
            <div matListItemTitle>{{ 'LAYOUT.SIDEBAR.HOME_PAGE_LINK' | translate }}</div>
          </a>

          <a mat-list-item routerLink="/monitoring" routerLinkActive="active-link"
             queryParamsHandling="merge">
            <mat-icon matListItemIcon class="link-icon">visibility</mat-icon>
            <div matListItemTitle>{{ 'LAYOUT.SIDEBAR.MONITORING_PAGE_LINK' | translate }}</div>
          </a>

          <a mat-list-item class="disabled-link">
            <mat-icon matListItemIcon class="link-icon">person</mat-icon>
            <div matListItemTitle>{{ 'LAYOUT.SIDEBAR.PROFILE_PAGE_LINK' | translate }}</div>
          </a>

          <a mat-list-item class="disabled-link">
            <mat-icon matListItemIcon class="link-icon">settings</mat-icon>
            <div matListItemTitle>{{ 'LAYOUT.SIDEBAR.SETTINGS_PAGE_LINK' | translate }}</div>
          </a>

        </mat-nav-list>

        <mat-divider></mat-divider>

        <!-- Nav list block -->
        <mat-nav-list class="nav-list">

          <a mat-list-item class="disabled-link">
            <mat-icon matListItemIcon class="link-icon">help</mat-icon>
            <div matListItemTitle>{{ 'LAYOUT.SIDEBAR.HELP_PAGE_LINK' | translate }}</div>
          </a>

        </mat-nav-list>

      </mat-sidenav>

      <!-- Sidebar main content -->
      <mat-sidenav-content>

        <div class="main-content" [@routeAnimations]="prepareRoute(outlet)" [class.main-content--closed]="!sidenav.opened">
          <router-outlet #outlet="outlet"></router-outlet>
        </div>

      </mat-sidenav-content>

    </mat-sidenav-container>

  `,
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements AfterViewInit {

  /** Component View Queries */
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  /** Injected Dependencies */
  private destroyRef = inject(DestroyRef);
  private observer = inject(BreakpointObserver);

  /** Component Outputs */
  sideOpenedChange = output<boolean>();

  ngAfterViewInit() {

    this.sidenav.open().then();

    // Automatically close/open according to dynamic screen size
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {

        const matched = res.matches;

        this.sidenav.mode = matched ? 'over' : 'side';
        (matched ? this.sidenav.close() : this.sidenav.open()).then()

      });

  }

  /** Prepare route for the transition animation */
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

}
