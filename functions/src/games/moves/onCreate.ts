import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import {CoordinateMap, Game, Move, Piece} from '../../../../types';

try {
  admin.initializeApp();
} catch (e) {
  console.log(e);
}
const db = admin.firestore();

export const onCreateMove =
    functions.firestore.document('games/{gameId}/moves/{moveId}')
        .onCreate(async (snapshot, _context) => {
          const moveRef = snapshot.ref
          const moveSnapshot = await moveRef.get();
          const move = moveSnapshot.data() as Move;

          const gameRef =
              moveRef.parent.parent as admin.firestore.DocumentReference;
          const gameSnapShot = await gameRef.get();
          const game = gameSnapShot.data() as Game;

          // '3,4' => userId of enemy
          const enemies: CoordinateMap = {};
          game.board!.players.forEach(player => {
            const me = player.userId === move.userId;
            if (!me) {
              Object.keys(player.coordinates).forEach(key => {
                enemies[key] = player.userId!;
              });
            }
          });

          // determine the player and fetch their position
          const myPlayerIndex =
              game.board!.players.findIndex(p => p.userId === move.userId);
          const posRef = gameRef.collection('positions').doc(move.userId);
          const posSnapshot = await posRef.get();
          const playerPosition = posSnapshot.data() as CoordinateMap;


          const batch = db.batch();
          const toKey = `${move.to.row},${move.to.col}`;
          const fromKey = `${move.from.row},${move.from.col}`;

          // if enemy, determine winner, delete the other
          if (enemies.hasOwnProperty(toKey)) {
            const enemyUserId = enemies[toKey];
            const enemyRef = gameRef.collection('positions').doc(enemyUserId);
            const enemySnapshot = await enemyRef.get();
            const enemyPosition = enemySnapshot.data() as CoordinateMap;
            const enemyPlayerIndex =
                game.board!.players.findIndex(p => p.userId === enemyUserId);

            const myRank = playerPosition[fromKey] as Piece;
            const enemyRank = enemyPosition[toKey] as Piece;
            const outcome = determineWinner(myRank, enemyRank);

            // if I won, take over enemy position
            if (outcome === 'win') {
              console.log('win');

              // update their position
              batch.update(
                  enemyRef, toKey, admin.firestore.FieldValue.delete());

              // update their player coordinates
              batch.update(
                  gameRef,
                  `board.players[${enemyPlayerIndex}].coordinates.${toKey}`,
                  admin.firestore.FieldValue.delete());

              // update my position
              batch.update(
                  posRef, toKey, playerPosition[fromKey], fromKey,
                  admin.firestore.FieldValue.delete());

              // update my player coordinates
              batch.update(
                  gameRef,
                  `board.players[${myPlayerIndex}].coordinates.${fromKey}`,
                  admin.firestore.FieldValue.delete(),
                  `board.players[${myPlayerIndex}].coordinates.${toKey}`, '');
            }

            // if they won, I just die
            else if (outcome === 'lose') {
              console.log('lose');

              // delete my position
              batch.update(
                  posRef, fromKey, admin.firestore.FieldValue.delete());

              // delete my player coordinates
              batch.update(
                  gameRef,
                  `board.players[${myPlayerIndex}].coordinates.${fromKey}`,
                  admin.firestore.FieldValue.delete());
            }

            // if we tie, both die
            else if (outcome === 'tie') {
              console.log('tie');

              // delete their position
              batch.update(
                  enemyRef, toKey, admin.firestore.FieldValue.delete());

              // delete their player coordinates
              batch.update(
                  gameRef,
                  `board.players[${enemyPlayerIndex}].coordinates.${toKey}`,
                  admin.firestore.FieldValue.delete());

              // delete my position
              batch.update(
                  posRef, fromKey, admin.firestore.FieldValue.delete());

              // delete my player coordinates
              batch.update(
                  gameRef,
                  `board.players[${myPlayerIndex}].coordinates.${fromKey}`,
                  admin.firestore.FieldValue.delete());
            }

            // we captured the flag!!!
            else if (outcome === 'flag') {
              console.log('TODO: do more with the flag');

              // TODO: update capture points +15, eliminate that player

              // update their position
              batch.update(
                  enemyRef, toKey, admin.firestore.FieldValue.delete());

              // update their player coordinates
              batch.update(
                  gameRef,
                  `board.players[${enemyPlayerIndex}].coordinates.${toKey}`,
                  admin.firestore.FieldValue.delete());

              // update my position
              batch.update(
                  posRef, toKey, playerPosition[fromKey], fromKey,
                  admin.firestore.FieldValue.delete());

              // update my player coordinates
              batch.update(
                  gameRef,
                  `board.players[${myPlayerIndex}].coordinates.${fromKey}`,
                  admin.firestore.FieldValue.delete(),
                  `board.players[${myPlayerIndex}].coordinates.${toKey}`, '');
            }
          }

          // if it's an empty square, just move
          else {
            console.log('empty');

            // update my position
            batch.update(posRef, {
              [toKey]: playerPosition[fromKey],
              [fromKey]: admin.firestore.FieldValue.delete(),
            });

            // update my player coordinates
            batch.update(gameRef, {
              [`board.players[${myPlayerIndex}].coordinates.${fromKey}`]:
                  admin.firestore.FieldValue.delete(),
              [`board.players[${myPlayerIndex}].coordinates.${toKey}`]: '',
            });
          }

          // increment the game turn counter
          batch.update(gameRef, {
            'state.turn': admin.firestore.FieldValue.increment(1),
          });
          // TODO: scores

          // commit
          return batch.commit();
        });

function determineWinner(myRank: Piece, enemyRank: Piece): 'win'|'lose'|'tie'|
    'flag' {
  const numberMap = {
    [Piece.SPY]: 1,
    [Piece.TWO]: 2,
    [Piece.THREE]: 3,
    [Piece.FOUR]: 4,
    [Piece.FIVE]: 5,
    [Piece.SIX]: 6,
    [Piece.GENERAL]: 7,
    [Piece.BOMB]: 1000,
    [Piece.FLAG]: 0,
  };

  // if equals, both die, tie
  if (myRank === enemyRank) {
    return 'tie';
  }

  // captured flag
  if (enemyRank === Piece.FLAG) {
    return 'flag';
  }

  // my spy kills their general
  if (enemyRank === Piece.GENERAL && myRank === Piece.SPY) {
    return 'win';
  }

  // my three kills their bomb
  if (enemyRank === Piece.BOMB && myRank === Piece.THREE) {
    return 'win';
  }

  // otherwise, bigger wins (bomb is big in this case)
  return numberMap[myRank] > numberMap[enemyRank] ? 'win' : 'lose';
}