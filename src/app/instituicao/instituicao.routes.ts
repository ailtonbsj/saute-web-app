import { Routes } from '@angular/router';
import { InstituicaoDatatableComponent } from './instituicao-datatable/instituicao-datatable.component';
import { InstituicaoFormComponent } from './instituicao-form/instituicao-form.component';

export const routes: Routes = [
  { path: '', component: InstituicaoDatatableComponent },
  { path: 'create', component: InstituicaoFormComponent },
  { path: ':id/edit', component: InstituicaoFormComponent },
];
