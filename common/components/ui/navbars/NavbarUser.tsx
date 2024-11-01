import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ToggleButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import { useFullScreenLoading, useSidebar } from '../../../../context/ui'

import React, { useState } from 'react'
import ThemeSwitcherButton from '../botones/ThemeSwitcherButton'
import { CustomDialog } from '../modales/CustomDialog'

import { useAuth } from '../../../../context/auth'
import { delay, guardarCookie, leerCookie } from '../../../utils'
import { useRouter } from 'next/router'
import { Icono } from '../Icono'
import { AlertDialog } from '../modales/AlertDialog'
import { imprimir } from '../../../utils/imprimir'
import { useThemeContext } from '../../../../context/ui/ThemeContext'
import { useSession } from '../../../hooks'
import Grid from '@mui/material/Grid'
import { useTranslation } from '@/common/hooks/useTranslation'
import VistaModalConfiguracion from '@/modules/configuracion/ui/VistaModalConfiguracion'
import LanguageMenu from '../language/LanguageMenu'
// import { RolNivelType } from '../../../../modules/login/types/loginTypes'
// import { VistaModalCambioRolNivel } from '../../../../modules/admin/roles/ui/ModalCambioRolNivel'
// import { DependenciaType } from '../../../../modules/admin/usuarios/types/usuariosCRUDTypes'

