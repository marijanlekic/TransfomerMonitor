import {DOCUMENT, inject, Injectable} from '@angular/core';

import {LocalStorageService} from '@core/services/local-storage.service';

export type ThemeType = 'light' | 'dark';

const LOCALE_STORAGE_KEY = 'theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  /** Injected Dependencies */
  private document = inject(DOCUMENT);
  private localStorage = inject(LocalStorageService)

  private currentTheme: ThemeType = 'light';

  constructor() {
    this.loadTheme();
  }

  /**
   * Load theme from local storage
   * @private
   */
  private loadTheme() {
    const savedTheme = this.localStorage.getItem<ThemeType>(LOCALE_STORAGE_KEY);
    this.currentTheme = savedTheme ?? 'light';
    this.applyTheme();
  }

  /**
   * Apply current theme to document
   * @private
   */
  private applyTheme() {
    this.document.body.classList.remove('light-theme', 'dark-theme');
    this.document.body.classList.add(`${this.currentTheme}-theme`);
    this.localStorage.setItem(LOCALE_STORAGE_KEY, this.currentTheme);
  }

  /**
   * Set theme
   * @param theme
   */
  setTheme(theme: ThemeType) {
    this.currentTheme = theme;
    this.applyTheme();
  }

  /**
   * Get theme
   */
  getTheme(): 'light' | 'dark' {
    return this.currentTheme;
  }
}
