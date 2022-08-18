import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessoReportComponent } from './processo-report.component';

describe('ProcessoReportComponent', () => {
  let component: ProcessoReportComponent;
  let fixture: ComponentFixture<ProcessoReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessoReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
