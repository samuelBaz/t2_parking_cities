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
import { UserCRUDTypes } from "@/modules/users/types/UserTypes"
import VistaModalUserDistributor from "@/modules/users/ui/VistaModalUserDistributor"
import { Breadcrumbs, Divider, Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import dayjs from "dayjs"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"

const DistributorDetail = () => {

  const { t } = useTranslation()
  const { sesionPeticion } = useSession()
  const { estaAutenticado } = useAuth()

  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))
  const { Alerta } = useAlerts()

  const [modalUser, setModalUser] = useState<boolean>(false)
  const router = useRouter()
  const [reload, setReload] = useState<boolean>(false)
  const [dependency, setDependency] = useState<string | null>(null)

  // Variables de páginado
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  
  const [users, setUsers] = useState<Array<UserCRUDTypes>>([])
  const [loading, setLoading] = useState(true)
  
  const [errorUsersData, setErrorUsersData] = useState<any>()

  const obtenerUsuariosPeticion = async (distributor: string | string[]): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/users/getAllUsersDistributor/${distributor}`,
        method: 'get',
      })
      imprimir(`Respuesta peticion usuarios: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      setUsers(respuesta.data)
      setTotal(respuesta.data.length)
    } catch (e) {
      imprimir(`Error obteniendo usuarios`, e)
      setErrorUsersData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'name', nombre: t('users.table.name'), ordenar: true },
    { campo: 'email', nombre: t('users.table.email'), ordenar: true },
    { campo: 'createdAt', nombre: t('users.table.created'), ordenar: true },
    // { campo: 'acciones', nombre: 'Acciones', ordenar: false },
  ])

  const contenidoTabla: Array<Array<ReactNode>> = users.map(
    (parkinAreaData, indexParking) => [
      <Typography
        key={`${parkinAreaData.id}-${indexParking}-email`}
        variant={'body2'}
      >{parkinAreaData.name}</Typography>,
      <Typography
        key={`${parkinAreaData.id}-${indexParking}-plate`}
        variant={'body2'}
      >{parkinAreaData.email}</Typography>,
      <Typography
        key={`${parkinAreaData.id}-${indexParking}-idTicket`}
        variant={'body2'}
      >{parkinAreaData.createdAt ? dayjs(parkinAreaData.createdAt).format('DD/MM/YYYY'): ''}</Typography>,
      // <Grid key={`${parkinAreaData.id}-${indexParking}-acciones`}>
        
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
    if (router.isReady) {
      const { id } = router.query
      if (id === undefined) {
        router.back()
      }
      setDependency(id! as string)
      if(estaAutenticado) obtenerUsuariosPeticion(id!).finally(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    router.isReady,
    router.query.id,
    estaAutenticado,
    pagina,
    limite,
    reload,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(ordenCriterios),
  ])

  const acciones: Array<ReactNode> = [
    <IconoTooltip
      key={'filtrar-users'}
      id={`filtrar-users`}
      titulo={'Filtrar Usuarios'}
      color={'primary'}
      accion={() => {
        // setOpenFilters((openFilters: any) => !openFilters)
      }}
      icono={'filter_list'}
      name={'Filtrar Usuarios'}
    />,
    <IconoBoton
      id={'agregarUsuario'}
      key={'agregarUsuario'}
      texto={t('users.add')}
      variante={xs ? 'icono' : 'boton'}
      icono={'add_circle_outline'}
      descripcion={t('users.add')}
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
        title={t('users.add')}
      >
        <VistaModalUserDistributor
          dependency={dependency!}
          accionCorrecta={() => {
            setModalUser(false)
            setReload(value => !value)
          }}
          accionCancelar={() => {
            setModalUser(false)
          }}
        />
      </CustomDialog>
      <Breadcrumbs aria-label="breadcrumb" separator={'-'}>
        <Typography
          sx={{ display: 'flex', alignItems: 'center' }}
          variant='body2'
          fontWeight={500}
          fontSize={14}
          // color={theme.palette.primary.main}
        >
          {t('third_party_company.companies')}
        </Typography>
        <Typography
          sx={{ display: 'flex', alignItems: 'center' }}
          variant='body2'
          fontWeight={500}
          fontSize={14}
          color={theme.palette.primary.main}
        >
          {t('nav_menu.users')}
        </Typography>
      </Breadcrumbs>
      <Divider sx={{ my: 1 }} />
      <CustomDataTable
          titulo={t('nav_menu.users')}
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

export default DistributorDetail