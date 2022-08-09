import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfessorRoutingModule } from './professor-routing.module';
import { ProfessorDatatableComponent } from './professor-datatable/professor-datatable.component';
import { ProfessorFormComponent } from './professor-form/professor-form.component';


@NgModule({
  declarations: [
    ProfessorDatatableComponent,
    ProfessorFormComponent
  ],
  imports: [
    CommonModule,
    ProfessorRoutingModule
  ]
})
export class ProfessorModule { }
