import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BedrijfOpdrachtenComponent } from './bedrijf-opdrachten.component';

describe('BedrijfOpdrachtenComponent', () => {
  let component: BedrijfOpdrachtenComponent;
  let fixture: ComponentFixture<BedrijfOpdrachtenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BedrijfOpdrachtenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BedrijfOpdrachtenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
