import { NivelEscolar } from "../nivelescolar/nivel-escolar.model";

export interface Instituicao {
  "Instituiçao": string;
  "Nível": NivelEscolar;
  Endereço: string;
  "Nº": number;
  Bairro: string;
  "Município": string;
  Email: string;
  "Dependência": string;
  Entidade: string;
  Credenciamento: string;
  "Valor Credenciamento": number;
  Recredenciamento: string;
  "Valor Recredenciamento": number;
}

