import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WealthScaleComponent } from './wealth-scale.component';

describe('WealthScaleComponent', () => {
  let component: WealthScaleComponent;
  let fixture: ComponentFixture<WealthScaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WealthScaleComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WealthScaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
