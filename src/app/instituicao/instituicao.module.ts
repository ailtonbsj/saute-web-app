import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstituicaoRoutingModule } from './instituicao-routing.module';
import { InstituicaoFormComponent } from './instituicao-form/instituicao-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { InstituicaoDatatableComponent } from './instituicao-datatable/instituicao-datatable.component';


@NgModule({
  declarations: [
    InstituicaoFormComponent, InstituicaoDatatableComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    InstituicaoRoutingModule
  ]
})
export class InstituicaoModule { }
