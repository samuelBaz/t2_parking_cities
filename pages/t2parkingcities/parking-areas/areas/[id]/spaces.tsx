import { LayoutUser } from "@/common/components/layouts"
import { CustomDataTable, CustomDialog, IconoTooltip } from "@/common/components/ui"
import InfoPopper from "@/common/components/ui/botones/InfoPopper"
import { CriterioOrdenType } from "@/common/components/ui/datatable/ordenTypes"
import { Paginacion } from "@/common/components/ui/datatable/Paginacion"
import { useAlerts, useSession } from "@/common/hooks"
import { useTranslation } from "@/common/hooks/useTranslation"
import { InterpreteMensajes } from "@/common/utils"
import { imprimir } from "@/common/utils/imprimir"
import { Constantes } from "@/config"
import { useAuth } from "@/context/auth"
import { Space } from "@/modules/t2parkingcities/types/areaTypes"
import VistaModalSpaces from "@/modules/t2parkingcities/ui/VistaModalSpaces"
import { Breadcrumbs, Divider, Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import dayjs from "dayjs"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"

const AreaSpaces = () => {

  const { t } = useTranslation()
  const { sesionPeticion } = useSession()
  const { estaAutenticado, usuario } = useAuth()
  const router = useRouter()
  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  const { Alerta } = useAlerts()

  const [openFilters, setOpenFilters] = useState(false)
  // const [filter, setFilter] = useState<PaymentFilterType>({email: '', licensePlate: '', ticket: '', state: ''})
  
  // Variables de páginado
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  
  const [area, setArea] = useState<string | null>(null)
  const [spaces, setSpaces] = useState<Array<Space>>([])
  const [loading, setLoading] = useState(true)

  const [modalSpace, setModalSpace] = useState<boolean>(false)
  const [spaceEdicion, setSpaceEdicion] = useState<Space | null>(null)
  
  const [errorSpaceData, setErrorSpaceData] = useState<any>()

  const obtenerAreasSpacesPeticion = async (id: string | string[]): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/spaces/byAreaId/${id}`,
        method: 'get',
        params: {
          size: limite,
          page: pagina - 1
        }
      })
      imprimir(`Respuesta obtener spaces: `, respuesta)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      setSpaces(respuesta.data.content)
      setTotal(respuesta.data? respuesta.data.totalElements : 0)
    } catch (e) {
      imprimir(`Error obteniendo areas`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
      setErrorSpaceData(e)
    } finally {
      setLoading(false)
    }
  }

  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'name', nombre: t('areas.tables.name'), ordenar: true },
    { campo: 'sensor', nombre: t('areas.tables.sensor'), ordenar: true },
    { campo: 'geolocalization', nombre: t('areas.tables.geolocalization'), ordenar: true },
    { campo: 'createdAt', nombre: t('table.createdAt'), ordenar: true },
    { campo: 'acciones', nombre: t('table.actions'), ordenar: false, fija: 150 },
  ])

  const contenidoTabla: Array<Array<ReactNode>> = spaces.map(
    (spaceData, indexSpace) => [
      <Typography
        key={`${spaceData.id}-${indexSpace}-name`}
        variant={'body2'}
      >{spaceData.name}</Typography>,
      <Typography
        key={`${spaceData.id}-${indexSpace}-sensor`}
        variant={'body2'}
      >{spaceData.sensorId? spaceData.sensorId : 'No assigned'}</Typography>,
      <Typography
        key={`${spaceData.id}-${indexSpace}-geolocalization`}
        variant={'body2'}
      >{spaceData.latitude && spaceData.longitude ? `${spaceData.latitude}, ${spaceData.longitude}`: '---, ---'}</Typography>,
      <Typography
        key={`${spaceData.id}-${indexSpace}-createdAt`}
        variant={'body2'}
      >{dayjs(spaceData.createdAt).format('DD/MM/YYYY HH:mm')}</Typography>,
      <Grid key={`${spaceData.id}-${indexSpace}-acciones`}>
        <IconoTooltip
          key={'editar-space'}
          id={`editar-space`}
          titulo={t('spaces.edit')}
          color={'primary'}
          accion={() => {
            setSpaceEdicion(spaceData)
            setModalSpace(true)
          }}
          icono={'edit'}
          name={t('spaces.edit')}
        />
      </Grid>
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
      setArea(id! as string)
      if(estaAutenticado) obtenerAreasSpacesPeticion(id!).finally(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    router.isReady,
    router.query.id,
    estaAutenticado,
    pagina,
    limite,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(ordenCriterios),
  ])

  const acciones: Array<ReactNode> = [
    <IconoTooltip
      key={'refresh-areas'}
      id={`refresh-areas`}
      titulo={'Actualizar Plazas'}
      color={'primary'}
      accion={() => {
        obtenerAreasSpacesPeticion(area!)
      }}
      icono={'refresh'}
      name={'Actualizar Areas'}
    />,
    <IconoTooltip
      key={'filtrar-areas'}
      id={`filtrar-areas`}
      titulo={'Filtrar areas'}
      color={'primary'}
      accion={() => {
        // setOpenFilters((openFilters: any) => !openFilters)
      }}
      icono={'filter_list'}
      name={'Filtrar Plazas'}
    />
  ]

  const cerrarModalSpace = async () => {
    setModalSpace(false)
    setSpaceEdicion(null)
  }

  return (
    <LayoutUser>
      <CustomDialog
        isOpen={modalSpace}
        info={<InfoPopper title={t('help.parking_space.title')} description={t('help.parking_space.description')}/>}
        handleClose={cerrarModalSpace}
        title={t('spaces.edit')}
      >
        <VistaModalSpaces
          space={spaceEdicion}
          accionCorrecta={() => {
            cerrarModalSpace().finally()
            obtenerAreasSpacesPeticion(area!).finally()
          }}
          accionCancelar={cerrarModalSpace}
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
          {t('parking_areas.areas')}
        </Typography>
        <Typography
          sx={{ display: 'flex', alignItems: 'center' }}
          variant='body2'
          fontWeight={500}
          fontSize={14}
          color={theme.palette.primary.main}
        >
          {t('areas.form.spaces')}
        </Typography>
      </Breadcrumbs>
      <Divider sx={{ my: 1 }} />
      <CustomDataTable
          titulo={t('areas.form.spaces')}
          error={!!errorSpaceData}
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

export default AreaSpaces