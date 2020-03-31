import {Component, Input} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {PlacementService} from 'src/app/services/placement.service';
import {Game, Map, PlayerPosition} from 'types';

@Component({
  selector: 'str-game-tile',
  templateUrl: './game-tile.component.html',
  styleUrls: ['./game-tile.component.scss'],
})
export class GameTileComponent {
  @Input() game: Game;
  @Input() position: PlayerPosition;
  @Input() row: number;
  @Input() col: number;

  constructor(
      public readonly placementService: PlacementService,
      private readonly authService: AuthService,
  ) {}

  get selectable(): boolean {
    if (this.currentPlayer) {
      return this.currentPlayer.coordinates.hasOwnProperty(
          `${this.row},${this.col}`)
    }
    return false;
  }

  get currentPlayer() {
    if (!this.game || !this.game.board) return null;
    return this.game.board.players.find(
        p => p.userId === this.authService.currentUserId);
  }

  get label(): string {
    if (this.position) {
      const rank = this.position[`${this.row},${this.col}`];
      if (rank) {
        return rank;
      }
    }
    return '';
  }

  get selected(): boolean {
    const {row = -1, col = -1} = this.placementService.selectedCell || {};
    return row === this.row && col === this.col;
  }

  get board(): Map|undefined {
    return this.game ? this.game.board : undefined;
  }

  get gamePhase(): string|undefined {
    return this.game ? this.game.phase : undefined;
  }

  // return the hex color for this cell
  get tileColor(): string {
    const {row, col, board} = this;
    if (board) {
      const key = `${row},${col}`;

      // check for off limits
      if (board.offLimits.hasOwnProperty(key)) {
        return '#808080';  // Greyed out
      }

      // then player color
      for (const player of board.players) {
        if (player.coordinates.hasOwnProperty(key)) {
          return player.color;
        }
      }

      // default to blank
      return '#FFFFFF';
    }
  }

  clickGameTile() {
    const {row, col} = this;
    const coordinate = {row, col};

    if (this.gamePhase === 'join' || this.gamePhase === 'complete') {
      return;
    }
    if (this.gamePhase === 'placement') {
      this.placementService.selectCell(coordinate);
    }

    if (this.gamePhase === 'playing') {
      // Highlight if it is your piece
      // (Then click on a new game tile to move)
    }

    // Depending on the phase of the game, this might do many things??
  }
}
