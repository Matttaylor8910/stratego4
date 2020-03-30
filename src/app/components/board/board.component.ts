import {Component, Input} from '@angular/core';
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

  constructor(
      public readonly placementService: PlacementService,
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
}
