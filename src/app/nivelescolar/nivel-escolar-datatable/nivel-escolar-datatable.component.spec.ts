import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelEscolarDatatableComponent } from './nivel-escolar-datatable.component';

describe('NivelEscolarDatatableComponent', () => {
  let component: NivelEscolarDatatableComponent;
  let fixture: ComponentFixture<NivelEscolarDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NivelEscolarDatatableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NivelEscolarDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
