export interface Area {
  id?: number
  name: string
  points: any
  parkingSpaces: number
  numbering: boolean
  typeNumbering: TypeNumbering
  spaces: Space[]
  cityId?: number
  createdAt?: Date
  version: number
}

export interface CreateEditAreaType {
  id?: number
  name: string
  points: any
  parkingSpaces: number
  numbering: boolean
  typeNumbering?: TypeNumbering | null
  cityId?: string
  version: number
}

export enum TypeNumbering {
  NUMERIC = 'NUMERIC',
  ALPHANUMERIC = 'ALPHANUMERIC'
}

export interface Point {
  id?: number
  name: string
  latitude: number
  longitude: number
  areaId?: number
}

export interface Space {
  id?: number
  name: string
  latitude: number
  longitude: number
  areaId: number
  hasSensor: boolean
  sensorId: string
  createdAt: Date
}