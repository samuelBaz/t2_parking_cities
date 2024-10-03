export interface DistributorCRUDType {
    id: number
    name: string
    realName: string
    description: string
    email: string
    address: string
    taxId: string
    commission: CreateEditCommissionType
    payoutCommissions?: Array<any>
    tickets?: Array<any>
    version: number
    createdAt: Date
    cityId: string
}

export interface CreateEditDistributorType {
    id?: number
    name: string
    realName: string
    description: string
    email: string
    address: string
    taxId: string
    commission: CreateEditCommissionType
    payoutCommissions?: Array<any>
    tickets?: Array<any>
    version: number
    cityId: string
}

interface CreateEditCommissionType {
  id?: number
  name: string
  value: number
  byTicket: boolean
  byMonth: boolean
}