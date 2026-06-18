import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGroupTask } from './create-group-task';

describe('CreateGroupTask', () => {
  let component: CreateGroupTask;
  let fixture: ComponentFixture<CreateGroupTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGroupTask],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateGroupTask);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
