import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id: number;
  name: string;
  department: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://localhost:7196/api'; // Standard .NET HTTPS port, may need adjustment
  private http = inject(HttpClient);

  public useAuthToken = false;

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employee`);
  }

  getSecretData(): Observable<any> {
    return this.http.post(`${this.apiUrl}/employee/secret`, {});
  }

  triggerError(statusCode: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/error/${statusCode}`);
  }
}
