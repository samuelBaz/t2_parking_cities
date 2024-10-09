// import { Enforcer } from 'casbin'
import { useRouter } from 'next/router'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
// import { useAlerts, useCasbinEnforcer, useSession } from '../../common/hooks'/
import { useAlerts, useSession } from '../../common/hooks'
import { Servicios } from '../../common/services'
import {
  delay,
  encodeBase64,
  guardarCookie,
  InterpreteMensajes,
  leerCookie,
} from '../../common/utils'
import { imprimir } from '../../common/utils/imprimir'
import { Constantes } from '../../config'
// import {
//   CambioRolNivelDependenciaType,
//   LoginCodeType,
//   LoginType,
//   RolNivelType,
//   UsuarioType,
// } from '../../modules/login/types/loginTypes'
import { useFullScreenLoading } from '../ui'

import { CasbinTypes } from '../../common/types'
import { LoginType, UsuarioType } from '@/modules/login/types/loginTypes'
// import { DependenciaType } from '../../modules/admin/usuarios/types/usuariosCRUDTypes'

interface ContextProps {
  cargarUsuarioManual: () => Promise<void>
  estaAutenticado: boolean
  sincronizado: boolean
  usuario: UsuarioType | null
  ingresar: ({ email, password }: LoginType) => Promise<void>
  progresoLogin: boolean
  // permisoUsuario: (routerName: string) => Promise<CasbinTypes>
  // permisoRecurso: (recurso: string, accion: string) => Promise<boolean>
  // permisoAccion: (routerName: string, accion: string) => Promise<boolean>
}

const AuthContext = createContext<ContextProps>({} as ContextProps)

interface AuthContextType {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthContextType) => {
  const [user, setUser] = useState<UsuarioType | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

  const router = useRouter()

  const { sesionPeticion, borrarCookiesSesion } = useSession()
  // const {
  //   interpretarPermiso,
  //   inicializarCasbin,
  //   permisoSobreRecurso,
  //   permisoSobreAccion,
  // } = useCasbinEnforcer()
  // const [enforcer, setEnforcer] = useState<Enforcer>()

  const inicializarUsuario = async () => {
    const token = leerCookie('token')

    if (!token) {
      setLoading(false)
      return
    }
    try {
      mostrarFullScreen()
      await obtenerUsuarioDetalle()
      // await obtenerPermisos()
    } catch (error: Error | any) {
      
      imprimir(`Error durante inicializarUsuario 🚨`, typeof error, error)
      borrarSesionUsuario()
      await router.replace({
        pathname: '/login',
      })
      throw error
    } finally {
      setLoading(false)
      ocultarFullScreen()
    }
  }

  const borrarSesionUsuario = () => {
    setUser(null)
    borrarCookiesSesion()
  }

  const cargarUsuarioManual = async () => {
    try {
      await obtenerUsuarioDetalle()
      // await obtenerPermisos()

      mostrarFullScreen()

      await router.replace({
        pathname: '/t2parkingcities/home',
      })
    } catch (error: Error | any) {
      imprimir(`Error durante cargarUsuarioManual 🚨`, error)
      borrarSesionUsuario()

      imprimir(`🚨 -> login`)
      await router.replace({
        pathname: '/login',
      })
      throw error
    } finally {
      ocultarFullScreen()
    }
  }

