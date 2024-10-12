import { HttpPlayerService } from './../../services/http-player.service';
import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { Game, HttpGameService } from '../../services/http-game.service';
import { RouterModule } from '@angular/router';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { StartGameDialogComponent } from './start-game-dialog/start-game-dialog.component';
import { MessagesModule } from 'primeng/messages';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule,
    DynamicDialogModule,
    MessagesModule,
  ],
  providers: [HttpPlayerService, HttpGameService, DialogService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  games$!: Observable<Game[]>;
  errorMessages: Message[] | undefined;

  constructor(
    private httpPlayerService: HttpPlayerService,
    private httpGameService: HttpGameService,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    this.loadGames();
  }

  loadGames() {
    this.games$ = forkJoin({
      players: this.httpPlayerService.getPlayers().pipe(
        catchError((err) => {
          this.manageError();
          return of([]);
        })
      ),
      games: this.httpGameService.getGames().pipe(
        catchError((err) => {
          this.manageError();
          return of([]);
        })
      ),
    }).pipe(
      map(({ players, games }) => {
        return games.map((game) => {
          game.scores = game.scores.map((score, index) => {
            const player = players.find((p) => p.id == score.playerId);
            return {
              ...score,
              playerName: player ? player.name : 'Invité',
              avatar:
                index === 0
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

    const scores = game.scores.map((score) => score.score);
    const uniqueScores = new Set(scores);
    const scoresAreEqual = uniqueScores.size !== scores.length;
    if (scoresAreEqual) return false;

    return game.scores.every((score) => score.score <= player.score);
  }

  openDialog() {
    this.dialogService.open(StartGameDialogComponent, {
      header: 'Séléctionnez les joueurs',
      width: '50%',
      closable: true,
      dismissableMask: true,
    });
  }

  manageError() {
    this.errorMessages = [
      {
        severity: 'error',
        summary: "Une erreur s'est produite lors du chargement des données.",
        detail:
          'Pensez à vérifier que le backend est bien lancé et que les tokens correspondent (ce dernier est enregistré dans le fichier environment.ts).',
      },
    ];
  }
}
