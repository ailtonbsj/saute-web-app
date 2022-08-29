import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { Instituicao } from '../instituicao.model';
import { InstituicaoService } from '../instituicao.service';

@Component({
  selector: 'app-instituicao-datatable',
  templateUrl: './instituicao-datatable.component.html',
  styleUrls: ['./instituicao-datatable.component.css']
})
export class InstituicaoDatatableComponent {

  isLoadingData = true;
  isEnabledFilter = false;
  displayedColumns: string[] = ['instituicao', 'nivelEscolar.nivelEscolar', 'endereco.rua', 'endereco.numero',
    'endereco.bairro', 'endereco.uf', 'endereco.municipio', 'email', 'dependencia', 'entidade', 'credenciamento',
    'validadeCredenciamento', 'actions'];

  dataSource: MatTableDataSource<Instituicao> = new MatTableDataSource(<Instituicao[]>[]);

  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};
  @ViewChild(MatSort) sort: MatSort = <MatSort>{};

  constructor(private service: InstituicaoService, private helper: HelperService,
    private router: Router) {
    this.loadDatatable();
  }

  loadDatatable() {
    this.service.index().subscribe({
      next: ent => {
        this.dataSource = new MatTableDataSource(ent);
        this.dataSource.sortingDataAccessor = HelperService.nestedSortingDataAccessor;
        this.dataSource.filterPredicate = HelperService.nestedFilterPredicate;

        if (this.sort.sortables) this.dataSource.sort = this.sort;
        if (this.paginator.page) this.dataSource.paginator = this.paginator;
        this.isLoadingData = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onUpdate(id: number) {
    this.router.navigate([`instituicao/${id}/edit`]);
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
      error: e => {
        this.helper.alertSnack(e);
      }
    });
  }

  refreshComponent() {
    this.router.navigateByUrl('nivelescolar', { skipLocationChange: true }).then(() => {
      this.router.navigate(['instituicao']);
    });
  }

}
