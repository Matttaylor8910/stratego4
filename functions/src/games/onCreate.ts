import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

try {
  admin.initializeApp();
} catch (e) {
  console.log(e);
}
const db = admin.firestore();

/**
 * Whenever a game is created, we need to set up the initial data
 */
export const onCreateGame = functions.firestore.document('games/{gameId}')
                                .onCreate(async (snapshot, _context) => {
                                  return snapshot.ref.update({
                                    phase: 'join',
                                    userIds: [],
                                    state: {
                                      players: [],
                                      turn: 0,
                                    },
                                    board: await getDefaultMap()
                                  });
                                });


/**
 * Return the default map from the database
 */
async function getDefaultMap(): Promise<any> {
  const snapshot = await db.collection('maps').doc('default').get();
  return snapshot.data();
}