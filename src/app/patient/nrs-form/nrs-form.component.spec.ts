import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NrsFormComponent } from './nrs-form.component';

describe('NrsFormComponent', () => {
  let component: NrsFormComponent;
  let fixture: ComponentFixture<NrsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NrsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NrsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
