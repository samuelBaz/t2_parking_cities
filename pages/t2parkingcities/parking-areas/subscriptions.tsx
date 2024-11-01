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
import { Currency, Vehicle } from "@/modules/t2parkingcities/types/scheduleTypes"
import { Subscription, SubscriptionBlock } from "@/modules/t2parkingcities/types/subscriptionTypes"
import VistaModalSubscriptions from "@/modules/t2parkingcities/ui/VistaModalSubscriptions"
import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import dayjs from "dayjs"
import { ReactNode, useEffect, useMemo, useState } from "react"

const Subscriptions = () => {

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
  
  const [subscriptions, setSubscriptions] = useState<Array<Subscription>>([])
  const [currencies, setCurrencies] = useState<Array<optionType>>([])
  const [vehicles, setVehicles] = useState<Array<Vehicle>>([])
  const [loading, setLoading] = useState(true)

  const [modalSubscripcion, setModalSubscripcion] = useState<boolean>(false)
  const [subscriptionEdicion, setSubscriptionEdicion] = useState<Subscription | null>(null)
  
  const [errorSubscriptionData, setErrorSubscriptionData] = useState<any>()

  const obtenerSubscriptionPeticion = async (): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/subscriptions/getAll/${usuario?.dependency}`,
        method: 'get',
      })
      imprimir(`Respuesta obtener abonos: `, respuesta)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      setSubscriptions(respuesta.data.content)
      setTotal(respuesta.data? respuesta.data.totalElements : 0)
    } catch (e) {
      imprimir(`Error obteniendo abonos`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
      setErrorSubscriptionData(e)
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
          respuesta.data.content
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
    { campo: 'name', nombre: t('subscriptions.tables.name'), ordenar: true },
    { campo: 'currency', nombre: t('subscriptions.tables.currency'), ordenar: true },
    { campo: 'createdAt', nombre: t('table.createdAt'), ordenar: true },
    { campo: 'acciones', nombre: t('table.actions'), ordenar: false },
  ])

  const contenidoTabla: Array<Array<ReactNode>> = subscriptions.map(
    (subscriptionData, indexSubscription) => [
      <Typography
        key={`${subscriptionData.id}-${indexSubscription}-name`}
        variant={'body2'}
      >{subscriptionData.name}</Typography>,
      <Typography
        key={`${subscriptionData.id}-${indexSubscription}-currency`}
        variant={'body2'}
      >{subscriptionData.currencyName}</Typography>,
      <Typography
        key={`${subscriptionData.id}-${indexSubscription}-createdAt`}
        variant={'body2'}
      >{dayjs(subscriptionData.createdAt).format('DD/MM/YYYY HH:mm')}</Typography>,
      <Grid key={`${subscriptionData.id}-${indexSubscription}-acciones`}>
        <IconoTooltip
          key={'editar-areas'}
          id={`editar-areas`}
          titulo={'Editar Abono'}
          color={'primary'}
          accion={() => {
            setSubscriptionEdicion(subscriptionData)
            setModalSubscripcion(true)
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
    if(estaAutenticado) obtenerSubscriptionPeticion().finally(() => {})
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
      key={'refresh-subs'}
      id={`refresh-subs`}
      titulo={'Actualizar Abonos'}
      color={'primary'}
      accion={() => {
        obtenerSubscriptionPeticion()
      }}
      icono={'refresh'}
      name={'Actualizar Abonos'}
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
      texto={t('subscriptions.add')}
      variante={xs ? 'icono' : 'boton'}
      icono={'add_circle_outline'}
      descripcion={t('subscriptions.add')}
      accion={() => {
        setModalSubscripcion(true)
      }}
    />
  ]

  const cerrarModalArea = async () => {
    setModalSubscripcion(false)
    setSubscriptionEdicion(null)
  }

  return (
    <LayoutUser>
      <CustomDialog
        isOpen={modalSubscripcion}
        info={<InfoPopper title={t('help.subscriptions.title')} description={t('help.subscriptions.description')}/>}
        handleClose={cerrarModalArea}
        title={subscriptionEdicion ? t('subscriptions.edit') : t('subscriptions.add')}
      >
        <VistaModalSubscriptions
          subscription={subscriptionEdicion}
          currencies={currencies}
          vehicles={vehicles}
          accionCorrecta={() => {
            cerrarModalArea().finally()
            obtenerSubscriptionPeticion().finally()
          }}
          accionCancelar={cerrarModalArea}
        />
      </CustomDialog>
      <CustomDataTable
          titulo={t('parking_areas.subscriptions')}
          error={!!errorSubscriptionData}
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

export default Subscriptions