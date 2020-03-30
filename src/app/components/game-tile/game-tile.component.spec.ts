import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GameTileComponent } from './game-tile.component';

describe('GameTileComponent', () => {
  let component: GameTileComponent;
  let fixture: ComponentFixture<GameTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameTileComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GameTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
