import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutorizacaoRoutingModule } from './autorizacao-routing.module';
import { AutorizacaoDatatableComponent } from './autorizacao-datatable/autorizacao-datatable.component';
import { AutorizacaoFormComponent } from './autorizacao-form/autorizacao-form.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AutorizacaoDatatableComponent,
    AutorizacaoFormComponent
  ],
  imports: [
    CommonModule,
    AutorizacaoRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class AutorizacaoModule { }
