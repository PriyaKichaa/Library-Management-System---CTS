import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllbooksComponent } from './allbooks.component';

describe('AllbooksComponent', () => {
  let component: AllbooksComponent;
  let fixture: ComponentFixture<AllbooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllbooksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllbooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
