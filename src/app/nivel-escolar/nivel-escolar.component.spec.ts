import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelEscolarComponent } from './nivel-escolar.component';

describe('NivelEscolarComponent', () => {
  let component: NivelEscolarComponent;
  let fixture: ComponentFixture<NivelEscolarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NivelEscolarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NivelEscolarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
