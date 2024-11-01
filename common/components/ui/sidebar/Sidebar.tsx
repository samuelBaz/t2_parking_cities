import { useEffect, useState } from 'react'
import {
  Avatar,
  useMediaQuery,
  useTheme,
  IconButton,
  Box,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useFullScreenLoading, useSidebar } from '../../../../context/ui'
import { useAuth } from '../../../../context/auth'
import { imprimir } from '../../../utils/imprimir'
import { CustomDrawer, SidebarModuloType } from './CustomDrawer'
import useModulo from '@/common/utils/modulos'
// import { obtenerDescripcionDependencia, titleCase } from '../../../utils'
// import { ConstanteRol } from '../../../../modules/admin/usuarios/types/usuariosCRUDTypes'

const drawerWidth = 220

export const Sidebar = () => {
  const { sideMenuOpen, closeSideMenu, openSideMenu, checkContentBadge } =
    useSidebar()

  const {
    usuario,
    estaAutenticado,
    progresoLogin
  } = useAuth()
  const [modulos, setModulos] = useState<SidebarModuloType[]>([])
  const { modulosAppAdmin, modulosAppDistributor, modulosAppUser, modulosAppInspector } = useModulo()
  const theme = useTheme()
  const router = useRouter()
  

  const sm = useMediaQuery(theme.breakpoints.only('sm'))
  const md = useMediaQuery(theme.breakpoints.only('md'))
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  const { estadoFullScreen } = useFullScreenLoading()

  const interpretarModulos = () => {
    imprimir(`Cambio en módulos`)

    const rolSeleccionado = usuario?.rol

    imprimir(`rolSeleccionado`, rolSeleccionado)

    setModulos(
      rolSeleccionado === 'USER' ? modulosAppUser 
      : rolSeleccionado === 'DISTRIBUTOR' ? modulosAppDistributor 
      : rolSeleccionado === 'ADMIN'? modulosAppAdmin 
      : rolSeleccionado === 'INSPECTOR' ? modulosAppInspector
      : [] 
    )
  }

  const navigateTo = async (url: string) => {
    if (sm || xs || md) {
      closeSideMenu()
    }
    await router.push(url)
  }

  useEffect(() => {
    if (sm || xs || md) {
      closeSideMenu()
    } else {
      openSideMenu()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sm, xs, md])

  useEffect(() => {
    imprimir(`reinterpretando módulos`)
    
    interpretarModulos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario])

  // const obtenerIcono = (idRol: string) => {
  //   if(idRol===ConstanteRol.ADMINISTRADOR)
  //     return "/icons/antecedentes-epi.png"
  //   if(idRol===ConstanteRol.SUPERVISOR)
  //     return "/icons/personas-contacto.png"
  //   if(idRol===ConstanteRol.CONSULTAS)
  //     return "/icons/clasificacion.png"
  //   if(idRol===ConstanteRol.CLASIFICADOR)
  //     return "/icons/datos-clinicos.png"
  //   if(idRol===ConstanteRol.INVESTIGADOR)
  //     return "/icons/seguimiento.png"
  //   if(idRol===ConstanteRol.LABORATORIO)
  //     return "/icons/resultado.png"
  //   if(idRol===ConstanteRol.NOTIFICADOR)
  //     return "/icons/notificador.png"
  //   if(idRol===ConstanteRol.TOMADOR_MUESTRA)
  //     return "/icons/toma-de-muestra.png"
  //   else
  //   return "/icons/consulta.png"
  // }

  return (
    <CustomDrawer
      variant={sm || xs || md ? 'temporary' : 'persistent'}
      open={
        sideMenuOpen &&
        estaAutenticado &&
        modulos.length > 0 &&
        !progresoLogin &&
        !estadoFullScreen &&
        modulos.some((moduloGrupo) =>
          moduloGrupo.subModulo.some((modulo: any) =>
            router.pathname.includes(modulo.url, 0)
          )
        )
      }
      onClose={closeSideMenu}
      sx={{
        width: sideMenuOpen ? drawerWidth : `0`,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          // borderWidth: 0.0,
          boxSizing: 'border-box',
        },
        transition: 'all 0.2s ease-out',
      }}
      rutaActual={router.pathname}
      modulos={modulos}
      setModulos={setModulos}
      navigateTo={navigateTo}
      badgeVariant="primary"
      checkContentBadge={checkContentBadge}
    >
    </CustomDrawer>
  )
}
