import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestemdeOpdrachtenComponent } from './gestemde-opdrachten.component';

describe('GestemdeOpdrachtenComponent', () => {
  let component: GestemdeOpdrachtenComponent;
  let fixture: ComponentFixture<GestemdeOpdrachtenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestemdeOpdrachtenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestemdeOpdrachtenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
