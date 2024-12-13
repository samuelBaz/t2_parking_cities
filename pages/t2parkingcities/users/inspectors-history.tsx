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
import VistaModalEvents from "@/modules/users/ui/VistaModalEvents"
import { EventReview, EventStatus, InspectorEventCRUDTypes } from "@/modules/users/types/inspectorEventTypes"
import { Button, Chip, Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import dayjs from "dayjs"
import { ReactNode, useEffect, useState } from "react"
import VistaModalDetailEvents from "@/modules/users/ui/VistaModalDetailEvents"
import { AlertDialogWithComment } from "@/common/components/ui/modales/AlertDialogWithComment"
import { LoadingButton } from "@mui/lab"

const InspectorsHistory = () => {

  const { t } = useTranslation()
  const { sesionPeticion } = useSession()
  const { estaAutenticado, usuario } = useAuth()

  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))
  const { Alerta } = useAlerts()

  const [modalEvent, setModalEvent] = useState<boolean>(false)
  const [modalEventDetail, setModalEventDetail] = useState<boolean>(false)
  const [mostrarAlertaValidar, setMostrarAlertaValidar] = useState<boolean>(false)
  const [mostrarAlertaCancelar, setMostrarAlertaCancelar] = useState<boolean>(false)
  const [eventDetailData, setEventDetailData] = useState<InspectorEventCRUDTypes | null>(null)
  const [openFilters, setOpenFilters] = useState<boolean>(false)
  // const [filter, setFilter] = useState<PaymentFilterType>({email: '', licensePlate: '', ticket: '', state: ''})

  
  // Variables de páginado
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  
  const [events, setEvents] = useState<Array<InspectorEventCRUDTypes>>([])
  const [loading, setLoading] = useState(true)
  const [loadingRevision, setLoadingRevision] = useState(false)
  
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

  const actualizarRevisionPeticion = async (status: EventStatus, comment: string): Promise<void> => {
    try {
      setLoadingRevision(true)
      const review: EventReview = {
        id: eventDetailData?.eventReview.id,
        comment: comment,
        eventStatus: status,
        reviewerId: usuario?.id,
        version: eventDetailData?.eventReview?.version
      } as EventReview

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/event_reviews`,
        method: 'put',
        body: review
      })
      imprimir(`Respuesta petición revision eventos : ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
    } catch (e) {
      imprimir(`Error revisando el evento`, e)
      setErrorUsersData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingRevision(false)
    }
  }

  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'description', nombre: t('inspectors.events.table.description'), ordenar: true },
    { campo: 'type', nombre: t('inspectors.events.table.type'), ordenar: true },
    { campo: 'plate', nombre: t('inspectors.events.table.vehicle_plate'), ordenar: true },
    { campo: 'createdAt', nombre: t('table.createdAt'), ordenar: true },
    { campo: 'status', nombre: t('inspectors.events.table.review_status'), ordenar: true },
    { campo: 'acciones', nombre: t('table.actions'), ordenar: false },
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
        key={`${eventData.id}-${indexEvent}-createdAt`}
        variant={'body2'}
      >{eventData.createdAt ? dayjs(eventData.createdAt).format('DD/MM/YYYY HH:mm'): ''}</Typography>,
      <Typography
        key={`${eventData.id}-${indexEvent}-status`}
        variant={'body2'}
      >{
        (() => {
          switch (eventData.eventReview.eventStatus) {
            case EventStatus.PENDING:
              return <Chip color="warning" label={EventStatus.PENDING} variant="outlined" size="small" />
            case EventStatus.CANCEL:
              return <Chip color="error" label={EventStatus.CANCEL} variant="outlined" size="small" />
            case EventStatus.VALID:
              return <Chip color="success" label={EventStatus.VALID} variant="outlined" size="small" />
            default:
              return null
          }
        })()
        }
      </Typography>,
      <Grid key={`${eventData.id}-${indexEvent}-acciones`}>
        <IconoTooltip
          accion={() => {
            setEventDetailData(eventData)
            setModalEventDetail(true)
          }}
          icono="visibility"
          id="ver-acciones"
          titulo={t('detail')}
          name="ver-acciones"
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
    estaAutenticado && usuario?.rol === 'INSPECTOR' && 
    <IconoBoton
      id={'agregarEvento'}
      key={'agregarEvento'}
      texto={t('inspectors.events.new_penalty')}
      variante={xs ? 'icono' : 'boton'}
      icono={'add_circle_outline'}
      descripcion={t('inspectors.events.new_penalty')}
      accion={() => {
        setModalEvent(true)
      }}
    />
  ]
  
  return (
    <LayoutUser>
      <CustomDialog
        isOpen={modalEvent}
        handleClose={() => {
          setModalEvent(false)
        }}
        info={<InfoPopper title={t('help.inspector.title')} description={t('help.inspector.description')}/>}
        title={t('inspectors.events.new_penalty')}
      >
        <VistaModalEvents
          accionCorrecta={() => {
            obtenerInspectoresEventHistoryPeticion().finally()
            setModalEvent(false)
          }}
          accionCancelar={() => {
            setModalEvent(false)
          }}
        />
      </CustomDialog>
      <CustomDialog
        isOpen={modalEventDetail}
        handleClose={() => {
          setModalEventDetail(false)
          setEventDetailData(null)
        }}
        info={<InfoPopper title={t('help.inspector.title')} description={t('help.inspector.description')}/>}
        title={t('detail')}
      >
        <VistaModalDetailEvents
          inspectorEvent={eventDetailData}
          accionCorrecta={() => {
            setModalEventDetail(false)
            setMostrarAlertaValidar(true)
          }}
          accionCancelar={() => {
            setModalEventDetail(false)
            setMostrarAlertaCancelar(true)
          }}
        />
      </CustomDialog>
      <AlertDialogWithComment 
        isOpen={mostrarAlertaValidar} 
        titulo={t('inspectors.events.validate.title')}
        texto={t('inspectors.events.validate.description')}
        label={t('comment')}
        accionCorrecta={async (comment: string) => {
          await actualizarRevisionPeticion(EventStatus.VALID, comment)
          setEventDetailData(null)
          await obtenerInspectoresEventHistoryPeticion()
          setMostrarAlertaValidar(false)
        }}>
        <Button
          variant={'outlined'}
          onClick={() => {
            setMostrarAlertaValidar(false)
            setEventDetailData(null)
          }}
        >
          {t('cancel')}
        </Button>
        <LoadingButton
          variant={'contained'}
          type="submit"
          loading={loadingRevision}
        >
          {t('validate')}
        </LoadingButton>
      </AlertDialogWithComment>

      <AlertDialogWithComment 
        isOpen={mostrarAlertaCancelar} 
        titulo={t('inspectors.events.validate.cancel')}
        texto={t('inspectors.events.validate.cancel_description')}
        label={t('comment')}
        accionCorrecta={async (comment: string) => {
          await actualizarRevisionPeticion(EventStatus.CANCEL, comment)
          setEventDetailData(null)
          await obtenerInspectoresEventHistoryPeticion()
          setMostrarAlertaCancelar(false)
        }}>
        <Button
          variant={'outlined'}
          onClick={() => {
            setMostrarAlertaCancelar(false)
            setEventDetailData(null)
          }}
        >
          {t('cancel')}
        </Button>
        <LoadingButton
          variant={'contained'}
          type="submit"
          loading={loadingRevision}
        >
          {t('close')}
        </LoadingButton>
      </AlertDialogWithComment>

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
