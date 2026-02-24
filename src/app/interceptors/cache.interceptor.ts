import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

// Simple in-memory cache map
const cache = new Map<string, HttpResponse<any>>();

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next(req);
  }

  // Check if we have a cached response for this URL
  const cachedResponse = cache.get(req.urlWithParams);
  if (cachedResponse) {
    console.log(`[CacheInterceptor] Returning cached response for: ${req.urlWithParams}`);
    return of(cachedResponse);
  }

  // If no cache, send the request and cache the response
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        console.log(`[CacheInterceptor] Caching new response for: ${req.urlWithParams}`);
        cache.set(req.urlWithParams, event);
      }
    })
  );
};
