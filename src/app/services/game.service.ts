import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Game} from 'types';

@Injectable({providedIn: 'root'})
export class GameService {
  constructor(
      private readonly afs: AngularFirestore,
  ) {}

  createGame(game: Game) {
    return this.afs.collection('games').doc(game.name).set(game);
  }
}
