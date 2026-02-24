import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService, Employee } from './services/employee.service';
import { EventBusService, LogEvent } from './services/event-bus.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  title = 'Company Dashboard';
  
  employeeService = inject(EmployeeService);
  eventBus = inject(EventBusService);

  employees: Employee[] = [];
  logs: LogEvent[] = [];
  isLoading = false;
  
  statusMessage: string | null = null;
  isError = false;

  get useAuthToken(): boolean {
    return this.employeeService.useAuthToken;
  }

  ngOnInit() {
    this.eventBus.logs$.subscribe(l => {
      this.logs = l;
    });
  }

  toggleAuth() {
    this.employeeService.useAuthToken = !this.employeeService.useAuthToken;
    this.eventBus.log('warning', 'System', `Auth Token injection sets to: ${this.employeeService.useAuthToken}`);
  }

  clearLogs() {
    this.eventBus.clearLogs();
  }

  private resetState() {
    this.statusMessage = null;
    this.isError = false;
    this.isLoading = true;
  }

  fetchEmployees() {
    this.resetState();
    this.eventBus.log('info', 'System', 'Action: Fetching Employees list...');
    
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.isLoading = false;
        this.statusMessage = 'Successfully loaded employees!';
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        this.statusMessage = 'Failed to load employees. Check the logs.';
      }
    });
  }

  accessSecretData() {
    this.resetState();
    this.eventBus.log('info', 'System', 'Action: Accessing secret company data...');

    this.employeeService.getSecretData().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.statusMessage = `Success: ${res.message}`;
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        this.statusMessage = 'Access Denied (401).';
      }
    });
  }

  triggerServerError(code: number) {
    this.resetState();
    this.eventBus.log('warning', 'System', `Action: Triggering ${code} error from backend...`);

    this.employeeService.triggerError(code).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        this.statusMessage = `Received ${code} error!`;
      }
    });
  }
}
