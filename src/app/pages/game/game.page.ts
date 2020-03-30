import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from 'src/app/services/auth.service';
import {GameService} from 'src/app/services/game.service';

import {Game, Map} from '../../../../types';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage {
  gameId: string;
  game$: Observable<Game>;

  constructor(
      public readonly authService: AuthService,
      private readonly route: ActivatedRoute,
      private readonly gameService: GameService,
  ) {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.game$ = this.gameService.getGame(this.gameId);
  }

  mockedGame(): Game {
    return {
      id: 'this-route',
      name: 'this-route',
      phase: 'join',
      userIds: [],
      board: this.defaultMap(),
      state: undefined
    };
  }

  private defaultMap(): Map {
    return {
      name: 'Default',
      width: 13,
      height: 13,
      players: [
        {
          // red
          color: '#EECDCD',
          coordinates: [
            {row: 0, col: 4},
            {row: 0, col: 5},
            {row: 0, col: 6},
            {row: 0, col: 7},
            {row: 0, col: 8},
            {row: 1, col: 4},
            {row: 1, col: 5},
            {row: 1, col: 6},
            {row: 1, col: 7},
            {row: 1, col: 8},
            {row: 2, col: 4},
            {row: 2, col: 5},
            {row: 2, col: 6},
            {row: 2, col: 7},
            {row: 2, col: 8},
            {row: 3, col: 5},
            {row: 3, col: 6},
            {row: 3, col: 7},
          ]
        },
        {
          // blue
          color: '#CCDAF5',
          coordinates: [
            {row: 4, col: 0},
            {row: 4, col: 1},
            {row: 4, col: 2},
            {row: 5, col: 0},
            {row: 5, col: 1},
            {row: 5, col: 2},
            {row: 5, col: 3},
            {row: 6, col: 0},
            {row: 6, col: 1},
            {row: 6, col: 2},
            {row: 6, col: 3},
            {row: 7, col: 0},
            {row: 7, col: 1},
            {row: 7, col: 2},
            {row: 7, col: 3},
            {row: 8, col: 0},
            {row: 8, col: 1},
            {row: 8, col: 2},
          ]
        },
        {
          // green
          color: '#DCE9D5',
          coordinates: [
            {row: 4, col: 10},
            {row: 4, col: 11},
            {row: 4, col: 12},
            {row: 5, col: 9},
            {row: 5, col: 10},
            {row: 5, col: 11},
            {row: 5, col: 12},
            {row: 6, col: 9},
            {row: 6, col: 10},
            {row: 6, col: 11},
            {row: 6, col: 12},
            {row: 7, col: 9},
            {row: 7, col: 10},
            {row: 7, col: 11},
            {row: 7, col: 12},
            {row: 8, col: 10},
            {row: 8, col: 11},
            {row: 8, col: 12},
          ]
        },
        {
          // yellow
          color: '#FDF2D0',
          coordinates: [
            {row: 9, col: 5},
            {row: 9, col: 6},
            {row: 9, col: 7},
            {row: 10, col: 4},
            {row: 10, col: 5},
            {row: 10, col: 6},
            {row: 10, col: 7},
            {row: 10, col: 8},
            {row: 11, col: 4},
            {row: 11, col: 5},
            {row: 11, col: 6},
            {row: 11, col: 7},
            {row: 11, col: 8},
            {row: 12, col: 4},
            {row: 12, col: 5},
            {row: 12, col: 6},
            {row: 12, col: 7},
            {row: 12, col: 8},
          ]
        },
      ],
      pieces: {
        'F': 1,
        'B': 2,
        'S': 1,
        'G': 1,
        '6': 1,
        '5': 2,
        '4': 3,
        '3': 3,
        '2': 4,
      },
      offLimits: [
        // top left
        {row: 0, col: 0},
        {row: 0, col: 1},
        {row: 0, col: 2},
        {row: 0, col: 3},
        {row: 1, col: 0},
        {row: 1, col: 1},
        {row: 1, col: 2},
        {row: 1, col: 3},
        {row: 2, col: 0},
        {row: 2, col: 1},
        {row: 2, col: 2},
        {row: 2, col: 3},
        {row: 3, col: 0},
        {row: 3, col: 1},
        {row: 3, col: 2},
        // top right
        {row: 0, col: 9},
        {row: 0, col: 10},
        {row: 0, col: 11},
        {row: 0, col: 12},
        {row: 1, col: 9},
        {row: 1, col: 10},
        {row: 1, col: 11},
        {row: 1, col: 12},
        {row: 2, col: 9},
        {row: 2, col: 10},
        {row: 2, col: 11},
        {row: 2, col: 12},
        {row: 3, col: 10},
        {row: 3, col: 11},
        {row: 3, col: 12},
        // bottom left
        {row: 9, col: 0},
        {row: 9, col: 1},
        {row: 9, col: 2},
        {row: 10, col: 0},
        {row: 10, col: 1},
        {row: 10, col: 2},
        {row: 10, col: 3},
        {row: 11, col: 0},
        {row: 11, col: 1},
        {row: 11, col: 2},
        {row: 11, col: 3},
        {row: 12, col: 0},
        {row: 12, col: 1},
        {row: 12, col: 2},
        {row: 12, col: 3},
        // bottom right
        {row: 9, col: 10},
        {row: 9, col: 11},
        {row: 9, col: 12},
        {row: 10, col: 9},
        {row: 10, col: 10},
        {row: 10, col: 11},
        {row: 10, col: 12},
        {row: 11, col: 9},
        {row: 11, col: 10},
        {row: 11, col: 11},
        {row: 11, col: 12},
        {row: 12, col: 9},
        {row: 12, col: 10},
        {row: 12, col: 11},
        {row: 12, col: 12},
        // middle islands
        {row: 4, col: 6},
        {row: 6, col: 4},
        {row: 6, col: 8},
        {row: 8, col: 6},
      ]
    };
  }
}
