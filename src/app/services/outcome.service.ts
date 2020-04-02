import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Outcome} from 'types';

@Injectable({providedIn: 'root'})
export class OutcomeService {
  constructor(
      private readonly afs: AngularFirestore,
  ) {}

  getOutcomes(gameId: string): Observable<Outcome[]> {
    return this.afs.collection('games')
        .doc(gameId)
        .collection<Outcome>('outcomes', ref => ref.orderBy('timestamp'))
        .valueChanges();
  }
}
