import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskReviewsDetails } from './task-reviews-details';

describe('TaskReviewsDetails', () => {
  let component: TaskReviewsDetails;
  let fixture: ComponentFixture<TaskReviewsDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskReviewsDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskReviewsDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
