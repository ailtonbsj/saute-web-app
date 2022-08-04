import { Injectable } from '@angular/core';
import { delay, from, Observable, of, take } from 'rxjs';
import { db } from '../db';
import { NivelEscolar } from '../nivel-escolar/nivel-escolar.model';

@Injectable({
  providedIn: 'root'
})
export class NivelEscolarService {

  constructor() {
    db.open();
  }

  // index(): Observable<NivelEscolar[]> {
  //   return of(this.cache).pipe(
  //     delay(300),
  //     take(1)
  //   );
  // }

  index(): Observable<NivelEscolar[]> {
    return from(db.nivelEscolar.toArray()).pipe(
      delay(300),
      take(1)
    );
  }

  // store(entity: NivelEscolar): Observable<NivelEscolar> {
  //   entity.id = Math.floor(1000 + Math.random() * 9000);
  //   entity.createdAt = new Date();
  //   entity.updatedAt = new Date();
  //   this.cache.push(entity);
  //   return of(entity).pipe(take(1));
  // }

  store(entity: NivelEscolar): Observable<number> {
    entity.createdAt = new Date();
    entity.updatedAt = new Date();
    return from(db.nivelEscolar.add(entity)).pipe(take(1));
  }

  // show(id: number): Observable<NivelEscolar> {
  //   return of(<NivelEscolar>this.cache.find(ent => ent.id == id)).pipe(take(1));
  // }

  show(id: number): Observable<NivelEscolar> {
    return from(
      db.nivelEscolar.get(parseInt('' + id)).then(ent => {
        return ent ? ent: <NivelEscolar>{};
      })
    ).pipe(take(1));
  }

  // update(entity: NivelEscolar): Observable<NivelEscolar> {
  //   entity.updatedAt = new Date();
  //   if (entity.id) this.destroy(entity.id);
  //   else throw Error('Entity without id');
  //   this.cache.push(entity);
  //   return of(entity).pipe(take(1));
  // }

  update(entity: NivelEscolar): Observable<number> {
    entity.updatedAt = new Date();
    return from(db.nivelEscolar.put(entity)).pipe(take(1));
  }

  // destroy(id: number): Observable<NivelEscolar> {
  //   let index = 0;
  //   let item: NivelEscolar = <NivelEscolar>this.cache.find((obj, i) => {
  //     if (obj.id === id) {
  //       index = i;
  //       return true;
  //     }
  //     return false;
  //   });
  //   this.cache.splice(index, 1);
  //   return of(item).pipe(take(1));
  // }

  destroy(id: number): Observable<void> {
    return from(db.nivelEscolar.delete(id)).pipe(take(1));
  }

}
