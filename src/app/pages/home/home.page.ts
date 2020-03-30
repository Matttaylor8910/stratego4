import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  constructor(
      private readonly router: Router,
  ) {}

  goToGame(value) {
    console.log('Go To Game: ' + value);
    value = value.toLowerCase();
    value = value.replace(/[^a-zA-Z0-9 ]/g, '');  // remove illegal values
    value = value.replace(/[ ]/g, '-');  // spaces to dashes
    console.log('gameCode: ' + value);
    this.router.navigate(['game', value]);
  }
}
