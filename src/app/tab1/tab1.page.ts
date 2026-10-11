import { Component, inject } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { CounterComponent } from '../components/counter/counter.component';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    CounterComponent,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonNote,
    IonTitle,
    IonToolbar,
  ],
})
export class Tab1Page {
  private readonly counterService = inject(CounterService);
  
  // Zpřístupníme signál pro šablonu
  readonly counters = this.counterService.counters;

  async onSaved(counter: SavedCounter): Promise<void> {
    await this.counterService.saveCounter(counter);
  }
}