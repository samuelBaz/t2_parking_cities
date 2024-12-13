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
import { Ticket } from "@/modules/distributors/types/ticketsTypes"
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material"
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
  
  const [tickets, setTickets] = useState<Array<Ticket>>([])
  const [loading, setLoading] = useState(true)
  
  const [errorAreaData, setErrorAreaData] = useState<any>()

  const obtenerTicketsPeticion = async (): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/tickets/getAllTicketsByCompanyId/${usuario?.dependency}`,
        method: 'get',
      })
      imprimir(`Respuesta obtener tickets: `, respuesta)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      setTickets(respuesta.data.content)
      setTotal(respuesta.data.totalElements)
    } catch (e) {
      imprimir(`Error obteniendo tickets`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
      setErrorAreaData(e)
    } finally {
      setLoading(false)
    }
  }

  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'plate', nombre: t('third_party_company.tickets.table.plate'), ordenar: true },
    { campo: 'phone_email', nombre: t('third_party_company.tickets.table.phone_email'), ordenar: true },
    { campo: 'amount', nombre: t('third_party_company.tickets.table.amount'), ordenar: true },
    { campo: 'duration', nombre: t('third_party_company.tickets.table.duration'), ordenar: true },
    { campo: 'distributor', nombre: t('third_party_company.tickets.table.distributor'), ordenar: true },
    { campo: 'createdAt', nombre: t('table.createdAt'), ordenar: true },
    // { campo: 'acciones', nombre: t('table.actions'), ordenar: false },
  ])

  const contenidoTabla: Array<Array<ReactNode>> = tickets.map(
    (ticketData, indexTicket) => [
      <Typography
        key={`${ticketData.id}-${indexTicket}-plate`}
        variant={'body2'}
      >{ticketData.plate}</Typography>,
      <Box 
        key={`${ticketData.id}-${indexTicket}-name`}>
        <Typography
          variant={'body2'}
        >{ticketData.phone}</Typography>
        <Typography
          variant={'body2'}
        >{ticketData.email}</Typography>
      </Box>,
      <Typography
        key={`${ticketData.id}-${indexTicket}-amount`}
        variant={'body2'}
      >{`$ ${ticketData.amount}`}</Typography>,
      <Typography
        key={`${ticketData.id}-${indexTicket}-duration`}
        variant={'body2'}
      >{`${dayjs(ticketData.startDate).format('HH:mm')} - ${dayjs(ticketData.endDate).format('HH:mm')}`}</Typography>,
      <Typography
        key={`${ticketData.id}-${indexTicket}-createdAt`}
        variant={'body2'}
      >{ticketData.companyName}</Typography>,
      <Typography
        key={`${ticketData.id}-${indexTicket}-createdAt`}
        variant={'body2'}
      >{dayjs(ticketData.createdAt).format('DD/MM/YYYY HH:mm')}</Typography>,
      // <Typography
      //   key={`${ticketData.id}-${indexTicket}-actions`}
      //   variant={'body2'}
      // >{dayjs(ticketData.createdAt).format('DD/MM/YYYY HH:mm')}</Typography>
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
    if(estaAutenticado) {
      obtenerTicketsPeticion().finally(() => {})
    }
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
      titulo={'Actualizar Tickets'}
      color={'primary'}
      accion={() => {
        obtenerTicketsPeticion()
      }}
      icono={'refresh'}
      name={'Actualizar Tickets'}
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
    />
  ]

  return (
    <LayoutUser>
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