import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchrijfMakerreviewComponent } from './schrijf-makerreview.component';

describe('SchrijfMakerreviewComponent', () => {
  let component: SchrijfMakerreviewComponent;
  let fixture: ComponentFixture<SchrijfMakerreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchrijfMakerreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchrijfMakerreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
