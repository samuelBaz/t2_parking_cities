import { FormInputText } from "@/common/components/ui/form"
import ProgresoLineal from "@/common/components/ui/progreso/ProgresoLineal"
import { useAlerts, useSession } from "@/common/hooks"
import { delay, InterpreteMensajes } from "@/common/utils"
import { imprimir } from "@/common/utils/imprimir"
import { Constantes } from "@/config"
import { Box, Button, DialogActions, DialogContent, Grid } from "@mui/material"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as turf from '@turf/turf'
import { useTranslation } from "@/common/hooks/useTranslation"
import { useAuth } from "@/context/auth"
import { CreateEditAreaType, EditSpace, Space } from "../types/areaTypes"

interface EditSpaceTypeForm {
  id?: number
  name: string
  sensor: string | null
  latitude: number | null
  longitude: number | null
}

export interface ModalParametroType {
  space?: Space | null
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalSpaces = ({
  space,
  accionCorrecta,
  accionCancelar,
}: ModalParametroType) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(false)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  const { t } = useTranslation()
  // Proveedor de la sesión
  const { sesionPeticion } = useSession()
  const { usuario } = useAuth()

  const { handleSubmit, control, watch, setValue } = useForm<EditSpaceTypeForm>({
    defaultValues: {
      id: space?.id,
      name: space?.name,
      sensor: space?.sensorId ?? '',
      latitude: space?.latitude?? null,
      longitude: space?.longitude?? null
    },
  })

  const guardarActualizarVehiculo = async (
    data: EditSpaceTypeForm
  ) => {
    await guardarActualizarVehiculoPeticion(data)
  }

  const guardarActualizarVehiculoPeticion = async (
    spaceForm: EditSpaceTypeForm
  ) => {
    try {
      setLoadingModal(true)
      const body: EditSpace = {
        id: spaceForm.id!,
        name: spaceForm.name,
        sensorId: spaceForm.sensor ?? null,
        latitude: spaceForm.latitude?? null,
        longitude: spaceForm.longitude?? null,
        areaId: space?.areaId!,
        version: space?.version!,
      }
      await delay(500)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/spaces`,
        method: 'put',
        body: body,
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar plaza de estacionamiento`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingModal(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(guardarActualizarVehiculo)}>
      <DialogContent dividers>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'name'}
                control={control}
                name="name"
                label={t('spaces.form.title')}
                disabled
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box height={20}></Box>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'name'}
                control={control}
                name="sensor"
                label={t('spaces.form.id_sensor')}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box height={20}></Box>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'name'}
                control={control}
                name="latitude"
                label={t('spaces.form.lat')}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'name'}
                control={control}
                name="longitude"
                label={t('spaces.form.long')}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <ProgresoLineal mostrar={loadingModal} />
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

export default VistaModalSpaces