import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NivelEscolar } from './nivel-escolar.model';

const ELEMENT_DATA: NivelEscolar[] = [
  { id: 1, "Nível Escolar": 'Hydrogen', created_at: new Date('2022-07-29T09:37'), updated_at: new Date('2022-07-29T09:45') },
  { id: 2, "Nível Escolar": 'Helium', created_at: new Date('2022-07-29T09:37'), updated_at: new Date('2022-07-29T09:45') },
  { id: 3, "Nível Escolar": 'Lithium', created_at: new Date('2022-07-29T09:37'), updated_at: new Date('2022-07-29T09:45') },
  { id: 4, "Nível Escolar": 'Beryllium', created_at: new Date('2022-07-29T09:37'), updated_at: new Date('2022-07-29T09:45') },
  { id: 5, "Nível Escolar": 'Boron', created_at: new Date('2022-07-29T09:37'), updated_at: new Date('2022-07-29T09:45') },
];

@Component({
  selector: 'app-nivel-escolar',
  templateUrl: './nivel-escolar.component.html',
  styleUrls: ['./nivel-escolar.component.css']
})
export class NivelEscolarComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'Nível Escolar', 'created_at', 'updated_at', 'actions'];
  dataSource: MatTableDataSource<NivelEscolar>;

  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};
  @ViewChild(MatSort) sort: MatSort = <MatSort>{};

  constructor() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
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

}
