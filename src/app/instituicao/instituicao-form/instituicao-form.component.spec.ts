import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituicaoFormComponent } from './instituicao-form.component';

describe('InstituicaoFormComponent', () => {
  let component: InstituicaoFormComponent;
  let fixture: ComponentFixture<InstituicaoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstituicaoFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstituicaoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
