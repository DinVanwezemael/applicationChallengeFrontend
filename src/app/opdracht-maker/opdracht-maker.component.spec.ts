import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdrachtMakerComponent } from './opdracht-maker.component';

describe('OpdrachtMakerComponent', () => {
  let component: OpdrachtMakerComponent;
  let fixture: ComponentFixture<OpdrachtMakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpdrachtMakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpdrachtMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
