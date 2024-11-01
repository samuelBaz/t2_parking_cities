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
import { Ticket } from "@/modules/distributors/types/ticketsTypes"
import VistaModalCompraTicket from "@/modules/distributors/ui/VistaModalCompraTicket"
import { Area } from "@/modules/t2parkingcities/types/areaTypes"
import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import dayjs from "dayjs"
import { ReactNode, useEffect, useState } from "react"

const Tickets = () => {
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
  
  const [areas, setAreas] = useState<Array<Ticket>>([])
  const [loading, setLoading] = useState(true)

  const [modalArea, setModalArea] = useState<boolean>(false)
  const [areaAdicion, setAreaEdicion] = useState<Area | null>(null)
  
  const [errorAreaData, setErrorAreaData] = useState<any>()

  const obtenerTicketsPeticion = async (): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/tickets/getTodayTicketsByCityId/${usuario?.dependency}`,
        method: 'get',
      })
      imprimir(`Respuesta obtener tickets: `, respuesta)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      setAreas(respuesta.data)
      setTotal(respuesta.data? respuesta.data.length : 0)
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
    { campo: 'name', nombre: t('areas.tables.name'), ordenar: true },
    { campo: 'spaces', nombre: t('areas.tables.parking_spaces'), ordenar: true },
    { campo: 'typeNumbering', nombre: t('areas.tables.type_numbering'), ordenar: true },
    { campo: 'createdAt', nombre: t('areas.tables.created'), ordenar: true },
    { campo: 'acciones', nombre: 'ACCIONES', ordenar: false },
  ])

  const contenidoTabla: Array<Array<ReactNode>> = areas.map(
    (areaData, indexArea) => [
      <Typography
        key={`${areaData.id}-${indexArea}-name`}
        variant={'body2'}
      >{areaData.amount}</Typography>,
      <Typography
        key={`${areaData.id}-${indexArea}-description`}
        variant={'body2'}
      >{areaData.duration}</Typography>,
      <Typography
        key={`${areaData.id}-${indexArea}-description`}
        variant={'body2'}
      >{areaData.email}</Typography>,
      <Typography
        key={`${areaData.id}-${indexArea}-startDate`}
        variant={'body2'}
      >{dayjs(areaData.startDate).format('DD/MM/YYYY HH:mm')}</Typography>,
      <Typography
        key={`${areaData.id}-${indexArea}-endDate`}
        variant={'body2'}
      >{dayjs(areaData.endDate).format('DD/MM/YYYY HH:mm')}</Typography>
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
    if(estaAutenticado) obtenerTicketsPeticion().finally(() => {})
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
      id={'comprarTicket'}
      key={'comprarTicket'}
      texto={'Comprar Ticket'}
      variante={xs ? 'icono' : 'boton'}
      icono={'add_circle_outline'}
      descripcion={'Comprar Ticket'}
      accion={() => {
        setModalArea(true)
      }}
    />
  ]

  const cerrarModalArea = async () => {
    setModalArea(false)
    setAreaEdicion(null)
  }

  return (
    <LayoutUser>
      <CustomDialog
        isOpen={modalArea}
        info={<InfoPopper title={t('help.area.title')} description={t('help.area.description')}/>}
        handleClose={cerrarModalArea}
        title={'Comprar Ticket'}
      >
        <VistaModalCompraTicket
          accionCorrecta={() => {
            cerrarModalArea().finally()
            obtenerTicketsPeticion().finally()
          }}
          accionCancelar={cerrarModalArea}
        />
      </CustomDialog>
      <CustomDataTable
          titulo={'Tickets'}
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

export default Tickets