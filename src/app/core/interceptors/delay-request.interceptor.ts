import {
  HttpRequest,
  HttpEvent,
  HttpHandlerFn,
} from '@angular/common/http';
import {delay, Observable} from 'rxjs';

export const delayRequestInterceptor =
  (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<any>> => next(req).pipe(delay(500));
