import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CounterService } from './counter';

// Mock pro localStorage, aby Capacitor Preferences nepadaly
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('CounterService', () => {
  let service: CounterService;

  beforeEach(() => {
    localStorageMock.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CounterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save a counter and prepend it to the list', async () => {
    const counter = {
      id: 'test-id',
      name: 'Test',
      value: 5,
    };

    await service.saveCounter(counter);

    expect(service.counters()).toHaveLength(1);
    expect(service.counters()[0]).toEqual(counter);
  });
});