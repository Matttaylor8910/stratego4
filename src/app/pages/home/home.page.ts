import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {GameService} from 'src/app/services/game.service';
import {MapService} from 'src/app/services/map.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  disabled = false;

  constructor(
      public mapService: MapService,
      private readonly router: Router,
      private readonly gameService: GameService,
  ) {}

  /**
   * Create a game or join an existing one and route to that id
   */
  async createGame(name: string) {
    if (name) {
      this.disabled = true;
      const gameId = await this.gameService.createOrGetGame(name);
      this.router.navigate(['game', gameId]);
    }
  }
}
