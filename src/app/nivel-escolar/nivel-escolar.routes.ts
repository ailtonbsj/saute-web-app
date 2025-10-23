import { Routes } from '@angular/router';
import { NivelEscolarDatatableComponent } from './nivel-escolar-datatable/nivel-escolar-datatable.component';
import { NivelEscolarFormComponent } from './nivel-escolar-form/nivel-escolar-form.component';

export const routes: Routes = [
  { path: '', component: NivelEscolarDatatableComponent },
  { path: 'create', component: NivelEscolarFormComponent },
  { path: ':id/edit', component: NivelEscolarFormComponent },
];
