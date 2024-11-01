import { FormInputText } from "@/common/components/ui/form"
import ProgresoLineal from "@/common/components/ui/progreso/ProgresoLineal"
import { useAlerts, useSession } from "@/common/hooks"
import { InterpreteMensajes } from "@/common/utils"
import { imprimir } from "@/common/utils/imprimir"
import { Constantes } from "@/config"
import { Box, Button, DialogActions, DialogContent, Grid } from "@mui/material"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { CreateEditVehicleType } from "../types/vehicleTypes"
import { useTranslation } from "@/common/hooks/useTranslation"
import { useAuth } from "@/context/auth"
import { Vehicle } from "../types/scheduleTypes"

interface CreateEditVehicleTypeForm {
  id?: number
  name: string
  description: string
  version: number
}

export interface ModalParametroType {
  vehicle?: Vehicle | null
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalVehicles = ({
  vehicle,
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

  const { handleSubmit, control } = useForm<CreateEditVehicleTypeForm>({
    defaultValues: {
      id: vehicle?.id,
      name: vehicle?.name,
      description: vehicle?.description,
      version: vehicle?.version
    },
  })

  const guardarActualizarVehiculo = async (
    data: CreateEditVehicleTypeForm
  ) => {
    await guardarActualizarVehiculoPeticion(data)
  }

  const guardarActualizarVehiculoPeticion = async (
    vehicle: CreateEditVehicleTypeForm
  ) => {
    try {
      setLoadingModal(true)
      const body: CreateEditVehicleType = {
        id: vehicle.id,
        name: vehicle.name,
        description: vehicle.description,
        byDefault: false,
        cityId: usuario?.dependency!,
        version: vehicle.version,
      }
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/vehicles`,
        method: !!vehicle.id ? 'put' : 'post',
        body: body,
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar vehiculo`, e)
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
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'name'}
                control={control}
                name="name"
                label={t('vehicles.form.name_of_vehicle')}
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'description'}
                control={control}
                name="description"
                label={t('vehicles.form.description')}
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
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

export default VistaModalVehicles