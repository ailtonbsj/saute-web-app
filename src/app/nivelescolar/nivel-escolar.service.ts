import { Injectable } from '@angular/core';
import { delay, Observable, of, take } from 'rxjs';
import { db } from '../db';
import { NivelEscolar } from './nivel-escolar.model';

@Injectable({
  providedIn: 'root'
})
export class NivelEscolarService {

  private cache: NivelEscolar[] = [
    { id: 1, nivelEscolar: 'Hydrogen', createdAt: new Date('2022-07-29T09:37'), updatedAt: new Date('2022-07-29T09:45') },
    { id: 2, nivelEscolar: 'Helium', createdAt: new Date('2022-07-29T09:37'), updatedAt: new Date('2022-07-29T09:45') },
    { id: 3, nivelEscolar: 'Lithium', createdAt: new Date('2022-07-29T09:37'), updatedAt: new Date('2022-07-29T09:45') },
  ];

  constructor() {
    db.open();
  }

  index(): Observable<NivelEscolar[]> {
    return of(this.cache).pipe(
      delay(300),
      take(1)
    );
  }

  store(entity: NivelEscolar): Observable<NivelEscolar> {
    entity.id = Math.floor(1000 + Math.random() * 9000);
    entity.createdAt = new Date();
    entity.updatedAt = new Date();
    this.cache.push(entity);
    return of(entity).pipe(take(1));
  }

  // async storeIDB (entity: NivelEscolar) {
  //   let res;
  //   try {
  //     res = await db.nivelEscolar.add(entity);
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   console.log(res);
  //   return res;
  // }

  // store(entity: NivelEscolar): Observable<NivelEscolar> {
  //   entity.createdAt = new Date();
  //   entity.updatedAt = new Date();
  //   this.storeIDB(<NivelEscolar>{
  //     ...entity,
  //   });
  //   return of(entity).pipe(take(1));
  // }

  show(id: number): Observable<NivelEscolar> {
    return of(<NivelEscolar>this.cache.find(ent => ent.id == id)).pipe(take(1));
  }

  update(entity: NivelEscolar): Observable<NivelEscolar> {
    entity.updatedAt = new Date();
    if(entity.id) this.destroy(entity.id);
    else throw Error('Entity without id');
    this.cache.push(entity);
    return of(entity).pipe(take(1));
  }

  destroy(id: number): Observable<NivelEscolar> {
    let index = 0;
    let item: NivelEscolar = <NivelEscolar>this.cache.find((obj, i) => {
      if (obj.id === id) {
        index = i;
        return true;
      }
      return false;
    });
    this.cache.splice(index, 1);
    return of(item).pipe(take(1));
  }

}
