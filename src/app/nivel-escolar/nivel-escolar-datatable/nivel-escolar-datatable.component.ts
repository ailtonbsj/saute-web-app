import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, of, switchMap } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { NivelEscolar } from '../nivel-escolar.model';
import { NivelEscolarService } from '../nivel-escolar.service';

@Component({
  selector: 'app-nivel-escolar-datatable',
  templateUrl: './nivel-escolar-datatable.component.html',
  styleUrls: ['./nivel-escolar-datatable.component.css']
})
export class NivelEscolarDatatableComponent implements AfterViewInit {

  isLoadingData = true;
  isEnabledFilter = false;
  displayedColumns: string[] = ['id', 'nivelEscolar', 'createdAt', 'updatedAt', 'actions'];
  dataSource: MatTableDataSource<NivelEscolar> = new MatTableDataSource(<NivelEscolar[]>[]);

  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};
  @ViewChild(MatSort) sort: MatSort = <MatSort>{};

  constructor(private service: NivelEscolarService, private router: Router,
    private helper: HelperService) {
    this.loadDatatable();
  }

  loadDatatable() {
    this.service.index().subscribe({
      next: ent => {
        this.dataSource = new MatTableDataSource(ent);
        if (this.sort.sortables) this.dataSource.sort = this.sort;
        if (this.paginator.page) this.dataSource.paginator = this.paginator;
        this.isLoadingData = false;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onDelete(id: number) {
    this.helper.confirmDialog().pipe(
      filter(res => res),
      switchMap(res => {
        return this.service.destroy(id)
      })
    ).subscribe({
      next: _ => {
        this.helper.alertSnack('Removido com sucesso!');
        this.refreshComponent();
      },
      error: e => this.defaultError(e)
    });
  }

  onUpdate(id: number) {
    this.router.navigate([`nivelescolar/${id}/edit`]);
  }

  refreshComponent() {
    this.router.navigateByUrl('instituicao', { skipLocationChange: true }).then(() => {
      this.router.navigate(['nivelescolar']);
    });
  }

  defaultError(e: any) {
    this.helper.alertSnack(
      e.status == 403 ? 'Sem permissão para esta operação' : 'Ocorreu um erro');
  }

}
