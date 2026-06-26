import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSheetFile } from './task-sheet-file';

describe('TaskSheetFile', () => {
  let component: TaskSheetFile;
  let fixture: ComponentFixture<TaskSheetFile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskSheetFile],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskSheetFile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
