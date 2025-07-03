export interface TableEntry<T> {
  search?: string;
  filters?: { [K in keyof T]?: string[]; };
  sort?: TableSort<T>
}

export interface TableSort<T> {
  sortActive: keyof T;
  sortDirection: 'asc' | 'desc' | '';
}
