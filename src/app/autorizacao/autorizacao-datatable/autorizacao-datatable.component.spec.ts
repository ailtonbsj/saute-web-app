import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorizacaoDatatableComponent } from './autorizacao-datatable.component';

describe('AutorizacaoDatatableComponent', () => {
  let component: AutorizacaoDatatableComponent;
  let fixture: ComponentFixture<AutorizacaoDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutorizacaoDatatableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutorizacaoDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
