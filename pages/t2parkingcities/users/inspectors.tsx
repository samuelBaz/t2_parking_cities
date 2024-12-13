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
import { ParkingArea } from "@/modules/t2parkingcities/types/parkinAreaTypes"
import { Schedule } from "@/modules/t2parkingcities/types/scheduleTypes"
import { Subscription } from "@/modules/t2parkingcities/types/subscriptionTypes"
import VistaModalParkingArea from "@/modules/t2parkingcities/ui/VistaModalParkingArea"
import { InspectorCRUDTypes, Permission, UserCRUDTypes } from "@/modules/users/types/UserTypes"
import VistaModalInspector from "@/modules/users/ui/VistaModalInspector"
import VistaModalUser from "@/modules/users/ui/VistaModalUser"
import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import dayjs from "dayjs"
import { ReactNode, useEffect, useState } from "react"

const Users = () => {

  const { t } = useTranslation()
  const { sesionPeticion } = useSession()
  const { estaAutenticado, usuario } = useAuth()

  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))
  const { Alerta } = useAlerts()

  const [modalUser, setModalUser] = useState<boolean>(false)

  const [openFilters, setOpenFilters] = useState(false)
  // const [filter, setFilter] = useState<PaymentFilterType>({email: '', licensePlate: '', ticket: '', state: ''})
  
  // Variables de páginado
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  
  const [users, setUsers] = useState<Array<UserCRUDTypes>>([])
  const [parkingAreas, setParkingAreas] = useState<Array<optionType>>([])
  const [loading, setLoading] = useState(true)
  
  const [errorUsersData, setErrorUsersData] = useState<any>()

  const obtenerInspectoresPeticion = async (): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/users/getAllInspectors/${usuario!.dependency}`,
        method: 'get',
      })
      imprimir(`Respuesta peticion usuarios inspectores: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      setUsers(respuesta.data.content)
      setTotal(respuesta.data.totalElements)
    } catch (e) {
      imprimir(`Error obteniendo usuarios inspectores`, e)
      setErrorUsersData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const obtenerParkingAreasPeticion = async (): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/parking_areas/getAll/${usuario!.dependency}`,
        method: 'get',
      })
      imprimir(`Respuesta peticion parking areas: ${respuesta}`)
      if(respuesta.data.content){
        setParkingAreas(
          respuesta.data.content.map((pa : ParkingArea) => {
            return {key: pa.id.toString(), value: pa.id.toString(), label: pa.name}
          })
        )
      }
    } catch (e) {
      imprimir(`Error obteniendo parking areas`, e)
      setErrorUsersData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'name', nombre: t('table.name'), ordenar: true },
    { campo: 'email', nombre: t('users.table.email'), ordenar: true },
    { campo: 'parking_areas', nombre: t('inspectors.table.parking_area'), ordenar: true },
    { campo: 'permissions', nombre: t('inspectors.table.permissions'), ordenar: true },
    { campo: 'createdAt', nombre: t('table.createdAt'), ordenar: true },
    // { campo: 'acciones', nombre: 'Acciones', ordenar: false },
  ])

  const contenidoTabla: Array<Array<ReactNode>> = users.map(
    (inspectorData, indexInspector) => [
      <Typography
        key={`${inspectorData.id}-${indexInspector}-email`}
        variant={'body2'}
      >{inspectorData.name}</Typography>,
      <Typography
        key={`${inspectorData.id}-${indexInspector}-plate`}
        variant={'body2'}
      >{inspectorData.email}</Typography>,
      <Typography
        key={`${inspectorData.id}-${indexInspector}-parkingAreas`}
        variant={'body2'}
      >
        {inspectorData.inspector?.parkingAreas ? inspectorData.inspector?.parkingAreas.map((parkingArea: ParkingArea) => parkingArea.name).toString() : ''}
      </Typography>,
      <Typography
        key={`${inspectorData.id}-${indexInspector}-parkingAreas`}
        variant={'body2'}
      >
        {inspectorData.inspector?.permissions ? inspectorData.inspector?.permissions.map((permission: Permission) => permission).toString() : ''}
      </Typography>,
      <Typography
        key={`${inspectorData.id}-${indexInspector}-idTicket`}
        variant={'body2'}
      >{inspectorData.createdAt ? dayjs(inspectorData.createdAt).format('DD/MM/YYYY HH:mm'): ''}</Typography>,
      // <Grid key={`${inspectorData.id}-${indexInspector}-acciones`}>
        
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
    if(estaAutenticado) obtenerInspectoresPeticion().finally(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    estaAutenticado,
    pagina,
    limite,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(ordenCriterios)
  ])

  useEffect(() => {
    if(estaAutenticado) obtenerParkingAreasPeticion().finally(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    estaAutenticado
  ])

  const acciones: Array<ReactNode> = [
    <IconoTooltip
      key={'refresh-inspectors'}
      id={`refresh-inspectors`}
      titulo={'Actualizar Inspectores'}
      color={'primary'}
      accion={() => {
        obtenerInspectoresPeticion()
      }}
      icono={'refresh'}
      name={'Actualizar Inspectores'}
    />,
    <IconoTooltip
      key={'filtrar-users'}
      id={`filtrar-users`}
      titulo={'Filtrar Inspectores'}
      color={'primary'}
      accion={() => {
        // setOpenFilters((openFilters: any) => !openFilters)
      }}
      icono={'filter_list'}
      name={'Filtrar Inspectores'}
    />,
    <IconoBoton
      id={'agregarUsuario'}
      key={'agregarUsuario'}
      texto={t('inspectors.add')}
      variante={xs ? 'icono' : 'boton'}
      icono={'add_circle_outline'}
      descripcion={t('inspectors.add')}
      accion={() => {
        setModalUser(true)
      }}
    />
  ]
  return (
    <LayoutUser>
      <CustomDialog
        isOpen={modalUser}
        handleClose={() => {
          setModalUser(false)
        }}
        info={<InfoPopper title={t('help.inspector.title')} description={t('help.inspector.description')}/>}
        title={t('inspectors.add')}
      >
        <VistaModalInspector
          parkingAreas={parkingAreas}
          accionCorrecta={() => {
            obtenerInspectoresPeticion().finally()
            setModalUser(false)
          }}
          accionCancelar={() => {
            setModalUser(false)
          }}
        />
      </CustomDialog>
      <CustomDataTable
          titulo={t('inspectors.inspectors')}
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

export default Users