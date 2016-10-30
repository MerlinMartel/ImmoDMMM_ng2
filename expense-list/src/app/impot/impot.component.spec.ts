/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ImpotComponent } from './impot.component';

describe('ImpotComponent', () => {
  let component: ImpotComponent;
  let fixture: ComponentFixture<ImpotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
