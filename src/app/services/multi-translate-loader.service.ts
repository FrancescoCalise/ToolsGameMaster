import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export class MultiTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient, private prefix: string = '/assets/i18n/', private suffix: string = '.json') {}

  getTranslation(lang: string): Observable<any> {
    const configUrl = `${this.prefix}translation-files.json`;

    return this.http.get<{ files: string[] }>(configUrl).pipe(
      switchMap(config => {
        // Crea un array di richieste per ogni file di traduzione
        const requests = config.files.map(file => this.http.get(`${this.prefix}${lang}/${file}${this.suffix}`).pipe(
          catchError(() => of({})) // Ignora errori per file mancanti
        ));

        // Unisci tutte le traduzioni in un unico oggetto
        return forkJoin(requests).pipe(
          map(responseArray => responseArray.reduce((acc, curr) => ({ ...acc, ...curr }), {}))
        );
      })
    );
  }
}

export function MultiTranslateLoaderFactory(http: HttpClient) {
    return new MultiTranslateLoader(http);
  }