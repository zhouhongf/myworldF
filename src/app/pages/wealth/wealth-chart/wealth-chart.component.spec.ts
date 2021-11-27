import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WealthChartComponent } from './wealth-chart.component';

describe('WealthChartComponent', () => {
  let component: WealthChartComponent;
  let fixture: ComponentFixture<WealthChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WealthChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WealthChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
