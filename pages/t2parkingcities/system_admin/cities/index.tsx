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
import { CityCRUDType } from "@/modules/system_admin/types/citiesCRUDTypes"
import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import dayjs from "dayjs"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"

const Cities = () => {

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
  
  const [cities, setCities] = useState<Array<CityCRUDType>>([])
  const [loading, setLoading] = useState(true)
  
  const [errorCitiesData, setErrorCitiesData] = useState<any>()

  const obtenerParkingAreasPeticion = async (): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/cities`,
        method: 'get',
      })
      imprimir(`Respuesta estado obtener cities: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      setCities(respuesta.data.content)
      setTotal(respuesta.data.totalElements)
    } catch (e) {
      imprimir(`Error obteniendo alcaldias`, e)
      setErrorCitiesData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'name', nombre: t('table.name'), ordenar: true },
    { campo: 'email', nombre: t('cities.table.email'), ordenar: true },
    { campo: 'phone', nombre: t('cities.table.phone'), ordenar: true },
    { campo: 'createdAt', nombre: t('table.createdAt'), ordenar: true },
    { campo: 'acciones', nombre: t('table.actions'), ordenar: false },
  ])

  const contenidoTabla: Array<Array<ReactNode>> = cities.map(
    (cityData, indexCity) => [
      <Typography
        key={`${cityData.id}-${indexCity}-name`}
        variant={'body2'}
      >{cityData.name}</Typography>,
      <Typography
        key={`${cityData.id}-${indexCity}-email`}
        variant={'body2'}
      >{cityData.email}</Typography>,
      <Typography
        key={`${cityData.id}-${indexCity}-idTicket`}
        variant={'body2'}
      >{cityData.phone}</Typography>,
      <Typography
        key={`${cityData.id}-${indexCity}-createdAt`}
        variant={'body2'}
      >{dayjs(cityData.createdAt).format('DD/MM/YYYY HH:mm')}</Typography>,
      <Grid key={`${cityData.id}-${indexCity}-acciones`}>
        <IconoTooltip
          key={'configurar-city'}
          id={`configurar-city`}
          titulo={'Configurar Alcaldía'}
          color={'primary'}
          accion={() => {
            router.push(`/t2parkingcities/system_admin/cities/${cityData.id}`)
          }}
          icono={'settings'}
          name={'Configurar Alcaldía'}
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
      key={'refresh-parking-areas'}
      id={`refresh-parking-areas`}
      titulo={'Actualizar Parking Areas'}
      color={'primary'}
      accion={() => {
        obtenerParkingAreasPeticion()
      }}
      icono={'refresh'}
      name={'Actualizar Parking Areas'}
    />,
    <IconoTooltip
      key={'filtrar-parking-areas'}
      id={`filtrar-parking-areas`}
      titulo={'Filtrar Parking Areas'}
      color={'primary'}
      accion={() => {
        // setOpenFilters((openFilters: any) => !openFilters)
      }}
      icono={'filter_list'}
      name={'Filtrar Parking Areas'}
    />
  ]
  return (
    <LayoutUser>
      <CustomDataTable
          titulo={t('cities.cities')}
          error={!!errorCitiesData}
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

export default Cities