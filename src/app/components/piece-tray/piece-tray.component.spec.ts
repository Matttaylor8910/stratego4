import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PieceTrayComponent } from './piece-tray.component';

describe('PieceTrayComponent', () => {
  let component: PieceTrayComponent;
  let fixture: ComponentFixture<PieceTrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieceTrayComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PieceTrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
