import { Instituicao } from "../instituicao/instituicao.model"

export interface Processo {
  id?: number
  numero: number // {"formal": "Número"}
  instituicao?: Instituicao
  instituicaoId: number //{"formal": "Instituição"}
  createdAt: Date // {"formal": "Criado em"}
  updatedAt: Date // {"formal": "Atualizado em"}
}
