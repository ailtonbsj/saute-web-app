import { Routes } from '@angular/router';
import { AutorizacaoDatatableComponent } from './autorizacao-datatable/autorizacao-datatable.component';
import { AutorizacaoFormComponent } from './autorizacao-form/autorizacao-form.component';

export const routes: Routes = [
  { path: '', component: AutorizacaoDatatableComponent },
  { path: 'create', component: AutorizacaoFormComponent },
  { path: ':id/edit', component: AutorizacaoFormComponent },
];
