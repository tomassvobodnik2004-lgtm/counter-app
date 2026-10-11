import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { SavedCounter } from '../models/saved-counter';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  private readonly STORAGE_KEY = 'saved_counters';
  readonly counters = signal<SavedCounter[]>([]);

  constructor() {
    this.loadCounters();
  }

  async loadCounters(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: this.STORAGE_KEY });
      if (value) {
        const parsed: SavedCounter[] = JSON.parse(value);
        this.counters.set(parsed);
      }
    } catch (e) {

    }
  }

  async saveCounter(counter: SavedCounter): Promise<void> {
    const updated = [counter, ...this.counters()];
    this.counters.set(updated);
    await this.persist(updated);
  }
  async removeCounter(counterId: string): Promise<void> {
    const updated = this.counters().filter(c => c.id !== counterId);
    this.counters.set(updated);
    await this.persist(updated);
  }
  async clearAll(): Promise<void> {
    this.counters.set([]);
    await this.persist([]);
  }
  private async persist(counters: SavedCounter[]): Promise<void> {
    try {
      await Preferences.set({
        key: this.STORAGE_KEY,
        value: JSON.stringify(counters),
      });
    } catch (e) {
    }
  }
}