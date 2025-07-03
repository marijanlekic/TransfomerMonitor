import {Routes} from '@angular/router';

import {NotFoundPageComponent} from './features/not-found-page/not-found-page.component';

export const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: 'home',
    data: {title: 'PAGES.HOME.PAGE_TITLE', animation: 'HomePage'},
    loadComponent: () =>
      import('./features/home-page/home-page.component')
        .then(m => m.HomePageComponent)
  },
  {
    path: 'monitoring',
    data: {title: 'PAGES.MONITORING.PAGE_TITLE', animation: 'MonitoringPage'},
    loadComponent: () =>
      import('./features/monitoring-page/monitoring-page.component')
        .then(m => m.MonitoringPageComponent)
  },
  {
    path: '404',
    data: {animation: 'NotFoundPage'},
    component: NotFoundPageComponent
  },
  {
    path: '**',
    redirectTo: '404'
  }
];
