import { FormInputText } from "@/common/components/ui/form"
import ProgresoLineal from "@/common/components/ui/progreso/ProgresoLineal"
import { useAlerts, useSession } from "@/common/hooks"
import { delay, InterpreteMensajes } from "@/common/utils"
import { imprimir } from "@/common/utils/imprimir"
import { Box, Button, DialogActions, DialogContent, Grid, Typography } from "@mui/material"
import { useForm } from "react-hook-form"
import { useTranslation } from "@/common/hooks/useTranslation"
import { useAuth } from "@/context/auth"
import { Constantes } from "@/config"
import { useState } from "react"
import { CreateEditUserType } from "@/modules/users/types/UserTypes"
import { Bitacora } from "@/common/components/ui/bitacora/Bitacora"
import { generarFechaAnterior } from "@/common/utils/fechas"
import { Icono } from "@/common/components/ui"
import { IBitacoraItems } from "@/common/components/ui/bitacora/bitacoraTypes"

interface CreateEditUserTypeForm {
  id?: number
  name: string
  email: string
  password: string
}

export interface ModalParametroType {
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalConfiguracion = ({
  accionCorrecta,
  accionCancelar,
}: ModalParametroType) => {
  
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState<IBitacoraItems | null>(
    {
      titulo: t('configuration.menu.fleets'),
      descripcion: '',
      fecha: '',
      color_icono: 'success',
      icono: 'emoji_transportation',
    }
  )

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()
  const { usuario } = useAuth()

  const { handleSubmit, control } = useForm<CreateEditUserTypeForm>({
    defaultValues: {
      id: undefined,
    },
  })

  const guardarActualizarUsuario = async (
    data: CreateEditUserTypeForm
  ) => {
    await guardarActualizarUsuarioPeticion(data)
  }

  const guardarActualizarUsuarioPeticion = async (
    user: CreateEditUserTypeForm
  ) => {
    try {
      setLoading(true)

      const body: CreateEditUserType = {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: 'USER',
        dependency: usuario?.dependency!,
        version: 0
      }

      await delay(500)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/users`,
        method: !!user.id ? 'put' : 'post',
        body: body,
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar parking area`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(guardarActualizarUsuario)}>
      <DialogContent dividers>
        <Grid container display='flex' direction='row' justifyContent="center">
          <Grid item xs={2}>
            <Bitacora
              titulo=""
              onClick={(item) => setSelectedItem(item)}
              acciones={[
                {
                  titulo: '',
                  items: [
                    {
                      titulo: t('configuration.menu.fleets'),
                      descripcion: '',
                      fecha: '',
                      color_icono: 'success',
                      icono: 'emoji_transportation',
                    },
                    {
                      titulo: t('configuration.menu.payment_methods.title'),
                      descripcion: '',
                      fecha: '',
                      color_icono: 'success',
                      icono: 'paid',
                    },
                    {
                      titulo: t('configuration.menu.messaging_channels.title'),
                      descripcion: '',
                      fecha: '',
                      color_icono: 'success',
                      icono: 'email',
                    },
                    {
                      titulo: t('configuration.menu.distributors'),
                      descripcion: '',
                      fecha: '',
                      color_icono: 'success',
                      icono: 'social_distance',
                    },
                  ],
                }]}
            />
          </Grid>
          <Grid item xs={10}>
            <Grid container>
              {
                selectedItem &&
                <Typography variant={'h6'} sx={{ fontWeight: '600' }}>
                  {selectedItem.titulo}
                </Typography> 
              }
              
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <ProgresoLineal mostrar={loading} />
      <DialogActions
        sx={{
          my: 1,
          mx: 2,
          justifyContent: {
            lg: 'flex-end',
            md: 'flex-end',
            xs: 'center',
            sm: 'center',
          },
        }}
      >
        <Button
          variant={'outlined'}
          onClick={accionCancelar}
        >
          {t('cancel')}
        </Button>
        <Button variant={'contained'}  type={'submit'}>
          {t('save')}
        </Button>
      </DialogActions>
    </form>
  )
}

export default VistaModalConfiguracion