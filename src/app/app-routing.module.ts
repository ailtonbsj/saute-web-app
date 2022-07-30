import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstituicaoComponent } from './instituicao/instituicao.component';
import { NivelEscolarDatatableComponent } from './nivel-escolar/nivel-escolar-datatable/nivel-escolar-datatable.component';

const routes: Routes = [
  { path: '', redirectTo: 'nivel-escolar', pathMatch: 'full' },
  { path: 'nivel-escolar', component: NivelEscolarDatatableComponent },
  { path: 'instituicao', component: InstituicaoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
