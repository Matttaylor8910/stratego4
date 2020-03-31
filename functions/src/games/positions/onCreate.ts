import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

try {
  admin.initializeApp();
} catch (e) {
  console.log(e);
}

export const onCreatePosition =
    functions.firestore.document('games/{gameId}/positions/{positionId}')
        .onCreate(async (snapshot, _context) => {
          console.log('hello world');
        });