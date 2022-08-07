import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogModel } from './confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  result: string = '';

  constructor(private snack: MatSnackBar, public dialog: MatDialog) { }

  alertSnack(message: string) {
    this.snack.open(message, 'X', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3500
    });
  }

  confirmDialog(): Observable<boolean> {
    const dialogData = new ConfirmDialogModel('', 'Você tem certeza disso?');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '800px',
      data: dialogData
    });
    return dialogRef.afterClosed()
  }

  /*
   * Helpers for <mat-autocomplete>
   */

  /*
   * USAGE:
   * [DisplayWith]="nestedSortingDataAccessor('')"
   */
  static displayAuto(property: string) {
    return (data: any) => data && data[property] ? data[property] : '';
  }

  /*
   * Helpers for MatTableDataSource
   */

  /*
   * USAGE:
   * this.ds = new MatTableDataSource(ent);
   * this.ds.sortingDataAccessor = HelperService.nestedSortingDataAccessor;
   * this.ds.filterPredicate = HelperService.nestedFilterPredicate;
   */
  static nestedSortingDataAccessor(i: any, p: any) {
    return p.split('.').reduce((o: any, p: any) => o && o[p], i);
  }

  static nestedFilterCheck(search: any, data: any, key: any) {
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.nestedFilterCheck(search, data[key], k);
        }
      }
    } else {
      search += data[key];
    }
    return search;
  }

  static nestedFilterPredicate(data: any, filter: string) {
    const accumulator = (curr: any, key: any) => {
      return HelperService.nestedFilterCheck(curr, data, key);
    };
    const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
    const transformedFilter = filter.trim().toLowerCase();
    return dataStr.indexOf(transformedFilter) !== -1;
  };

}
