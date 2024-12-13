import { LayoutUser } from "@/common/components/layouts"
import { CustomDataTable, CustomDialog, IconoTooltip } from "@/common/components/ui"
import { IconoBoton } from "@/common/components/ui/botones/IconoBoton"
import { CriterioOrdenType } from "@/common/components/ui/datatable/ordenTypes"
import { Paginacion } from "@/common/components/ui/datatable/Paginacion"
import { useAlerts, useSession } from "@/common/hooks"
import { useTranslation } from "@/common/hooks/useTranslation"
import { InterpreteMensajes } from "@/common/utils"
import { imprimir } from "@/common/utils/imprimir"
import { Constantes } from "@/config"
import { useAuth } from "@/context/auth"
import { Commission } from "@/modules/configuracion/types/configurationCRUDTypes"
import { CityCRUDType } from "@/modules/system_admin/types/citiesCRUDTypes"
import VistaModalConfigCommission from "@/modules/system_admin/ui/VistaModalConfigCommission"
import { ParkingArea } from "@/modules/t2parkingcities/types/parkinAreaTypes"
import { Schedule } from "@/modules/t2parkingcities/types/scheduleTypes"
import { Subscription } from "@/modules/t2parkingcities/types/subscriptionTypes"
import { UserCRUDTypes } from "@/modules/users/types/UserTypes"
import VistaModalUserDistributor from "@/modules/users/ui/VistaModalUserDistributor"
import { Breadcrumbs, Divider, Grid, Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material"
import dayjs from "dayjs"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"

const CityDetail = () => {

  const { t } = useTranslation()
  const { sesionPeticion } = useSession()
  const { estaAutenticado } = useAuth()

  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))
  const { Alerta } = useAlerts()

  const [modalConfig, setModalConfig] = useState<boolean>(false)
  const router = useRouter()
  const [reload, setReload] = useState<boolean>(false)
  const [city, setCity] = useState<string | null>(null)
  const [cityData, setCityData] = useState<CityCRUDType | null>(null)
  const [commission, setCommission] = useState<Commission | null>(null)

  // Variables de páginado
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  
  const [loading, setLoading] = useState(true)
  const [loadingCity, setLoadingCity] = useState(true)
  const [parkingAreas, setParkingAreas] = useState<Array<ParkingArea>>([])
  
  const [errorParkingsData, setErrorParkingsData] = useState<any>()

  const obtenerAlcaldiaPeticion = async (): Promise<void> => {
    try {
      setLoadingCity(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/cities/${city}`,
        method: 'get',
      })
      setCityData(respuesta.data)
    } catch (e) {
      imprimir(`Error obteniendo la alcaldia`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingCity(false)
    }
  }

  const obtenerConfiguracionAlcaldiaPeticion = async (): Promise<void> => {
    try {
      setLoadingCity(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/city_configurations/byCityId/${city}`,
        method: 'get',
      })
      setCommission(respuesta.data.commission)
    } catch (e) {
      imprimir(`Error obteniendo la alcaldia`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingCity(false)
    }
  }

  const obtenerParkingAreasPeticion = async (): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/parking_areas/getAll/${city}`,
        method: 'get',
      })
      imprimir(`Respuesta estado parametro: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      setParkingAreas(respuesta.data.content)
      setTotal(respuesta.data.totalElements)
    } catch (e) {
      imprimir(`Error obteniendo areas de parqueo`, e)
      setErrorParkingsData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'name', nombre: t('table.name'), ordenar: true },
    { campo: 'area', nombre: t('parking_areas.tables.area'), ordenar: true },
    { campo: 'schedules', nombre: t('parking_areas.tables.schedules'), ordenar: true },
    { campo: 'subscriptions', nombre: t('parking_areas.tables.subscriptions'), ordenar: true },
    { campo: 'createdAt', nombre: t('table.createdAt'), ordenar: true },
  ])

  const contenidoTabla: Array<Array<ReactNode>> = parkingAreas.map(
    (parkinAreaData, indexParking) => [
      <Typography
        key={`${parkinAreaData.id}-${indexParking}-email`}
        variant={'body2'}
      >{parkinAreaData.name}</Typography>,
      <Typography
        key={`${parkinAreaData.id}-${indexParking}-plate`}
        variant={'body2'}
      >{parkinAreaData.areaName}</Typography>,
      <Typography
        key={`${parkinAreaData.id}-${indexParking}-idTicket`}
        variant={'body2'}
      >{parkinAreaData.schedules.map((schedule : Schedule) => schedule.name).toString()}</Typography>,
      <Typography
        key={`${parkinAreaData.id}-${indexParking}-state`}
        variant={'body2'}
      >{parkinAreaData.subscriptions.map((subscription: Subscription) => subscription.name).toString()}</Typography>,
      <Typography
        key={`${parkinAreaData.id}-${indexParking}-createdAt`}
        variant={'body2'}
      >{dayjs(parkinAreaData.createdAt).format('DD/MM/YYYY')}</Typography>
    ]
  )

  const paginacion = (
    <Paginacion
      pagina={pagina}
      limite={limite}
      total={total}
      cambioPagina={setPagina}
      cambioLimite={setLimite}
    />
  )

  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query
      if (id === undefined) {
        router.back()
      }
      setCity(id! as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    router.isReady,
    router.query.id
  ])

  useEffect(() => {
    if (city && estaAutenticado) {
      obtenerAlcaldiaPeticion().finally(() => {})
      obtenerConfiguracionAlcaldiaPeticion()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    city,
    estaAutenticado
  ])

  useEffect(() => {
    if (city) {
      if(estaAutenticado) obtenerParkingAreasPeticion().finally(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    city,
    estaAutenticado,
    pagina,
    limite,
    reload,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(ordenCriterios),
  ])

  const acciones: Array<ReactNode> = [
    <IconoTooltip
      key={'refresh-users'}
      id={`refresh-users`}
      titulo={'Actualizar Areas de Parqueo'}
      color={'primary'}
      accion={() => {
        // obtenerUsuariosPeticion(dependency!)
      }}
      icono={'refresh'}
      name={'Actualizar Areas de Parqueo'}
    />,
    <IconoTooltip
      key={'filtrar-users'}
      id={`filtrar-users`}
      titulo={'Filtrar Areas de Parqueo'}
      color={'primary'}
      accion={() => {
        // setOpenFilters((openFilters: any) => !openFilters)
      }}
      icono={'filter_list'}
      name={'Filtrar Areas de Parqueo'}
    />,
    <IconoBoton
      id={'agregarUsuario'}
      key={'agregarUsuario'}
      texto={t('cities.config_commission')}
      variante={xs ? 'icono' : 'boton-icono'}
      iconColor="inherit"
      icono={'settings'}
      descripcion={t('cities.config_commission')}
      accion={() => {
        setModalConfig(true)
      }}
    />
  ]
  return (
    <LayoutUser>
      <CustomDialog
        isOpen={modalConfig}
        handleClose={() => {
          setModalConfig(false)
        }}
        title={t('cities.config_commission')}
      >
        <VistaModalConfigCommission
          commission={commission}
          accionCorrecta={() => {
            setModalConfig(false)
            obtenerConfiguracionAlcaldiaPeticion()
          }}
          accionCancelar={() => {
            setModalConfig(false)
          }}
        />
      </CustomDialog>
      <Breadcrumbs aria-label="breadcrumb" separator={'-'}>
        <Typography
          sx={{ display: 'flex', alignItems: 'center' }}
          variant='body2'
          fontWeight={500}
          fontSize={14}
          // color={theme.palette.primary.main}
        >
          {t('cities.cities')}
        </Typography>
        <Typography
          sx={{ display: 'flex', alignItems: 'center' }}
          variant='body2'
          fontWeight={500}
          fontSize={14}
          color={theme.palette.primary.main}
        >
          {
            loadingCity ?
              <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: 100 }} animation="wave" /> :
              cityData?.name
          }
        </Typography>
      </Breadcrumbs>
      <Divider sx={{ my: 1 }} />
      <CustomDataTable
          cabeceraPersonalizada={
            <Grid container direction={'row'} justifyContent={'space-between'}>
              <Grid item>
                {
                  loadingCity ?
                    <Skeleton variant="text" sx={{ fontSize: '2.2rem', width: 100 }} animation="wave" /> :
                    <>
                      <Typography variant={'h5'} sx={{ fontWeight: '600' }}>
                        {cityData?.name}
                      </Typography>
                    </>
                }
                <Typography sx={{ pt: 1 }} fontSize={15}>
                  {t('parking_areas.title')}
                </Typography>
              </Grid>
              <Grid item>
                {acciones}
              </Grid>
            </Grid>
          }
          error={!!errorParkingsData}
          cargando={loading}
          acciones={acciones}
          columnas={ordenCriterios}
          cambioOrdenCriterios={setOrdenCriterios}
          paginacion={paginacion}
          contenidoTabla={contenidoTabla}
          filtros={
            null
            // openFilters && (
            //   <PaymentFilter
            //     accionCorrecta={(filtro) =>{
            //       setPagina(1)
            //       setLimite(10)
            //       setFilter(filtro)}
            //     }/>
            // )
          }
        />
    </LayoutUser>
  )
}

export default CityDetail