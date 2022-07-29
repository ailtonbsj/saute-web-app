import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstituicaoComponent } from './instituicao/instituicao.component';
import { NivelEscolarComponent } from './nivel-escolar/nivel-escolar.component';

const routes: Routes = [
  { path: '', redirectTo: 'nivel-escolar', pathMatch: 'full' },
  { path: 'nivel-escolar', component: NivelEscolarComponent },
  { path: 'instituicao', component: InstituicaoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
