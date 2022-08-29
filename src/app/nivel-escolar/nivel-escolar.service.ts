import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, from, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { db } from '../db';
import { NivelEscolar } from '../nivel-escolar/nivel-escolar.model';

@Injectable({
  providedIn: 'root'
})
export class NivelEscolarService {

  api = localStorage.getItem('api') || 'local';
  apiEnabled = false;

  constructor(private http: HttpClient) {
    // db.open();
    this.apiEnabled = this.api !== 'local';
    if (this.apiEnabled) this.api += '/nivelescolar';
  }

  index(): Observable<NivelEscolar[]> {
    if (this.apiEnabled) {
      return this.http.get<NivelEscolar[]>(`${this.api}`);
    } else {
      return from(db.nivelEscolar.toArray()).pipe(
        delay(300),
        take(1)
      );
    }
  }

  store(entity: NivelEscolar): Observable<number> {
    if (this.apiEnabled) {
      return this.http.post<number>(`${this.api}`, entity);
    } else {
      entity.createdAt = new Date();
      entity.updatedAt = new Date();
      return from(db.nivelEscolar.add(entity)).pipe(take(1));
    }
  }

  show(id: number): Observable<NivelEscolar> {
    if (this.apiEnabled) {
      return this.http.get<NivelEscolar>(`${this.api}/${id}`);
    } else {
      return from(
        db.nivelEscolar.get(parseInt('' + id)).then(ent => {
          return ent ? ent : <NivelEscolar>{};
        })
      ).pipe(take(1));
    }
  }

  update(entity: NivelEscolar): Observable<number> {
    if (this.apiEnabled) {
      return this.http.patch<number>(`${this.api}`, entity);
    } else {
      entity.updatedAt = new Date();
      return from(db.nivelEscolar.put(entity)).pipe(take(1));
    }
  }

  destroy(id: number): Observable<void> {
    if (this.apiEnabled) {
      return this.http.delete<void>(`${this.api}/${id}`);
    } else {
      const promise = db.instituicao.toArray()
        .then(insts => insts.map(inst => inst.nivelEscolarId))
        .then(arr => arr.includes(id));
      return from(promise).pipe(
        map(constraint => { if (constraint) throw new Error('Cannot remove.') }),
        switchMap(() => from(db.nivelEscolar.delete(id))),
        take(1)
      );
    }
  }

  filter(query: string): Observable<NivelEscolar[]> {
    if (this.apiEnabled) {
      return this.http.get<NivelEscolar[]>(`${this.api}?q=${query}`);
    } else {
      const text = query.toLowerCase().replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, '');
      // db.nivelEscolar.where('nivelEscolar').startsWithIgnoreCase(text).limit(10).toArray();
      const queryPromise = db.nivelEscolar.limit(5).filter(
        x => new RegExp(text).test(x.nivelEscolar.toLowerCase())
      ).toArray();
      return from(queryPromise).pipe(delay(1), take(1));
    }
  }

}
