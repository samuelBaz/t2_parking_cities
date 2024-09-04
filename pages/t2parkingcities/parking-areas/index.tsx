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
import { ParkingArea } from "@/modules/t2parkingcities/ParkingArea"
import { Grid, Typography } from "@mui/material"
import dayjs from "dayjs"
import { ReactNode, useEffect, useState } from "react"

const ParkingAreas = () => {

  const { t } = useTranslation()
  const { sesionPeticion } = useSession()
  const { estaAutenticado, usuario } = useAuth()

  const { Alerta } = useAlerts()

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
        url: `${Constantes.baseUrl}/api/parking_areas/getAll/${usuario!.id}`,
        method: 'get',
      })
      imprimir(`Respuesta estado parametro: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      setParkingAreas(respuesta.data)
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
      >{parkinAreaData.area.name}</Typography>,
      <Typography
        key={`${parkinAreaData.id}-${indexParking}-idTicket`}
        variant={'body2'}
      >{parkinAreaData.area.name}</Typography>,
      <Typography
        key={`${parkinAreaData.id}-${indexParking}-state`}
        variant={'body2'}
      >{parkinAreaData.area.name}</Typography>,
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
    obtenerParkingAreasPeticion().finally(() => {})
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
  />
  ]
  return (
    <LayoutUser>
      <CustomDataTable
          // tituloPersonalizado={
          //   <Typography color="text.primary" fontSize="18px" fontWeight={700} >
          //     Listado de Pagos
          //   </Typography>
          // }
          titulo={t('parking_areas.title')}
          error={!!errorPaymentsData}
          cargando={loading}
          acciones={[
            
          ]}
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