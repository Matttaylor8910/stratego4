import {Component, Input} from '@angular/core';
import {Game} from 'types';

@Component({
  selector: 'str-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  @Input() game: Game;

  constructor() {}

  joinTeam(teamNum: number): void {
    console.log('Joining team ' + teamNum);
    console.log('Add to array at ' + (teamNum - 1));
  }

  // return the hex color for this cell
  getTileColor(row: number, col: number): string {
    const board = this.game.board;
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
}
