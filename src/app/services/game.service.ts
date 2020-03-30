import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentReference} from '@angular/fire/firestore';
import {firestore} from 'firebase';
import {Observable} from 'rxjs';
import {Game} from '../../../types';
import {AuthService} from './auth.service';

@Injectable({providedIn: 'root'})
export class GameService {
  private db: firestore.Firestore;

  constructor(
      private readonly authService: AuthService,
      private readonly afs: AngularFirestore,
  ) {
    this.db = firestore();
  }

  /**
   * Create a game and return the id of document
   * @param name
   */
  async createOrGetGame(name: string): Promise<string> {
    const id = this.createGameId(name);
    const game = await this.db.collection('games').doc(id).get();

    // if the game doesn't exist, create it
    if (!game.exists) {
      await this.afs.collection('games').doc(id).set({id, name});
    }

    // return the doc id
    return id;
  }

  /**
   * Return a game
   * @param id
   */
  getGame(id: string): Observable<Game> {
    return this.afs.collection('games').doc<Game>(id).valueChanges();
  }

  /**
   * Join a game
   * @param gameId
   * @param index
   */
  async joinGame(gameId: string, index: number): Promise<DocumentReference> {
    const userId = await this.authService.getUserId();
    return this.afs.collection('games').doc(gameId).collection('requests').add({
      userId,
      index
    });
  }

  /**
   * "Suh dude!" turns into "suh-dude"
   * @param name
   */
  private createGameId(name: string): string {
    return name.toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, '')  // remove illegal values
        .replace(/[ ]/g, '-');          // spaces to dashes
  }
}
