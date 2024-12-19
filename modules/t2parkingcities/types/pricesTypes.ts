export interface PriceRequestTG {
  billingBlock: PriceTG[]
  dias: DiaTG[]
  zona: ZonaTG
}

export interface PriceTG{
  id?: number
  minutes: number
  price: number
}

export interface ZonaTG{
  id?: number
  name: string
  departamento: string
  descripcion: string
  billingBlock: number
}

export interface DiaTG{
  // id?: number
  nombre: string
  idNombre: number
  horarioInicio: Date
  horarioFin: Date
}


export interface PriceSubscriptionRequestTG {
  billingBlock: SubscriptionTG[]
  zona: ZonaTG
}

export interface SubscriptionTG{
  id?: number
  price: number
  mes: string
  mesInt: number
}