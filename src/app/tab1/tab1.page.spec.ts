import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter';
import { Tab1Page } from './tab1.page';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tab1Page],
      providers: [CounterService],
    }).compileComponents();

    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add the newest saved counter via service', async () => {
    const first: SavedCounter = {
      id: 'first',
      name: 'První',
      value: 1,
    };
    const second: SavedCounter = {
      id: 'second',
      name: 'Druhé',
      value: 2,
    };

    await component.onSaved(first);
    await component.onSaved(second);

    expect(component.counters()).toEqual([second, first]);
  });
});