import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfTaskDetails } from './self-task-details';

describe('SelfTaskDetails', () => {
  let component: SelfTaskDetails;
  let fixture: ComponentFixture<SelfTaskDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfTaskDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(SelfTaskDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
