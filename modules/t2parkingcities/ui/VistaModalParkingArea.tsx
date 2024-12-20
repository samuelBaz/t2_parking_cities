import { FormInputText, optionType } from "@/common/components/ui/form"
import ProgresoLineal from "@/common/components/ui/progreso/ProgresoLineal"
import { useAlerts, useSession } from "@/common/hooks"
import { delay, InterpreteMensajes } from "@/common/utils"
import { imprimir } from "@/common/utils/imprimir"
import { Box, Button, DialogActions, DialogContent, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "@/common/hooks/useTranslation"
import { useAuth } from "@/context/auth"
import { BillingBlock, CreateUpdateScheduleType, Days, Schedule } from "../types/scheduleTypes"
import { FormInputAutocomplete } from "@/common/components/ui/form/FormInputAutocomplete"
import { Constantes } from "@/config"
import { Area } from "../types/areaTypes"
import { Subscription, SubscriptionBlock } from "../types/subscriptionTypes"
import { CreateEditParkingAreaType } from "../types/parkinAreaTypes"
import { DiaTG, PriceRequestTG, PriceSubscriptionRequestTG, PriceTG, SubscriptionTG, ZonaTG } from "../types/pricesTypes"
import { ScheduleT2PCTG, SubscriptionT2PCTG } from "../types/ticketGenerator"

interface CreateEditParkingAreaTypeForm {
  id?: number
  name: string
  area: optionType | undefined
  scheduleIds: Array<optionType>
  subscriptionIds?: Array<optionType>
}

export interface ModalParametroType {
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalParkingArea = ({
  accionCorrecta,
  accionCancelar,
}: ModalParametroType) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [areas, setAreas] = useState<Array<optionType>>([])
  const [schedules, setSchedules] = useState<Array<optionType>>([])
  const [schedulesData, setSchedulesData] = useState<Array<Schedule>>([])
  const [subscriptions, setSubscriptions] = useState<Array<optionType>>([])
  const [subscriptionsData, setSubscriptionsData] = useState<Array<Subscription>>([])

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  const { t } = useTranslation()

  // Proveedor de la sesión
  const { sesionPeticion, peticion } = useSession()
  const { usuario, estaAutenticado } = useAuth()

  const { handleSubmit, control } = useForm<CreateEditParkingAreaTypeForm>({
    defaultValues: {
      id: undefined,
      area: undefined,
      scheduleIds: [],
      subscriptionIds: []
    },
  })

  const guardarActualizarParkingArea = async (
    data: CreateEditParkingAreaTypeForm
  ) => {
    await guardarActualizarParkingAreaPeticion(data)
    await guardarPreciosTicketGenerator(data)
    await guardarPreciosSubscripcionTicketGenerator(data)
  }

  const guardarActualizarParkingAreaPeticion = async (
    parkingAreaForm: CreateEditParkingAreaTypeForm
  ) => {
    try {
      setLoading(true)
      const body: CreateEditParkingAreaType = {
        id: parkingAreaForm.id,
        name: parkingAreaForm.name,
        areaId: parkingAreaForm.area?.value!,
        schedules: parkingAreaForm.scheduleIds.map((schedule: optionType) => {
          return { id: schedule.value }
        }),
        subscriptions: parkingAreaForm.subscriptionIds!.map((subs: optionType) => {
          return { id: subs.value }
        }),
        cityId: usuario?.dependency!,
        version: 0
      }

      await delay(500)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/parking_areas`,
        method: !!parkingAreaForm.id ? 'put' : 'post',
        body: body,
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar parking area`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

	const guardarPreciosTicketGenerator = async (parkingAreaForm: CreateEditParkingAreaTypeForm) => {
    try {
      if (parkingAreaForm.scheduleIds.length > 0) {
        const schedulesFlat = schedulesData.filter((schedule: Schedule) =>
          parkingAreaForm.scheduleIds.map((option: optionType) => option.value).includes(schedule.id.toString())
        )
  
        for (const schedule of schedulesFlat) {
          const zona: ZonaTG = {
            name: schedule.name,
            departamento: schedule.name,
            descripcion: schedule.name,
            billingBlock: schedule.id,
          }
  
          const billingBlock: PriceTG[] = schedule.billingBlocks.map((bb: BillingBlock) => ({
            minutes: bb.minutes,
            price: bb.price,
          }))
  
          const dias: DiaTG[] = schedule.days.map((d: Days, indexDay: number) => {
            const [startHour, startMinute, startSecond] = schedule.startHour.split(':').map(Number);
            const [endHour, endMinute, endSecond] = schedule.endHour.split(':').map(Number);
  
            const sd = new Date();
            sd.setHours(startHour, startMinute, startSecond)
  
            const ed = new Date();
            ed.setHours(endHour, endMinute, endSecond)
  
            return {
              nombre: d.toString(),
              idNombre: indexDay,
              horarioInicio: sd,
              horarioFin: ed,
            }
          })
  
          const precioDto: PriceRequestTG = {
            zona,
            dias,
            billingBlock,
          }
  
          const response = await peticion({
            url: `${Constantes.ticketGeneratorUrl}/precios`,
            method: 'post',
            body: precioDto,
            withCredentials: false
          })
          
          if (response && response.status === 200) {
            const price: PriceRequestTG = response.response
            const scheduleTG: ScheduleT2PCTG = {
              cityId: schedule.cityId,
              parkingAreaId: parkingAreaForm.area?.value!,
              scheduleId: schedule.id,
              zonaId: price.zona.id!,
            }
  
            await sesionPeticion({
              url: `${Constantes.baseUrl}/api/ticket_generator_schedules`,
              method: 'post',
              body: scheduleTG,
            })
          }
        }
      }
    } catch (e) {
      imprimir(`Error al crear precios Ticket Generator`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    }
  }

	const guardarPreciosSubscripcionTicketGenerator = async (parkingAreaForm: CreateEditParkingAreaTypeForm) => {
    try {
      if (parkingAreaForm.subscriptionIds && parkingAreaForm.subscriptionIds.length > 0) {
        const subscriptionsFlat = subscriptionsData.filter((subs: Subscription) =>
          parkingAreaForm.subscriptionIds?.map((option: optionType) => option.value).includes(subs.id.toString())
        )
  
        for (const subscription of subscriptionsFlat) {
          const zona: ZonaTG = {
            name: subscription.name,
            departamento: subscription.name,
            descripcion: subscription.name,
            billingBlock: subscription.id
          }
  
          const billingBlock: SubscriptionTG[] = subscription.subscriptionBlocks.map((sb: SubscriptionBlock) => ({
            price: sb.price,
            mes: sb.name,
            mesInt: sb.id
          }))
  
          const precioAbonoDto: PriceSubscriptionRequestTG = {
            zona,
            billingBlock
          }
  
          const response = await peticion({
            url: `${Constantes.ticketGeneratorUrl}/precio_abonos`,
            method: 'post',
            body: precioAbonoDto,
            withCredentials: false
          })
  
          if (response && response.status === 200) {
            const priceSubscription: PriceSubscriptionRequestTG = response.response
            const subscriptionTG: SubscriptionT2PCTG = {
              cityId: subscription.cityId,
              parkingAreaId: parkingAreaForm.area?.value!,
              zonaId: priceSubscription.zona.id!,
              subscriptionId: subscription.id
            }
  
            await sesionPeticion({
              url: `${Constantes.baseUrl}/api/ticket_generator_subscriptions`,
              method: 'post',
              body: subscriptionTG
            })
          }
        }
      }
    } catch (e) {
      imprimir(`Error al crear precio subscripciones Ticket Generator`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    }
  }  

  const obtenerAreasPeticion = async (): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/areas/getAll/${usuario?.dependency}`,
        method: 'get',
      })
      imprimir(`Respuesta obtener areas: `, respuesta)
      if(respuesta.data.content){
        setAreas(
          respuesta.data.content.map((area: Area) => {
            return {key: area.id?.toString(), value: area.id?.toString(), label: area.name} as optionType
          })
        )
      }
    } catch (e) {
      imprimir(`Error obteniendo areas`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const obtenerSchedulesPeticion = async (): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/schedules/getAll/${usuario?.dependency}`,
        method: 'get',
      })
      imprimir(`Respuesta obtener schedules: `, respuesta)
      if(respuesta.data.content){
        setSchedules(
          respuesta.data.content.map((schedule: Schedule) => {
            return {key: schedule.id?.toString(), value: schedule.id?.toString(), label: schedule.name} as optionType
          })
        )
        setSchedulesData(respuesta.data.content)
      }
    } catch (e) {
      imprimir(`Error obteniendo schedules`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const obtenerSubscriptionsPeticion = async (): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/subscriptions/getAll/${usuario?.dependency}`,
        method: 'get',
      })
      imprimir(`Respuesta obtener areas: `, respuesta)
      if(respuesta.data.content){
        setSubscriptions(
          respuesta.data.content.map((sub: Subscription) => {
            return {key: sub.id?.toString(), value: sub.id?.toString(), label: sub.name} as optionType
          })
        )
        setSubscriptionsData(respuesta.data.content)
      }
    } catch (e) {
      imprimir(`Error obteniendo areas`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    obtenerAreasPeticion()
    obtenerSchedulesPeticion()
    obtenerSubscriptionsPeticion()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estaAutenticado])

  return (
    <form onSubmit={handleSubmit(guardarActualizarParkingArea)}>
      <DialogContent dividers>
        <Grid container display='flex' direction='column' justifyContent="center">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'name'}
                control={control}
                name="name"
                label={t('parking_areas.name_of')}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
          <Box height={8}></Box>
        </Grid>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputAutocomplete
                id={'name'}
                control={control}
                name="area"
                label={t('parking_areas.area')}
                options={areas}
                disabled={false}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box height={8}></Box>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputAutocomplete
                id={'name'}
                control={control}
                name="scheduleIds"
                label={t('parking_areas.schedules')}
                options={schedules}
                multiple
                disabled={false}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box height={8}></Box>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputAutocomplete
                id={'name'}
                control={control}
                name="subscriptionIds"
                label={t('parking_areas.subscriptions')}
                options={subscriptions}
                multiple
                disabled={false}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box height={8}></Box>
      </DialogContent>
      <ProgresoLineal mostrar={loading} />
      <DialogActions
        sx={{
          my: 1,
          mx: 2,
          justifyContent: {
            lg: 'flex-end',
            md: 'flex-end',
            xs: 'center',
            sm: 'center',
          },
        }}
      >
        <Button
          variant={'outlined'}
          onClick={accionCancelar}
        >
          {t('cancel')}
        </Button>
        <Button variant={'contained'}  type={'submit'}>
          {t('save')}
        </Button>
      </DialogActions>
    </form>
  )
}

export default VistaModalParkingArea