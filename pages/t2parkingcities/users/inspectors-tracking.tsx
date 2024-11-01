import { LayoutUser } from "@/common/components/layouts"
import { FormInputDate, optionType } from "@/common/components/ui/form"
import { FormInputAutocomplete } from "@/common/components/ui/form/FormInputAutocomplete"
import { useAlerts, useSession } from "@/common/hooks"
import { useTranslation } from "@/common/hooks/useTranslation"
import { InterpreteMensajes } from "@/common/utils"
import { Constantes } from "@/config"
import { useAuth } from "@/context/auth"
import { UserCRUDTypes } from "@/modules/users/types/UserTypes"
import { Box, Button, Grid, Typography } from "@mui/material"
import { Feature } from "geojson"
import { FeatureGroup, Map } from "leaflet"
import dynamic from "next/dynamic"
import Image from "next/image"
import { createRef, useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"

const InspectorsTracking = () => {
  
  const { t } = useTranslation()
  const { sesionPeticion } = useSession()
  const { estaAutenticado, usuario } = useAuth()
  const { Alerta } = useAlerts()

  const { control } = useForm()

  
  const featureGroupRef = useRef<FeatureGroup | null>(null)
  const mapRef = createRef<Map>()
  
  
  const [zoom, setZoom] = useState<number | undefined>(15)
  const [centro, setCentro] = useState<number[] | undefined>()
  const [inspectors, setInspectors] = useState<Array<optionType>>([])
  const [loading, setLoading] = useState<boolean>(true)

  const MapaDibujar = useMemo(
    () =>
      dynamic(() => import('@/common/components/ui/mapas/MapaDibujar'), {
        ssr: false,
      }),
    []
  )

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

  const obtenerInspectoresPeticion = async (): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/users/getAllInspectors/${usuario!.dependency}`,
        method: 'get',
      })
      if(respuesta.data.content){
        setInspectors(
          respuesta.data.content.map((inspector: UserCRUDTypes) => {
            return {key: inspector.id.toString(), value: inspector.id.toString(), label: inspector.email}
          })
        )
      }
    } catch (e) {
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    obtenerInspectoresPeticion()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  return (
    <LayoutUser>
      <Grid container direction={'column'}>
        <Grid item xs={12}>
          <Typography variant={'h5'} sx={{ fontWeight: '600' }}>
            {t('inspectors.tracking')}
          </Typography>
        </Grid>
        <Grid item xs={12} marginY={2}>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <FormInputDate
                id=""
                name=""
                label="Fecha de busqueda"
                control={control}
              />
            </Grid>
            <Grid item xs={3}>
              <FormInputAutocomplete
                id=""
                name=""
                label="Inspectores"
                control={control}
                multiple
                options={inspectors}
              />
            </Grid>

          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={9}>
              <MapaDibujar
                mapRef={mapRef}
                featureGroupRef={featureGroupRef}
                // getPoligonos={handleChangePoligonos}
                onlyread={true}
                id={`mapa-poligonos-dibujar`}
                key={`mapa-poligonos-dibujar`}
                height={600}
                zoom={zoom}
                centro={centro}
                poligono={null}
                // poligono={{type: 'Feature', properties: {}, geometry: watch('points')? watch('points')[0].geometry : null} as Feature}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant={'h6'} sx={{ fontWeight: '600' }} textAlign={'center'} mb={2}>
                App Inspectores
              </Typography>
              {
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/app.svg" alt="App Download" style={{width: '100%'}} />
              }
              <Grid container alignContent={'center'} justifyContent={'center'} direction={'column'}>
                <Box
                  height={35}
                  mb={2}
                  component="img"
                  src="/logo.png"
                  alt="T2 Cities"
                />
                <Button 
                  variant="contained" 
                  href='https://docs.google.com/uc?export=download&id=1fwwBLauPJU9MoUyQBEbS4IQIKSifkRwo' 
                  target="_blank" 
                  rel="noopener noreferrer">
                  Descargar APP
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </LayoutUser>
  )
}

export default InspectorsTracking