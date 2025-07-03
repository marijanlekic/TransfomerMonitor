import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable} from 'rxjs';

import {Transformer} from '@core/models/transformer';

import {TableEntry} from '@shared/table-state/ table-state.model';
import {searchAndFilterArray, sortByCriteria} from '@utils/arrays';

@Injectable({
  providedIn: 'root',
})
export class TransformerService {

  httpClient = inject(HttpClient)

  getTransformers(filters: TableEntry<Transformer>): Observable<Transformer[]> {

    const query: { [key: string]: string | string [] } = {
      search: filters.search || '',
      ...filters.filters,
      ...filters.sort
    }

    const params = new HttpParams({fromObject: {...query}});

    return this.httpClient.get<Transformer[]>(`json/sampledata.json`, {params}).pipe(
      map(result => {

        //
        // Mock search and filter on backend side
        //
        const searchTerm = filters['search']?.toString().toLowerCase() || '';

        // Fields to filter using search term (includes)
        const searchKeys: (keyof Transformer)[] = ['name'];
        // Fields to filter on exact match
        const filterKeys: (keyof Transformer)[] = ['health', 'region'];

        const filtered = searchAndFilterArray(result, searchTerm, filters.filters || {}, {searchKeys, filterKeys})

        return sortByCriteria(filtered, query['sortActive'] as any, query['sortDirection'] as any)
      }));
  }

}
