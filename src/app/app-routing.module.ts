import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstituicaoDatatableComponent } from './instituicao/instituicao-datatable/instituicao-datatable.component';
import { NivelEscolarDatatableComponent } from './nivelescolar/nivel-escolar-datatable/nivel-escolar-datatable.component';

const routes: Routes = [
  { path: '', redirectTo: 'nivelescolar', pathMatch: 'full' },
  { path: 'nivelescolar', component: NivelEscolarDatatableComponent },
  { path: 'instituicao', component: InstituicaoDatatableComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
