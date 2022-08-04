import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstituicaoDatatableComponent } from './instituicao/instituicao-datatable/instituicao-datatable.component';

const routes: Routes = [
  { path: '', redirectTo: 'instituicao', pathMatch: 'full' },
  {
    path: 'nivelescolar',
    loadChildren: () => import('./nivel-escolar/nivel-escolar.module').then(m => m.NivelEscolarModule),
  },
  { path: 'instituicao', component: InstituicaoDatatableComponent },
  { path: '**', redirectTo: 'instituicao' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
