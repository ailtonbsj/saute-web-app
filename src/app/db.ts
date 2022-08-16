import Dexie, { Table } from "dexie";
import { Autorizacao } from "./autorizacao/autorizacao.model";
import { Instituicao } from "./instituicao/instituicao.model";
import { NivelEscolar } from "./nivel-escolar/nivel-escolar.model";
import { Processo } from "./processo/processo.model";
import { Professor } from "./professor/professor.model";

export class AppDB extends Dexie {
  nivelEscolar!: Table<NivelEscolar, number>;
  instituicao!: Table<Instituicao, number>;
  professor!: Table<Professor, number>;
  processo!: Table<Processo, number>;
  autorizacao!: Table<Autorizacao, number>;
  configuracao!: Table<any, number>;

  constructor() {
    super('saute-web');
    this.version(1).stores({
      nivelEscolar: '++id',
      instituicao: ['++id', 'nivelEscolarId'].join(','),
      professor: '++id',
      processo: '++id, instituicaoId',
      autorizacao: '++id, professorId, processoId',
      configuracao: 'id'
    });
  }
}

export const db = new AppDB();
