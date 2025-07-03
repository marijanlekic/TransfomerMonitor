import {Component, inject} from '@angular/core';

import {LayoutComponent} from '@layout/layout.component';
import {TitleService} from '@core/services/title.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [LayoutComponent],
  template: `
    <app-layout></app-layout>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  /** Injected Dependencies */
  private titleService = inject(TitleService);

}
