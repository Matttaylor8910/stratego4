import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Player} from 'types';

@Injectable({providedIn: 'root'})
export class PlayerService {
  constructor(
      private readonly afs: AngularFirestore,
  ) {}

  updatePlayer(player: Player): Promise<void> {
    return this.afs.collection('players').doc(player.id).update(player);
  }
}
