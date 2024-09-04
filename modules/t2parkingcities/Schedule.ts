export interface Schedule {
  id: number
  name: string
  days: Day[]
  vehicles: Vehicle[]
  startHour: string
  endHour: string
  currency: Currency
  minimumTime: number
  billingBlocks: BillingBlock[]
  cityId: number
  createdAt: Date
}

export interface Day {
  id: number
  name: string
  number: number
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
}

