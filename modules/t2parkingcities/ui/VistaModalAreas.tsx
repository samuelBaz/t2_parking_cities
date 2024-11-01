import { FormInputRadio, FormInputText } from "@/common/components/ui/form"
import ProgresoLineal from "@/common/components/ui/progreso/ProgresoLineal"
import { useAlerts, useSession } from "@/common/hooks"
import { delay, InterpreteMensajes } from "@/common/utils"
import { imprimir } from "@/common/utils/imprimir"
import { Constantes } from "@/config"
import { Alert, Box, Button, Checkbox, DialogActions, DialogContent, Grid, Typography } from "@mui/material"
import { createRef, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import * as turf from '@turf/turf'
import { useTranslation } from "@/common/hooks/useTranslation"
import { useAuth } from "@/context/auth"
import { FeatureGroup, Map } from "leaflet"
import MapaDibujar from "@/common/components/ui/mapas/MapaDibujar"
import { Area, CreateEditAreaType, TypeNumbering } from "../types/areaTypes"
import { Feature } from "geojson"

interface CreateEditAreaTypeForm {
  id?: number
  name: string
  points: any | null
  parkingSpaces: number | null
  numbering: boolean
  typeNumbering?: TypeNumbering | null
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
  
	const [havePoints, setHavePoints] = useState<boolean>(false)
	const [havePointsDirt, setHavePointsDirt] = useState<boolean>(false)
  
  const featureGroupRef = useRef<FeatureGroup | null>(null)
  const mapRef = createRef<Map>()

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()
  const { usuario } = useAuth()

  useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position: any) => {
					setCentro([position.coords.latitude, position.coords.longitude])
				}, (error) => {
					console.error('Error al obtener la ubicación del usuario:', error)
				}
			)
		}
	}, [])

  const { handleSubmit, control, watch, setValue } = useForm<CreateEditAreaTypeForm>({
    defaultValues: {
      id: area?.id,
      name: area?.name,
      numbering: area?.numbering ?? false,
      parkingSpaces: area?.parkingSpaces?? null,
      points: area?.points? JSON.parse(area.points) : null,
      typeNumbering: area?.typeNumbering ?? null,
      version: area?.version
    },
  })

  const guardarActualizarVehiculo = async (
    data: CreateEditAreaTypeForm
  ) => {
    await guardarActualizarVehiculoPeticion(data)
  }

  const guardarActualizarVehiculoPeticion = async (
    area: CreateEditAreaTypeForm
  ) => {
    try {
      if(!havePoints && area.id === undefined) {
        setHavePointsDirt(true)
        return
      }
      setLoadingModal(true)
      const body: CreateEditAreaType = {
        id: area.id,
        name: area.name,
        numbering: area.numbering,
        parkingSpaces: area.parkingSpaces?? 0,
        points: JSON.stringify(area.points),
        typeNumbering: area.typeNumbering,
        cityId: usuario?.dependency!,
        version: area.version,
      }
      await delay(500)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/areas`,
        method: !!area.id ? 'put' : 'post',
        body: body,
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar area`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingModal(false)
    }
  }

  const handleChangePoligonos = (poligonos: any) => {
    if(poligonos.length > 0){
      setHavePoints(true)
      setValue('points',poligonos)
      const pointsTest = poligonos[0].geometry.coordinates[0]
      let spacesCount = 0
      pointsTest.forEach((p: any, i: number) => {
        if(i === pointsTest.length -1){
          const from = turf.point(p)
          const to = turf.point(pointsTest[0])
          const options: any = { units: 'kilometers' }
          spacesCount = spacesCount + turf.distance(from, to, options)
        } else{
          const from = turf.point(p)
          const to = turf.point(pointsTest[i+1])
          const options: any = { units: 'kilometers' }
          spacesCount = spacesCount + turf.distance(from, to, options)
        }
      })
      spacesCount = (spacesCount * 1000) / 3
      spacesCount = Math.round(spacesCount)
      setValue('parkingSpaces', spacesCount)
    }
    else{
      setValue('parkingSpaces', 0)
      setHavePoints(false)
    }
    setHavePointsDirt(true)
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
                label={t('areas.form.name_of_area')}
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box height={20}></Box>
        {
          !havePoints && havePointsDirt &&
          <Alert severity="error" sx={{mb: 1}}>
            Debes dibujar el area de parqueo correspondiente.
          </Alert>
        }
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <MapaDibujar
                mapRef={mapRef}
                featureGroupRef={featureGroupRef}
                getPoligonos={handleChangePoligonos}
                onlyread={watch('id')? true : false}
                id={`mapa-poligonos-dibujar`}
                key={`mapa-poligonos-dibujar`}
                height={400}
                zoom={zoom}
                centro={centro}
                poligono={{type: 'Feature', properties: {}, geometry: watch('points')? watch('points')[0].geometry : null} as Feature}
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
                name="parkingSpaces"
                label={t('areas.form.spaces')}
                disabled={watch('id')? true: false}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <Checkbox checked={watch('numbering')} 
                disabled={watch('id')? true: false} onChange={(event) => {
                setValue('numbering', event.target.checked)
                if(event.target.checked === false){
                  setValue('typeNumbering', null)
                }
              }}/>
              <Typography variant='body2' sx={{ fontWeight: '500', fontSize: 14, color: 'text.primary' }}>
                {t('areas.form.want_to_list')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Box height={20}></Box>
        {
          watch('numbering') && 
          <Grid container direction={'column'} justifyContent="space-evenly">
            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
              <Grid item xs={12} sm={12} md={12}>
                <FormInputRadio
                  id={'name'}
                  control={control}
                  name="typeNumbering"
                  direccion={'row'}
                  label={t('areas.form.type_numbering')}
                  options={[{label: 'Numeric', value: 'NUMERIC', key: 'NUMERIC'}, {label: 'Alphanumeric', value: 'ALPHANUMERIC', key: 'ALPHANUMERIC'}]}
                  disabled={watch('id')? true: false}
                  rules={{ required: 'Este campo es requerido' }}
                />
              </Grid>
            </Grid>
          </Grid>
        }
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

export default VistaModalAreas