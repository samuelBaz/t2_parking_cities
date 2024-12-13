export interface InspectorEventCRUDTypes {
  id: string
  description: string
  typeEvent: TypeEvent
  image: any
  plate: string
  inspectorId: number
  eventReview: EventReview
  createdAt: Date
  version: number
}

export interface CreateEditInspectorEvent {
  id?: string
  description: string
  typeEvent: TypeEvent
  plate: string
  inspectorId: string
  version: number
}

export enum TypeEvent{
  CONSULT = 'CONSULT',
  PENALIZE = 'PENALIZE'
}

export interface EventReview {
  id?: string | undefined
  comment: string
  reviewerId: string
  eventStatus: EventStatus
  version: number
}

export enum EventStatus{
  VALID = 'VALID',
  CANCEL = 'CANCEL',
  PENDING = 'PENDING'
}