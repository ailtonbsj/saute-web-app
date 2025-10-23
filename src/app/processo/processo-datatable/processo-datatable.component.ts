import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { Processo } from '../processo.model';
import { ProcessoService } from '../processo.service';

@Component({
    selector: 'app-processo-datatable',
    templateUrl: './processo-datatable.component.html',
    styleUrls: ['./processo-datatable.component.css'],
    standalone: false
})
export class ProcessoDatatableComponent implements OnInit {

  isLoadingData = true;
  isEnabledFilter = false;
  displayedColumns: string[] = ['numero', 'instituicaoId', 'createdAt', 'updatedAt', 'actions'];

  dataSource: MatTableDataSource<Processo> = new MatTableDataSource(<Processo[]>[]);

  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};
  @ViewChild(MatSort) sort: MatSort = <MatSort>{};

  constructor(
    private service: ProcessoService,
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
    this.router.navigate([`processo/${id}/edit`]);
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

  onReport(id: number) {
    this.router.navigate([`processo/${id}/report`]);
  }

  refreshComponent() {
    this.router.navigateByUrl('nivelescolar', { skipLocationChange: true }).then(() => {
      this.router.navigate(['processo']);
    });
  }

  defaultError(e: any) {
    this.helper.alertSnack(
      e.status == 403 ? 'Sem permissão para esta operação' : 'Ocorreu um erro');
  }

}
