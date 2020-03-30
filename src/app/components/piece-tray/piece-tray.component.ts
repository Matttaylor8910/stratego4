import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Map, PiecePosition} from '../../../../types';

interface SelectablePiece {
  id: number;
  rank: string;
  isUsed: boolean;
}

@Component({
  selector: 'str-piece-tray',
  templateUrl: './piece-tray.component.html',
  styleUrls: ['./piece-tray.component.scss'],
})
export class PieceTrayComponent implements OnInit {
  @Input() board: Map;
  @Input() startingPieces: PiecePosition[];
  pieces: SelectablePiece[] = [];
  selectedPiece: number;

  constructor() {}

  ngOnInit() {
    this.createPieces(this.startingPieces);
  }

  createPieces(startingPieces: PiecePosition[]) {
    let pieceNum = 0;

    Object.keys(startingPieces).forEach(key => {
      for (let i = 0; i < startingPieces[key]; i++) {
        this.pieces.push({id: pieceNum, rank: key, isUsed: false});
        pieceNum++;
      }
    });
  }

  selectPiece(piece: SelectablePiece) {
    if (this.selectedPiece && this.selectedPiece === piece.id) {
      this.selectedPiece = undefined;
    } else {
      this.selectedPiece = piece.id;
    }

    // TODO: emit or something here
  }

  usePiece(id: number) {
    const foundPiece = this.pieces.find(piece => piece.id === id);
    foundPiece.isUsed = !foundPiece.isUsed;
  }
}
