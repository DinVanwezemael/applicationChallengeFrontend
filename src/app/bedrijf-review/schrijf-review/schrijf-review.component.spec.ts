import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchrijfReviewComponent } from './schrijf-review.component';

describe('SchrijfReviewComponent', () => {
  let component: SchrijfReviewComponent;
  let fixture: ComponentFixture<SchrijfReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchrijfReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchrijfReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
