import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdrachtStemmenComponent } from './opdracht-stemmen.component';

describe('OpdrachtStemmenComponent', () => {
  let component: OpdrachtStemmenComponent;
  let fixture: ComponentFixture<OpdrachtStemmenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpdrachtStemmenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpdrachtStemmenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
