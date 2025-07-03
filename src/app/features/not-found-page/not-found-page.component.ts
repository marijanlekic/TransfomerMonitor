import {Component} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-not-found-page-component',
  imports: [
    TranslatePipe
  ],
  template: `
    <div>
      <h2 class="not-found-title">404</h2>
      <p class="not-found-text">{{'PAGES.NOT_FOUND.PAGE_NOT_FOUND' | translate}}</p>
    </div>
  `,
  styleUrl: './not-found-page.component.scss'
})
export class NotFoundPageComponent {

}
