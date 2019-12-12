import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BedrijfComponent } from './bedrijf.component';

describe('BedrijfComponent', () => {
  let component: BedrijfComponent;
  let fixture: ComponentFixture<BedrijfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BedrijfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BedrijfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
