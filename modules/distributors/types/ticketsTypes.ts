export interface Ticket {
  id: number
  plate: string
  duration: number
  startDate: Date
  endDate: Date
  phone: string
  email: string
  idTicketGenerator: number
  amount: number
  status: TicketStatus
  companyId: number
  cityId: number
  version: number
}

export enum TicketStatus {
  OK, REVERSED, PENDING
}