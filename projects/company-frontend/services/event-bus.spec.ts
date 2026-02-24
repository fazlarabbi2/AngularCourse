import { TestBed } from '@angular/core/testing';

import { EventBus } from './event-bus';

describe('EventBus', () => {
  let service: EventBus;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventBus);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
