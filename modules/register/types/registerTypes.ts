export interface RegisterType {
  email: string
  password: string
  name: string
  phone: string
  countryId: string
}

export interface Country{
  id: number
  name: string
  createdAt: Date
}

export enum TypeMessagingChannel {
  WHATSAPP = 'WHATSAPP',
  SMS = 'SMS'
}