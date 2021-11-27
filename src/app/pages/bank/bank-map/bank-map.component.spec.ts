import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BankMapComponent } from './bank-map.component';

describe('BankMapComponent', () => {
  let component: BankMapComponent;
  let fixture: ComponentFixture<BankMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankMapComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BankMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
