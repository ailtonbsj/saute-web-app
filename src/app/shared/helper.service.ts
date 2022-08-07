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

  /* Helpers for <mat-autocomplete> (Use in [DisplayWith]) */
  static displayAuto(property: string) {
    return (data: any) => data && data[property] ? data[property] : '';
  }

  /* Helpers for MatTableDataSource (Use in sortingDataAccessor property) */
  static nestedSortingDataAccessor(i: any, p: any) {
    return p.split('.').reduce((o: any, p: any) => o && o[p], i);
  }

}
