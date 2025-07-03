import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  /**
   * Set item in localstorage with provided key and value
   * @param key
   * @param value
   */
  setItem(key: string, value: any): void {
    localStorage.setItem(key, value);
  }

  /**
   * Get item with provided key
   * @param key
   */
  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? item as T : null;
  }

  /**
   * Remove item with given key from local storage
   * @param key
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear local storage
   */
  clear(): void {
    localStorage.clear();
  }

}
