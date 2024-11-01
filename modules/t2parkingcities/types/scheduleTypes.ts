export interface Schedule {
  id: number
  name: string
  days: Days[]
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
  days: string[]
  vehicles: Vehicle[]
  startHour: string
  endHour: string
  currencyId: string | number
  minimumTime: number
  billingBlocks: BillingBlock[]
  cityId: number | string
  version: number
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

export enum Days {
  MONDAY = 'MONDAY',
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY"
}

