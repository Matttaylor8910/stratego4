import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import {Game, JoinRequest} from '../../types';

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

export const onRequestJoinGame =
    functions.firestore.document('games/{gameId}/requests/{requestId}')
        .onCreate(async (snapshot, _context) => {
          const gameRef = snapshot.ref.parent.parent!;
          const gameSnapshot = await gameRef.get();
          const game = gameSnapshot.data() as Game;
          const request = snapshot.data() as JoinRequest;

          return assignPlayerOrDont(gameRef, game, request)
        });

/**
 * Give some information about a game and the join request, assign a player to a
 * team if we can
 * @param gameRef
 * @param game
 * @param request
 */
async function assignPlayerOrDont(
    gameRef: admin.firestore.DocumentReference, game: Game,
    request: JoinRequest): Promise<admin.firestore.WriteResult> {
  console.log(game, request);

  const players = game.board!.players;
  const playerIds = players.filter(p => p.userId).map(p => p.userId);
  const {index, userId} = request;

  // if this user hasn't already joined the game and a userId hasn't been set at
  // this path yet, add them to the game
  console.log('playerIds', playerIds);
  if (!playerIds.includes(userId) && !players[index].userId) {
    players[index].userId = userId;
    game.userIds = game.userIds!.concat(userId);
    game.state!.players = game.state!.players.concat({userId, score: 0});
    game.board!.players = players;
  };

  // if all spots have been filled, move to the placement round
  const availableSpots = players.filter(p => !p.userId).length;
  if (availableSpots === 0) {
    game.phase = 'placement';
  }

  // update the game
  return gameRef.update(game);
}

/**
 * Return the default map from the database
 */
async function getDefaultMap(): Promise<any> {
  const snapshot = await db.collection('maps').doc('default').get();
  return snapshot.data();
}