import { Routes } from '@angular/router';
import { ProcessoDatatableComponent } from './processo-datatable/processo-datatable.component';
import { ProcessoFormComponent } from './processo-form/processo-form.component';
import { ProcessoReportComponent } from './processo-report/processo-report.component';

export const routes: Routes = [
  { path: '', component: ProcessoDatatableComponent },
  { path: 'create', component: ProcessoFormComponent },
  { path: ':id/edit', component: ProcessoFormComponent },
  { path: ':id/report', component: ProcessoReportComponent },
];
