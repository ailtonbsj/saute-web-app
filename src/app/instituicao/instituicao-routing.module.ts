import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NivelEscolarFormComponent } from '../nivel-escolar/nivel-escolar-form/nivel-escolar-form.component';
import { InstituicaoDatatableComponent } from './instituicao-datatable/instituicao-datatable.component';
import { InstituicaoFormComponent } from './instituicao-form/instituicao-form.component';

const routes: Routes = [
  { path: '', component: InstituicaoDatatableComponent },
  { path: 'create', component: InstituicaoFormComponent },
  { path: ':id/edit', component: InstituicaoFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstituicaoRoutingModule { }
