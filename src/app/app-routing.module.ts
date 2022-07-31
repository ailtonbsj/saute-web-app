import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstituicaoDatatableComponent } from './instituicao/instituicao-datatable/instituicao-datatable.component';
import { NivelEscolarDatatableComponent } from './nivelescolar/nivel-escolar-datatable/nivel-escolar-datatable.component';
import { NivelEscolarFormComponent } from './nivelescolar/nivel-escolar-form/nivel-escolar-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'nivelescolar', pathMatch: 'full' },
  { path: 'nivelescolar', component: NivelEscolarDatatableComponent },
  { path: 'test', component: NivelEscolarFormComponent },
  { path: 'instituicao', component: InstituicaoDatatableComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