  useEffect(() => {
    if (!router.isReady) return

    inicializarUsuario()
      .catch(imprimir)
      .finally(() => {
        imprimir('Verificación de login finalizada 👨‍💻')
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  const login = async ({ email, password }: LoginType) => {
    try {
      setLoading(true)
      const respuesta = await Servicios.post({
        url: `${Constantes.baseUrl}/auth/insecure/login`,
        body: { email, password },
        withCredentials: false,
        headers: {},
      })

      if(respuesta.status != 0){
        throw new Error(`${respuesta.message}`)
      }

      guardarCookie('token', respuesta.token.access_token)
      guardarCookie('refresh_token', respuesta.token.refresh_token)
      imprimir(`Token ✅: ${respuesta.token.access_token}`)

      const userType: UsuarioType = {
        email: respuesta.user.email,
        access_token: respuesta.token.access_token,
        rol: respuesta.user.role,
        id: respuesta.user.id,
        dependency: respuesta.user.dependency
      }

      setUser(userType)

      imprimir(`Usuarios ✅`, respuesta.datos)

      // await obtenerPermisos()

      mostrarFullScreen()
      await delay(500)
      await router.replace({
        pathname: '/t2parkingcities/home',
      })
    } catch (e) {
      imprimir(`Error al iniciar sesión: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
      borrarSesionUsuario()
    } finally {
      setLoading(false)
      ocultarFullScreen()
    }
  }

  // const CambiarRolNivelDependencia = async ({
  //   idRolNivel,
  //   idDependencia,
  // }: CambioRolNivelDependenciaType) => {
  //   imprimir(
  //     `Cambiando rolNivel Depedencia 👮‍♂️: ${idRolNivel}, ${idDependencia}`
  //   )
  //   await actualizarRolNivelDependencia({ idRolNivel, idDependencia })
  //   await obtenerPermisos()
  //   await router.replace({
  //     pathname: '/admin/home',
  //   })
  // }

  // const actualizarRolNivelDependencia = async ({
  //   idRolNivel,
  //   idDependencia,
  // }: CambioRolNivelDependenciaType) => {
  //   const respuestaUsuario = await sesionPeticion({
  //     method: 'patch',
  //     url: `${Constantes.baseUrl}/cambiarRolNivelDependencia`,
  //     body: {
  //       idRolNivel,
  //       idDependencia,
  //     },
  //   })

  //   guardarCookie('token', respuestaUsuario.datos?.access_token)
  //   imprimir(`Token ✅: ${respuestaUsuario.datos?.access_token}`)

  //   setUser(respuestaUsuario.datos)
  //   setSincronizado(Boolean(respuestaUsuario.datos.sincronizacion))
  //   imprimir(
  //     `rol definido en obtenerUsuarioRol 👨‍💻: ${respuestaUsuario.datos.idRolNivel}`
  //   )
  // }

  // const obtenerPermisos = async () => {
  //   const respuestaPermisos = await sesionPeticion({
  //     url: `${Constantes.baseUrl}/autorizacion/permisos`,
  //   })

  //   setEnforcer(await inicializarCasbin(respuestaPermisos.datos))
  // }

  const obtenerUsuarioDetalle = async () => {
    const respuestaUsuario = await sesionPeticion({
      url: `${Constantes.baseUrl}/api/cities/userDetail`,
    })
    const userType: UsuarioType = {
      email: respuestaUsuario.data.email,
      access_token: '',
      rol: respuestaUsuario.data.role,
      id: respuestaUsuario.data.id,
      dependency: respuestaUsuario.data.dependency
    }
    console.log(userType);
    
    setUser(userType)
  }

  // const usuarioRolNivel = () =>
  //   user?.rolesNiveles.find((rol: any) => rol.idRolNivel == user?.idRolNivel)
  // const dependencia = () => user?.dependencia

  return (
    <>
      <AuthContext.Provider
        value={{
          cargarUsuarioManual,
          estaAutenticado: !!user && !loading,
          usuario: user,
          sincronizado: true,
          ingresar: login,
          progresoLogin: loading,
          // permisoRecurso: 
          // (recurso: string, accion: string) =>
          //   permisoSobreRecurso({
          //     enforcer,
          //     idUsuario: user?.id ?? '',
          //     rol: usuarioRolNivel()?.rol ?? '',
          //     recurso: recurso,
          //     accion: accion,
          //   }),
          // permisoAccion: (routerName: string, accion: string) =>
          //   permisoSobreAccion({
          //     enforcer,
          //     idUsuario: user?.id ?? '',
          //     rol: usuarioRolNivel()?.rol ?? '',
          //     routerName,
          //     accion: accion,
          //   }),
          // permisoUsuario: (routerName: string) =>
          //   interpretarPermiso({
          //     enforcer: enforcer,
          //     idUsuario: user?.id ?? '',
          //     rol: usuarioRolNivel()?.rol ?? '',
          //     routerName: routerName,
          //   }),
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  )
}

export const useAuth = () => useContext(AuthContext)
