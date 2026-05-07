import { Routes } from '@angular/router';
import { ProfessorDatatableComponent } from './professor-datatable/professor-datatable.component';
import { ProfessorFormComponent } from './professor-form/professor-form.component';

export const routes: Routes = [
  { path: '', component: ProfessorDatatableComponent },
  { path: 'create', component: ProfessorFormComponent },
  { path: ':id/edit', component: ProfessorFormComponent },
];
