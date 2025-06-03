import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminserviceComponent } from './adminservice.component';

describe('AdminserviceComponent', () => {
  let component: AdminserviceComponent;
  let fixture: ComponentFixture<AdminserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminserviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