export const NavbarUser = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // const [rolesNiveles, setRolesNiveles] = useState<RolNivelType[]>([])

  const { cerrarSesion } = useSession()

  const {
    usuario,
  } = useAuth()

  const { sideMenuOpen, closeSideMenu, openSideMenu } = useSidebar()

  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()
  const [modalConfiguracion, setModalConfiguracion] = useState<boolean>(false)

  const [mostrarAlertaCerrarSesion, setMostrarAlertaCerrarSesion] =
    useState(false)

  const router = useRouter()

  const { themeMode, toggleTheme } = useThemeContext()
  const { t } = useTranslation()

  // Indicador para mostrar el modal de cambio de rol nivel
  const [modalRolNivel, setModalRolNivel] = useState(false)

  // const cambiarRolNivel = async (
  //   idRolNivelSeleccionado: string,
  //   dependenciaSeleccionada: DependenciaType | undefined
  // ) => {
  //   setModalRolNivel(false)
  //   if (
  //     (idRolNivelSeleccionado &&
  //     idRolNivelSeleccionado !== usuarioRolNivel?.idRolNivel)
  //     ||
  //     (
  //       dependencia?.id !== dependenciaSeleccionada?.id
  //     )

  //   ) {
  //     imprimir(`cambiando a rolNivel : ${idRolNivelSeleccionado}`)
  //     imprimir(`depedencia: ${dependenciaSeleccionada}`)
  //     cerrarMenu()
  //     mostrarFullScreen(`Cambiando de rol nivel..`)
  //     await delay(1000)
  //     await router.replace({
  //       pathname: '/admin/home',
  //     })
  //     await setUsuarioRolNivelDependencia({
  //       idRolNivel: `${idRolNivelSeleccionado}`,
  //       idDependencia: `${dependenciaSeleccionada?.id}`,
  //     })
  //     ocultarFullScreen()
  //   }
  // }

  const desplegarMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const cerrarMenu = () => {
    setAnchorEl(null)
  }

  const cerrarMenuSesion = async () => {
    cerrarMenu()
    await cerrarSesion()
  }

  // const interpretarRolesNiveles = () => {
  //   imprimir(`Cambio en roles niveles 📜`, usuario?.rolesNiveles)
  //   if (usuario?.rolesNiveles && usuario?.rolesNiveles.length > 0) {
  //     // setRolesNiveles(usuario?.rolesNiveles)
  //   }
  // }

  const verificarDepedencia = () => {
    const verificarDependencia = leerCookie('cambioRolNivelDepedencia')
    imprimir(`Verificar depedencia 📜`, verificarDependencia)
    if (
      // usuario?.rolesNiveles &&
      // usuario?.rolesNiveles.length > 1 &&
      // !verificarDependencia
      true
    ) {
      guardarCookie('cambioRolNivelDepedencia', 'true')
      abrirCambioRolNivel()
    }
  }

  const abrirCambioRolNivel = () => {
    cerrarMenu()
    setModalRolNivel(true)
  }

  /// Interpretando roles desde estado
  // useEffect(() => {
  //   // interpretarRolesNiveles()
  //   verificarDepedencia()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [usuario])

  const theme = useTheme()
  // const sm = useMediaQuery(theme.breakpoints.only('sm'))
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  const accionMostrarAlertaCerrarSesion = () => {
    cerrarMenu()
    setMostrarAlertaCerrarSesion(true)
  }

  /// Método que cierra una ventana modal
  const cerrarModalRolNivel = async () => {
    setModalRolNivel(false)
    await delay(500)
  }

  return (
    <>
      <AlertDialog
        isOpen={mostrarAlertaCerrarSesion}
        titulo={'Alerta'}
        texto={`¿Está seguro de cerrar sesión?`}
      >
        <Button
          variant={'outlined'}
          onClick={() => {
            setMostrarAlertaCerrarSesion(false)
          }}
        >
          Cancelar
        </Button>
        <Button
          variant={'contained'}
          onClick={async () => {
            setMostrarAlertaCerrarSesion(false)
            await cerrarMenuSesion()
          }}
        >
          Aceptar
        </Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalConfiguracion}
        handleClose={() => {
          setModalConfiguracion(false)
        }}
        title={t('configuration.continue')}
        fullScreen
      >
        <VistaModalConfiguracion
          accionCancelar={() => {
            setModalConfiguracion(false)
          }}
        />
      </CustomDialog>

      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            id={'menu-sidebar'}
            size="large"
            aria-label="Menu lateral"
            name={sideMenuOpen ? 'Cerrar menú lateral' : 'Abrir menú lateral'}
            edge="start"
            color={'inherit'}
            onClick={() => {
              if (sideMenuOpen) {
                closeSideMenu()
              } else {
                openSideMenu()
              }
            }}
            sx={{ mr: 0 }}
          >
            {sideMenuOpen ? (
              <Icono color={'action'}>menu_open</Icono>
            ) : (
              <Icono color={'action'}>menu</Icono>
            )}
          </IconButton>
          <Grid
            container
            alignItems={'center'}
            flexDirection={'row'}
            sx={{
              flexGrow: 1,
            }}
          >
            <Box display={'inline-flex'}>
              <Grid
                container
                alignItems={'center'}
                flexDirection={'row'}
                justifyContent={'flex-start'}
                onClick={async () => {
                  await router.replace({
                    pathname: '/t2parkingcities/home',
                  })
                }}
                sx={{ cursor: 'pointer' }}
              >
                <Box
                  height={35}
                  component="img"
                  src="/logo.png"
                  alt="T2 Cities"
                />
              </Grid>
            </Box>
          </Grid>
          
          <LanguageMenu/>
          {!xs && <ThemeSwitcherButton />}
          <ToggleButton
            sx={{ px: 1.2, minWidth: 0, borderWidth: 0 }}
            size="small"
            onClick={desplegarMenu}
            color="primary"
            value={''}
            selected={!!anchorEl}
          >
            <Box display={'inline-flex'}>
              <Grid
                container
                alignItems={'center'}
                flexDirection={'row'}
                justifyContent={'flex-start'}
                sx={{ cursor: 'pointer' }}
              >
                {/* <Typography color={'text.primary'} component="div">
                  AJUSTE DE CUENTA
                </Typography> */}
                <Icono color={'action'}>settings</Icono>
              </Grid>
            </Box>
          </ToggleButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={cerrarMenu}
            autoFocus={false}
          >
            <Divider />
            <MenuItem sx={{ px: 2.5, py: 1.5, mt: 1 }} onClick={toggleTheme}>
              {themeMode === 'light' ? (
                <Icono color={'inherit'} fontSize={'small'}>
                  dark_mode
                </Icono>
              ) : (
                <Icono color={'inherit'} fontSize={'small'}>
                  light_mode
                </Icono>
              )}

              <Box width={'15px'} />
              <Typography variant={'body2'} fontWeight={'500'}>
                {themeMode === 'light' ? t('dark_mode') : t('light_mode')}{' '}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem
              sx={{ px: 2.5, py: 1.5, mt: 1 }}
              onClick={() => {
                router.push('/t2parkingcities/profile')
              }}
            >
              <Icono color={'inherit'} fontSize={'small'}>
                manage_accounts
              </Icono>
              <Box width={'15px'} />
              <Typography variant={'body2'} fontWeight={'600'}>
                {t('menu.profile')}
              </Typography>
            </MenuItem>
            <Divider />
            {
              usuario?.rol === 'ADMIN' && 
              <>
                <MenuItem
                  sx={{ px: 2.5, py: 1.5, mt: 1 }}
                  onClick={() => {
                    setModalConfiguracion(true)
                  }}
                >
                  <Icono color={'inherit'} fontSize={'small'}>
                    miscellaneous_services
                  </Icono>
                  <Box width={'15px'} />
                  <Typography variant={'body2'} fontWeight={'600'}>
                    {t('configuration.continue')}
                  </Typography>
                </MenuItem>
                <Divider />
              </>
            }
            <MenuItem
              sx={{ px: 2.5, py: 1.5, mt: 1 }}
              onClick={accionMostrarAlertaCerrarSesion}
            >
              <Icono color={'error'} fontSize={'small'}>
                logout
              </Icono>
              <Box width={'15px'} />
              <Typography variant={'body2'} fontWeight={'600'} color={'error'}>
                {t('menu.logout')}
              </Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  )
}
