export interface ConfigurationCRUDType {
  id: number,
  createdAt: Date,
  version: number,
  cityId: number,
  paymentMethods: Array<PaymentMethodCRUDType>,
  commission: Commission
  messagingChannels: any | null,
  fleets: boolean | null,
  distributors: boolean | null
}

export interface PaymentMethodCRUDType {
  id: number
  method: string
  stripeSecretKey?: string 
  stripePublicKey?: string
  stripeApiKey?: string
  paypalSecretKey?: string
  paypalClientId?: string
  cityConfigurationId: number
}

export interface CreatePaymentMethod {
  method: string
  stripeSecretKey?: string
  stripePublicKey?: string
  stripeApiKey?: string
  paypalSecretKey?: string
  paypalClientId?: string
  cityConfigurationId: string
}

export enum TypePaymentMethod {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL'
}

export interface UpdateConfigurationCRUDType {
  id: number
  cityId: number
  version: number
  fleets: boolean | null
  distributors: boolean | null
  commission: Commission
}

export interface Commission {
  id?: number
  name: TypeCommission
  value: number
  byMonth: boolean
  byTicket: boolean
  version: number
}

export enum TypeCommission {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED'
}


export interface UpdateCommission {
  id: number
  name: string
  value: number
  byMonth: boolean
  byTicket: boolean
  version: number
}