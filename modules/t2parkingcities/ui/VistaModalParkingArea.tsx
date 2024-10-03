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
import { Schedule } from "../types/scheduleTypes"
import { FormInputAutocomplete } from "@/common/components/ui/form/FormInputAutocomplete"
import { Constantes } from "@/config"
import { Area } from "../types/areaTypes"
import { Subscription } from "../types/subscriptionTypes"
import { CreateEditParkingAreaType } from "../types/parkinAreaTypes"

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
  const [subscriptions, setSubscriptions] = useState<Array<optionType>>([])

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  const { t } = useTranslation()

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()
  const { usuario, estaAutenticado } = useAuth()

  const { handleSubmit, control } = useForm<CreateEditParkingAreaTypeForm>({
    defaultValues: {
      id: undefined,
      area: undefined,
      scheduleIds: [],
      subscriptionIds: []
    },
  })

  const guardarActualizarSubscription = async (
    data: CreateEditParkingAreaTypeForm
  ) => {
    await guardarActualizarSubscriptionPeticion(data)
  }

  const guardarActualizarSubscriptionPeticion = async (
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

  const obtenerAreasPeticion = async (): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/areas/getAll/${usuario?.dependency}`,
        method: 'get',
      })
      imprimir(`Respuesta obtener areas: `, respuesta)
      if(respuesta.data){
        setAreas(
          respuesta.data.map((area: Area) => {
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
      if(respuesta.data){
        setSchedules(
          respuesta.data.map((schedule: Schedule) => {
            return {key: schedule.id?.toString(), value: schedule.id?.toString(), label: schedule.name} as optionType
          })
        )
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
      if(respuesta.data){
        setSubscriptions(
          respuesta.data.map((sub: Subscription) => {
            return {key: sub.id?.toString(), value: sub.id?.toString(), label: sub.name} as optionType
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

  useEffect(() => {
    obtenerAreasPeticion()
    obtenerSchedulesPeticion()
    obtenerSubscriptionsPeticion()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estaAutenticado])

  return (
    <form onSubmit={handleSubmit(guardarActualizarSubscription)}>
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