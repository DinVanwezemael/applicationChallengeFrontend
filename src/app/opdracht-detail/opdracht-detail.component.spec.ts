import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdrachtDetailComponent } from './opdracht-detail.component';

describe('OpdrachtDetailComponent', () => {
  let component: OpdrachtDetailComponent;
  let fixture: ComponentFixture<OpdrachtDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpdrachtDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpdrachtDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
