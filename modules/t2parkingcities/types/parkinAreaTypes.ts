

import { Area } from './areaTypes'
import { Schedule } from './scheduleTypes'
import { Subscription } from './subscriptionTypes'

export interface ParkingArea {
  id: number
  name: string
  areaId: number
  areaName: string 
  schedules: Schedule[]
  subscriptions: Subscription[]
  cityId: number
  createdAt: Date
}

export interface CreateEditParkingAreaType{
  id?: number | undefined
  name: string
  areaId: string
  schedules: CreateScheduleSubscription[]
  subscriptions: CreateScheduleSubscription[]
  cityId: string
  version: number
}

interface CreateScheduleSubscription {
  id: string
}