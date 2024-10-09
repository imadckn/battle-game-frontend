import { Subscription } from 'rxjs';
import {
  HttpPlayerService,
  Player,
} from './../../../services/http-player.service';
import { Component } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-start-game-dialog',
  standalone: true,
  imports: [
    CheckboxModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  templateUrl: './start-game-dialog.component.html',
  styleUrl: './start-game-dialog.component.scss',
})
export class StartGameDialogComponent {
  subscriptions = new Subscription();

  allPlayers: Player[] = [];
  selectedPlayers: number[] = [];
  newPlayer: string = '';

  showNameInput: boolean = false;

  constructor(
    private HttpPlayerService: HttpPlayerService,
    private router: Router,
    private dialogRef: DynamicDialogRef
  ) {
    this.loadExistingPlayers();
  }

  loadExistingPlayers() {
    this.subscriptions.add(
      this.HttpPlayerService.getPlayers().subscribe((players) => {
        this.allPlayers = players;
      })
    );
  }

  startPlaying() {
    this.router
      .navigate(['/battle', this.selectedPlayers[0], this.selectedPlayers[1]])
      .then(() => {
        this.dialogRef.close();
      });
  }

  addNewPlayer() {
    if (this.newPlayer.length == 0) {
      this.showNameInput = false;
      return;
    }

    this.subscriptions.add(
      this.HttpPlayerService.addPlayer(this.newPlayer).subscribe((player) => {
        this.allPlayers.push(player);
        this.newPlayer = '';
        this.showNameInput = false;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
