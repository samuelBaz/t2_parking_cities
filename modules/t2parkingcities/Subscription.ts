import { Currency, Vehicle } from './Schedule'

export interface Subscription {
  id: number
  name: string
  currency: Currency
  subscriptionBlocks: SubscriptionBlock[]
  cityId: number
  createdAt: Date
}

export interface SubscriptionBlock {
  id: number
  name: string
  vehicle: Vehicle
  price: number
  subscriptionId: number
}