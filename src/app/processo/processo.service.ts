import { Injectable } from '@angular/core';
import { Table } from 'dexie';
import { delay, from, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { db } from '../db';
import { Instituicao } from '../instituicao/instituicao.model';
import { Processo } from './processo.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessoService {

  table: Table<Processo, number> = db.processo;

  constructor() { }

  index(): Observable<Processo[]> {
    /* With Promise */
    let processos: Processo[];
    const promise = this.table.toArray()
      .then(arr => { processos = arr; return arr })
      .then(arr => arr.map(i => i.instituicaoId))
      .then(keys => db.instituicao.bulkGet(keys))
      .then(inst => processos.map(
        i => { i.instituicao = inst.find(v => v?.id === i.instituicaoId); return i }
      ))
    return from(promise).pipe(delay(1), take(1));
  }

  show(id: number): Observable<Processo> {
    let processo: Processo;
    return from(this.table.get(parseInt(`${id}`))).pipe(
      map(ent => processo = ent ? <Processo>ent : <Processo>{}),
      switchMap(ent => ent.instituicaoId ? from(db.instituicao.get(ent.instituicaoId)) : of(<Instituicao>{})),
      map(inst => { processo.instituicao = inst; return processo }),
      take(1)
    );
  }

  private transformToSave(entity: Processo): Processo {
    entity.updatedAt = new Date();
    delete entity.instituicao;
    return entity;
  }

  store(entity: Processo): Observable<number> {
    entity = this.transformToSave(entity);
    entity.createdAt = new Date();
    return from(this.table.add(entity)).pipe(take(1));
  }

  update(entity: Processo): Observable<number> {
    entity = this.transformToSave(entity);
    return from(this.table.put(entity)).pipe(take(1));
  }

  destroy(id: number): Observable<void> {
    return from(this.table.delete(id)).pipe(take(1));
  }

  filter(query: string): Observable<Processo[]> {
    const text = query.toLowerCase().replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, '');
    const queryPromise = this.table.limit(5).filter(
      x => new RegExp(text).test((''+x.numero).toLowerCase())
    ).toArray();
    return from(queryPromise).pipe(delay(1), take(1));
  }
}
