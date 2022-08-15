import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogModel } from './confirm-dialog/confirm-dialog.component';

export enum FileReaderFormat { ARRAY_BUFFER, BINARY_STRING, DATA_URL, TEXT };

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

  /*
   * Helpers for Upload of Images
   */

  /*
   * Promisify FileReader and Image for Uploads
   */

  fileReader(file: File, format: FileReaderFormat = FileReaderFormat.DATA_URL) {
    return new Promise((res: (value: string) => void, rej) => {
      const reader = new FileReader();

      reader.onload = ev => {
        res(<string>ev.target?.result);
      }

      reader.onerror = ev => {
        rej(ev);
      }

      switch (format) {
        case FileReaderFormat.DATA_URL:
          reader.readAsDataURL(file);
          break;
        case FileReaderFormat.TEXT:
          reader.readAsText(file);
          break;
        case FileReaderFormat.BINARY_STRING:
          reader.readAsBinaryString(file);
          break;
        case FileReaderFormat.ARRAY_BUFFER:
          reader.readAsArrayBuffer(file);
          break;
      }
    });
  }

  image(blob: string) {
    return new Promise((res: (value: HTMLImageElement) => void, rej) => {
      const pic = new Image();

      pic.onload = ev => {
        res(pic);
      }

      pic.onerror = ev => {
        rej(ev);
      }

      pic.src = blob;
    });
  }

  resizePicute(img: HTMLImageElement, maxWidth: number) {
    const canvas = document.createElement('canvas');
    const maxHeight = maxWidth;
    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > maxWidth) {
        //height *= maxWidth / width;
        height = Math.round(height *= maxWidth / width);
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        //width *= maxHeight / height;
        width = Math.round(width *= maxHeight / height);
        height = maxHeight;
      }
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", 0.7); // get the data from canvas as 70% JPG (can be also PNG, etc.)
  }

  async fetchToBlob(url: string, type: string) {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    const file = new File([buf], url.split('/').pop() || url, { type });
    return this.fileReader(file);
  }

}
