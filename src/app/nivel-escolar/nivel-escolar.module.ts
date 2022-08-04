import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NivelEscolarRoutingModule } from './nivel-escolar-routing.module';
import { NivelEscolarDatatableComponent } from './nivel-escolar-datatable/nivel-escolar-datatable.component';
import { NivelEscolarFormComponent } from './nivel-escolar-form/nivel-escolar-form.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NivelEscolarService } from './nivel-escolar.service';


@NgModule({
  declarations: [
    NivelEscolarDatatableComponent, NivelEscolarFormComponent
  ],
  imports: [
    CommonModule,
    NivelEscolarRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [NivelEscolarService]
})
export class NivelEscolarModule { }
