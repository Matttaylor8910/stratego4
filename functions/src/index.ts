import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();
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

async function getDefaultMap(): Promise<any> {
  const snapshot = await db.collection('maps').doc('default').get();
  return snapshot.data();
}