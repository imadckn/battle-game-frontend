import { Injectable } from '@angular/core';
import { HttpPlayerService, Player } from './http-player.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private httpPlayerService: HttpPlayerService) {}

  initPlayers(
    player1Id: number,
    player2Id: number
  ): Observable<{
    player1: { player: Player; deck: number[]; score: number };
    player2: { player: Player; deck: number[]; score: number };
  }> {
    return this.httpPlayerService.getPlayers().pipe(
      map((players) => {
        const deck = this.shuffle(this.createDeck()); // deck = [52, 12, 3, ..., 49] par exemple

        const player1Deck: number[] = [];
        const player2Deck: number[] = [];

        for (let i = 0; i < deck.length; i++) {
          // Si i est pair, on ajoute la carte à player1Deck, sinon à player2Deck
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

  createDeck(): number[] {
    // return un tableau de 52 éléments de 1 à 52 => [1, 2, 3, ..., 52]
    return Array.from({ length: 52 }, (_, i) => i + 1);
  }

  shuffle(deck: number[]): number[] {
    for (let i = deck.length - 1; i > 0; i--) {
      // Génère un nombre aléatoire entre 0 et i
      const j = Math.floor(Math.random() * (i + 1));
      // Échange deck[i] et deck[j]
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    // Retourne le deck mélangé => [52, 12, 3, ..., 49] par exemple
    return deck;
  }

  playRound(
    player1: any,
    player2: any
  ): { player1Card: number | undefined; player2Card: number | undefined } {
    // retire la première carte de chaque deck
    const player1Card = player1.deck.shift();
    const player2Card = player2.deck.shift();

    if (player1Card !== undefined && player2Card !== undefined) {
      // Si la carte de player1 est plus grande, il gagne un point
      if (player1Card > player2Card) player1.score++;
      else player2.score++;
    }
    return { player1Card, player2Card };
  }
}
