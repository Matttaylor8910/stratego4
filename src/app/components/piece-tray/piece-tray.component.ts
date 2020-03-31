import {Component, Input, OnInit} from '@angular/core';
import {PlacementService} from 'src/app/services/placement.service';
import {Game, PiecesMap, PlayerPosition} from 'types';



@Component({
  selector: 'str-piece-tray',
  templateUrl: './piece-tray.component.html',
  styleUrls: ['./piece-tray.component.scss'],
})
export class PieceTrayComponent implements OnInit {
  @Input() game: Game;
  @Input() position: PlayerPosition;

  saved = false;

  constructor(
      public readonly placementService: PlacementService,
  ) {}

  ngOnInit() {
    this.createPieces(this.game.board!.pieces);
  }

  get done(): boolean {
    return this.saved || this.position !== undefined;
  }

  // boostrap the placement service
  createPieces(startingPieces: PiecesMap) {
    const pieces = [];

    Object.keys(startingPieces).forEach(key => {
      for (let i = 0; i < startingPieces[key]; i++) {
        pieces.push(key);
      }
    });

    this.placementService.setPieces(pieces);
  }

  savePosition() {
    this.saved = true;
    this.placementService.createPlayerPosition(this.game.id)
  }
}
