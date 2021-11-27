import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SysuserTextFavorComponent } from './sysuser-text-favor.component';

describe('SysuserTextFavorComponent', () => {
  let component: SysuserTextFavorComponent;
  let fixture: ComponentFixture<SysuserTextFavorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysuserTextFavorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SysuserTextFavorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
