import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePersonalTask } from './create-personal-task';

describe('CreatePersonalTask', () => {
  let component: CreatePersonalTask;
  let fixture: ComponentFixture<CreatePersonalTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePersonalTask],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePersonalTask);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
