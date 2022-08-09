import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfessorDatatableComponent } from './professor-datatable/professor-datatable.component';
import { ProfessorFormComponent } from './professor-form/professor-form.component';

const routes: Routes = [
  { path: '', component: ProfessorFormComponent },
  { path: 'create', component: ProfessorFormComponent },
  { path: ':id/edit', component: ProfessorFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessorRoutingModule { }
