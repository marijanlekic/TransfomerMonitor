type Primitive = string | number | boolean;
type Item = Record<string, any>;

interface FilterOptions {
  searchKeys: string[];       // keys for search (text match)
  filterKeys: string[];       // keys for filtering (exact match or includes)
}

/**
 * Filter array by search term and filters
 * @param arr
 * @param searchTerm
 * @param filters
 * @param options
 */
export function searchAndFilterArray<T extends Item>(
  arr: T[],
  searchTerm: string,
  filters: Partial<Record<string, Primitive | Primitive[]>>,
  options: FilterOptions
): T[] {
  const {searchKeys, filterKeys} = options;
  const lowerSearchTerm = searchTerm.toLowerCase();

  return arr.filter(item => {
    // 1. Search logic: At least one searchKey contains searchTerm (case-insensitive)
    if (searchTerm) {
      const matchesSearch = searchKeys.some(key => {
        const value = item[key];
        if (value === undefined || value === null) return false;
        // Convert value to string and search inside it
        return String(value).toLowerCase().includes(lowerSearchTerm);
      });
      if (!matchesSearch) return false;
    }

    // Filter logic
    for (const key of filterKeys) {
      const filterValue = filters[key];

      // Skip filtering if filter value is undefined, empty string or empty array
      if (
        filterValue === undefined ||
        filterValue === '' ||
        (Array.isArray(filterValue) && filterValue.length === 0)
      ) {
        continue;
      }

      const itemValue = item[key];

      if (Array.isArray(filterValue)) {
        if (!filterValue.includes(itemValue)) return false;
      } else {
        if (itemValue !== filterValue) return false;
      }
    }

    return true;
  });
}

export function sortByCriteria<T>(array: T[], column: keyof T, direction: 'asc' | 'desc'): T[] {

  if (!column || (direction !== 'asc' && direction !== 'desc')) {
    // No sorting criteria, return a shallow copy (to avoid mutating original)
    return [...array];
  }

  return [...array].sort((a, b) => {
    const aVal = a[column];
    const bVal = b[column];

    if (aVal == null) return direction === 'asc' ? 1 : -1;
    if (bVal == null) return direction === 'asc' ? -1 : 1;

    const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return direction === 'asc' ? result : -result;
  });

}
