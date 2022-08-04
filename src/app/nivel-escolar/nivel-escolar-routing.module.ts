import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NivelEscolarDatatableComponent } from './nivel-escolar-datatable/nivel-escolar-datatable.component';
import { NivelEscolarFormComponent } from './nivel-escolar-form/nivel-escolar-form.component';

const routes: Routes = [
  { path: '', component: NivelEscolarDatatableComponent },
  { path: 'create', component: NivelEscolarFormComponent },
  { path: ':id/edit', component: NivelEscolarFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NivelEscolarRoutingModule { }
