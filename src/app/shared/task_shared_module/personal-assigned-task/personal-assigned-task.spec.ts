import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAssignedTask } from './personal-assigned-task';

describe('PersonalAssignedTask', () => {
  let component: PersonalAssignedTask;
  let fixture: ComponentFixture<PersonalAssignedTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalAssignedTask],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalAssignedTask);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
