export interface Professor {
  id?: number
  nome: string
  nascimento: Date
  naturalidade: string
  cpf: string
  rg: string
  orgaoEmissor: string
  endereco: {
    cep: string
    rua: string
    numero?: number
    bairro: string
    uf: string
    municipio: string
  }
  telefone?: string
  celular: string
  email: string
  pai?: string
  mae?: string
  habilitacao: string
  categoriaCNH?: string
  foto?: string
  createdAt: Date
  updatedAt: Date
}
