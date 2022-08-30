import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, filter, from, map, Observable, of, reduce, switchMap, take, tap } from 'rxjs';
import { db } from '../db';
import { NivelEscolar } from '../nivel-escolar/nivel-escolar.model';
import { Instituicao } from './instituicao.model';

@Injectable({
  providedIn: 'root'
})
export class InstituicaoService {

  api = localStorage.getItem('api') || 'local';
  apiEnabled = false;

  constructor(private http: HttpClient) {
    //db.open();
    this.apiEnabled = this.api !== 'local';
    if (this.apiEnabled) this.api += '/instituicao';
  }

  private async indexAsync() {
    const instituicoes = await db.instituicao.toArray();
    const keys = instituicoes.map(i => i.nivelEscolarId);
    const niveis = await db.nivelEscolar.bulkGet(keys);
    return instituicoes.map(
      i => { i.nivelEscolar = niveis.find(v => v?.id === i.nivelEscolarId); return i }
    )
  }

  index(): Observable<Instituicao[]> {
    if (this.apiEnabled) {
      return this.http.get<Instituicao[]>(`${this.api}`);
    } else {
      /* With Async Await */
      return from(this.indexAsync()).pipe(delay(1), take(1));
    }
  }

  show(id: number): Observable<Instituicao> {
    if (this.apiEnabled) {
      return this.http.get<Instituicao>(`${this.api}/${id}`);
    } else {
      let instituicao: Instituicao;
      return from(db.instituicao.get(parseInt(`${id}`))).pipe(
        map(inst => instituicao = inst ? <Instituicao>inst : <Instituicao>{}),
        switchMap(inst => inst.nivelEscolarId ? from(db.nivelEscolar.get(inst.nivelEscolarId)) : of(<NivelEscolar>{})),
        map(nivel => { instituicao.nivelEscolar = nivel; return instituicao }),
        take(1)
      );
    }
  }

  private transformToSave(entity: Instituicao): Instituicao {
    entity.endereco.uf = (<any>entity.endereco.uf).nome;
    entity.endereco.municipio = (<any>entity.endereco.municipio).nome;
    return entity;
  }

  store(entity: Instituicao): Observable<number> {
    entity = this.transformToSave(entity);
    if (this.apiEnabled) {
      return this.http.post<number>(`${this.api}`, entity);
    } else {
      delete entity.nivelEscolar;
      entity.updatedAt = new Date();
      entity.createdAt = new Date();
      return from(db.instituicao.add(entity)).pipe(take(1));
    }
  }

  update(entity: Instituicao): Observable<number> {
    entity = this.transformToSave(entity);
    if (this.apiEnabled) {
      return this.http.patch<number>(`${this.api}`, entity);
    } else {
      delete entity.nivelEscolar;
      entity.updatedAt = new Date();
      return from(db.instituicao.put(entity)).pipe(take(1));
    }
  }

  destroy(id: number): Observable<void> {
    if (this.apiEnabled) {
      return this.http.delete<void>(`${this.api}/${id}`);
    } else {
      const promise = db.processo.toArray()
        .then(procs => procs.map(proc => proc.instituicaoId))
        .then(arr => arr.includes(id))
      return from(promise).pipe(
        map(constraint => { if (constraint) throw new Error('Cannot remove.') }),
        switchMap(() => from(db.instituicao.delete(id))),
        take(1)
      );
    }
  }

  filter(query: string): Observable<Instituicao[]> {
    if (this.apiEnabled) {
      return this.http.get<Instituicao[]>(`${this.api}?q=${query}`);
    } else {
      const text = query.toLowerCase().replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, '');
      // db.nivelEscolar.where('instituicao').startsWithIgnoreCase(text).limit(10).toArray();
      const queryPromise = db.instituicao.limit(5).filter(
        x => new RegExp(text).test(x.instituicao.toLowerCase())
      ).toArray();
      return from(queryPromise).pipe(delay(1), take(1));
    }
  }

}
