import { Injectable } from '@angular/core';
import { Table } from 'dexie';
import { delay, from, map, Observable, take } from 'rxjs';
import { db } from '../db';
import { Autorizacao } from './autorizacao.model';

@Injectable({
  providedIn: 'root'
})
export class AutorizacaoService {

  table: Table<Autorizacao, number> = db.autorizacao;

  constructor() { }

  index(): Observable<Autorizacao[]> {
    return from(this.table.toArray()).pipe(delay(1), take(1));
  }

  show(id: number): Observable<Autorizacao> {
    return from(this.table.get(parseInt(`${id}`))).pipe(
      map(ent => ent ? <Autorizacao>ent : <Autorizacao>{}),
      take(1)
    );
  }

  private transformToSave(entity: Autorizacao): Autorizacao {
    entity.updatedAt = new Date();
    delete entity.professor;
    delete entity.processo;
    return entity;
  }

  store(entity: Autorizacao): Observable<number> {
    entity = this.transformToSave(entity);
    entity.createdAt = new Date();
    return from(this.table.add(entity)).pipe(take(1));
  }

  update(entity: Autorizacao): Observable<number> {
    entity = this.transformToSave(entity);
    return from(this.table.put(entity)).pipe(take(1));
  }

  destroy(id: number): Observable<void> {
    return from(this.table.delete(id)).pipe(take(1));
  }

}
