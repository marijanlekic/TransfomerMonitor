import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import {provideRouter} from '@angular/router';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';

import * as PlotlyJS from 'plotly.js-basic-dist';
import {ToastrModule} from 'ngx-toastr';
import {PlotlyModule} from 'angular-plotly.js';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';

import {delayRequestInterceptor} from '@core/interceptors/delay-request.interceptor';
import {errorInterceptor} from '@core/interceptors/error.interceptor';
import {ThemeService} from '@core/services/theme.service';
import {LanguageService} from '@core/services/language.service';

import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {

  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient( withInterceptors([delayRequestInterceptor, errorInterceptor]),),
    provideAnimations(),
    ThemeService,
    LanguageService,
    importProvidersFrom(
      PlotlyModule.forRoot(PlotlyJS),
      ToastrModule.forRoot({positionClass: 'toast-bottom-center', disableTimeOut: true, closeButton: true}),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
          deps: [HttpClient]
        }
      })
    )
  ]
};
