import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {GameService} from 'src/app/services/game.service';
import {PlacementService} from 'src/app/services/placement.service';

import {Game, Map, PlayerPosition} from '../../../../types';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage {
  gameId: string;
  game$: Observable<Game>;

  constructor(
      private readonly route: ActivatedRoute,
      private readonly gameService: GameService,
      private readonly placementService: PlacementService,
  ) {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.game$ = this.gameService.getGame(this.gameId);
  }

  position(game: Game): PlayerPosition {
    if (game.phase === 'placement') {
      return this.placementService.position;
    } else {
      // TODO: return version from server when playing
      return {};
    }
  }
}
