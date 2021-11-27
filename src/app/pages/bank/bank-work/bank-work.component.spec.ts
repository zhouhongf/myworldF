import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BankWorkComponent } from './bank-work.component';

describe('BankWorkComponent', () => {
  let component: BankWorkComponent;
  let fixture: ComponentFixture<BankWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankWorkComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BankWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
