import { Processo } from "../processo/processo.model"
import { Professor } from "../professor/professor.model"

export interface Autorizacao {
  id?: number
  numero: number // {"formal": "Número"}
  professor?: Professor
  professorId: number
  processo?: Processo
  processoId: number
  referendum: string
  createdAt: Date // {"formal": "Criado em"}
  updatedAt: Date // {"formal": "Atualizado em"}
}
