export interface Schedule {
  id: number
  name: string
  days: Day[]
  vehicles: Vehicle[]
  startHour: string
  endHour: string
  currencyId: number
  minimumTime: number
  billingBlocks: BillingBlock[]
  cityId: number
  createdAt: Date
  version: number
}

export interface CreateUpdateScheduleType {
  id: number
  name: string
  days: CreateUpdateDayType[]
  vehicles: Vehicle[]
  startHour: string
  endHour: string
  currencyId: string | number
  minimumTime: number
  billingBlocks: BillingBlock[]
  cityId: number | string
  version: number
}

export interface Day {
  id: number
  name: string
  number: number
}

export interface CreateUpdateDayType {
  id: number | string
  name: string
}

export interface Vehicle {
  id: number
  name: string
  description: string
  byDefault: boolean
  cityId: number
  createdAt: Date
  version: number
}

export interface Currency {
  id: number
  name: string
}

export interface BillingBlock {
  id?: number
  minutes: number
  price: number
  scheduleId: number
  version: number
}

