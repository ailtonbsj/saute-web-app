import { Injectable } from '@angular/core';
import { delay, from, map, Observable, of, switchMap, take } from 'rxjs';
import { db } from '../db';
import { Professor } from './professor.model';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {

  constructor() { }

  index(): Observable<Professor[]> {
    return from(db.professor.toArray()).pipe(delay(1), take(1));
  }

  show(id: number): Observable<Professor> {
    return from(db.professor.get(parseInt(`${id}`))).pipe(
      map(prof => prof ? <Professor>prof : <Professor>{}),
      take(1)
    );
  }

  private transformToSave(entity: Professor): Professor {
    entity.updatedAt = new Date();
    entity.endereco.uf = (<any>entity.endereco.uf).nome;
    entity.endereco.municipio = (<any>entity.endereco.municipio).nome;
    entity.naturalidade = (<any>entity.naturalidade).nome;
    return entity;
  }

  store(entity: Professor): Observable<number> {
    entity = this.transformToSave(entity);
    entity.createdAt = new Date();
    return from(db.professor.add(entity)).pipe(take(1));
  }

  update(entity: Professor): Observable<number> {
    entity = this.transformToSave(entity);
    return from(db.professor.put(entity)).pipe(take(1));
  }

  destroy(id: number): Observable<void> {
    const promise = db.autorizacao.toArray()
      .then(auts => auts.map(aut => aut.professorId))
      .then(arr => arr.includes(id))
    return from(promise).pipe(
      map(constraint => { if (constraint) throw new Error('Cannot remove.') }),
      switchMap(() => from(db.professor.delete(id))),
      take(1)
    );
  }

  filter(query: string): Observable<Professor[]> {
    const text = query.toLowerCase().replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, '');
    const queryPromise = db.professor.limit(5).filter(
      x => new RegExp(text).test(x.nome.toLowerCase())
    ).toArray();
    return from(queryPromise).pipe(delay(1), take(1));
  }
}
