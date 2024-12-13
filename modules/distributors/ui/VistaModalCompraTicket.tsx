import { FormInputText, optionType } from "@/common/components/ui/form"
import ProgresoLineal from "@/common/components/ui/progreso/ProgresoLineal"
import { useAlerts, useSession } from "@/common/hooks"
import { InterpreteMensajes } from "@/common/utils"
import { imprimir } from "@/common/utils/imprimir"
import { Box, Button, DialogActions, DialogContent, Grid, InputAdornment } from "@mui/material"
import { useForm } from "react-hook-form"
import { useTranslation } from "@/common/hooks/useTranslation"
import { useAuth } from "@/context/auth"
import { Constantes } from "@/config"
import { useEffect, useState } from "react"
import { FormInputAutocomplete } from "@/common/components/ui/form/FormInputAutocomplete"
import { Icono } from "@/common/components/ui"
import { ParkingArea } from "@/modules/t2parkingcities/types/parkinAreaTypes"
import { BillingBlock, Schedule } from "@/modules/t2parkingcities/types/scheduleTypes"
import { FormInputTime } from "@/common/components/ui/form/FormInputTime"
import dayjs from "dayjs"
import { CreateTicket, TicketStatus } from "../types/ticketsTypes"

interface CreateEditDistributorTypeForm {
  id?: number
  phone: string
  email: string
  plate: string
  parkingArea: optionType | null
  schedule: optionType | null
  billingBlock: optionType | null
  startDate: Date
  endDate: Date | null
  version: number
}

