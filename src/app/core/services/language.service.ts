import {inject, Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LocalStorageService} from '@core/services/local-storage.service';

const LOCALE_STORAGE_KEY = 'lang';
const LANGUAGES = ['en', 'sr'];

@Injectable({providedIn: 'root'})
export class LanguageService {

  /** Injected Dependencies */
  private localStorage = inject(LocalStorageService)
  private translateService = inject(TranslateService);

  constructor() {

    this.translateService.getLangs();

    // Setup default language and fallback
    this.translateService.addLangs(LANGUAGES);
    this.translateService.setDefaultLang(LANGUAGES[0]);

    const browserLang = this.translateService.getBrowserLang();
    const savedLang = this.localStorage.getItem<string>(LOCALE_STORAGE_KEY);

    this.translateService.use(savedLang || browserLang || LANGUAGES[0]);

  }

  /**
   * Set current language
   * @param lang
   */
  setLanguage(lang: string) {
    this.translateService.use(lang);
    this.localStorage.setItem(LOCALE_STORAGE_KEY, lang);
  }

  /**
   * Get current selected language
   */
  getCurrentLanguage(): string {
    return this.translateService.currentLang || LANGUAGES[0];
  }

}
