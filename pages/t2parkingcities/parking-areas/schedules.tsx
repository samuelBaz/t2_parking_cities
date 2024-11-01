import { LayoutUser } from "@/common/components/layouts"
import { CustomDataTable, CustomDialog, IconoTooltip } from "@/common/components/ui"
import { IconoBoton } from "@/common/components/ui/botones/IconoBoton"
import InfoPopper from "@/common/components/ui/botones/InfoPopper"
import { CriterioOrdenType } from "@/common/components/ui/datatable/ordenTypes"
import { Paginacion } from "@/common/components/ui/datatable/Paginacion"
import { optionType } from "@/common/components/ui/form"
import { useAlerts, useSession } from "@/common/hooks"
import { useTranslation } from "@/common/hooks/useTranslation"
import { InterpreteMensajes } from "@/common/utils"
import { imprimir } from "@/common/utils/imprimir"
import { Constantes } from "@/config"
import { useAuth } from "@/context/auth"
import { Currency, Schedule, Vehicle } from "@/modules/t2parkingcities/types/scheduleTypes"
import VistaModalSchedules from "@/modules/t2parkingcities/ui/VistaModalSchedules"
import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import dayjs from "dayjs"
import { ReactNode, useEffect, useMemo, useState } from "react"

const Schedules = () => {

  const { t } = useTranslation()
  const { sesionPeticion } = useSession()
  const { estaAutenticado, usuario } = useAuth()
  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  const { Alerta } = useAlerts()

  const [openFilters, setOpenFilters] = useState(false)
  // const [filter, setFilter] = useState<PaymentFilterType>({email: '', licensePlate: '', ticket: '', state: ''})
  
  // Variables de páginado
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  
  const [schedules, setSchedules] = useState<Array<Schedule>>([])
  const [currencies, setCurrencies] = useState<Array<optionType>>([])
  const [vehicles, setVehicles] = useState<Array<optionType>>([])
  const [loading, setLoading] = useState(true)

  const [modalSchedule, setModalSchedule] = useState<boolean>(false)
  const [scheduleEdicion, setScheduleEdicion] = useState<Schedule | null>(null)
  
  const [errorScheduleData, setErrorScheduleData] = useState<any>()

  const obtenerSchedulesPeticion = async (): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/schedules/getAll/${usuario?.dependency}`,
        method: 'get',
      })
      imprimir(`Respuesta obtener areas: `, respuesta)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      setSchedules(respuesta.data.content)
      setTotal(respuesta.data? respuesta.data.totalElements : 0)
    } catch (e) {
      imprimir(`Error obteniendo areas`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
      setErrorScheduleData(e)
    } finally {
      setLoading(false)
    }
  }

  const obtenerCurrenciesPeticion = async (): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/currencies`,
        method: 'get',
      })
      imprimir(`Respuesta obtener monedas: `, respuesta)
      if(respuesta.data.content){
        setCurrencies(
          respuesta.data.content.map((currency: Currency) => {
            return { label: currency.name, key: currency.id.toString(), value: currency.id.toString()} as optionType
          })
        )
      }
    } catch (e) {
      imprimir(`Error obteniendo monedas`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const obtenerVehiclesPeticion = async (): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/vehicles`,
        method: 'get',
      })
      imprimir(`Respuesta obtener vehiculos: `, respuesta)
      if(respuesta.data.content){
        setVehicles(
          respuesta.data.content.map((vehicle: Vehicle) => {
            return { label: vehicle.name, key: vehicle.id.toString(), value: vehicle.id.toString()} as optionType
          })
        )
      }
    } catch (e) {
      imprimir(`Error obteniendo vehiculos`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'name', nombre: t('schedules.tables.name'), ordenar: true },
    { campo: 'days', nombre: t('schedules.tables.days'), ordenar: true },
    { campo: 'hours', nombre: t('schedules.tables.hours'), ordenar: true },
    { campo: 'minimumTime', nombre: t('schedules.tables.minimum_time'), ordenar: true },
    { campo: 'vehicles', nombre: t('schedules.tables.vehicles'), ordenar: true },
    { campo: 'createdAt', nombre: t('table.createdAt'), ordenar: true },
    { campo: 'acciones', nombre: t('table.actions'), ordenar: false },
  ])

  const contenidoTabla: Array<Array<ReactNode>> = schedules.map(
    (scheduleData, indexSchedule) => [
      <Typography
        key={`${scheduleData.id}-${indexSchedule}-name`}
        variant={'body2'}
      >{scheduleData.name}</Typography>,
      <Typography
        key={`${scheduleData.id}-${indexSchedule}-days`}
        variant={'body2'}
      >{scheduleData.days.map(day => t(`days.${day}`)).toString()}</Typography>,
      <Typography
        key={`${scheduleData.id}-${indexSchedule}-hours`}
        variant={'body2'}
      >{ (scheduleData.startHour? dayjs(dayjs().format('YYYY-MM-DD') + scheduleData.startHour).format('HH:mm'): '') + ' to ' + (scheduleData.endHour? dayjs(dayjs().format('YYYY-MM-DD') + scheduleData.endHour).format('HH:mm'): '') }</Typography>,
      <Typography
        key={`${scheduleData.id}-${indexSchedule}-minimum-time`}
        variant={'body2'}
      >{ scheduleData.minimumTime + ' Minutes'}</Typography>,
      <Typography
        key={`${scheduleData.id}-${indexSchedule}-vehicles`}
        variant={'body2'}
      >{scheduleData.vehicles.map(vehicle => vehicle.name).toString()}</Typography>,
      <Typography
        key={`${scheduleData.id}-${indexSchedule}-createdAt`}
        variant={'body2'}
      >{dayjs(scheduleData.createdAt).format('DD/MM/YYYY HH:mm')}</Typography>,
      <Grid key={`${scheduleData.id}-${indexSchedule}-acciones`}>
        <IconoTooltip
          key={'editar-areas'}
          id={`editar-areas`}
          titulo={'Editar Area'}
          color={'primary'}
          accion={() => {
            setScheduleEdicion(scheduleData)
            setModalSchedule(true)
          }}
          icono={'edit'}
          name={'Editar Area'}
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
    if(estaAutenticado) obtenerSchedulesPeticion().finally(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    estaAutenticado,
    pagina,
    limite,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(ordenCriterios)
  ])

  useEffect(() => {
    if(estaAutenticado){
      obtenerCurrenciesPeticion().finally(() => {})
      obtenerVehiclesPeticion().finally(() => {})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    estaAutenticado
  ])

  const acciones: Array<ReactNode> = [
    <IconoTooltip
      key={'refresh-schedules'}
      id={`refresh-schedules`}
      titulo={'Actualizar Horarios'}
      color={'primary'}
      accion={() => {
        obtenerSchedulesPeticion()
      }}
      icono={'refresh'}
      name={'Actualizar Horarios'}
    />,
    <IconoTooltip
      key={'filtrar-areas'}
      id={`filtrar-areas`}
      titulo={'Filtrar horarios'}
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
      texto={t('schedules.add')}
      variante={xs ? 'icono' : 'boton'}
      icono={'add_circle_outline'}
      descripcion={t('areas.add')}
      accion={() => {
        setModalSchedule(true)
      }}
    />
  ]

  const cerrarModalArea = async () => {
    setModalSchedule(false)
    setScheduleEdicion(null)
  }

  return (
    <LayoutUser>
      <CustomDialog
        isOpen={modalSchedule}
        info={<InfoPopper title={t('help.schedule.title')} description={t('help.schedule.description')}/>}
        handleClose={cerrarModalArea}
        title={scheduleEdicion ? t('schedules.edit') : t('schedules.add')}
      >
        <VistaModalSchedules
          schedule={scheduleEdicion}
          vehicles={vehicles}
          currencies={currencies}
          accionCorrecta={() => {
            cerrarModalArea().finally()
            obtenerSchedulesPeticion().finally()
          }}
          accionCancelar={cerrarModalArea}
        />
      </CustomDialog>
      <CustomDataTable
          titulo={t('parking_areas.schedules')}
          error={!!errorScheduleData}
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

export default Schedules