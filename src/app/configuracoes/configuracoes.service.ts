import { Injectable } from '@angular/core';
import { from, Observable, of, take } from 'rxjs';
import { db } from '../db';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracoesService {

  constructor() { }

  backup(): Observable<any> {
    async function backup() {
      const nivelEscolares = await db.nivelEscolar.toArray();
      const professores = await db.professor.toArray();
      const instituiccoes = await db.instituicao.toArray();
      const processos = await db.processo.toArray();
      const autorizacoes = await db.autorizacao.toArray();
      return JSON.stringify({ nivelEscolares, professores, instituiccoes, processos, autorizacoes });
    }
    return from(backup()).pipe(take(1));
  }

  clear() {
    const clear = async () => {
      const dbs = await window.indexedDB.databases();
      dbs.forEach((db: any) => { window.indexedDB.deleteDatabase(db.name) });
    }
    return from(clear()).pipe(take(1));
  }

  restore(data: string): Observable<any> {
    console.log(data);
    return of(data).pipe(take(1));
  }
}
