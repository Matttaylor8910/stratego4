import {Component, Input} from '@angular/core';
import {GameService} from 'src/app/services/game.service';
import {Game, Map, PlayerPosition} from 'types';

@Component({
  selector: 'str-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  @Input() game: Game;
  @Input() position: PlayerPosition;

  constructor(
      private readonly gameService: GameService,
  ) {}

  get board(): Map|undefined {
    return this.game ? this.game.board : undefined;
  }

  get gamePhase(): string|undefined {
    return this.game ? this.game.phase : undefined;
  }

  showButton(index: number): boolean {
    return this.board && !this.board.players[index].userId;
  }

  joinTeam(index: number): void {
    this.gameService.joinGame(this.game.id, index);
  }

  clickGameTile(row: number, col: number) {
    console.log('Clicked game tile. row: ' + row + ' col: ' + col);
    console.log(this.gamePhase);
    if (this.gamePhase === 'join' || this.gamePhase === 'complete') {
      return;
    }
    if (this.gamePhase === 'placement') {
      // Highlight and emit?
      // (Places piece if one is selected on piece tray)
      // (Otherwise: Click Piece tray to select both)
    }

    if (this.gamePhase === 'playing') {
      // Highlight if it is your piece
      // (Then click on a new game tile to move)
    }

    // Depending on the phase of the game, this might do many things??
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
