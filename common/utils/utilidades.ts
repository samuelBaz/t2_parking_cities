import childProcess from 'child_process'
import { Constantes } from '../../config'
// import { IZXCVBNResult } from 'zxcvbn-typescript'
import packageJson from '../../package.json'
// import { RolNivelType } from '../../modules/login/types/loginTypes'
// import {
//   ConstanteNivelAcceso,
//   DependenciaType,
// } from '../../modules/admin/usuarios/types/usuariosCRUDTypes'

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const encodeBase64 = (data: string) => {
  return Buffer.from(data).toString('base64')
}
export const decodeBase64 = (data: string) => {
  return Buffer.from(data, 'base64').toString('ascii')
}

export const titleCase = (word: string) => {
  return word.length <= 1
    ? word.toUpperCase()
    : word
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export const execChildProcess = async (comando: string) => {
  const childProcess = require('child_process')
  return await new Promise((resolve, reject) => {
    childProcess.exec(
      comando,
      (error: childProcess.ExecException, stdout: string, stderr: string) => {
        return error ? reject(stderr) : resolve(stdout)
      }
    )
  })
}

export const versionNumber = () => {
  return packageJson.version
}

export const serviceName = () => {
  return packageJson.name
}

export const siteName = () => {
  return Constantes.siteName ?? ''
}

// export const seguridadPass = async (pass: string): Promise<IZXCVBNResult> => {
//   const zxcvbnLib = (await import('zxcvbn-typescript')).default
//   return zxcvbnLib(pass)
// }
export const mensajeSincronizado =
  'La acción ha sido desabilitada, solo puede llevarse acabo desde el sistema core de usuarios'

export const getRandomId = () => {
  return Math.floor(Math.random() * 100000) * -1
}

// export const obtenerDescripcionRolNivel = (data: RolNivelType) => {
//   return data.rol + ' - ' + data.nivelAcceso
// }

// export const obtenerDescripcionDependencia = (
//   data: DependenciaType | undefined
// ) => {
//   if (!data) return ''
//   if (data.idRegionalAsuss) return data.regionalAsuss?.nombre
//   if (data.idDepartamento) return data.departamento?.nombre
//   if (data.idRed) return data.red?.codigo + ' - ' + data.red?.nombre
//   if (data.idMunicipio)
//     return data.municipio?.codigo + ' - ' + data.municipio?.nombre
//   if (data.idInstitucion)
//     return data.institucion?.codigo + ' - ' + data.institucion?.nombre
//   if (data.idEstablecimiento)
//     return data.establecimiento?.codigo + ' - ' + data.establecimiento?.nombre
//   return 'NO ESTABLECIDO'
// }

// export const obtenerDescripcionDependenciaListado = (
//   data: DependenciaType | undefined
// ) => {
//   if (!data) return ''
//   if (data.regionalAsuss) return data.regionalAsuss?.nombre
//   if (data.departamento) return data.departamento?.nombre
//   if (data.red) return data.red?.nombre
//   if (data.municipio) return data.municipio?.nombre
//   if (data.institucion) return data.institucion?.nombre
//   if (data.establecimiento) return data.establecimiento?.nombre
//   return 'NO ESTABLECIDO'
// }

// export const obtenerColor = (nivelAcceso: string | undefined) => {
//   if (nivelAcceso === ConstanteNivelAcceso.NACIONAL) return '#011F1B'
//   if (nivelAcceso === ConstanteNivelAcceso.ASUSS) return '#011F1B'
//   if (nivelAcceso === ConstanteNivelAcceso.DEPARTAMENTO) return '#022A24'
//   if (nivelAcceso === ConstanteNivelAcceso.RED) return '#023E36'
//   if (nivelAcceso === ConstanteNivelAcceso.MUNICIPIO) return '#035348'
//   if (nivelAcceso === ConstanteNivelAcceso.INSTITUCION) return '#228577'
//   if (nivelAcceso === ConstanteNivelAcceso.ESTABLECIMIENTO) return '#40A395'
//   return 'black'
// }
