import {
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
  HttpHandlerFn,
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

export const errorInterceptor =
  (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {

        const message = error.error instanceof ErrorEvent
          ? `Client error: ${error.error.message}` : `Server error ${error.status}: ${error.message}`;

        return throwError(() => new Error(message));
      })
    );
  };
