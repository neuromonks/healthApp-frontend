import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Mnst20Component } from './mnst20.component';

describe('Mnst20Component', () => {
  let component: Mnst20Component;
  let fixture: ComponentFixture<Mnst20Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Mnst20Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Mnst20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
