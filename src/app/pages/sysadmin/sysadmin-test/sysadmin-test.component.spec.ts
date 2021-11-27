import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SysadminTestComponent } from './sysadmin-test.component';

describe('SysadminTestComponent', () => {
  let component: SysadminTestComponent;
  let fixture: ComponentFixture<SysadminTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysadminTestComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SysadminTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
