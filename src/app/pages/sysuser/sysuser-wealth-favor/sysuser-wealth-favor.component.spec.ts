import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SysuserWealthFavorComponent } from './sysuser-wealth-favor.component';

describe('SysuserWealthFavorComponent', () => {
  let component: SysuserWealthFavorComponent;
  let fixture: ComponentFixture<SysuserWealthFavorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysuserWealthFavorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SysuserWealthFavorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
