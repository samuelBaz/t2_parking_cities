import { LayoutUser } from "@/common/components/layouts"
import { CustomDataTable, CustomDialog, IconoTooltip } from "@/common/components/ui"
import { IconoBoton } from "@/common/components/ui/botones/IconoBoton"
import InfoPopper from "@/common/components/ui/botones/InfoPopper"
import { CriterioOrdenType } from "@/common/components/ui/datatable/ordenTypes"
import { Paginacion } from "@/common/components/ui/datatable/Paginacion"
import { useAlerts, useSession } from "@/common/hooks"
import { useTranslation } from "@/common/hooks/useTranslation"
import { InterpreteMensajes } from "@/common/utils"
import { imprimir } from "@/common/utils/imprimir"
import { Constantes } from "@/config"
import { useAuth } from "@/context/auth"
import { Area } from "@/modules/t2parkingcities/types/areaTypes"
import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import dayjs from "dayjs"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useMemo, useState } from "react"

const Areas = () => {

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
  
  const [areas, setAreas] = useState<Array<Area>>([])
  const [loading, setLoading] = useState(true)

  const [modalArea, setModalArea] = useState<boolean>(false)
  const [areaAdicion, setAreaEdicion] = useState<Area | null>(null)
  
  const [errorAreaData, setErrorAreaData] = useState<any>()

  const obtenerAreasPeticion = async (): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/areas/getAll/${usuario?.dependency}`,
        method: 'get',
      })
      imprimir(`Respuesta obtener areas: `, respuesta)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      setAreas(respuesta.data.content)
      setTotal(respuesta.data? respuesta.data.totalElements : 0)
    } catch (e) {
      imprimir(`Error obteniendo areas`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
      setErrorAreaData(e)
    } finally {
      setLoading(false)
    }
  }

  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'name', nombre: t('table.name'), ordenar: true },
    { campo: 'spaces', nombre: t('areas.tables.parking_spaces'), ordenar: true },
    { campo: 'typeNumbering', nombre: t('areas.tables.type_numbering'), ordenar: true },
    { campo: 'createdAt', nombre: t('table.createdAt'), ordenar: true },
    { campo: 'acciones', nombre: t('table.actions'), ordenar: false, fija: 150 },
  ])

  const contenidoTabla: Array<Array<ReactNode>> = areas.map(
    (areaData, indexArea) => [
      <Typography
        key={`${areaData.id}-${indexArea}-name`}
        variant={'body2'}
      >{areaData.name}</Typography>,
      <Typography
        key={`${areaData.id}-${indexArea}-description`}
        variant={'body2'}
      >{areaData.parkingSpaces}</Typography>,
      <Typography
        key={`${areaData.id}-${indexArea}-description`}
        variant={'body2'}
      >{areaData.typeNumbering}</Typography>,
      <Typography
        key={`${areaData.id}-${indexArea}-createdAt`}
        variant={'body2'}
      >{dayjs(areaData.createdAt).format('DD/MM/YYYY HH:mm')}</Typography>,
      <Grid key={`${areaData.id}-${indexArea}-acciones`}>
        <IconoTooltip
          key={'editar-areas'}
          id={`editar-areas`}
          titulo={t('areas.edit')}
          color={'primary'}
          accion={() => {
            setAreaEdicion(areaData)
            setModalArea(true)
          }}
          icono={'edit'}
          name={t('areas.edit')}
        />
        <IconoTooltip
          key={'editar-spaces'}
          id={`editar-spaces`}
          titulo={t('areas.form.spaces')}
          color={'primary'}
          accion={() => {
            router.push(`areas/${areaData.id}/spaces`)
          }}
          icono={'workspaces'}
          name={t('areas.form.spaces')}
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
    if(estaAutenticado) obtenerAreasPeticion().finally(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    estaAutenticado,
    pagina,
    limite,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(ordenCriterios)
  ])

  const acciones: Array<ReactNode> = [
    <IconoTooltip
      key={'refresh-areas'}
      id={`refresh-areas`}
      titulo={'Actualizar Areas'}
      color={'primary'}
      accion={() => {
        obtenerAreasPeticion()
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
      name={'Filtrar areas'}
    />,
    <IconoBoton
      id={'agregarVehiculo'}
      key={'agregarvehiculo'}
      texto={t('areas.add')}
      variante={xs ? 'icono' : 'boton'}
      icono={'add_circle_outline'}
      descripcion={t('areas.add')}
      accion={() => {
        setModalArea(true)
      }}
    />
  ]

  const cerrarModalArea = async () => {
    setModalArea(false)
    setAreaEdicion(null)
  }

  const VistaModalAreas = useMemo(
    () =>
      dynamic(() => import('./../../../../modules/t2parkingcities/ui/VistaModalAreas'), {
        ssr: false,
      }),
    []
  )

  return (
    <LayoutUser>
      <CustomDialog
        isOpen={modalArea}
        info={<InfoPopper title={t('help.area.title')} description={t('help.area.description')}/>}
        handleClose={cerrarModalArea}
        title={areaAdicion ? t('areas.edit') : t('areas.add')}
      >
        <VistaModalAreas
          area={areaAdicion}
          accionCorrecta={() => {
            cerrarModalArea().finally()
            obtenerAreasPeticion().finally()
          }}
          accionCancelar={cerrarModalArea}
        />
      </CustomDialog>
      <CustomDataTable
          titulo={t('parking_areas.areas')}
          error={!!errorAreaData}
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

export default Areas