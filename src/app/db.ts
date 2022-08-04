import Dexie, { Table } from "dexie";
import { NivelEscolar } from "./nivel-escolar/nivel-escolar.model";

export class AppDB extends Dexie {
  nivelEscolar!: Table<NivelEscolar, number>;

  constructor() {
    super('saute-web');
    this.version(1).stores({
      nivelEscolar: '++id, nivelEscolar, createdAt, updatedAt'
    });
  }
}

export const db = new AppDB();
