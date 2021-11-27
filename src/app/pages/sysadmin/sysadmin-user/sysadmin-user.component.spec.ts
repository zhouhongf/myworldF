import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SysadminUserComponent } from './sysadmin-user.component';

describe('SysadminUserComponent', () => {
  let component: SysadminUserComponent;
  let fixture: ComponentFixture<SysadminUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysadminUserComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SysadminUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
