import {Injectable} from '@angular/core';
import {Coordinate} from 'types';

export interface SelectablePiece {
  id: number;
  rank: string;
  isUsed: boolean;
}

@Injectable({providedIn: 'root'})
export class PlacementService {
  pieces: SelectablePiece[] = [];

  selectedPiece: number;
  selectedCell: Coordinate;

  constructor() {}

  setPieces(pieces: SelectablePiece[]) {
    this.pieces = pieces;
  }

  selectPiece(piece: SelectablePiece) {
    console.log('piece', piece);
    if (this.selectedPiece && this.selectedPiece === piece.id) {
      this.selectedPiece = undefined;
    } else {
      this.selectedPiece = piece.id;
    }
    this.assignPieceIfNecessary();
  }

  selectCell(coordinate: Coordinate) {
    console.log('coordinate', coordinate);
    if (this.selectedCell && this.selectedCell === coordinate) {
      this.selectedCell = undefined;
    } else {
      this.selectedCell = coordinate;
    }
    this.assignPieceIfNecessary();
  }

  assignPieceIfNecessary() {
    console.log(this.selectedCell, this.selectedPiece);
  }
}
