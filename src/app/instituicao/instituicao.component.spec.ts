import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituicaoComponent } from './instituicao.component';

describe('InstituicaoComponent', () => {
  let component: InstituicaoComponent;
  let fixture: ComponentFixture<InstituicaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstituicaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstituicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
