import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {GameService} from 'src/app/services/game.service';
import {PlacementService} from 'src/app/services/placement.service';
import {PlayerService} from 'src/app/services/player.service';

import {Game, PlayerPosition} from '../../../../types';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnDestroy {
  private destroyed$ = new Subject<void>();

  gameId: string;
  game$: Observable<Game>;

  playerPosition: PlayerPosition;

  constructor(
      private readonly route: ActivatedRoute,
      private readonly gameService: GameService,
      private readonly placementService: PlacementService,
      private readonly playerService: PlayerService,
  ) {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.game$ = this.gameService.getGame(this.gameId);

    this.getUserPosition();
  }

  async getUserPosition() {
    const position$ = await this.playerService.getPlayerPosition(this.gameId);
    position$.pipe(takeUntil(this.destroyed$)).subscribe(position => {
      this.playerPosition = position;
      console.log(position);
    });
  }

  get position(): PlayerPosition {
    return this.playerPosition || this.placementService.position;
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }
}
