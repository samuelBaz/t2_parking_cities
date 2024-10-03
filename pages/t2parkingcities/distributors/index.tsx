import { LayoutUser } from "@/common/components/layouts"
import { CustomDataTable, CustomDialog, IconoTooltip } from "@/common/components/ui"
import { IconoBoton } from "@/common/components/ui/botones/IconoBoton"
import InfoPopper from "@/common/components/ui/botones/InfoPopper"
import { CriterioOrdenType } from "@/common/components/ui/datatable/ordenTypes"
import { Paginacion } from "@/common/components/ui/datatable/Paginacion"
import CustomMensajeEstado from "@/common/components/ui/estados/CustomMensajeEstado"
import { useAlerts, useSession } from "@/common/hooks"
import { useTranslation } from "@/common/hooks/useTranslation"
import { InterpreteMensajes } from "@/common/utils"
import { imprimir } from "@/common/utils/imprimir"
import { Constantes } from "@/config"
import { useAuth } from "@/context/auth"
import { DistributorCRUDType } from "@/modules/distributors/types/distributorsTypes"
import VistaModalDistributor from "@/modules/distributors/ui/VistaModalDistributor"
import { InspectorEventCRUDTypes } from "@/modules/users/types/inspectorEventTypes"
import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import dayjs from "dayjs"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"

const Distributors = () => {

  const { t } = useTranslation()
  const { sesionPeticion } = useSession()
  const { estaAutenticado, usuario } = useAuth()

  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))
  const { Alerta } = useAlerts()

  const [modalDistributor, setModalDistributor] = useState<boolean>(false)

  const [openFilters, setOpenFilters] = useState(false)
  // const [filter, setFilter] = useState<PaymentFilterType>({email: '', licensePlate: '', ticket: '', state: ''})

  // Variables de páginado
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  
  const [distributors, setDistributors] = useState<Array<DistributorCRUDType>>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  const [errorUsersData, setErrorUsersData] = useState<any>()
  
  const obetenerDistributorPeticion = async (): Promise<void> => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/companies/getAll/${usuario!.dependency}`,
        method: 'get',
      })
      imprimir(`Respuesta peticion eventos inspectores: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      setDistributors(respuesta.data)
      setTotal(respuesta.data.length)
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
    { campo: 'name', nombre: t('third_party_company.table.name'), ordenar: true },
    { campo: 'taxId', nombre: t('third_party_company.table.tax_id'), ordenar: true },
    { campo: 'email', nombre: t('third_party_company.table.email'), ordenar: true },
    { campo: 'address', nombre: t('third_party_company.table.address'), ordenar: true },
    { campo: 'commission', nombre: t('third_party_company.table.commission'), ordenar: true },
    { campo: 'createdAt', nombre: t('third_party_company.table.created'), ordenar: true },
    { campo: 'acciones', nombre: 'Acciones', ordenar: false },
  ])

  const contenidoTabla: Array<Array<ReactNode>> = distributors.map(
    (distributorData, indexDistributor) => [
      <Typography
        key={`${distributorData.id}-${indexDistributor}-name`}
        variant={'body2'}
      >{distributorData.name}</Typography>,
      <Typography
        key={`${distributorData.id}-${indexDistributor}-taxId`}
        variant={'body2'}
      >{distributorData.taxId}</Typography>,
      <Typography
        key={`${distributorData.id}-${indexDistributor}-email`}
        variant={'body2'}
      >{distributorData.email}</Typography>,
      <Typography
        key={`${distributorData.id}-${indexDistributor}-address`}
        variant={'body2'}
      >{distributorData.address}</Typography>,
      <CustomMensajeEstado
        key={`${distributorData.id}-${indexDistributor}-commission`}
        color={distributorData.commission.name === 'FIXED' ? 'info' : 'warning'}
        titulo={distributorData.commission.name}
      />,
      <Typography
        key={`${distributorData.id}-${indexDistributor}-createdAt`}
        variant={'body2'}
      >{distributorData.createdAt ? dayjs(distributorData.createdAt).format('DD/MM/YYYY'): ''}</Typography>,
      <Grid key={`${distributorData.id}-${indexDistributor}-acciones`}>
        <IconoTooltip
          key={'configurar-distributor'}
          id={`configurar-distributor`}
          titulo={'Configurar Distribuidor'}
          color={'primary'}
          accion={() => {
            router.push(`/t2parkingcities/distributors/${distributorData.id}`)
          }}
          icono={'settings'}
          name={'Configurar Distribuidor'}
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
    if(estaAutenticado) obetenerDistributorPeticion().finally(() => {})
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
      key={'filtrar-distributors'}
      id={`filtrar-distributors`}
      titulo={'Filtrar Distribuidores'}
      color={'primary'}
      accion={() => {
        // setOpenFilters((openFilters: any) => !openFilters)
      }}
      icono={'filter_list'}
      name={'Filtrar Distribuidores'}
    />,
    <IconoBoton
      id={'agregarDistributor'}
      key={'agregarDistributor'}
      texto={t('third_party_company.add')}
      variante={xs ? 'icono' : 'boton'}
      icono={'add_circle_outline'}
      descripcion={t('third_party_company.add')}
      accion={() => {
        setModalDistributor(true)
      }}
    />
  ]
  
  return (
    <LayoutUser>
      <CustomDialog
        isOpen={modalDistributor}
        handleClose={() => {
          setModalDistributor(false)
        }}        
        info={<InfoPopper title={t('help.thrid_party_company.title')} description={t('help.thrid_party_company.description')}/>}
        title={t('third_party_company.add')}
      >
        <VistaModalDistributor
          accionCorrecta={() => {
            obetenerDistributorPeticion().finally()
            setModalDistributor(false)
          }}
          accionCancelar={() => {
            setModalDistributor(false)
          }}
        />
      </CustomDialog>
      <CustomDataTable
          titulo={t('third_party_company.companies')}
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

export default Distributors