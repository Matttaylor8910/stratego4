import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {GameService} from 'src/app/services/game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  constructor(
      private readonly router: Router,
      private readonly gameService: GameService,
  ) {}

  /**
   * Create a game or join an existing one and route to that id
   * @param name
   */
  async createGame(name: string) {
    const gameId = await this.gameService.createOrGetGame(name);
    this.router.navigate(['game', gameId]);
  }
}
