
import { Area } from './Area'
import { Schedule } from './Schedule'
import { Subscription } from './Subscription'

export interface ParkingArea {
  id: number
  name: string
  area: Area
  schedules: Schedule[]
  subscriptions: Subscription[]
  cityId: number
  createdAt: Date
}