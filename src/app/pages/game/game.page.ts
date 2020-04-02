import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {AuthService} from 'src/app/services/auth.service';
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
  myTurn = false;
  playing = false;

  constructor(
      private readonly authService: AuthService,
      private readonly route: ActivatedRoute,
      private readonly gameService: GameService,
      private readonly placementService: PlacementService,
      private readonly playerService: PlayerService,
  ) {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.game$ = this.gameService.getGame(this.gameId).pipe(tap(game => {
      this.myTurn = this.isMyTurn(game);
      this.playing = this.inGame(game);
    }));

    this.getUserPosition();
  }

  /**
   * Subscribe to the user's position to layover the board
   */
  async getUserPosition() {
    const position$ = await this.playerService.getPlayerPosition(this.gameId);
    position$.pipe(takeUntil(this.destroyed$)).subscribe(position => {
      this.playerPosition = position;
    });
  }

  /**
   * Return either the placement service position when in the placement phase or
   * the player position whenever that is set
   */
  get position(): PlayerPosition {
    return this.playerPosition || this.placementService.position;
  }

  private inGame(game: Game): boolean {
    return (game.userIds || []).includes(this.authService.currentUserId);
  }

  private isMyTurn(game): boolean {
    if (game && game.board) {
      const {turn} = game.state;
      const {players} = game.board;
      const index = turn % players.length;
      return players[index].userId === this.authService.currentUserId;
    }
    return false;
  }

  /**
   * Clean up subscriptions
   */
  ngOnDestroy() {
    this.destroyed$.next();
  }
}
