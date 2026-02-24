import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // In a real app, retrieve the token from a service or localStorage
  const authToken = 'my-auth-token-12345';

  // Clone the request to add the new header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return next(authReq);
};
