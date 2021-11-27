import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WealthStandardComponent } from './wealth-standard.component';

describe('WealthStandardComponent', () => {
  let component: WealthStandardComponent;
  let fixture: ComponentFixture<WealthStandardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WealthStandardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WealthStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
