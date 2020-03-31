import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Coordinate, PlayerPosition} from 'types';

import {AuthService} from './auth.service';

@Injectable({providedIn: 'root'})
export class PlacementService {
  pieces: string[] = [];

  selectedPieceIndex: number;
  selectedCell: Coordinate;

  position: PlayerPosition = {};

  constructor(
      private readonly afs: AngularFirestore,
      private readonly authService: AuthService,
  ) {}

  setPieces(pieces: string[]) {
    this.pieces = pieces;
  }

  selectPiece(index: number) {
    if (this.selectedPieceIndex === index) {
      this.selectedPieceIndex = undefined;
    } else {
      this.selectedPieceIndex = index;
    }
    this.assignPieceIfNecessary();
  }

  selectCell(coordinate: Coordinate) {
    const {row: row1, col: col1} = coordinate;
    const {row: row2, col: col2} = this.selectedCell || {};
    if (row1 === row2 && col1 === col2) {
      this.selectedCell = undefined;
    } else {
      this.selectedCell = coordinate;
    }
    this.assignPieceIfNecessary();
  }

  assignPieceIfNecessary() {
    if (this.selectedCell && this.selectedPieceIndex !== undefined) {
      // add the piece into the position map
      const {row, col} = this.selectedCell;
      const key = `${row},${col}`;

      // remove the piece from the available options
      const piece = this.pieces.splice(this.selectedPieceIndex, 1)[0];

      // if there was already a piece at this position make it available again
      const old = this.position[key];
      if (old) {
        this.pieces.push(old);
        this.pieces.sort();
      }

      // then put the new piece in it's place
      this.position[key] = piece;

      // clear the selections
      this.selectedPieceIndex = undefined;
      this.selectedCell = undefined;
    }
  }
  /**
   * Add the current position to the database for a given game
   * @param gameId
   */
  createPlayerPosition(gameId: string) {
    return this.afs.collection('games')
        .doc(gameId)
        .collection('positions')
        .doc(this.authService.currentUserId)
        .set(this.position);
  }
}