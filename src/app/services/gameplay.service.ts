import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Coordinate, CoordinateMap, Game, Move, Piece} from 'types';
import {AuthService} from './auth.service';

@Injectable({providedIn: 'root'})
export class GameplayService {
  selectedCell: Coordinate;
  availableMoves: CoordinateMap = {};

  constructor(
      private readonly authService: AuthService,
      private readonly afs: AngularFirestore,
  ) {}

  selectCell(rank: Piece, coordinate: Coordinate, game: Game) {
    switch (rank) {
      case Piece.BOMB:
      case Piece.FLAG:
        this.selectedCell = coordinate;
        this.availableMoves = {};
        break;  // can't move flags or bombs
      default:
        this.buildAvailableMoves(rank, coordinate, game);
        break;
    }
  }

  private buildAvailableMoves(rank: Piece, coordinate: Coordinate, game: Game) {
    // '3,4': 'me'|'enemy'|'offLimits'
    const gameMap: CoordinateMap = {};
    game.board.players.forEach(player => {
      const me = player.userId === this.authService.currentUserId;
      Object.keys(player.coordinates).forEach(key => {
        gameMap[key] = me ? 'me' : 'enemy';
      });
    });
    Object.keys(game.board.offLimits).forEach(key => {
      gameMap[key] = 'offLimits';
    });

    const {row, col} = coordinate;

    // if we clicked on our own piece, figure out available moves
    if (gameMap[`${row},${col}`] === 'me') {
      this.selectedCell = coordinate;
      this.availableMoves = {};

      this.buildAvailableMovesLeft(rank, row, col, gameMap, game);
      this.buildAvailableMovesRight(rank, row, col, gameMap, game);
      this.buildAvailableMovesUp(rank, row, col, gameMap, game);
      this.buildAvailableMovesDown(rank, row, col, gameMap, game);
    }

    // otherwise, this is a move we can make, add to firestore
    else {
      this.makeMove(game.id, {
        to: coordinate,
        from: this.selectedCell,
        userId: this.authService.currentUserId
      });
    }
  }

  buildAvailableMovesLeft(
      rank: Piece, row: number, col: number, gameMap: CoordinateMap,
      game: Game) {
    const keepGoing = this.addAvailableMove(row, col - 1, gameMap, game);
    if (keepGoing && rank === Piece.TWO) {
      this.buildAvailableMovesLeft(rank, row, col - 1, gameMap, game);
    }
  }

  buildAvailableMovesRight(
      rank: Piece, row: number, col: number, gameMap: CoordinateMap,
      game: Game) {
    const keepGoing = this.addAvailableMove(row, col + 1, gameMap, game);
    if (keepGoing && rank === Piece.TWO) {
      this.buildAvailableMovesRight(rank, row, col + 1, gameMap, game);
    }
  }

  buildAvailableMovesUp(
      rank: Piece, row: number, col: number, gameMap: CoordinateMap,
      game: Game) {
    const keepGoing = this.addAvailableMove(row - 1, col, gameMap, game);
    if (keepGoing && rank === Piece.TWO) {
      this.buildAvailableMovesUp(rank, row - 1, col, gameMap, game);
    }
  }

  buildAvailableMovesDown(
      rank: Piece, row: number, col: number, gameMap: CoordinateMap,
      game: Game) {
    const keepGoing = this.addAvailableMove(row + 1, col, gameMap, game);
    if (keepGoing && rank === Piece.TWO) {
      this.buildAvailableMovesDown(rank, row + 1, col, gameMap, game);
    }
  }

  private addAvailableMove(
      row: number, col: number, gameMap: CoordinateMap, game: Game): boolean {
    const {width, height} = game.board;

    // out of bounds
    if (row < 0 || row >= width || col < 0 || col >= height) {
      return false;
    }

    // handle different spots in the map
    const key = `${row},${col}`;
    switch (gameMap[key]) {
      case 'me':
      case 'offLimits':
        return false;
      case 'enemy':
        // it's an available move, but you can't go further
        this.availableMoves[key] = 'true';
        return false;
      default:
        // it's an empty space, so it's good
        this.availableMoves[key] = 'true';
        return true;
    }
  }

  /**
   * Send a move to Firestore
   */
  private makeMove(gameId: string, move: Move) {
    this.selectedCell = undefined;
    this.availableMoves = {};
    return this.afs.collection('games').doc(gameId).collection('moves').add(
        move);
  }
}
