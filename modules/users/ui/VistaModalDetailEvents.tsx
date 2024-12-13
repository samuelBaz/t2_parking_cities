import { FormInputText } from "@/common/components/ui/form"
import ProgresoLineal from "@/common/components/ui/progreso/ProgresoLineal"
import { Box, Button, DialogActions, DialogContent, Grid } from "@mui/material"
import { useForm } from "react-hook-form"
import { useTranslation } from "@/common/hooks/useTranslation"
import FormInputImage from "@/common/components/ui/form/FormInputImage"
import { EventStatus, InspectorEventCRUDTypes } from "../types/inspectorEventTypes"
import { useAuth } from "@/context/auth"

function base64ToFile(base64: any, fileName: string, mimeType: string) {
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)

    // Crear un Blob y convertirlo a un File
    const blob = new Blob([byteArray], { type: mimeType })
    return new File([blob], fileName, { type: mimeType })
}

interface CreateEditEventTypeForm {
  id?: string
  description: string
  licensePlate: string
  file: any
  version: number
}

export interface ModalParametroType {
  inspectorEvent?: InspectorEventCRUDTypes | null
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalDetailEvents = ({
  inspectorEvent,
  accionCorrecta,
  accionCancelar,
}: ModalParametroType) => {

  const { t } = useTranslation()
  const { usuario } = useAuth()

  const { control } = useForm<CreateEditEventTypeForm>({
    defaultValues: {
      id: inspectorEvent?.id,
      description: inspectorEvent?.description,
      licensePlate: inspectorEvent?.plate,
      file: inspectorEvent?.image ? [base64ToFile(inspectorEvent?.image, "imagen.png", "image/png")] : [],
      version: inspectorEvent?.version
    },
  })

  return (
    <>
      <DialogContent dividers>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'description'}
                control={control}
                name="description"
                label={t('inspectors.events.form.description')}
                disabled
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
                disabled
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              {
                inspectorEvent && inspectorEvent.image &&
                <FormInputImage
                  id={'file'}
                  control={control}
                  name="file"
                  borrar={true}
                  label={t('inspectors.events.form.photographic')}
                />
              }
            </Grid>
          </Grid>
        </Grid>
        <Box height={20}></Box>
      </DialogContent>
      <ProgresoLineal mostrar={false} />
      {
        usuario && usuario.rol === 'INSPECTOR' &&
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
            disabled={inspectorEvent?.eventReview.eventStatus !== EventStatus.PENDING}
            onClick={accionCancelar}
          >
            {t('cancel')}
          </Button>
          <Button 
            variant={'contained'}
            disabled={inspectorEvent?.eventReview.eventStatus !== EventStatus.PENDING}
            onClick={accionCorrecta}>
            {t('validate')}
          </Button>
        </DialogActions>
      }
    </>
  )
}

export default VistaModalDetailEvents