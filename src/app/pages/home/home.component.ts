import { HttpPlayerService } from './../../services/http-player.service';
import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { forkJoin, map, Observable } from 'rxjs';
import { Game, HttpGameService } from '../../services/http-game.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule],
  providers: [HttpPlayerService, HttpGameService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  games$!: Observable<Game[]>;

  constructor(
    private httpPlayerService: HttpPlayerService,
    private httpGameService: HttpGameService
  ) {}

  ngOnInit() {
    this.loadGames();
  }

  loadGames() {
    this.games$ = forkJoin({
      players: this.httpPlayerService.getPlayers(),
      games: this.httpGameService.getGames(),
    }).pipe(
      map(({ players, games }) => {
        return games.map((game) => {
          game.scores = game.scores.map((score) => {
            const player = players.find((p) => p.id == score.playerId);
            return {
              ...score,
              playerName: player ? player.name : 'Invité',
              avatar:
                score.playerId === 1
                  ? 'assets/img/player1.png'
                  : 'assets/img/player2.png',
            };
          });
          return game;
        });
      })
    );
  }

  isWinner(game: Game, playerName: string | undefined): boolean {
    const player = game.scores.find((score) => score.playerName === playerName);
    if (!player) return false;

    return game.scores.every((score) => score.score <= player.score);
  }
}
