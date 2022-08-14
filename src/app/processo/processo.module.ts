import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessoRoutingModule } from './processo-routing.module';
import { ProcessoDatatableComponent } from './processo-datatable/processo-datatable.component';
import { ProcessoFormComponent } from './processo-form/processo-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';


@NgModule({
  declarations: [
    ProcessoDatatableComponent,
    ProcessoFormComponent
  ],
  imports: [
    CommonModule,
    ProcessoRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class ProcessoModule { }
