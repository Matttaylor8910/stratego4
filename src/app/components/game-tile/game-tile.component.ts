import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'str-game-tile',
  templateUrl: './game-tile.component.html',
  styleUrls: ['./game-tile.component.scss'],
})
export class GameTileComponent implements OnInit {

  @Input()
  color: string;

  constructor() { }

  ngOnInit() {
    // console.log('my Color is ' + this.color);
  }

}
