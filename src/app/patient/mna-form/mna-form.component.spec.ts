import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MnaFormComponent } from './mna-form.component';

describe('MnaFormComponent', () => {
  let component: MnaFormComponent;
  let fixture: ComponentFixture<MnaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MnaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MnaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
