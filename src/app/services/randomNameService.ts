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
  
    return this.http.get<any>(this.apiUrl).pipe(
      timeout(5000), // Timeout di 5 secondi
      map(response => {
        let name =  `${response.results[0].name.first} ${response.results[0].name.last}`;
        return this.normalizeString(name);
      }),
      catchError(error => {
        return of(''); // Ritorna una stringa vuota in caso di errore o timeout
      })
    );
  }
  
  private normalizeString(input: string): string {
    const specialCharactersMap: { [key: string]: string } = {
        'ć': 'c', 'č': 'c', 'š': 's', 'ž': 'z', 'đ': 'd', // Add other mappings as needed
        'Ć': 'C', 'Č': 'C', 'Š': 'S', 'Ž': 'Z', 'Đ': 'D'
    };

    return input.split('').map(char => specialCharactersMap[char] || char).join('');
}

}
