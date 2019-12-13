import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BedrijfReviewComponent } from './bedrijf-review.component';

describe('BedrijfReviewComponent', () => {
  let component: BedrijfReviewComponent;
  let fixture: ComponentFixture<BedrijfReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BedrijfReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BedrijfReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
