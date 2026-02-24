import { HttpInterceptorFn } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const started = Date.now();
  let ok: string;

  console.log(`[LoggingInterceptor] Request started: ${req.method} ${req.urlWithParams}`);

  return next(req).pipe(
    tap({
      next: (event) => (ok = 'succeeded'),
      error: (error) => (ok = 'failed')
    }),
    finalize(() => {
      const elapsed = Date.now() - started;
      const msg = `[LoggingInterceptor] Request ${req.method} "${req.urlWithParams}" ${ok} in ${elapsed} ms.`;
      console.log(msg);
    })
  );
};
