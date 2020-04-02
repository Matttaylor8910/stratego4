import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import {CoordinateMap, Game, Move, Piece} from '../../../../types';

try {
  admin.initializeApp();
} catch (e) {
  console.log(e);
}
const db = admin.firestore();

const captureValues = {
    [Piece.TWO]: 2,
    [Piece.THREE]: 3,
    [Piece.FOUR]: 4,
    [Piece.FIVE]: 5,
    [Piece.SIX]: 6,
    [Piece.GENERAL]: 7,
    [Piece.SPY]: 0,
    [Piece.BOMB]: 5,
    [Piece.FLAG]: 15,
};

export const onCreateMove =
    functions.firestore.document('games/{gameId}/moves/{moveId}')
        .onCreate(async (snapshot, _context) => {
          const moveRef = snapshot.ref
          const moveSnapshot = await moveRef.get();
          const move = moveSnapshot.data() as Move;

          const gameRef = moveRef.parent.parent;
          const gameSnapShot = await gameRef!.get();
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
          const myPlayerIndex = game.board!.players.findIndex(p => p.userId === move.userId);
          const myPlayer = game.board!.players[myPlayerIndex];

          const posRef = gameRef!.collection('positions').doc(move.userId);
          const posSnapshot = await posRef.get();
          const playerPosition = posSnapshot.data() as CoordinateMap;


          const batch = db.batch();
          const toKey = `${move.to.row},${move.to.col}`;
          const fromKey = `${move.from.row},${move.from.col}`;

          // if enemy, determine winner, delete the other
          if (enemies.hasOwnProperty(toKey)) {
            const enemyUserId = enemies[toKey];
            const enemyRef = gameRef!.collection('positions').doc(enemyUserId);
            const enemySnapshot = await enemyRef.get();
            const enemyPosition = enemySnapshot.data() as CoordinateMap;
            const enemyPlayerIndex = game.board!.players.findIndex(p => p.userId === enemyUserId);
            const enemyPlayer = game.board!.players[enemyPlayerIndex];

            const myRank = playerPosition[fromKey] as Piece;
            const enemyRank = enemyPosition[toKey] as Piece;
            const outcome = determineWinner(myRank, enemyRank);

            // if I won, take over enemy position
            if (outcome === 'win') {
              console.log('win');

              // update their position
              delete enemyPosition[toKey];
              batch.set(enemyRef, enemyPosition);

              // update their player coordinates
              delete enemyPlayer!.coordinates[toKey];

              // update my position
              playerPosition[toKey] = playerPosition[fromKey];
              delete playerPosition[fromKey];
              batch.set(posRef, playerPosition);

              // update my player coordinates
              delete myPlayer!.coordinates[fromKey];
              myPlayer!.coordinates[toKey] = '';

              //update scores
              // myPlayer gets enemyRank points
              game.state!.players[myPlayerIndex].score += captureValues[enemyRank];
            }

            // if they won, I just die
            else if (outcome === 'lose') {
              console.log('lose');

              // delete my position
              delete playerPosition[fromKey];
              batch.set(posRef, playerPosition);

              // delete my player coordinates
              delete myPlayer!.coordinates[fromKey];

              //update scores
              // enemyPlayer gets myRank points
              game.state!.players[enemyPlayerIndex].score += captureValues[myRank];
            }

            // if we tie, both die
            else if (outcome === 'tie') {
              console.log('tie');

              // delete their position
              delete enemyPosition[toKey];
              batch.set(enemyRef, enemyPosition);

              // delete their player coordinates
              delete enemyPlayer!.coordinates[toKey];

              // delete my position
              delete playerPosition[fromKey];
              batch.set(posRef, playerPosition);

              // delete my player coordinates
              delete myPlayer!.coordinates[fromKey];

              // Both players get points
              game.state!.players[myPlayerIndex].score += captureValues[enemyRank];
              game.state!.players[enemyPlayerIndex].score += captureValues[myRank];
            }

            // we captured the flag!!!
            else if (outcome === 'flag') {
              console.log('TODO: do more with the flag');

              // TODO: eliminate that player

              // update their position
              delete enemyPosition[toKey];
              batch.set(enemyRef, enemyPosition);

              // update their player coordinates
              delete enemyPlayer!.coordinates[toKey];

              // update my position
              playerPosition[toKey] = playerPosition[fromKey];
              delete playerPosition[fromKey];
              batch.set(posRef, playerPosition);

              // update my player coordinates
              delete myPlayer!.coordinates[fromKey];
              myPlayer!.coordinates[toKey] = '';

              //Flag points
              game.state!.players[myPlayerIndex].score += captureValues[enemyRank];
            }
          }

          // if it's an empty square, just move
          else {
            console.log('empty');

            // update my position
            playerPosition[toKey] = playerPosition[fromKey];
            delete playerPosition[fromKey];
            batch.set(posRef, playerPosition);

            // update my player coordinates
            delete myPlayer!.coordinates[fromKey];
            myPlayer!.coordinates[toKey] = '';
          }

          // update the game
          game.state!.turn++;
          // TODO: scores
          batch.set(gameRef!, game);

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