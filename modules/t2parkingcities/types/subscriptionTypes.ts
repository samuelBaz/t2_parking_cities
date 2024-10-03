export interface Subscription {
  id: number
  name: string
  currencyId: number
  currencyName: string
  subscriptionBlocks: SubscriptionBlock[]
  cityId: number
  createdAt: Date
  version: number
}

export interface SubscriptionBlock {
  id: number
  name: string
  vehicleId: number
  price: number
  subscriptionId: number
}

export interface CreateUpdateSubscriptionType {
  id?: number
  name: string
  currencyId: string
  subscriptionBlocks: CreateUpdateSubscriptionBlockType[]
  cityId: string
  version: number
}

export interface CreateUpdateSubscriptionBlockType {
  id?: number
  name: string
  vehicleId: string
  price: number
}