import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEmployee } from './all-employee';

describe('AllEmployee', () => {
  let component: AllEmployee;
  let fixture: ComponentFixture<AllEmployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllEmployee],
    }).compileComponents();

    fixture = TestBed.createComponent(AllEmployee);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
