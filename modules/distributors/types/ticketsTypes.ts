import { DistributorCRUDType } from "./distributorsTypes"

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
  companyName: string
  version: number
  createdAt: Date
}

export enum TicketStatus {
  OK="OK", 
  REVERSED="REVERSED", 
  PENDING="PENDING"
}

export interface CreateTicket{
  plate: string
  duration: string
  startDate: Date
  endDate: Date
  phone: string
  email: string
  // idTicketGenerator: number
  amount: string
  status: TicketStatus
  companyId: string
}