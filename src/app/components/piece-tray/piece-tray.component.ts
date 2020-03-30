import {Component, Input, OnInit} from '@angular/core';
import {PlacementService} from 'src/app/services/placement.service';

import {Map, PiecePosition} from '../../../../types';

@Component({
  selector: 'str-piece-tray',
  templateUrl: './piece-tray.component.html',
  styleUrls: ['./piece-tray.component.scss'],
})
export class PieceTrayComponent implements OnInit {
  @Input() startingPieces: PiecePosition[];

  constructor(
      public readonly placementService: PlacementService,
  ) {}

  ngOnInit() {
    this.createPieces(this.startingPieces);
  }

  // boostrap the placement service
  createPieces(startingPieces: PiecePosition[]) {
    const pieces = [];
    let pieceNum = 0;

    Object.keys(startingPieces).forEach(key => {
      for (let i = 0; i < startingPieces[key]; i++) {
        pieces.push({id: pieceNum, rank: key, isUsed: false});
        pieceNum++;
      }
    });

    this.placementService.setPieces(pieces);
  }
}
