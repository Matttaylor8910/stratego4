import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {OutcomeService} from 'src/app/services/outcome.service';
import {Game, Outcome} from 'types';

@Component({
  selector: 'str-outcome-feed',
  templateUrl: './outcome-feed.component.html',
  styleUrls: ['./outcome-feed.component.scss'],
})
export class OutcomeFeedComponent implements OnInit {
  @Input() game: Game;

  outcomes$: Observable<Outcome[]>;

  constructor(
      private readonly outcomeService: OutcomeService,
  ) {}

  ngOnInit() {
    this.outcomes$ =
        this.outcomeService.getOutcomes(this.game.id).pipe(tap(outcomes => {
          console.log(outcomes);
        }));
  }
}
