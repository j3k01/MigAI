import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignDetectionComponent } from './sign-detection.component';

describe('SignDetectionComponent', () => {
  let component: SignDetectionComponent;
  let fixture: ComponentFixture<SignDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignDetectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
