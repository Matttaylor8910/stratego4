import {Component, Input} from '@angular/core';
import {GameService} from 'src/app/services/game.service';
import {Game, Map} from 'types';

@Component({
  selector: 'str-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  @Input() game: Game;

  constructor(
      private readonly gameService: GameService,
  ) {}

  get board(): Map|undefined {
    return this.game ? this.game.board : undefined;
  }

  showButton(index: number): boolean {
    return this.board && !this.board.players[index].userId;
  }

  joinTeam(index: number): void {
    this.gameService.joinGame(this.game.id, index);
  }

  // return the hex color for this cell
  getTileColor(row: number, col: number): string {
    const {board} = this;
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
