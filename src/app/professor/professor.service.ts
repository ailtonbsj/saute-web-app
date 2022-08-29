import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, from, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { db } from '../db';
import { Professor } from './professor.model';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {

  api = localStorage.getItem('api') || 'local';
  apiEnabled = false;

  constructor(private http: HttpClient) {
    this.apiEnabled = this.api !== 'local';
    if (this.apiEnabled) this.api += '/professor';
  }

  index(): Observable<Professor[]> {
    if (this.apiEnabled) {
      return this.http.get<Professor[]>(`${this.api}`);
    } else {
      return from(db.professor.toArray()).pipe(delay(1), take(1));
    }
  }

  show(id: number): Observable<Professor> {
    if (this.apiEnabled) {
      return this.http.get<Professor>(`${this.api}/${id}`);
    } else {
      return from(db.professor.get(parseInt(`${id}`))).pipe(
        tap(v => console.log({ ...v?.endereco })),
        map(prof => prof ? <Professor>prof : <Professor>{}),
        take(1)
      );
    }
  }

  private transformToSave(entity: Professor): Professor {
    entity.endereco.uf = (<any>entity.endereco.uf).nome;
    entity.endereco.municipio = (<any>entity.endereco.municipio).nome;
    entity.naturalidade = (<any>entity.naturalidade).nome;
    return entity;
  }

  store(entity: Professor): Observable<number> {
    entity = this.transformToSave(entity);
    if (this.apiEnabled) {
      return this.http.post<number>(`${this.api}`, entity);
    } else {
      entity.createdAt = new Date();
      entity.updatedAt = new Date();
      return from(db.professor.add(entity)).pipe(take(1));
    }
  }

  update(entity: Professor): Observable<number> {
    entity = this.transformToSave(entity);
    if (this.apiEnabled) {
      return this.http.patch<number>(`${this.api}`, entity);
    } else {
      entity.updatedAt = new Date();
      return from(db.professor.put(entity)).pipe(take(1));
    }
  }

  destroy(id: number): Observable<void> {
    if (this.apiEnabled) {
      return this.http.delete<void>(`${this.api}/${id}`);
    } else {
      const promise = db.autorizacao.toArray()
        .then(auts => auts.map(aut => aut.professorId))
        .then(arr => arr.includes(id))
      return from(promise).pipe(
        map(constraint => { if (constraint) throw new Error('Cannot remove.') }),
        switchMap(() => from(db.professor.delete(id))),
        take(1)
      );
    }
  }

  filter(query: string): Observable<Professor[]> {
    if (this.apiEnabled) {
      return this.http.get<Professor[]>(`${this.api}?q=${query}`);
    } else {
      const text = query.toLowerCase().replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, '');
      const queryPromise = db.professor.limit(5).filter(
        x => new RegExp(text).test(x.nome.toLowerCase())
      ).toArray();
      return from(queryPromise).pipe(delay(1), take(1));
    }
  }
}
