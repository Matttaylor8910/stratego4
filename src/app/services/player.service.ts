import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Game, PlayerPosition} from 'types';

import {AuthService} from './auth.service';

@Injectable({providedIn: 'root'})
export class PlayerService {
  constructor(
      private readonly authService: AuthService,
      private readonly afs: AngularFirestore,
  ) {}

  async getPlayerPosition(gameId: string): Promise<Observable<PlayerPosition>> {
    const userId = await this.authService.getUserId();
    return this.afs.collection('games')
        .doc<Game>(gameId)
        .collection('positions')
        .doc<PlayerPosition>(userId)
        .valueChanges();
  }
}