export interface ModalParametroType {
  parkingAreas: Array<ParkingArea>
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalCompraTicket = ({
  parkingAreas,
  accionCorrecta,
  accionCancelar,
}: ModalParametroType) => {
  const [loading, setLoading] = useState<boolean>(false)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  const { t } = useTranslation()

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()
  const { usuario } = useAuth()
  const [parkingAreasOptions, setParkingAreasOptions] = useState<Array<optionType>>([])
  const [schedules, setSchedules] = useState<Array<optionType>>([])
  const [billingBlock, setBillingBlock] = useState<Array<optionType>>([])

  const { handleSubmit, control, watch, setValue } = useForm<CreateEditDistributorTypeForm>({
    defaultValues: {
      id: undefined,
      version: 0,
      parkingArea: null,
      schedule: null,
      billingBlock: null,
      startDate: dayjs().toDate()
    },
  })

  const parkingAreaWatch : optionType | null = watch('parkingArea') 
  const scheduleWatch : optionType | null = watch('schedule') 
  const billingBlockWatch : optionType | null = watch('billingBlock') 
  const startDateWatch : Date | null = watch('startDate') 

  const guardarActualizarUsuario = async (
    data: CreateEditDistributorTypeForm
  ) => {
    await guardarActualizarUsuarioPeticion(data)
  }

  const guardarActualizarUsuarioPeticion = async (
    ticket: CreateEditDistributorTypeForm
  ) => {
    try {
      setLoading(true)
      const ticketDto = {
        plate: ticket.plate,
        duration: ticket.billingBlock?.key!,
        phone: ticket.phone,
        email: ticket.email,
        amount: ticket.billingBlock?.value!,
        status: TicketStatus.OK,
        startDate: ticket.startDate,
        endDate: ticket.endDate,
        companyId: usuario?.dependency
      } as CreateTicket
      
      // console.log(ticketDto)
      //     const responseTicketT2PC = await fetchWithToken(
      //       `${API.tickets.post}`, ticketT2PC, 'POST'
      //     )
      
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/tickets`,
        method: 'post',
        body: ticketDto,
      })
      if(respuesta.status !== 200){
        Alerta({
          mensaje: respuesta.message,
          variant: 'error',
        })
        return
      }
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al comprar un ticket`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const findSchedules = (event: optionType | any) => {
    const parkingArea = parkingAreas.find((parkingArea: ParkingArea) => parkingArea.id == event.value )
    if(parkingArea){
      setSchedules(
        parkingArea.schedules.map((schedule: Schedule) => {
          return {
            key: schedule.id.toString(),
            value: schedule.id.toString(),
            label: schedule.name
          } as optionType
        })
      )
    }
  }

  const findBillingBlock = (event: optionType | any) => {
    if(parkingAreaWatch == null) return
    const parkingArea = parkingAreas.find((parkingArea: ParkingArea) => parkingArea.id.toString() == parkingAreaWatch?.value )
    if(parkingArea){
      const scheduleFind = parkingArea.schedules.find((schedule: Schedule) => schedule.id.toString() == event.value)
      if(scheduleFind){
        setBillingBlock(
          scheduleFind.billingBlocks.map((bb: BillingBlock) => {
            return {
              key: bb.minutes?.toString(),
              value: bb.price?.toString(),
              label: `${bb.minutes} - $${bb.price}`
            } as optionType
          })
        )
      }
    }
  }

  useEffect(() => {
    if(parkingAreas){
      setParkingAreasOptions(
        parkingAreas.map((parkingArea : ParkingArea) => {
          return {
            key: parkingArea.id.toString(),
            value: parkingArea.id.toString(),
            label: parkingArea.name
          } as optionType
        })
      )
    }
  }, [parkingAreas])

  useEffect(() => {
    if(startDateWatch && billingBlockWatch){
      const calculateEndDate = dayjs(startDateWatch).add(parseInt(billingBlockWatch.key), 'minutes')
      setValue('endDate', calculateEndDate.toDate())
    } else setValue('endDate', null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingBlockWatch, startDateWatch])
  

  return (
    <form onSubmit={handleSubmit(guardarActualizarUsuario)}>
      <DialogContent dividers>
        <Grid container display='flex' direction='column' justifyContent="center">
          <Grid item xs={12} sm={12} md={12}>
            <FormInputText
              id={'phone'}
              control={control}
              name="phone"
              label={t('authentication.register.phone')}
              rules={{ required: 'Este campo es requerido' }}
            />
          </Grid>
        </Grid>
        <Box height={8}></Box>
        <Grid container display='flex' direction='column' justifyContent="center">
          <Grid item xs={12} sm={12} md={12}>
            <FormInputText
              id={'email'}
              control={control}
              name="email"
              label={t('email')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icono>email</Icono>
                  </InputAdornment>
                )
              }}
              rules={{ required: 'Este campo es requerido' }}
            />
          </Grid>
        </Grid>
        <Box height={8}></Box>
        <Grid container display='flex' direction='column' justifyContent="center">
          <Grid item xs={12} sm={12} md={12}>
            <FormInputText
              id={'plate'}
              control={control}
              name="plate"
              label={t('inspectors.events.form.vehicle_plate')}
              rules={{ required: 'Este campo es requerido' }}
            />
          </Grid>
        </Grid>
        <Box height={8}></Box>
        <Grid container display='flex' direction='column' justifyContent="center">
          <Grid item xs={12} sm={12} md={12}>
            <FormInputAutocomplete
              id={'parkingArea'}
              control={control}
              name="parkingArea"
              label={t('nav_menu.parking_areas')}
              options={parkingAreasOptions}
              onChange={(event: any) => {
                if(event){
                  findSchedules(event)
                } else {
                  setSchedules([])
                }
                setValue('schedule', null)
                setValue('billingBlock', null)
              }}
              rules={{ required: 'Este campo es requerido' }}
            />
          </Grid>
        </Grid>
        <Box height={8}></Box>
        <Grid container display='flex' direction='column' justifyContent="center">
          <Grid item xs={12} sm={12} md={12}>
            <FormInputAutocomplete
              id={'schedule'}
              control={control}
              name="schedule"
              label={t('parking_areas.schedules')}
              disabled={parkingAreaWatch == null}
              onChange={(event: any) => {
                if(event){
                  findBillingBlock(event)
                } else {
                  setBillingBlock([])
                }
                setValue('billingBlock', null)
              }}
              options={schedules}
              rules={{ required: 'Este campo es requerido' }}
            />
          </Grid>
        </Grid>
        <Box height={8}></Box>
        <Grid container display='flex' direction='column' justifyContent="center">
          <Grid item xs={12} sm={12} md={12}>
            <FormInputAutocomplete
              id={'billingBlock'}
              control={control}
              name="billingBlock"
              label={t('schedules.form.minutes')}
              disabled={scheduleWatch == null}
              options={billingBlock}
              rules={{ required: 'Este campo es requerido' }}
            />
          </Grid>
        </Grid>
        <Box height={8}></Box>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={6} md={6}>
              <FormInputTime
              id={'startDate'}
              control={control}
              name="startDate"
              label={t('schedules.form.start_hour')}
              format="HH:mm"
              rules={{ required: 'Este campo es requerido' }}
            />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <FormInputTime
              id={'endDate'}
              control={control}
              name="endDate"
              disabled
              label={t('schedules.form.end_hour')}
              format="HH:mm"
              rules={{ required: 'Este campo es requerido' }}
            />
            </Grid>
          </Grid>
        </Grid>
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

export default VistaModalCompraTicket