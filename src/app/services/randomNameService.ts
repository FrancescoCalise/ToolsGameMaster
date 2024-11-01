// random-name.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RandomNameService {

  private apiUrl = 'https://randomuser.me/api/?inc=name';

  constructor(private http: HttpClient) {}

  getRandomName(): Observable<string> {
    console.log('Inizio chiamata API per ottenere un nome casuale');
  
    return this.http.get<any>(this.apiUrl).pipe(
      timeout(5000), // Timeout di 5 secondi
      map(response => {
        console.log('Risposta ricevuta:', response);
        return `${response.results[0].name.first} ${response.results[0].name.last}`;
      }),
      catchError(error => {
        console.error('Errore o timeout raggiunto:', error);
        return of(''); // Ritorna una stringa vuota in caso di errore o timeout
      })
    );
  }
  

}
