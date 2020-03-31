import {Component, Input} from '@angular/core';
import {get} from 'lodash';
import {AuthService} from 'src/app/services/auth.service';
import {GameService} from 'src/app/services/game.service';
import {PlacementService} from 'src/app/services/placement.service';
import {Game, Map, PlayerPosition} from 'types';

@Component({
  selector: 'str-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  @Input() game: Game;
  @Input() position: PlayerPosition;

  joiningIndex?: number;

  constructor(
      public readonly placementService: PlacementService,
      private readonly authService: AuthService,
      private readonly gameService: GameService,
  ) {}

  get rotateClass(): string {
    if (this.game && this.game.board) {
      const {players} = this.game.board;
      for (let i = 0; i < players.length; i++) {
        if (players[i].userId === this.authService.currentUserId) {
          return `rotate-player-${i}`;
        }
      }
    }
    return '';
  }

  get board(): Map|undefined {
    return this.game ? this.game.board : undefined;
  }

  get playerInGame(): boolean {
    return get(this.game, 'userIds') &&
        this.game.userIds.includes(this.authService.currentUserId);
  }

  disabled(index: number) {
    return this.joining(index) || this.playerInGame;
  }

  label(index: number): string {
    if (this.playerInGame) {
      return 'Waiting';
    } else if (this.joining(index)) {
      return 'Joining...';
    } else {
      return 'Join';
    }
  }

  joining(index: number): boolean {
    return this.joiningIndex === index;
  }

  showButton(index: number): boolean {
    return this.board && !this.board.players[index].userId;
  }

  joinTeam(index: number): void {
    this.joiningIndex = index;
    this.gameService.joinGame(this.game.id, index);
  }
}
