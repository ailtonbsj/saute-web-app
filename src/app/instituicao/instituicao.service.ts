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

  index(): Observable<Instituicao[]> {
    /* Promises vs Observables */
    // let instituicoes: Instituicao[];
    // const promise = db.instituicao.toArray()
    //   .then(val => {
    //     instituicoes = val;
    //     return val.map(i => i.nivelEscolarId);
    //   })
    //   .then(keys => db.nivelEscolar.bulkGet(keys))
    //   .then(nivelEscolares => instituicoes.map(i => {
    //     i.nivelEscolar = nivelEscolares.find(v => v?.id === i.nivelEscolarId);
    //     return i
    //   }));
    // return from(promise).pipe(delay(1), take(1));

    let instituicoes: Instituicao[];
    let niveis: NivelEscolar[];
    return from(db.instituicao.toArray()).pipe(
      tap(arr => instituicoes = arr),
      map(arr => arr.map(i => i.nivelEscolarId)),
      switchMap(keys => from(db.nivelEscolar.bulkGet(keys))),
      tap(arr => niveis = <NivelEscolar[]>arr),
      switchMap(_ => from(instituicoes)),
      map(i => ({ ...i, nivelEscolar: niveis.find(v => v?.id === i.nivelEscolarId) })),
      reduce((acc: Instituicao[], one: Instituicao) => acc.concat([one]), []),
      take(1)
    );
  }

  store(entity: Instituicao): Observable<number> {
    entity.createdAt = new Date();
    entity.updatedAt = new Date();
    delete entity.nivelEscolar;
    entity.endereco.uf = (<any>entity.endereco.uf).nome;
    entity.endereco.municipio = (<any>entity.endereco.municipio).nome;
    return from(db.instituicao.add(entity)).pipe(take(1));
  }

}
