import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakerReviewComponent } from './maker-review.component';

describe('MakerReviewComponent', () => {
  let component: MakerReviewComponent;
  let fixture: ComponentFixture<MakerReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakerReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakerReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
