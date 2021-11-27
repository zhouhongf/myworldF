import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SysuserHrFavorComponent } from './sysuser-hr-favor.component';

describe('SysuserHrFavorComponent', () => {
  let component: SysuserHrFavorComponent;
  let fixture: ComponentFixture<SysuserHrFavorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysuserHrFavorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SysuserHrFavorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
