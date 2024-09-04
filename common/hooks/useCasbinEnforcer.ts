// import { PoliticaType } from '../../modules/login/types/loginTypes'
// import { Enforcer } from 'casbin'
// import { imprimir } from '../utils/imprimir'
// import { basicModel, basicPolicy } from '../utils/casbin'

// interface InterpretarPermisoParams {
//   enforcer?: Enforcer
//   idUsuario: string
//   routerName: string
//   rol: string
// }

// interface PermisoSobreRecursoParams {
//   enforcer?: Enforcer
//   idUsuario: string
//   rol: string
//   recurso: string
//   accion: string
// }

// interface PermisoSobreAccionParams {
//   enforcer?: Enforcer
//   idUsuario: string
//   rol: string
//   routerName: string
//   accion: string
// }

// export const useCasbinEnforcer = () => {
//   interface VerificarAutorizacionType {
//     enforcer?: Enforcer
//     idUsuario: string
//     politica?: PoliticaType
//   }

//   const inicializarCasbin = async (politicas: string[][]) => {
//     const casbinLib = await import('casbin')
//     imprimir(`casbinLib 🪄`, casbinLib)

//     const model = casbinLib.newModelFromString(basicModel)
//     const policy = new casbinLib.StringAdapter(basicPolicy)
//     const enforcerTemp: Enforcer = await casbinLib.newEnforcer(model, policy)
//     for await (const p of politicas) {
//       await enforcerTemp.addPolicy(p[0], p[1], p[2], p[3], p[4], p[5])
//     }
//     return enforcerTemp
//   }

//   const verificarAutorizacion = async ({
//     enforcer,
//     idUsuario,
//     politica,
//   }: VerificarAutorizacionType): Promise<boolean> => {
//     const [permisoUser, politicas] =
//       (await enforcer?.enforceEx(
//         idUsuario,
//         politica?.objeto,
//         politica?.accion,
//         Date.now()
//       )) ?? []

//     if ((politicas ?? []).length > 0) {
//       // si tiene el permiso para usuario
//       return permisoUser ?? false
//     }

//     return (
//       (await enforcer?.enforce(
//         politica?.sujeto,
//         politica?.objeto,
//         politica?.accion,
//         Date.now()
//       )) ?? false
//     )
//   }

//   const permisoSobreRecurso = ({
//     enforcer,
//     idUsuario,
//     rol,
//     recurso,
//     accion,
//   }: PermisoSobreRecursoParams) => {
//     return verificarAutorizacion({
//       enforcer,
//       idUsuario,
//       politica: {
//         sujeto: rol,
//         objeto: recurso,
//         accion: accion,
//       },
//     })
//   }
//   const permisoSobreAccion = ({
//     enforcer,
//     idUsuario,
//     rol,
//     routerName,
//     accion,
//   }: PermisoSobreAccionParams) => {
//     return verificarAutorizacion({
//       enforcer,
//       idUsuario,
//       politica: {
//         sujeto: rol,
//         objeto: routerName,
//         accion: accion,
//       },
//     })
//   }

//   const interpretarPermiso = async ({
//     enforcer,
//     idUsuario,
//     routerName,
//     rol,
//   }: InterpretarPermisoParams) => {
//     return {
//       read: await verificarAutorizacion({
//         enforcer: enforcer,
//         idUsuario,
//         politica: {
//           sujeto: rol ?? '',
//           objeto: routerName,
//           accion: 'read',
//         },
//       }),
//       create: await verificarAutorizacion({
//         enforcer: enforcer,
//         idUsuario,
//         politica: {
//           sujeto: rol ?? '',
//           objeto: routerName,
//           accion: 'create',
//         },
//       }),
//       update: await verificarAutorizacion({
//         enforcer: enforcer,
//         idUsuario,
//         politica: {
//           sujeto: rol ?? '',
//           objeto: routerName,
//           accion: 'update',
//         },
//       }),
//       delete: await verificarAutorizacion({
//         enforcer: enforcer,
//         idUsuario,
//         politica: {
//           sujeto: rol ?? '',
//           objeto: routerName,
//           accion: 'delete',
//         },
//       }),
//     }
//   }
//   return {
//     inicializarCasbin,
//     interpretarPermiso,
//     permisoSobreRecurso,
//     permisoSobreAccion,
//   }
// }
