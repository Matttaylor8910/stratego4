import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {Game} from '../../../../types';

try {
  admin.initializeApp();
} catch (e) {
  console.log(e);
}

export const onCreatePosition =
    functions.firestore.document('games/{gameId}/positions/{positionId}')
        .onCreate(async (snapshot, _context) => {
          const posRef = snapshot.ref.parent
          const posSnapshot = await posRef.get();
          const posIds = posSnapshot.docs.map(doc => doc.id);

          const gameRef = posRef.parent;
          const gameSnapShot = await gameRef!.get();
          const game = gameSnapShot.data() as Game;

          // if positions are being made, the userIds exist
          // once every user has a position set, start the game
          const everyoneReady = game.userIds!.every(id => posIds.includes(id));
          if (everyoneReady) {
            await gameRef!.update({phase: 'playing'});
          }
        });