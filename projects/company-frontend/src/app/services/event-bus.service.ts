import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LogEvent {
  time: Date;
  type: 'info' | 'error' | 'success' | 'warning';
  message: string;
  source: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private logsSubject = new BehaviorSubject<LogEvent[]>([]);
  public logs$ = this.logsSubject.asObservable();

  log(type: 'info' | 'error' | 'success' | 'warning', source: string, message: string) {
    const newLog: LogEvent = {
      time: new Date(),
      type,
      message,
      source
    };
    
    // Keep last 50 logs
    const currentLogs = this.logsSubject.value;
    const updatedLogs = [newLog, ...currentLogs].slice(0, 50);
    this.logsSubject.next(updatedLogs);
  }

  clearLogs() {
    this.logsSubject.next([]);
  }
}
