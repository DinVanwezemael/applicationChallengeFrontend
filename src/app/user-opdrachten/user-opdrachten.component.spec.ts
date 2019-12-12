import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOpdrachtenComponent } from './user-opdrachten.component';

describe('UserOpdrachtenComponent', () => {
  let component: UserOpdrachtenComponent;
  let fixture: ComponentFixture<UserOpdrachtenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserOpdrachtenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOpdrachtenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
