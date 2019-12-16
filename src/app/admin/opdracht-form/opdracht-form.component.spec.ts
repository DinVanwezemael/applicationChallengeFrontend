import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdrachtFormComponent } from './opdracht-form.component';

describe('OpdrachtFormComponent', () => {
  let component: OpdrachtFormComponent;
  let fixture: ComponentFixture<OpdrachtFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpdrachtFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpdrachtFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
