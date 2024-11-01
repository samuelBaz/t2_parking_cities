import { ParkingArea } from "@/modules/t2parkingcities/types/parkinAreaTypes"
import { InspectorEventCRUDTypes } from "./inspectorEventTypes"

export interface UserCRUDTypes {
  id: number
  email: string
  name: string
  password: string
  version: number
  inspector?: InspectorCRUDTypes
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

export interface InspectorCRUDTypes {
  id?: number
  permissions: Permission[]
  parkingAreas: ParkingArea[]
  inspectorEvents: InspectorEventCRUDTypes[]
  eventReviews: InspectorEventCRUDTypes[]
  version?: number
  cityId: number
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

export interface Permission {
  id: number
  name: TypePermission
}

export enum TypePermission{
  CONSULT = 'CONSULT',
  PENALIZE = 'PENALIZE'
}