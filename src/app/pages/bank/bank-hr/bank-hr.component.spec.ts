import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BankHrComponent } from './bank-hr.component';

describe('BankHrComponent', () => {
  let component: BankHrComponent;
  let fixture: ComponentFixture<BankHrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankHrComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BankHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
