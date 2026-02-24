import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;

        if (error.status === 401) {
          errorMessage = 'Unauthorized: Please log in again.';
        } else if (error.status === 403) {
          errorMessage = 'Forbidden: You do not have permission.';
        } else if (error.status === 0) {
          errorMessage = 'Network Error: Cannot reach the backend.';
        }
      }

      console.error('[ErrorInterceptor]', errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};
