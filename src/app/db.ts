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

  constructor() {
    super('saute-web');
    this.version(6).stores({
      nivelEscolar: '++id, nivelEscolar, createdAt, updatedAt',
      instituicao: ['++id', 'instituicao', 'nivelEscolarId', 'endereco', 'numero', 'bairro',
        'municipio', 'email', 'dependencia', 'entidade', 'credenciamento', 'valorCredenciamento',
        'recredenciamento', 'valorRecredenciamento', 'createdAt', 'updatedAt'].join(','),
      professor: '++id',
      processo: '++id, instituicao',
      autorizacao: '++id, professor, processo'
    });
  }
}

export const db = new AppDB();
