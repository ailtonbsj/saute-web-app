import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessoRoutingModule } from './processo-routing.module';
import { ProcessoDatatableComponent } from './processo-datatable/processo-datatable.component';
import { ProcessoFormComponent } from './processo-form/processo-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { ProcessoReportComponent } from './processo-report/processo-report.component';


@NgModule({
  declarations: [
    ProcessoDatatableComponent,
    ProcessoFormComponent,
    ProcessoReportComponent
  ],
  imports: [
    CommonModule,
    ProcessoRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class ProcessoModule { }
