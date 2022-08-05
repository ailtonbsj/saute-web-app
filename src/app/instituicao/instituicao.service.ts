import { Injectable } from '@angular/core';
import { from, Observable, take } from 'rxjs';
import { db } from '../db';
import { Instituicao } from './instituicao.model';

@Injectable({
  providedIn: 'root'
})
export class InstituicaoService {

  constructor() {
    db.open();
  }

  store(entity: Instituicao): Observable<number> {
    entity.createdAt = new Date();
    entity.updatedAt = new Date();
    delete entity.nivelEscolar;
    return from(db.instituicao.add(entity)).pipe(take(1));
  }

}
