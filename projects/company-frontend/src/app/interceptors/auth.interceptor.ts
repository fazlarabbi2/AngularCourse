import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { EventBusService } from '../services/event-bus.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const employeeService = inject(EmployeeService);
  const eventBus = inject(EventBusService);

  // In a real app, this comes from an Auth Service or LocalStorage
  const dummyToken = 'my-auth-token-12345';

  if (employeeService.useAuthToken) {
    eventBus.log('info', 'AuthInterceptor', 'Appending Authorization header to request');
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${dummyToken}`
      }
    });
    return next(clonedRequest);
  }

  eventBus.log('warning', 'AuthInterceptor', 'No auth token applied (Simulation mode)');
  return next(req);
};
