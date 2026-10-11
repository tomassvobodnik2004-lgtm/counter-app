import { Component, computed, inject, signal } from '@angular/core';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
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
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonButtons,
    IonIcon,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
  ],
})
export class Tab1Page {
  public readonly counterService = inject(CounterService);
  private readonly alertCtrl = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);

  // Signál zpřístupněný pro HTML šablonu i unit testy
  readonly counters = this.counterService.counters;

  readonly searchQuery = signal<string>('');
  readonly sortOrder = signal<'newest' | 'oldest' | 'name' | 'value'>('newest');

  constructor() {
    addIcons({ trashOutline });
  }

  // Filtrovaná a seřazená kolekce počítadel
  readonly filteredCounters = computed(() => {
    let list = [...this.counterService.counters()];
    const query = this.searchQuery().toLowerCase().trim();

    if (query) {
      list = list.filter((c) => c.name.toLowerCase().includes(query));
    }

    switch (this.sortOrder()) {
      case 'oldest':
        return list.reverse();
      case 'name':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'value':
        return list.sort((a, b) => b.value - a.value);
      case 'newest':
      default:
        return list;
    }
  });

  // Součet hodnot
  readonly totalSum = computed(() => {
    return this.counterService.counters().reduce((acc, c) => acc + c.value, 0);
  });

  // Varianta A: Průměr hodnot
  readonly averageValue = computed(() => {
    const list = this.counterService.counters();
    if (list.length === 0) return '0.00';
    return (this.totalSum() / list.length).toFixed(2);
  });

  async onSaved(counter: SavedCounter): Promise<void> {
    await this.counterService.saveCounter(counter);
    await this.showToast('Počítadlo bylo úspěšně uloženo.');
  }

  async onDeleteSingle(id: string): Promise<void> {
    await this.counterService.removeCounter(id);
    await this.showToast('Záznam byl odstraněn.');
  }

  async confirmClearAll(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Vymazat historii',
      message: 'Opravdu chcete vymazat všechna uložená počítadla?',
      buttons: [
        { text: 'Zrušit', role: 'cancel' },
        {
          text: 'Vymazat',
          role: 'destructive',
          handler: async () => {
            await this.counterService.clearAll();
            await this.showToast('Všechna počítadla byla vymazána.');
          },
        },
      ],
    });
    await alert.present();
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
}