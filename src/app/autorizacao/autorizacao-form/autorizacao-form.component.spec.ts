import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorizacaoFormComponent } from './autorizacao-form.component';

describe('AutorizacaoFormComponent', () => {
  let component: AutorizacaoFormComponent;
  let fixture: ComponentFixture<AutorizacaoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutorizacaoFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutorizacaoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
