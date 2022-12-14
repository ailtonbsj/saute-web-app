import { HttpClient } from '@angular/common/http';
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

  api = localStorage.getItem('api') || 'local';
  apiEnabled = false;

  constructor(private http: HttpClient) {
    this.apiEnabled = this.api !== 'local';
    if (this.apiEnabled) this.api += '/processo';
  }

  index(): Observable<Processo[]> {
    if (this.apiEnabled) {
      return this.http.get<Processo[]>(`${this.api}`);
    } else {
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
  }

  show(id: number): Observable<Processo> {
    if (this.apiEnabled) {
      return this.http.get<Processo>(`${this.api}/${id}`);
    } else {
      let processo: Processo;
      let instituicao: Instituicao;
      return from(this.table.get(parseInt(`${id}`))).pipe(
        map(ent => processo = ent ? <Processo>ent : <Processo>{}),
        switchMap(ent => ent.instituicaoId ? from(db.instituicao.get(ent.instituicaoId)) : of(<Instituicao>{})),
        switchMap(inst => { instituicao = <Instituicao>inst; return from(db.nivelEscolar.get(inst?.nivelEscolarId || 0)) }),
        map(nivel => { instituicao.nivelEscolar = nivel; return instituicao }),
        map(inst => { processo.instituicao = inst; return processo }),
        take(1)
      );
    }
  }

  private transformToSave(entity: Processo): Processo {
    entity.updatedAt = new Date();
    delete entity.instituicao;
    return entity;
  }

  store(entity: Processo): Observable<number> {
    if (this.apiEnabled) {
      return this.http.post<number>(`${this.api}`, entity);
    } else {
      entity = this.transformToSave(entity);
      entity.createdAt = new Date();
      return from(this.table.add(entity)).pipe(take(1));
    }
  }

  update(entity: Processo): Observable<number> {
    if (this.api) {
      return this.http.patch<number>(`${this.api}`, entity);
    } else {
      entity = this.transformToSave(entity);
      return from(this.table.put(entity)).pipe(take(1));
    }
  }

  destroy(id: number): Observable<void> {
    if (this.api) {
      return this.http.delete<void>(`${this.api}/${id}`);
    } else {
      const promise = db.autorizacao.toArray()
        .then(auts => auts.map(aut => aut.processoId))
        .then(arr => arr.includes(id))
      return from(promise).pipe(
        map(constraint => { if (constraint) throw new Error('Cannot remove.') }),
        switchMap(() => from(this.table.delete(id))),
        take(1)
      );
    }
  }

  filter(query: string): Observable<Processo[]> {    
    if (this.apiEnabled) {
      return this.http.get<Processo[]>(`${this.api}?q=${query}`);
    } else {
      const text = query.toLowerCase().replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, '');
      const queryPromise = this.table.limit(5).filter(
        x => new RegExp(text).test(('' + x.numero).toLowerCase())
      ).toArray();
      return from(queryPromise).pipe(delay(1), take(1));
    }
  }
}
