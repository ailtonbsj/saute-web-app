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

    /* With Promise */
    // let instituicoes: Instituicao[];
    // const promise = db.instituicao.toArray()
    //   .then(arr => { instituicoes = arr; return arr })
    //   .then(arr => arr.map(i => i.nivelEscolarId))
    //   .then(keys => db.nivelEscolar.bulkGet(keys))
    //   .then(niveis => instituicoes.map(
    //     i => { i.nivelEscolar = niveis.find(v => v?.id === i.nivelEscolarId); return i }
    //   ))
    // return from(promise).pipe(delay(1), take(1));

    /* With Observable */
    // let instituicoes: Instituicao[];
    // return from(db.instituicao.toArray()).pipe(
    //   tap(arr => instituicoes = arr),
    //   map(arr => arr.map(i => i.nivelEscolarId)),
    //   switchMap(keys => from(db.nivelEscolar.bulkGet(keys))),
    //   map(niveis => instituicoes.map(
    //     i => { i.nivelEscolar = niveis.find(v => v?.id === i.nivelEscolarId); return i }
    //   )),
    //   delay(1), take(1)
    // );
  }

  store(entity: Instituicao): Observable<number> {
    entity.createdAt = new Date();
    entity.updatedAt = new Date();
    delete entity.nivelEscolar;
    entity.endereco.uf = (<any>entity.endereco.uf).nome;
    entity.endereco.municipio = (<any>entity.endereco.municipio).nome;
    return from(db.instituicao.add(entity)).pipe(take(1));
  }

  destroy(id: number): Observable<void> {
    return from(db.instituicao.delete(id)).pipe(take(1));
  }

}
