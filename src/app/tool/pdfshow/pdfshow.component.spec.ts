import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PdfshowComponent } from './pdfshow.component';

describe('PdfshowComponent', () => {
  let component: PdfshowComponent;
  let fixture: ComponentFixture<PdfshowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfshowComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PdfshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
