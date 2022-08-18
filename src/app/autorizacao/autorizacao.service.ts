import { Injectable } from '@angular/core';
import { Table } from 'dexie';
import { delay, from, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { db } from '../db';
import { Processo } from '../processo/processo.model';
import { Professor } from '../professor/professor.model';
import { Autorizacao } from './autorizacao.model';

@Injectable({
  providedIn: 'root'
})
export class AutorizacaoService {

  table: Table<Autorizacao, number> = db.autorizacao;

  constructor() { }

  index(): Observable<Autorizacao[]> {
    /* With Observable */
    let autorizacoes: Autorizacao[];
    return from(this.table.toArray()).pipe(
      tap(arr => autorizacoes = arr),
      map(arr => arr.map(i => i.professorId)),
      switchMap(keys => from(db.professor.bulkGet(keys))),
      map(profs => autorizacoes.map(
        i => { i.professor = profs.find(v => v?.id === i.professorId); return i.processoId }
      )),
      switchMap(keys => from(db.processo.bulkGet(keys))),
      map(procs => autorizacoes.map(
        i => { i.processo = procs.find(v => v?.id === i.processoId); return i }
      )),
      delay(1), take(1)
    );
  }

  show(id: number): Observable<Autorizacao> {
    let autorizacao: Autorizacao;
    return from(this.table.get(parseInt(`${id}`))).pipe(
      map(ent => autorizacao = ent ? <Autorizacao>ent : <Autorizacao>{}),
      switchMap(ent => ent.professorId ? from(db.professor.get(ent.professorId)) : of(<Professor>{})),
      map(prof => { autorizacao.professor = prof; return autorizacao }),
      switchMap(ent => ent.processoId ? from(db.processo.get(ent.processoId)) : of(<Processo>{})),
      map(proc => { autorizacao.processo = proc; return autorizacao }),
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

  private async fillAutorizacaoWithProfessor(auth: Autorizacao) {
    auth.professor = await db.professor.get(auth.professorId);
    return auth;
  }

  getByProcess(id: number) {
    const promise = this.table.filter(auth => auth.processoId === id).toArray()
      .then(auths => auths.map(this.fillAutorizacaoWithProfessor))
      .then(auths => Promise.all(auths));
    return from(promise);
  }

}
