import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {GameService} from 'src/app/services/game.service';
import {Game} from 'types';

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
  ) {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.game$ = this.gameService.getGame(this.gameId);
  }
}
