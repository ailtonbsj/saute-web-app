import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { Professor } from '../professor.model';
import { ProfessorService } from '../professor.service';

@Component({
  selector: 'app-professor-datatable',
  templateUrl: './professor-datatable.component.html',
  styleUrls: ['./professor-datatable.component.css']
})
export class ProfessorDatatableComponent implements OnInit {

  isLoadingData = true;
  isEnabledFilter = false;
  displayedColumns: string[] = ['id', 'nome', 'nascimento', 'naturalidade', 'cpf', 'rg', 'orgaoEmissor',
    'endereco.cep', 'endereco.rua', 'endereco.numero', 'endereco.bairro', 'endereco.uf', 'endereco.municipio',
    'telefone', 'celular', 'email', 'pai', 'mae', 'numeroCNH', 'categoriaCNH', 'foto', 'createdAt', 'updatedAt', 'actions'];

  dataSource: MatTableDataSource<Professor> = new MatTableDataSource(<Professor[]>[]);

  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};
  @ViewChild(MatSort) sort: MatSort = <MatSort>{};

  constructor(
    private service: ProfessorService,
    private router: Router,
    private helper: HelperService) {
    this.loadDatatable();
  }

  ngOnInit(): void {
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
    this.router.navigate([`professor/${id}/edit`]);
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
      }
    });
  }

  refreshComponent() {
    this.router.navigateByUrl('nivelescolar', { skipLocationChange: true }).then(() => {
      this.router.navigate(['professor']);
    });
  }

}
