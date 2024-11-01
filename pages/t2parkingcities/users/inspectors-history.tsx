import { LayoutUser } from "@/common/components/layouts"
import { CustomDataTable, IconoTooltip } from "@/common/components/ui"
import { CriterioOrdenType } from "@/common/components/ui/datatable/ordenTypes"
import { Paginacion } from "@/common/components/ui/datatable/Paginacion"
import { useAlerts, useSession } from "@/common/hooks"
import { useTranslation } from "@/common/hooks/useTranslation"
import { InterpreteMensajes } from "@/common/utils"
import { imprimir } from "@/common/utils/imprimir"
import { Constantes } from "@/config"
import { useAuth } from "@/context/auth"
import { InspectorEventCRUDTypes } from "@/modules/users/types/inspectorEventTypes"
import { Typography, useMediaQuery, useTheme } from "@mui/material"
import dayjs from "dayjs"
import { ReactNode, useEffect, useState } from "react"

const InspectorsHistory = () => {

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
  
  const [events, setEvents] = useState<Array<InspectorEventCRUDTypes>>([])
  const [loading, setLoading] = useState(true)
  
  const [errorUsersData, setErrorUsersData] = useState<any>()

  
  const obtenerInspectoresEventHistoryPeticion = async (): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/inspector_events/getAll/${usuario!.dependency}`,
        method: 'get',
      })
      imprimir(`Respuesta peticion eventos inspectores: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      setEvents(respuesta.data.content)
      setTotal(respuesta.data.totalElements)
    } catch (e) {
      imprimir(`Error obteniendo eventos de los inspectores`, e)
      setErrorUsersData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'description', nombre: t('inspectors.events.table.description'), ordenar: true },
    { campo: 'type', nombre: t('inspectors.events.table.type'), ordenar: true },
    { campo: 'plate', nombre: t('inspectors.events.table.vehicle_plate'), ordenar: true },
    { campo: 'createdAt', nombre: t('table.createdAt'), ordenar: true },
    // { campo: 'acciones', nombre: 'Acciones', ordenar: false },
  ])

  const contenidoTabla: Array<Array<ReactNode>> = events.map(
    (eventData, indexEvent) => [
      <Typography
        key={`${eventData.id}-${indexEvent}-description`}
        variant={'body2'}
      >{eventData.description}</Typography>,
      <Typography
        key={`${eventData.id}-${indexEvent}-type`}
        variant={'body2'}
      >{eventData.typeEvent}</Typography>,
      <Typography
        key={`${eventData.id}-${indexEvent}-plate`}
        variant={'body2'}
      >{eventData.plate}</Typography>,
      <Typography
        key={`${eventData.id}-${indexEvent}-idTicket`}
        variant={'body2'}
      >{eventData.createdAt ? dayjs(eventData.createdAt).format('DD/MM/YYYY HH:mm'): ''}</Typography>,
      // <Grid key={`${eventData.id}-${indexEvent}-acciones`}>
        
      // </Grid>
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
    if(estaAutenticado) obtenerInspectoresEventHistoryPeticion().finally(() => {})
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
      key={'refresh-inspectors-h'}
      id={`refresh-inspectors-h`}
      titulo={'Actualizar Historial de Inspectores'}
      color={'primary'}
      accion={() => {
        obtenerInspectoresEventHistoryPeticion()
      }}
      icono={'refresh'}
      name={'Actualizar Historial de Inspectores'}
    />,
    <IconoTooltip
      key={'filtrar-eventos'}
      id={`filtrar-users`}
      titulo={'Filtrar Eventos'}
      color={'primary'}
      accion={() => {
        // setOpenFilters((openFilters: any) => !openFilters)
      }}
      icono={'filter_list'}
      name={'Filtrar Eventos'}
    />,
    // <IconoBoton
    //   id={'agregarUsuario'}
    //   key={'agregarUsuario'}
    //   texto={t('inspectors.add')}
    //   variante={xs ? 'icono' : 'boton'}
    //   icono={'add_circle_outline'}
    //   descripcion={t('inspectors.add')}
    //   accion={() => {
    //     setModalUser(true)
    //   }}
    // />
  ]
  
  return (
    <LayoutUser>
      <CustomDataTable
          titulo={t('inspectors.events.history')}
          error={!!errorUsersData}
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

export default InspectorsHistory
