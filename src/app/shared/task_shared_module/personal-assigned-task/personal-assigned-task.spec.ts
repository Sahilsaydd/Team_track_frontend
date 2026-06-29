import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAssignedTaskComponent } from './personal-assigned-task';
import { Task } from '../../../core/services/task';

describe('PersonalAssignedTaskComponent', () => {
  let component: PersonalAssignedTaskComponent;
  let fixture: ComponentFixture<PersonalAssignedTaskComponent>;

  beforeEach(async () => {
    const taskServiceStub = {
      getPersonalAssignedTasks: jasmine.createSpy('getPersonalAssignedTasks').and.returnValue({ subscribe: () => {} }),
      uploadEvidence: jasmine.createSpy('uploadEvidence').and.returnValue({ subscribe: () => {} }),
      submitTask: jasmine.createSpy('submitTask').and.returnValue({ subscribe: () => {} }),
    };

    await TestBed.configureTestingModule({
      imports: [PersonalAssignedTaskComponent],
      providers: [{ provide: Task, useValue: taskServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalAssignedTaskComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should store selected screenshot and document files for submission', () => {
    const screenshot = new File(['img'], 'screenshot.png', { type: 'image/png' });
    const document = new File(['doc'], 'notes.pdf', { type: 'application/pdf' });

    component.onScreenshotSelect({ target: { files: [screenshot] } } as any);
    component.onFileSelect({ target: { files: [document] } } as any);

    expect(component.screenshotFile).toBe(screenshot);
    expect(component.documentFile).toBe(document);
  });
});
