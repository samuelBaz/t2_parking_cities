import { FormInputText } from "@/common/components/ui/form"
import ProgresoLineal from "@/common/components/ui/progreso/ProgresoLineal"
import { useAlerts, useSession } from "@/common/hooks"
import { InterpreteMensajes } from "@/common/utils"
import { imprimir } from "@/common/utils/imprimir"
import { Constantes } from "@/config"
import { Box, Button, DialogActions, DialogContent, Grid } from "@mui/material"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "@/common/hooks/useTranslation"
import { useAuth } from "@/context/auth"
import FormInputImage from "@/common/components/ui/form/FormInputImage"
import { CreateEditInspectorEvent, TypeEvent } from "../types/inspectorEventTypes"

interface CreateEditEventTypeForm {
  id?: string
  description: string
  licensePlate: string
  file: any
  version: number
}

export interface ModalParametroType {
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalEvents = ({
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

  const { handleSubmit, control } = useForm<CreateEditEventTypeForm>()

  const guardarActualizarVehiculo = async (
    data: CreateEditEventTypeForm
  ) => {
    await guardarActualizarVehiculoPeticion(data)
  }

  const guardarActualizarVehiculoPeticion = async (
    event: CreateEditEventTypeForm
  ) => {
    try {
      setLoadingModal(true)
      
      const body: CreateEditInspectorEvent = {
        id: event.id,
        description: event.description,
        plate: event.licensePlate,
        typeEvent: TypeEvent.PENALIZE,
        inspectorId: usuario?.id!,
        version: event.version,
      }
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/inspector_events`,
        method: 'post',
        body: body,
      })
      if(event.file && event.file.length > 0){
        const formData = new FormData()
        formData.append('file', event.file[0])
        formData.append('eventId', respuesta.data.id)
        await sesionPeticion({
          url: `${Constantes.baseUrl}/api/inspector_events/upload_file`,
          body: formData,
          method: 'POST'
        })
      }
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar un evento`, e)
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
                id={'description'}
                control={control}
                name="description"
                label={t('inspectors.events.form.description')}
                disabled={loadingModal}
                multiline
                rows={2}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'licensePlate'}
                control={control}
                name="licensePlate"
                label={t('inspectors.events.form.vehicle_plate')}
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputImage
                id={'file'}
                control={control}
                name="file"
                label={t('inspectors.events.form.photographic')}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box height={20}></Box>
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

export default VistaModalEvents