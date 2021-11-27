import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BankBlogComponent } from './bank-blog.component';

describe('BankBlogComponent', () => {
  let component: BankBlogComponent;
  let fixture: ComponentFixture<BankBlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankBlogComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BankBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
