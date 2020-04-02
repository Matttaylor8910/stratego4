import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {GameService} from 'src/app/services/game.service';
import {Game} from 'types';

@Component({
  selector: 'str-all',
  templateUrl: './all.page.html',
  styleUrls: ['./all.page.scss'],
})
export class AllPage {
  games$: Observable<Game[]>;

  constructor(
      private readonly gameService: GameService,
  ) {
    this.games$ = this.gameService.getGames();
  }
}
