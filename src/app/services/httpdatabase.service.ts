import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HttpRequest } from '../models/http-request.model';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpDatabase {
  constructor(private _httpClient: HttpClient) {}

  search(terms: Observable<string>) {
    return terms.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) =>
        this.getCharacters(term).pipe(
          catchError(() => {
            return of({ info: null, results: null });
          })
        )
      )
    );
  }

  getCharacters(
    name: string = '',
    status: string = '',
    page: number = 0
  ): Observable<HttpRequest> {
    const apiUrl = 'https://rickandmortyapi.com/api/character';
    return this._httpClient.get<HttpRequest>(apiUrl, {
      params: new HttpParams()
        .set('name', name)
        .set('status', status)
        .set('page', (page + 1).toString()),
    });
  }
}
