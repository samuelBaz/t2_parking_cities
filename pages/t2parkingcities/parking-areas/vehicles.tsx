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
import { ParkingArea } from "@/modules/t2parkingcities/ParkingArea"
import { Vehicle } from "@/modules/t2parkingcities/Schedule"
import VistaModalVehicles from "@/modules/t2parkingcities/ui/VistaModalVehicles"
import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import dayjs from "dayjs"
import { ReactNode, useEffect, useState } from "react"

const Vehicles = () => {

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
  
  const [vehicles, setVehicles] = useState<Array<Vehicle>>([])
  const [loading, setLoading] = useState(true)

  const [modalVehiculo, setModalVehiculo] = useState<boolean>(false)
  const [vehiculoEdicion, setVehiculoEdicion] = useState<Vehicle | null>(null)
  
  const [errorVehicleData, setErrorVehicleData] = useState<any>()

  const obtenerVehiclesPeticion = async (): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/vehicles/getAll/${usuario?.id}`,
        method: 'get',
      })
      imprimir(`Respuesta obtener vehiculos: `, respuesta)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      setVehicles(respuesta.data)
    } catch (e) {
      imprimir(`Error obteniendo vehiculos`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
      setErrorVehicleData(e)
    } finally {
      setLoading(false)
    }
  }

  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'name', nombre: t('vehicles.table.name'), ordenar: true },
    { campo: 'description', nombre: t('vehicles.table.description'), ordenar: true },
    { campo: 'createdAt', nombre: t('vehicles.table.created'), ordenar: true },
    { campo: 'acciones', nombre: 'ACCIONES', ordenar: false },
  ])

  const contenidoTabla: Array<Array<ReactNode>> = vehicles.map(
    (vehicleData, indexVehicle) => [
      <Typography
        key={`${vehicleData.id}-${indexVehicle}-name`}
        variant={'body2'}
      >{vehicleData.name}</Typography>,
      <Typography
        key={`${vehicleData.id}-${indexVehicle}-description`}
        variant={'body2'}
      >{vehicleData.description}</Typography>,
      <Typography
        key={`${vehicleData.id}-${indexVehicle}-createdAt`}
        variant={'body2'}
      >{dayjs(vehicleData.createdAt).format('DD/MM/YYYY HH:mm')}</Typography>,
      <Grid key={`${vehicleData.id}-${indexVehicle}-acciones`}>
        {
          !vehicleData.byDefault && 
          <IconoTooltip
            key={'editar-vehiculos'}
            id={`editar-vehiculos`}
            titulo={'Editar vehiculo'}
            color={'primary'}
            accion={() => {
              setVehiculoEdicion(vehicleData)
              setModalVehiculo(true)
            }}
            icono={'edit'}
            name={'Editar vehiculo'}
          />
        }
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
    if(estaAutenticado) obtenerVehiclesPeticion().finally(() => {})
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
      key={'filtrar-vehiculos'}
      id={`filtrar-vehiculos`}
      titulo={'Filtrar vehiculos'}
      color={'primary'}
      accion={() => {
        // setOpenFilters((openFilters: any) => !openFilters)
      }}
      icono={'filter_list'}
      name={'Filtrar Vehiculos'}
    />,
    <IconoBoton
      id={'agregarVehiculo'}
      key={'agregarvehiculo'}
      texto={t('vehicles.add')}
      variante={xs ? 'icono' : 'boton'}
      icono={'add_circle_outline'}
      descripcion={t('vehicles.add')}
      accion={() => {
        setModalVehiculo(true)
      }}
    />
  ]

  const cerrarModalVehiculo = async () => {
    setModalVehiculo(false)
    setVehiculoEdicion(null)
  }

  return (
    <LayoutUser>
      <CustomDialog
        isOpen={modalVehiculo}
        handleClose={cerrarModalVehiculo}
        title={vehiculoEdicion ? 'Editar vehiculo' : 'Nuevo vehiculo'}
      >
        <VistaModalVehicles
          vehicle={vehiculoEdicion}
          accionCorrecta={() => {
            cerrarModalVehiculo().finally()
            obtenerVehiclesPeticion().finally()
          }}
          accionCancelar={cerrarModalVehiculo}
        />
      </CustomDialog>
      <CustomDataTable
          titulo={t('vehicles.all')}
          error={!!errorVehicleData}
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

export default Vehicles