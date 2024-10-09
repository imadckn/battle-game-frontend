import {
  HttpPlayerService,
  Player,
} from './../../services/http-player.service';
import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { CongratulationsComponent } from './congratulations/congratulations.component';

export const cardAnimation = trigger('cardAnimation', [
  state('player1', style({ transform: 'translate(-300%, 100%)' })),
  state('player2', style({ transform: 'translate(300%, 100%)' })),
  transition('default => player1', [animate('1s ease-in-out')]),
  transition('default => player2', [animate('1s ease-in-out')]),
  transition('player1 => default', [animate('0s')]),
  transition('player2 => default', [animate('0s')]),
]);

@Component({
  selector: 'app-battle',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule,
    DynamicDialogModule,
    CongratulationsComponent,
  ],
  providers: [GameService, HttpPlayerService],
  templateUrl: './battle.component.html',
  styleUrl: './battle.component.scss',
  animations: [cardAnimation],
})
export class BattleComponent {
  subscriptions = new Subscription();
  player1!: { player: Player; deck: number[]; score: number };
  player2!: { player: Player; deck: number[]; score: number };
  player1Clicked = false;
  player2Clicked = false;
  currentPlayer1Card: number | undefined;
  currentPlayer2Card: number | undefined;
  disableButtons = false;
  cardState1: string = 'default';
  cardState2: string = 'default';
  isFinished = false;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initplayers();
  }

  initplayers() {
    this.subscriptions.add(
      this.route.paramMap.subscribe((params) => {
        const player1Id = parseInt(params.get('firstPlayer') || '', 10);
        const player2Id = parseInt(params.get('secondPlayer') || '', 10);
        this.subscriptions.add(
          this.gameService
            .initPlayers(player1Id, player2Id)
            .subscribe((players) => {
              this.player1 = players.player1;
              this.player2 = players.player2;
            })
        );
      })
    );
  }

  play(player: string) {
    if (player === 'player1') {
      this.player1Clicked = true;
      this.currentPlayer1Card = this.player1.deck[0];
    }
    if (player === 'player2') {
      this.player2Clicked = true;
      this.currentPlayer2Card = this.player2.deck[0];
    }
    setTimeout(() => {
      this.getRoundWinner();
    }, 2000);
  }

  getRoundWinner() {
    if (this.player1Clicked && this.player2Clicked) {
      this.disableButtons = true;
      this.player1Clicked = this.player2Clicked = false;

      const result = this.gameService.playRound(this.player1, this.player2);

      if (
        result.player1Card !== undefined &&
        result.player2Card !== undefined
      ) {
        if (result.player1Card > result.player2Card) {
          this.cardState1 = 'player1';
          this.cardState2 = 'player1';
        } else if (result.player1Card < result.player2Card) {
          this.cardState1 = 'player2';
          this.cardState2 = 'player2';
        }
      }

      setTimeout(() => {
        this.currentPlayer1Card = undefined;
        this.currentPlayer2Card = undefined;
        this.cardState1 = 'default';
        this.cardState2 = 'default';
        this.disableButtons = false;
        if (this.player1.deck.length === 0) this.isFinished = true;
      }, 1000);
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
