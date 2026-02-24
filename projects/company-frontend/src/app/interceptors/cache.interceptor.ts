import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, tap } from 'rxjs';
import { EventBusService } from '../services/event-bus.service';

const cacheMap = new Map<string, HttpResponse<any>>();

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  const eventBus = inject(EventBusService);

  // We only cache GET requests
  if (req.method !== 'GET') {
    return next(req);
  }

  // Attempt to hit cache
  const cachedResponse = cacheMap.get(req.urlWithParams);
  if (cachedResponse) {
    eventBus.log('success', 'CacheInterceptor', `Found cached response for ${req.urlWithParams}. Returning cache and skipping backend!`);
    return of(cachedResponse.clone()); // Return cloned response
  }

  eventBus.log('info', 'CacheInterceptor', `No cache found for ${req.urlWithParams}. Requesting from backend...`);

  // Send request and cache it if successful
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        eventBus.log('success', 'CacheInterceptor', `Caching new response for ${req.urlWithParams}`);
        cacheMap.set(req.urlWithParams, event.clone());
      }
    })
  );
};
