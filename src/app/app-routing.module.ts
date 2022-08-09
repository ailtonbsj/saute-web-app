import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstituicaoDatatableComponent } from './instituicao/instituicao-datatable/instituicao-datatable.component';

const routes: Routes = [
  { path: '', redirectTo: 'professor', pathMatch: 'full' },
  {
    path: 'instituicao',
    loadChildren: () => import('./instituicao/instituicao.module').then(m => m.InstituicaoModule)
  },
  {
    path: 'professor',
    loadChildren: () => import('./professor/professor.module').then(m => m.ProfessorModule),
  },
  {
    path: 'nivelescolar',
    loadChildren: () => import('./nivel-escolar/nivel-escolar.module').then(m => m.NivelEscolarModule),
  },
  { path: '**', redirectTo: 'instituicao' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
