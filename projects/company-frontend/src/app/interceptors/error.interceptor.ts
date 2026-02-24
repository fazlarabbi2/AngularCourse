import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { EventBusService } from '../services/event-bus.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const eventBus = inject(EventBusService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

      if (error.error instanceof ErrorEvent) {
        // Client-side mapping error
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        // Server-side error mapping
        switch(error.status) {
          case 401:
            errorMessage = `[401 Unauthorized] You are not logged in or token is invalid.`;
            break;
          case 403:
            errorMessage = `[403 Forbidden] You lack permissions to access this resource.`;
            break;
          case 404:
            errorMessage = `[404 Not Found] The requested resource does not exist.`;
            break;
          case 500:
            errorMessage = `[500 Internal Server Error] The backend crashed or had an unhandled exception.`;
            break;
          case 0:
            errorMessage = `[0 Network Error] Could not connect to the backend. Is it running?`;
            break;
          default:
            errorMessage = `[${error.status}] Server Error: ${error.message}`;
        }
      }

      eventBus.log('error', 'ErrorInterceptor', errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};
