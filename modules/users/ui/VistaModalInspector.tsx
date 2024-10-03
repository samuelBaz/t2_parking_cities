import { FormInputText, optionType } from "@/common/components/ui/form"
import ProgresoLineal from "@/common/components/ui/progreso/ProgresoLineal"
import { useAlerts, useSession } from "@/common/hooks"
import { delay, InterpreteMensajes } from "@/common/utils"
import { imprimir } from "@/common/utils/imprimir"
import { Box, Button, DialogActions, DialogContent, Grid } from "@mui/material"
import { useForm } from "react-hook-form"
import { useTranslation } from "@/common/hooks/useTranslation"
import { useAuth } from "@/context/auth"
import { Constantes } from "@/config"
import { CreateEditInspectorType, CreateEditUserType } from "../types/UserTypes"
import { useState } from "react"
import { FormInputAutocomplete } from "@/common/components/ui/form/FormInputAutocomplete"

interface CreateEditUserTypeForm {
  id?: number
  name: string
  email: string
  password: string
  parkingAreas: Array<optionType>
  permissions: Array<optionType>
}

export interface ModalParametroType {
  parkingAreas: Array<optionType>
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalInspector = ({
  parkingAreas,
  accionCorrecta,
  accionCancelar,
}: ModalParametroType) => {
  const [loading, setLoading] = useState<boolean>(false)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  const { t } = useTranslation()

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()
  const { usuario } = useAuth()

  const { handleSubmit, control } = useForm<CreateEditUserTypeForm>({
    defaultValues: {
      id: undefined,
      parkingAreas: []
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

      const body: CreateEditInspectorType = {
        id: user.id,
        user: {
          name: user.name,
          email: user.email,
          password: user.password,
          role: 'INSPECTOR',
          dependency: usuario?.dependency!,
        },
        parkingAreas: user.parkingAreas.map((parking: any) => {
          return {id: parking.value}
        }),
        permissions: user.permissions.map((permission: any) => permission.value),
        version: 0
      }
      console.log(body);
      
      await delay(500)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/inspectors`,
        method: !!user.id ? 'put' : 'post',
        body: body,
      })
      if(respuesta.status !== 200){
        Alerta({
          mensaje: respuesta.message,
          variant: 'error',
        })
        return
      }
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
        <Grid container display='flex' direction='column' justifyContent="center">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'name'}
                control={control}
                name="name"
                label={t('third_party_company.user.username')}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box height={8}></Box>
        <Grid container display='flex' direction='column' justifyContent="center">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'email'}
                control={control}
                name="email"
                label={t('email')}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box height={8}></Box>
        <Grid container display='flex' direction='column' justifyContent="center">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'password'}
                control={control}
                type="password"
                name="password"
                label={t('password')}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box height={8}></Box>
        <Grid container display='flex' direction='column' justifyContent="center">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputAutocomplete
                id={'parkingAreas'}
                control={control}
                name="parkingAreas"
                label={t('inspectors.form.assign')}
                options={parkingAreas}
                multiple
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box height={8}></Box>
        <Grid container display='flex' direction='column' justifyContent="center">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputAutocomplete
                id={'permissions'}
                control={control}
                name="permissions"
                label={t('inspectors.form.permissions')}
                options={[{key: '1', value: 'CONSULT', label: 'Consulta'}, {key: '2', value: 'PENALIZE', label: 'Multar'}]}
                multiple
                rules={{ required: 'Este campo es requerido' }}
              />
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

export default VistaModalInspector