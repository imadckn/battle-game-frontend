import { Component, Input } from '@angular/core';
import { Player } from '../../../services/http-player.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpGameService } from '../../../services/http-game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'congratulations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [HttpGameService],
  templateUrl: './congratulations.component.html',
  styleUrl: './congratulations.component.scss',
})
export class CongratulationsComponent {
  subscriptions = new Subscription();
  @Input() player1!: { player: Player; deck: number[]; score: number };
  @Input() player2!: { player: Player; deck: number[]; score: number };
  winner!: Player;
  score!: string;

  constructor(private httpGameService: HttpGameService) {}

  ngOnInit() {
    if (this.player1.score > this.player2.score) {
      this.winner = this.player1.player;
      this.score = `${this.player1.score} - ${this.player2.score}`;
    } else if (this.player1.score < this.player2.score) {
      this.winner = this.player2.player;
      this.score = `${this.player2.score} - ${this.player1.score}`;
    } else {
      this.winner = {
        id: 0,
        name: 'Égalité',
      };
      this.score = `${this.player1.score} - ${this.player2.score}`;
    }

    this.saveGame();
  }

  saveGame() {
    this.subscriptions.add(
      this.httpGameService
        .saveGame([
          {
            playerId: this.player1.player.id,
            score: this.player1.score,
          },
          {
            playerId: this.player2.player.id,
            score: this.player2.score,
          },
        ])
        .subscribe()
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
