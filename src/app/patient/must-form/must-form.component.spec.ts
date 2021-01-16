import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MustFormComponent } from './must-form.component';

describe('MustFormComponent', () => {
  let component: MustFormComponent;
  let fixture: ComponentFixture<MustFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MustFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MustFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
