// random-name.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RandomNameService {

  private apiUrl = 'https://randomuser.me/api/?inc=name';

  constructor(private http: HttpClient) {}

  getRandomName(): Promise<string | undefined> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => `${response.results[0].name.first} ${response.results[0].name.last}`)
    ).toPromise();
}

}
