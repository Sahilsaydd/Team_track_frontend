import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalTaskReview } from './personal-task-review';

describe('PersonalTaskReview', () => {
  let component: PersonalTaskReview;
  let fixture: ComponentFixture<PersonalTaskReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalTaskReview],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalTaskReview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
