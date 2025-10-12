import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './security/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./security/security.module').then(m => m.SecurityModule)
  },
  {
    path: 'autorizacao',
    loadChildren: () => import('./autorizacao/autorizacao.module').then(m => m.AutorizacaoModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'processo',
    loadChildren: () => import('./processo/processo.module').then(m => m.ProcessoModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'instituicao',
    loadChildren: () => import('./instituicao/instituicao.module').then(m => m.InstituicaoModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'professor',
    loadChildren: () => import('./professor/professor.module').then(m => m.ProfessorModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'nivelescolar',
    loadChildren: () => import('./nivel-escolar/nivel-escolar.routes').then(r => r.routes),
    canActivate: [AuthGuard]
  },
  {
    path: 'configuracoes',
    loadChildren: () => import('./configuracoes/configuracoes.module').then(m => m.ConfiguracoesModule),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'processo' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
