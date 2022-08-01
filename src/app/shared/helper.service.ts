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
    // dialogRef.afterClosed().subscribe(dialogResult => {
    //   this.result = dialogResult;
    // });
  }

}
