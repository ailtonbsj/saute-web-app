import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutorizacaoDatatableComponent } from './autorizacao-datatable/autorizacao-datatable.component';
import { AutorizacaoFormComponent } from './autorizacao-form/autorizacao-form.component';

const routes: Routes = [
  { path: '', component: AutorizacaoDatatableComponent },
  { path: 'create', component: AutorizacaoFormComponent },
  { path: ':id/edit', component: AutorizacaoFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutorizacaoRoutingModule { }
