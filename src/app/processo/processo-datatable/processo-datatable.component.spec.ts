import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessoDatatableComponent } from './processo-datatable.component';

describe('ProcessoDatatableComponent', () => {
  let component: ProcessoDatatableComponent;
  let fixture: ComponentFixture<ProcessoDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessoDatatableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessoDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
