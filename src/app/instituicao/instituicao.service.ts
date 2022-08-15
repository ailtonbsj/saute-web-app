import { Injectable } from '@angular/core';
import { delay, filter, from, map, Observable, of, reduce, switchMap, take, tap } from 'rxjs';
import { db } from '../db';
import { NivelEscolar } from '../nivel-escolar/nivel-escolar.model';
import { Instituicao } from './instituicao.model';

@Injectable({
  providedIn: 'root'
})
export class InstituicaoService {

  constructor() {
    db.open();
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
    /* With Async Await */
    return from(this.indexAsync()).pipe(delay(1), take(1));
  }

  show(id: number): Observable<Instituicao> {
    let instituicao: Instituicao;
    return from(db.instituicao.get(parseInt(`${id}`))).pipe(
      map(inst => instituicao = inst ? <Instituicao>inst : <Instituicao>{}),
      switchMap(inst => inst.nivelEscolarId ? from(db.nivelEscolar.get(inst.nivelEscolarId)) : of(<NivelEscolar>{})),
      map(nivel => { instituicao.nivelEscolar = nivel; return instituicao }),
      take(1)
    );
  }

  private transformToSave(entity: Instituicao): Instituicao {
    entity.updatedAt = new Date();
    delete entity.nivelEscolar;
    entity.endereco.uf = (<any>entity.endereco.uf).nome;
    entity.endereco.municipio = (<any>entity.endereco.municipio).nome;
    return entity;
  }

  store(entity: Instituicao): Observable<number> {
    entity = this.transformToSave(entity);
    entity.createdAt = new Date();
    return from(db.instituicao.add(entity)).pipe(take(1));
  }

  update(entity: Instituicao): Observable<number> {
    entity = this.transformToSave(entity);
    return from(db.instituicao.put(entity)).pipe(take(1));
  }

  destroy(id: number): Observable<void> {

    const promise = db.processo.toArray()
      .then(procs => procs.map(proc => proc.instituicaoId))
      .then(arr => arr.includes(id))
    return from(promise).pipe(
      map(constraint => { if (constraint) throw new Error('Cannot remove.') }),
      switchMap(() => from(db.instituicao.delete(id))),
      take(1)
    );

  }

  filter(query: string): Observable<Instituicao[]> {
    const text = query.toLowerCase().replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, '');
    // db.nivelEscolar.where('instituicao').startsWithIgnoreCase(text).limit(10).toArray();
    const queryPromise = db.instituicao.limit(5).filter(
      x => new RegExp(text).test(x.instituicao.toLowerCase())
    ).toArray();
    return from(queryPromise).pipe(delay(1), take(1));
  }

}
