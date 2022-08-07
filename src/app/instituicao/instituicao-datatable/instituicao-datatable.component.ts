import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
    'valorCredenciamento', 'actions'];

  dataSource: MatTableDataSource<Instituicao> = new MatTableDataSource(<Instituicao[]>[]);

  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};
  @ViewChild(MatSort) sort: MatSort = <MatSort>{};

  constructor(private service: InstituicaoService) {
    this.loadDatatable();
  }

  loadDatatable() {
    this.service.index().subscribe({
      next: ent => {
        this.dataSource = new MatTableDataSource(ent);
        this.dataSource.sortingDataAccessor = HelperService.nestedSortingDataAccessor;
        if (this.sort.sortables) this.dataSource.sort = this.sort;
        if (this.paginator.page) this.dataSource.paginator = this.paginator;
        this.isLoadingData = false;
      }
    });
  }

  onUpdate(id: number) { }

  onDelete(id: number) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
