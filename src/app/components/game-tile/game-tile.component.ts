import {Component, Input} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {GameplayService} from 'src/app/services/gameplay.service';
import {PlacementService} from 'src/app/services/placement.service';
import {Game, Map, Piece, PlayerPosition} from 'types';

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
  @Input() myTurn: boolean;

  constructor(
      public readonly placementService: PlacementService,
      private readonly gameplayService: GameplayService,
      private readonly authService: AuthService,
  ) {}

  get width(): string {
    let max = 48;
    if (this.board) {
      const split = window.innerWidth / this.board.width;
      if (split < max) {
        max = Math.floor(split);
      }
    }
    return `${max}px`;
  }

  get availableMove(): boolean {
    return this.gameplayService.availableMoves.hasOwnProperty(
        `${this.row},${this.col}`);
  }

  get selectable(): boolean {
    // can't select anything when it's not your turn
    if (this.gamePhase === 'playing' && !this.myTurn) {
      return false;
    }
    // you can select available moves
    if (this.availableMove) {
      return true;
    }
    // or your own pieces
    if (this.currentPlayer) {
      return this.currentPlayer.coordinates.hasOwnProperty(
          `${this.row},${this.col}`);
    }
    return false;
  }

  get currentPlayer() {
    if (!this.board) {
      return null;
    }
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
    let row, col;
    if (this.gamePhase === 'placement' && this.placementService.selectedCell) {
      row = this.placementService.selectedCell.row;
      col = this.placementService.selectedCell.col;
    } else if (
        this.gamePhase === 'playing' && this.gameplayService.selectedCell) {
      row = this.gameplayService.selectedCell.row;
      col = this.gameplayService.selectedCell.col;
    }
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
      this.gameplayService.selectCell(
          this.label as Piece, coordinate, this.game);
    }

    // Depending on the phase of the game, this might do many things??
  }
}
