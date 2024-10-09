import { Injectable } from '@angular/core';
import { HttpPlayerService, Player } from './http-player.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private httpPlayerService: HttpPlayerService) {}

  createDeck(): number[] {
    return Array.from({ length: 52 }, (_, i) => i + 1);
  }

  shuffle(deck: number[]): number[] {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  initPlayers(
    player1Id: number,
    player2Id: number
  ): Observable<{
    player1: { player: Player; deck: number[]; score: number };
    player2: { player: Player; deck: number[]; score: number };
  }> {
    return this.httpPlayerService.getPlayers().pipe(
      map((players) => {
        const deck = this.shuffle(this.createDeck());

        const player1Deck: number[] = [];
        const player2Deck: number[] = [];

        for (let i = 0; i < deck.length; i++) {
          if (i % 2 === 0) player1Deck.push(deck[i]);
          else player2Deck.push(deck[i]);
        }

        let player1 = players.find((p) => p.id === player1Id);
        if (!player1)
          player1 = {
            id: player1Id,
            name: `Joueur 1`,
          };
        player1.avatar = `assets/img/player1.png`;

        let player2 = players.find((p) => p.id === player2Id);
        if (!player2)
          player2 = {
            id: player2Id,
            name: `Joueur 2`,
          };
        player2.avatar = `assets/img/player2.png`;

        return {
          player1: { player: player1, deck: player1Deck, score: 0 },
          player2: { player: player2, deck: player2Deck, score: 0 },
        };
      })
    );
  }

  playRound(
    player1: any,
    player2: any
  ): { player1Card: number | undefined; player2Card: number | undefined } {
    const player1Card = player1.deck.shift();
    const player2Card = player2.deck.shift();

    if (player1Card !== undefined && player2Card !== undefined) {
      if (player1Card > player2Card) {
        player1.score++;
      } else {
        player2.score++;
      }
    }
    return { player1Card, player2Card };
  }
}
