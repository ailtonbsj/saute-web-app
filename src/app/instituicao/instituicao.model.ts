import { NivelEscolar } from "../nivel-escolar/nivel-escolar.model";

export interface Instituicao {
  id?: number
  instituicao: string
  nivelEscolar?: NivelEscolar
  nivelEscolarId: number
  endereco: {
    rua: string
    numero?: number
    bairro: string
    municipio: string
    uf: string
    cep: number
  }
  email: string
  dependencia: string
  entidade: string
  credenciamento: string
  valorCredenciamento: number
  recredenciamento: string
  valorRecredenciamento: number
  createdAt: Date
  updatedAt: Date
}

