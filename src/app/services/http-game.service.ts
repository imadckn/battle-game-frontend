import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Game {
  id: string;
  scores: Score[];
}

interface Score {
  playerId: number;
  score: number;
  avatar?: string;
  playerName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HttpGameService {
  constructor(private http: HttpClient) {}

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: environment.apiKey,
    });
  }

  getGames(): Observable<Game[]> {
    const headers = this.getHeaders();
    return this.http.get<Game[]>(`/api/v1/games`, { headers });
  }
}
