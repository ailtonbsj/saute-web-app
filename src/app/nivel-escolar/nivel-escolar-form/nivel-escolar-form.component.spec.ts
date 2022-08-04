import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelEscolarFormComponent } from './nivel-escolar-form.component';

describe('NivelEscolarFormComponent', () => {
  let component: NivelEscolarFormComponent;
  let fixture: ComponentFixture<NivelEscolarFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NivelEscolarFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NivelEscolarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
