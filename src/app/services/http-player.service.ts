import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Player {
  id: number;
  name: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HttpPlayerService {
  constructor(private http: HttpClient) {}

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: environment.apiKey,
    });
  }

  getPlayers(): Observable<Player[]> {
    const headers = this.getHeaders();
    return this.http.get<Player[]>(`/api/v1/players`, { headers });
  }

  addPlayer(name: string): Observable<Player> {
    const headers = this.getHeaders();
    return this.http.post<Player>(`/api/v1/players`, { name }, { headers });
  }
}
