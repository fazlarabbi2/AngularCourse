import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, finalize } from 'rxjs/operators';
import { EventBusService } from '../services/event-bus.service';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const eventBus = inject(EventBusService);
  const startTime = Date.now();
  
  eventBus.log('info', 'LoggingInterceptor', `Starting request: ${req.method} ${req.urlWithParams}`);

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          eventBus.log('success', 'LoggingInterceptor', `Received response status: ${event.status}`);
        }
      },
      error: (error) => {
        eventBus.log('error', 'LoggingInterceptor', `Request failed`);
      }
    }),
    finalize(() => {
      const elapsed = Date.now() - startTime;
      eventBus.log('info', 'LoggingInterceptor', `Request completed in ${elapsed}ms`);
    })
  );
};
