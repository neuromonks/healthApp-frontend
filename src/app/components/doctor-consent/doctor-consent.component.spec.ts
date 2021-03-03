import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorConsentComponent } from './doctor-consent.component';

describe('DoctorConsentComponent', () => {
  let component: DoctorConsentComponent;
  let fixture: ComponentFixture<DoctorConsentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorConsentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
