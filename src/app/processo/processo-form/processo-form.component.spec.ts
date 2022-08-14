import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessoFormComponent } from './processo-form.component';

describe('ProcessoFormComponent', () => {
  let component: ProcessoFormComponent;
  let fixture: ComponentFixture<ProcessoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessoFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
