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
      const configuracoes = await db.configuracao.toArray();
      return JSON.stringify({ nivelEscolares, professores, instituiccoes, processos, autorizacoes, configuracoes });
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

  restore(data: any): Observable<any> {
    db.nivelEscolar.bulkAdd(data.nivelEscolares);
    db.professor.bulkAdd(data.professores);
    db.instituicao.bulkAdd(data.instituiccoes);
    db.processo.bulkAdd(data.processos);
    db.autorizacao.bulkAdd(data.autorizacoes);
    db.configuracao.bulkAdd(data.configuracoes);
    return of({status: 'success'}).pipe(take(1));
  }

  private async saveDataReportAsync(data: any) {
    const count = await db.configuracao.count();
    if(count === 0) {
      db.configuracao.add({id: 0, ...data });
    } else {
      db.configuracao.put({id: 0, ...data });
    }
    return 'success';
  }

  saveDataReport(data: any) {
    const promise = this.saveDataReportAsync(data);
    return from(promise).pipe(take(1));
  }

  getDataReport(): Observable<any> {
    return from(db.configuracao.get(0)).pipe(take(1));
  }
}
