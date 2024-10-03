export interface UserCRUDTypes {
  id: number
  email: string
  name: string
  password: string
  version: number
  createdAt: Date
} 

export interface CreateEditUserType{
  id?: number
  email: string
  name: string
  password: string
  role: string
  dependency: string
  version?: number
}

export interface CreateEditInspectorType{
  id?: number
  user: CreateEditUserType
  parkingAreas: Array<CreateParkingAreas>
  permissions: Array<string>
  version: number
}

interface CreateParkingAreas {
  id: string
}