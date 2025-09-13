import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfessorRoutingModule } from './professor-routing.module';
import { ProfessorDatatableComponent } from './professor-datatable/professor-datatable.component';
import { ProfessorFormComponent } from './professor-form/professor-form.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  declarations: [
    ProfessorDatatableComponent,
    ProfessorFormComponent
  ],
  imports: [
    CommonModule,
    ProfessorRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxMaskModule.forChild()
  ]
})
export class ProfessorModule { }
