export interface LoginType {
  email: string
  password: string
}

export interface PropiedadesType {
  icono?: string
  descripcion?: string
  orden: number
}

export type SubModuloType = {
  id: string
  label: string
  url: string
  nombre: string
  descripcion: string
  icono: string
  propiedades: PropiedadesType
  estado: string
  subModulo: SubModuloType[]
}

export type ModuloType = {
  id: string
  label: string
  descripcion: string
  url: string
  nombre: string
  icono: string
  propiedades: PropiedadesType
  estado: string
  subModulo: SubModuloType[]
}

export interface UsuarioType {
  access_token: string
  id: string
  email: string
  rol: string
}