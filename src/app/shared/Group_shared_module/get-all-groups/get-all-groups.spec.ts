import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllGroups } from './get-all-groups';

describe('GetAllGroups', () => {
  let component: GetAllGroups;
  let fixture: ComponentFixture<GetAllGroups>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAllGroups],
    }).compileComponents();

    fixture = TestBed.createComponent(GetAllGroups);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
