import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';

import {Transformer} from '@core/models/transformer';

@Injectable({
  providedIn: 'root',
})
export class RegionService {

  httpClient = inject(HttpClient)

  getRegions(): Observable<string[]> {

    return this.httpClient.get<Transformer[]>(`json/sampledata.json`).pipe(
      map(result => [...new Set(result.map(transformer => transformer.region))]));
  }

}
