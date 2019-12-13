import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BedrijfFormComponent } from './bedrijf-form.component';

describe('BedrijfFormComponent', () => {
  let component: BedrijfFormComponent;
  let fixture: ComponentFixture<BedrijfFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BedrijfFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BedrijfFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
