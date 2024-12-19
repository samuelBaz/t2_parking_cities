import { delay, eliminarCookie, guardarCookie, leerCookie } from '../utils'
import { imprimir } from '../utils/imprimir'
import {
  estadosRutasSinPermiso,
  estadosSinPermiso,
  peticionFormatoMetodo,
  Servicios,
} from '../services'
import { verificarToken } from '../utils/token'
import { Constantes } from '../../config'
import { useFullScreenLoading } from '../../context/ui'
import { useRouter } from 'next/router'

export const useSession = () => {
  const router = useRouter()

  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

  const sesionPeticion = async ({
    url,
    method = 'get',
    body,
    headers,
    params,
    responseType,
    withCredentials = true,
  }: peticionFormatoMetodo) => {
    
    try {
      if(withCredentials){
        if (!verificarToken(leerCookie('token') ?? '')) {
          imprimir(`Token caducado ⏳`)
          await actualizarSesion()
        }

        const cabeceras = {
          accept: 'application/json',
          Authorization: `Bearer ${leerCookie('token') ?? ''}`,
          ...headers,
        }

        imprimir(`enviando 🔐🌍`, body, method, url, cabeceras)
        const response = await Servicios.peticionHTTP({
          url,
          method: method,
          headers: cabeceras,
          body,
          params,
          responseType,
          withCredentials,
        })
        imprimir('respuesta 🔐📡', body, method, url, response)
        return response.data
      } else {
        const response = await Servicios.peticion({
          url,
          method: method,
          body,
          params,
          responseType,
          withCredentials,
        })
        imprimir('respuesta 🔐📡', body, method, url, response)
        return response.data
      }
    } catch (e: import('axios').AxiosError | any) {
      
      if (e.code === 'ECONNABORTED') {
        throw new Error('La petición está tardando demasiado')
      }

      if (Servicios.isNetworkError(e)) {
        borrarCookiesSesion()
        router.reload()
        await delay(200)
        throw new Error('Error en la conexión 🌎')
      }

      if (estadosSinPermiso.includes(e.response?.status)) {
        mostrarFullScreen()
        await cerrarSesion()
        ocultarFullScreen()
        return
      }
      if(estadosRutasSinPermiso.includes(e.response?.status)){
        mostrarFullScreen()
        router.back()
        ocultarFullScreen()
        return
      }

      throw e.response?.data || 'Ocurrio un error desconocido'
    }
  }

  const borrarCookiesSesion = () => {
    eliminarCookie('token') // Eliminando access_token
    eliminarCookie('refresh_token') // Eliminando access_token
    eliminarCookie('jid') // Eliminando refresh token
  }

  const cerrarSesion = async () => {
    try {
      mostrarFullScreen()
      const token = leerCookie('token')
      borrarCookiesSesion()

      const respuesta = await Servicios.get({
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        url: `${Constantes.baseUrl}/logout`,
      })
      imprimir(`finalizando con respuesta`, respuesta)

      if (respuesta?.url) {
        window.location.href = respuesta?.url
      } else {
        router.reload()
      }
    } catch (e) {
      imprimir(`Error al cerrar sesión: `, e)
      router.reload()
    } finally {
      ocultarFullScreen()
    }
  }

  const actualizarSesion = async () => {
    imprimir(`Actualizando token 🚨`)

    try {
      const respuesta = await Servicios.post({
        url: `${Constantes.baseUrl}/auth/insecure/refreshToken`,
        withCredentials: false,
        body: {
          token: leerCookie('refresh_token'),
        },
      })

      guardarCookie('token', respuesta.token.access_token)
      guardarCookie('refresh_token', respuesta.token.refresh_token)

      await delay(500)
    } catch (e) {
      await cerrarSesion()
    }
  }

  return { sesionPeticion, cerrarSesion, borrarCookiesSesion }
}
