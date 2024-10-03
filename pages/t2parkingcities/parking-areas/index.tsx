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
import { ParkingArea } from "@/modules/t2parkingcities/types/parkinAreaTypes"
import { Schedule } from "@/modules/t2parkingcities/types/scheduleTypes"
import { Subscription } from "@/modules/t2parkingcities/types/subscriptionTypes"
import VistaModalParkingArea from "@/modules/t2parkingcities/ui/VistaModalParkingArea"
import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import dayjs from "dayjs"
import { ReactNode, useEffect, useState } from "react"

const ParkingAreas = () => {

  const { t } = useTranslation()
  const { sesionPeticion } = useSession()
  const { estaAutenticado, usuario } = useAuth()

  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))
  const { Alerta } = useAlerts()

  const [modalParkingArea, setModalParkingArea] = useState<boolean>(false)

  const [openFilters, setOpenFilters] = useState(false)
  // const [filter, setFilter] = useState<PaymentFilterType>({email: '', licensePlate: '', ticket: '', state: ''})
  
  // Variables de páginado
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  
  const [parkingAreas, setParkingAreas] = useState<Array<ParkingArea>>([])
  const [loading, setLoading] = useState(true)
  
  const [errorPaymentsData, setErrorPaymentsData] = useState<any>()

  const obtenerParkingAreasPeticion = async (): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/parking_areas/getAll/${usuario!.dependency}`,
        method: 'get',
      })
      imprimir(`Respuesta estado parametro: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      setParkingAreas(respuesta.data)
      setTotal(respuesta.data.length)
    } catch (e) {
      imprimir(`Error obteniendo areas de parqueo`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'name', nombre: 'Nombre', ordenar: true },
    { campo: 'area', nombre: 'Area', ordenar: true },
    { campo: 'schedules', nombre: 'Horarios', ordenar: true },
    { campo: 'subscriptions', nombre: 'Subscripciones', ordenar: true },
    { campo: 'acciones', nombre: 'Acciones', ordenar: false },
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
      <Grid key={`${parkinAreaData.id}-${indexParking}-acciones`}>
        
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
    if(estaAutenticado) obtenerParkingAreasPeticion().finally(() => {})
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
      key={'filtrar-parking-areas'}
      id={`filtrar-parking-areas`}
      titulo={'Filtrar Parking Areas'}
      color={'primary'}
      accion={() => {
        // setOpenFilters((openFilters: any) => !openFilters)
      }}
      icono={'filter_list'}
      name={'Filtrar PArking Areas'}
    />,
    <IconoBoton
      id={'agregarParqueo'}
      key={'agregarParqueo'}
      texto={t('parking_areas.add')}
      variante={xs ? 'icono' : 'boton'}
      icono={'add_circle_outline'}
      descripcion={t('parking_areas.add')}
      accion={() => {
        setModalParkingArea(true)
      }}
    />
  ]
  return (
    <LayoutUser>
      <CustomDialog
        isOpen={modalParkingArea}
        info={<InfoPopper title={t('help.parking_area.title')} description={t('help.parking_area.description')}/>}
        handleClose={() => {
          setModalParkingArea(false)
        }}
        title={t('parking_areas.add')}
      >
        <VistaModalParkingArea
          accionCorrecta={() => {
            setModalParkingArea(false)
            obtenerParkingAreasPeticion().finally()
          }}
          accionCancelar={() => {
            setModalParkingArea(false)
          }}
        />
      </CustomDialog>
      <CustomDataTable
          titulo={t('parking_areas.title')}
          error={!!errorPaymentsData}
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

export default ParkingAreas