import {Component, Input} from '@angular/core';
import { Game } from 'types';

@Component({
  selector: 'str-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  @Input()
  game: Game;

  constructor() {}

  // return the hex color for this cell
  getColor(row: number, col: number): string {
    const board = this.game.board;
    if (board) {
      if (board.offLimits.some( offLimitCell => (offLimitCell.row === row  && offLimitCell.col === col))) {
        console.log('Found off limits cell at ' + row + ', ' + col);
        return '#808080'; // Greyed out
        // color = '#808080'; // Greyed out
      }

      let playerColor = '';
      board.players.forEach( player => {
        if (player.coordinates.some(playerCell => (playerCell.row === row  && playerCell.col === col))) {
          console.log('Found player color: ' + player.color + ' at cell ' + row + ', ' + col);
          playerColor = player.color;
          return;
        }
      });
      if (playerColor) {
        return playerColor;
      }

      console.log('Default color cell at ' + row + ', ' + col);
      return '#FFFFFF';
    }
  }
}

