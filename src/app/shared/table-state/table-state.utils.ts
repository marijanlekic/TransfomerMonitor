import {Params} from '@angular/router';
import {TableEntry} from '@shared/table-state/ table-state.model';

export function tableStateToQuery<T extends object = {}>(state: TableEntry<T>): Params {

  const filters = Object.entries({...state.filters})
    .reduce<Record<string, string | null>>((acc, [key, value]) => {
        const res = (value as string[]?? []).join(',');
        acc[key] = res.length ? res : null;
        return acc;
      }
      , {} as any)

  const emptySort = !(state.sort?.sortActive && state.sort?.sortDirection)

  return {

    search: state.search || undefined,
    ...filters,
    ...(emptySort ? {sortActive: null, sortDirection: null} : {
      sortActive: state.sort?.sortActive,
      sortDirection: state.sort?.sortDirection
    })
  };

}

export function queryToTableState<T extends object = {}>(params: Params, filt: string[] = []): Partial<TableEntry<T>> {

  const {search, sortActive, sortDirection, ...other} = params;

  const filters = Object.entries(other)
    .reduce<Record<string, string[]>>((acc, [key, value]) => {

      if (filt.includes(key)) {
        (acc[key] = value.split(','), acc)
      }

      return acc;
    }, {} as any);

  return {
    search: search || '',
    filters,
    ...(sortActive && sortDirection ? {sort: {sortActive, sortDirection}} : null)
  }

}
