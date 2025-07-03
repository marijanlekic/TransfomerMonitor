import {ChangeDetectionStrategy, Component, signal, viewChild} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';

import {ToolbarComponent} from '@layout/toolbar/toolbar.component';
import {SidebarComponent} from '@layout/sidebar/sidebar.component';

@Component({
  standalone: true,
  selector: 'app-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    ToolbarComponent,
    SidebarComponent],
  template: `

    <!-- Toolbar component -->
    <app-toolbar
      [isSideBarOpened]="sideBarOpened()"
      (toggleChange)="onSidebarToggle($event)">
    </app-toolbar>

    <!-- Left sidebar component -->
    <app-sidebar
      (sideOpenedChange)="sideBarOpened.set($event)">
    </app-sidebar>

  `,
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  /** Component View Queries */
  sidebarComponent = viewChild.required(SidebarComponent);

  sideBarOpened = signal<boolean>(false);

  onSidebarToggle(opened: boolean) {

    if (opened) {
      this.sidebarComponent().sidenav.open().then();
      return;
    }

    this.sidebarComponent().sidenav.close().then();

  }

}
