import {Injectable, inject} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {combineLatest, filter, map, startWith, switchMap} from 'rxjs';

import {TranslateService} from '@ngx-translate/core';

const APP_NAME = 'Camlin Group';

@Injectable({providedIn: 'root'})
export class TitleService {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);
  private titleService = inject(Title);

  constructor() {
    const routeChange$ = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.getDeepestChild(this.route).snapshot.data['title'] ?? null),
      startWith(this.getDeepestChild(this.route).snapshot.data['title'] ?? null)
    );

    // Stream: current lang or trigger
    const langChange$ = this.translate.onLangChange.pipe(
      startWith(null)
    );

    // Combine route + lang change to reactively update title
    combineLatest([routeChange$, langChange$])
      .pipe(
        map(([titleKey]) => titleKey),
        filter((titleKey): titleKey is string => !!titleKey),
        switchMap(titleKey => this.translate.get(titleKey)),
        map(translated => this.formatTitle(translated))
      )
      .subscribe(fullTitle => this.titleService.setTitle(fullTitle));
  }

  private getDeepestChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) route = route.firstChild;
    return route;
  }

  private formatTitle(title: string): string {
    return `${title} | ${APP_NAME}`;
  }
}
