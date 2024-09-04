import { FormInputText } from "@/common/components/ui/form"
import ProgresoLineal from "@/common/components/ui/progreso/ProgresoLineal"
import { useAlerts, useSession } from "@/common/hooks"
import { delay, InterpreteMensajes } from "@/common/utils"
import { imprimir } from "@/common/utils/imprimir"
import { Constantes } from "@/config"
import { Box, Button, DialogActions, DialogContent, Grid } from "@mui/material"
import { createRef, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Vehicle } from "../Schedule"
import { CreateEditVehicleType } from "../types/vehicleTypes"
import { useTranslation } from "@/common/hooks/useTranslation"
import { useAuth } from "@/context/auth"
import { Area } from "../Area"
import { FeatureGroup, Map } from "leaflet"
import MapaDibujar from "@/common/components/ui/mapas/MapaDibujar"

interface CreateEditVehicleTypeForm {
  id?: number
  name: string
  description: string
  version: number
}

export interface ModalParametroType {
  area?: Area | null
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalAreas = ({
  area,
  accionCorrecta,
  accionCancelar,
}: ModalParametroType) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(false)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  const { t } = useTranslation()
  
  const [zoom, setZoom] = useState<number | undefined>(15)
  const [centro, setCentro] = useState<number[] | undefined>()
  
  const featureGroupRef = useRef<FeatureGroup | null>(null)
  const mapRef = createRef<Map>()

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()
  const { usuario } = useAuth()

  const { handleSubmit, control } = useForm<CreateEditVehicleTypeForm>({
    defaultValues: {
      id: area?.id,
      name: area?.name,
      // description: vehicle?.description,
      version: area?.version
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
        cityId: usuario?.id!,
        version: vehicle.version,
      }
      await delay(1000)
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
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'name'}
                control={control}
                name="name"
                label={t('vehicles.form.name_of_vehicle')}
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box height={20}></Box>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <MapaDibujar
                mapRef={mapRef}
                featureGroupRef={featureGroupRef}
                onlyread={false}
                id={`mapa-poligonos-dibujar`}
                key={`mapa-poligonos-dibujar`}
                height={400}
                zoom={zoom}
                centro={centro}
                poligono={null}
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
          Cancelar
        </Button>
        <Button variant={'contained'} disabled={loadingModal} type={'submit'}>
          Guardar
        </Button>
      </DialogActions>
    </form>
  )
}

export default VistaModalAreas