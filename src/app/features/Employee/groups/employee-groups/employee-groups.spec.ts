import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeGroups } from './employee-groups';

describe('EmployeeGroups', () => {
  let component: EmployeeGroups;
  let fixture: ComponentFixture<EmployeeGroups>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeGroups],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeGroups);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
