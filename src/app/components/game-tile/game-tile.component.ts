import {Component, Input} from '@angular/core';
import {PlacementService} from 'src/app/services/placement.service';
import {Game, Map} from 'types';

@Component({
  selector: 'str-game-tile',
  templateUrl: './game-tile.component.html',
  styleUrls: ['./game-tile.component.scss'],
})
export class GameTileComponent {
  @Input() game: Game;
  @Input() row: number;
  @Input() col: number;

  constructor(
      public readonly placementService: PlacementService,
  ) {}

  get disabled(): boolean {
    // TODO: disable tiles that aren't yours
    return false;
  }

  get selected(): boolean {
    const {row, col} = this.placementService.selectedCell || {};
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
      if (board.offLimits.some(
              offLimitCell =>
                  (offLimitCell.row === row && offLimitCell.col === col))) {
        return '#808080';  // Greyed out
      }

      let playerColor = '';
      board.players.forEach(player => {
        if (player.coordinates.some(
                playerCell =>
                    (playerCell.row === row && playerCell.col === col))) {
          playerColor = player.color;
          return;
        }
      });
      if (playerColor) {
        return playerColor;
      }
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
