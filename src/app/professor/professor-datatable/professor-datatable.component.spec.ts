import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorDatatableComponent } from './professor-datatable.component';

describe('ProfessorDatatableComponent', () => {
  let component: ProfessorDatatableComponent;
  let fixture: ComponentFixture<ProfessorDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessorDatatableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessorDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
