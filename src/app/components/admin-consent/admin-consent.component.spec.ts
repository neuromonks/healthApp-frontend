import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminConsentComponent } from './admin-consent.component';

describe('AdminConsentComponent', () => {
  let component: AdminConsentComponent;
  let fixture: ComponentFixture<AdminConsentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminConsentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
