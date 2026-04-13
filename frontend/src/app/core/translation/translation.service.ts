import { Injectable, signal, computed } from '@angular/core';
import { AppTranslations } from '../../shared/translations.types';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private translations = signal<AppTranslations | null>(null);

  t = computed(() => this.translations());

  setTranslations(t: AppTranslations) {
    this.translations.set(t);
  }

  getTranslations(): AppTranslations | null {
    return this.translations();
  }
}
