import { FormInputDate, FormInputDropdown, FormInputText, optionType } from "@/common/components/ui/form"
import ProgresoLineal from "@/common/components/ui/progreso/ProgresoLineal"
import { useAlerts, useSession } from "@/common/hooks"
import { delay, InterpreteMensajes } from "@/common/utils"
import { imprimir } from "@/common/utils/imprimir"
import { Alert, Box, Button, Checkbox, DialogActions, DialogContent, Grid, Paper, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "@/common/hooks/useTranslation"
import { useAuth } from "@/context/auth"
import { BillingBlock, CreateUpdateDayType, CreateUpdateScheduleType, Day, Schedule, Vehicle } from "../types/scheduleTypes"
import { FormInputAutocomplete } from "@/common/components/ui/form/FormInputAutocomplete"
import { FormInputTime } from "@/common/components/ui/form/FormInputTime"
import dayjs from "dayjs"
import { Constantes } from "@/config"

interface VehicleFormType {
  key: string
  value: boolean
  label: string
}

interface CreateEditSusbcriptionTypeForm {
  id?: number
  name: string
  dayIds?: optionType[] | [] 
  startHour: Date | undefined
  endHour: Date | undefined
  currencyId: string | undefined
  minimumTime: number | undefined
  vehicles?:Record<string, any>
  billingBlock: Record<string, any>
  version: number
}

export interface ModalParametroType {
  schedule?: Schedule | null
  days: Array<optionType>
  currencies: Array<optionType>
  vehicles: Array<optionType>
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalSchedules = ({
  schedule,
  days,
  currencies,
  vehicles,
  accionCorrecta,
  accionCancelar,
}: ModalParametroType) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(true)
  const [loadingBilling, setLoadingBilling] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  const { t } = useTranslation()

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()
  const { usuario } = useAuth()

  const { handleSubmit, control, watch, setValue, getValues } = useForm<CreateEditSusbcriptionTypeForm>({
    defaultValues: {
      id: schedule?.id,
      name: schedule?.name,
      dayIds: schedule?.days? schedule.days
        .map((day: Day) => {
         return {key:day.id.toString(), value: day.id.toString(), label: day.name} as optionType
        }): [],
      startHour: schedule?.startHour? dayjs(dayjs().format('YYYY-MM-DD') + schedule.startHour).toDate(): undefined,
      endHour: schedule?.endHour? dayjs(dayjs().format('YYYY-MM-DD') + schedule.endHour).toDate() : undefined,
      currencyId: schedule?.currencyId? schedule.currencyId.toString() : undefined,
      minimumTime: schedule?.minimumTime?? 30,
      version: schedule?.version
    },
  })

  const watchStartHour : Date | undefined = watch('startHour')
  const watchId : number | undefined = watch('id')
  const watchEndHour : Date | undefined = watch('endHour')
  const watchMinimunTime : number | undefined = watch('minimumTime')

  useEffect(() => {
    setLoadingModal(true)
    vehicles.forEach(vehicle => {
      setValue(`vehicles.[${vehicle.key}].checked`, schedule? false : true)
      setValue(`vehicles.[${vehicle.key}].vehicle`, vehicle.key)
    })
    if(schedule){
      schedule?.vehicles.forEach((vehicle: Vehicle) => {
        setValue(`vehicles.[${vehicle.id}].checked`, true)
      })
      
      schedule?.billingBlocks.forEach((billingBlock: BillingBlock, index: number) => {
        setValue(`billingBlock.[${ billingBlock.id}].minutes`, billingBlock.minutes)
        setValue(`billingBlock.[${ billingBlock.id}].id`, billingBlock.id)
        setValue(`billingBlock.[${ billingBlock.id}].price`, billingBlock.price)
        setValue(`billingBlock.[${ billingBlock.id}].version`, billingBlock.version)
      })
      setLoadingBilling(false)
    }
    setLoadingModal(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule])

  useEffect(() => {
    if(schedule === undefined || schedule === null){
      if(watchStartHour && watchEndHour && watchMinimunTime){
        setValue('billingBlock', [])
        setLoadingBilling(true)
        if(watchMinimunTime! > 0){
          let startDate = dayjs(watchStartHour).toDate()
          const endDate =  dayjs(watchEndHour).toDate()
          let count = 0
          
          while(endDate > startDate) {
            const startms = startDate.getTime()
            const add = watchMinimunTime * 60000
            startDate = new Date(startms+add)
            count = count + 1
          }

          for(let i = 1; i <= count; i++){
            setValue(`billingBlock.[${i}].minutes`, watchMinimunTime * i)
            setValue(`billingBlock.[${i}].id`, i)
            setValue(`billingBlock.[${i}].price`, 0)
            setValue(`billingBlock.[${i}].version`, 0)
          }
        }
        setLoadingBilling(false)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchStartHour, watchEndHour, watchMinimunTime, schedule])

  const guardarActualizarSubscription = async (
    data: CreateEditSusbcriptionTypeForm
  ) => {
    await guardarActualizarSubscriptionPeticion(data)
  }

  const guardarActualizarSubscriptionPeticion = async (
    scheduleForm: CreateEditSusbcriptionTypeForm
  ) => {
    try {
      setLoading(true)
      
      const body: CreateUpdateScheduleType = {
        id: scheduleForm.id!,
        name: scheduleForm.name,
        currencyId: scheduleForm.currencyId!,
        billingBlocks: scheduleForm.billingBlock
          .filter((billing: any) => billing != null)
          .map((billing: any) => {
            // const vehicle = vehicles.find((vehicle: Vehicle) => vehicle.id === price.vehicle)

            return {id: watchId? billing.id : undefined, price: billing.price, minutes: billing.minutes, version: billing.version}
          }),
        cityId: usuario?.dependency!,
        days: scheduleForm.dayIds ? scheduleForm.dayIds?.map((day) => {
          return {id: day.key, name: day.label} as CreateUpdateDayType
        }) : [],
        startHour: scheduleForm.startHour?.toISOString()!,
        endHour: scheduleForm.endHour?.toISOString()!,
        minimumTime: scheduleForm.minimumTime!,
        vehicles: scheduleForm.vehicles?.filter((vehicle: any) => vehicle != null)
          .filter((vehicle: any) => vehicle.checked)
          .map((vehicle: any) => {
            return {id: vehicle.vehicle}
          }),
        version: scheduleForm.version,
      }

      await delay(500)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/schedules`,
        method: !!scheduleForm.id ? 'put' : 'post',
        body: body,
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar schedule`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(guardarActualizarSubscription)}>
      <DialogContent dividers>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'name'}
                control={control}
                name="name"
                label={t('schedules.form.name_of_schedule')}
                disabled={loadingModal}
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
                name="dayIds"
                label={t('schedules.form.days')}
                options={days}
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
            <Grid item xs={12} sm={6} md={6}>
              <FormInputTime
                id={'name'}
                control={control}
                name="startHour"
                label={t('schedules.form.start_hour')}
                format="HH:mm"
                disabled={watchId? true: false}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <FormInputTime
                id={'name'}
                control={control}
                name="endHour"
                label={t('schedules.form.end_hour')}
                format="HH:mm"
                disabled={watchId? true: false}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box height={8}></Box>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={6} md={6}>
              <FormInputDropdown
                id={'name'}
                control={control}
                name="currencyId"
                label={t('schedules.form.currency')}
                options={currencies}
                disabled={false}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <FormInputText
                id={'name'}
                control={control}
                type="number"
                name="minimumTime"
                disabled={watchId? true: false}
                label={t('schedules.form.minimum_time')}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box height={8}></Box>
        <Grid container direction="column">
          <Grid item>
            <Typography variant="subtitle2" fontWeight={500}>
              Vehicles
            </Typography>
          </Grid>
          <Grid container display='flex' flexDirection='row' justifyContent='space-between' sx={{my: 1}}>
            {
              !loadingModal && vehicles.map((vehicle: optionType, index: any) => {
                return (
                  <Grid item  key={'vehicles-'+index} flexDirection='row'> 
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                      <Grid item>
                        <Checkbox
                          defaultChecked={true} 
                          checked={watch(`vehicles.[${vehicle.key}].checked`)}
                          onChange={(event) => {
                            setValue(`vehicles.[${vehicle.key}].checked`, event.target.checked)
                          }}
                          inputProps={{ 'aria-label': 'controlled' }}/>
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {vehicle.label}
                        </Typography>
                      </Grid>
                    </Box>
                  </Grid>
                )
              })
            }
          </Grid>
        </Grid>
        <Grid container direction="column">
          <Grid item>
            <Typography variant="subtitle2" fontWeight={500}>
              Billing Block
            </Typography>
          </Grid>
          <Grid item >
            {
              !loadingBilling && watch('billingBlock').filter((billing: any) => billing != null).map((billingBlock: any, index: any) => {
                return (
                  <Paper key={'billing-block-price-'+index} sx={{mb: 1}}>
                    <Grid container sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                      <Grid item xs>
                        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                          <Grid item>
                            <Typography variant="subtitle2" fontWeight={600} ml={1}>
                              {`${billingBlock.minutes} ${t('schedules.form.minutes')}`}
                            </Typography>
                          </Grid>
                        </Box>
                      </Grid>
                      <Grid item xs>
                        <Typography variant="subtitle2" fontWeight={400}>
                          {`${t('schedules.form.price')} ${watch('currencyId')? `(${currencies.find(currency => currency.value === watch('currencyId'))?.label})`: ``} `}
                        </Typography>
                      </Grid>
                      <Grid item xs sx={{pr: 1}}>
                        <FormInputText
                          id={'price'}
                          control={control}
                          name={`billingBlock.[${billingBlock.id}].price`}
                          label={''}
                          // disabled={watch(`prices.[${billingBlock.id}].checked`) === undefined ? false : !watch(`prices.[${vehicle.id}].checked`)}
                          rules={{ required: 'Este campo es requerido'}}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                )
              })
            }
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
          disabled={loadingModal}
          onClick={accionCancelar}
        >
          {t('cancel')}
        </Button>
        <Button variant={'contained'} disabled={loadingModal} type={'submit'}>
          {t('save')}
        </Button>
      </DialogActions>
    </form>
  )
}

export default VistaModalSchedules