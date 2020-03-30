import {Component, Input, OnInit} from '@angular/core';
import {Map} from '../../../../types';

@Component({
  selector: 'str-piece-tray',
  templateUrl: './piece-tray.component.html',
  styleUrls: ['./piece-tray.component.scss'],
})
export class PieceTrayComponent implements OnInit {

  @Input() board: Map;
  @Input() startingPieces: {[shortName: string]: number};
  pieces = [];
  selectedPiece: number;

  constructor() { }

  ngOnInit() {
    this.createPieces(this.startingPieces);
  }

  createPieces(startingPieces) {
    let pieceNum = 0;

    Object.keys(startingPieces).forEach(key => {
      for (let i = 0; i < startingPieces[key]; i++) {
        this.pieces.push({
          id: pieceNum,
          rank: key,
          isUsed: false
        });
        pieceNum++;
      }
    });
  }

  selectPiece(id: number) {
    if (this.selectedPiece && this.selectedPiece === id) {
      this.selectedPiece = undefined;
    } else {
      this.selectedPiece = id;
      // TODO: emit event for selected piece?
    }
  }

  usePiece(id: number) {
    const foundPiece = this.pieces.find(piece => piece.id === id);
    foundPiece.isUsed = !foundPiece.isUsed;
  }
}
