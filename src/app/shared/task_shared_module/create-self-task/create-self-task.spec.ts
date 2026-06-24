import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSelfTask } from './create-self-task';

describe('CreateSelfTask', () => {
  let component: CreateSelfTask;
  let fixture: ComponentFixture<CreateSelfTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSelfTask],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSelfTask);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
