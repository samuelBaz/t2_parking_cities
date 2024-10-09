import { FormInputText, optionType } from "@/common/components/ui/form"
import ProgresoLineal from "@/common/components/ui/progreso/ProgresoLineal"
import { useAlerts, useSession } from "@/common/hooks"
import { InterpreteMensajes } from "@/common/utils"
import { imprimir } from "@/common/utils/imprimir"
import { Box, Button, DialogActions, DialogContent, Grid, InputAdornment } from "@mui/material"
import { useForm } from "react-hook-form"
import { useTranslation } from "@/common/hooks/useTranslation"
import { useAuth } from "@/context/auth"
import { Constantes } from "@/config"
import { useState } from "react"
import { FormInputAutocomplete } from "@/common/components/ui/form/FormInputAutocomplete"
import { Icono } from "@/common/components/ui"
import { CreateEditDistributorType } from "../types/distributorsTypes"

interface CreateEditDistributorTypeForm {
  id?: number
  name: string
  realName: string
  description: string
  email: string
  address: string
  nit: string
  commissionType: optionType
  commissionBy: optionType
  commission: number
  version: number
}

export interface ModalParametroType {
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalCompraTicket = ({
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

  const { handleSubmit, control } = useForm<CreateEditDistributorTypeForm>({
    defaultValues: {
      id: undefined,
      commissionType: {key: '2', value: 'FIXED', label: 'Fijo'} as optionType,
      version: 0
    },
  })

  const guardarActualizarUsuario = async (
    data: CreateEditDistributorTypeForm
  ) => {
    await guardarActualizarUsuarioPeticion(data)
  }

  const guardarActualizarUsuarioPeticion = async (
    distributor: CreateEditDistributorTypeForm
  ) => {
    try {
      setLoading(true)

      const body: CreateEditDistributorType = {
        id: distributor.id,
        name: distributor.name,
        realName: distributor.realName,
        address: distributor.address,
        description: distributor.description,
        email: distributor.email,
        taxId: distributor.nit,
        commission: {
          byMonth: distributor.commissionBy ? distributor.commissionBy.value === 'BY_MONTH' ? true : false : false,
          byTicket: distributor.commissionBy ? distributor.commissionBy.value === 'BY_TICKET' ? true : false : false,
          name: distributor.commissionType.value,
          value: distributor.commission
        },
        version: distributor.version,
        cityId: usuario?.dependency!
      }
      console.log(body);
      
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/companies`,
        method: !!distributor.id ? 'put' : 'post',
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
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'name'}
                control={control}
                name="name"
                label={t('third_party_company.form.name')}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'realName'}
                control={control}
                name="realName"
                label={t('third_party_company.form.name_real')}
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
                id={'description'}
                control={control}
                name="description"
                label={t('third_party_company.form.description')}
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
                label={t('third_party_company.form.email')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icono>email</Icono>
                    </InputAdornment>
                  )
                }}
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
                id={'address'}
                control={control}
                name="address"
                label={t('third_party_company.form.address')}
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
                id={'nit'}
                control={control}
                name="nit"
                label={t('third_party_company.form.tax_id')}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box height={8}></Box>
        <Grid container display='flex' direction='column' justifyContent="center">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputAutocomplete
                id={'commissionType'}
                control={control}
                name="commissionType"
                label={t('third_party_company.form.commission_types')}
                options={[
                  {key: '1', value: 'PERCENTAGE', label: 'Porcentaje'},
                  {key: '2', value: 'FIXED', label: 'Fijo'}
                ]}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputAutocomplete
                id={'commissionBy'}
                control={control}
                name="commissionBy"
                label={t('third_party_company.form.commission_by')}
                options={[
                  {key: '1', value: 'BY_MONTH', label: 'Por Mes'},
                  {key: '2', value: 'BY_TICKET', label: 'Por Ticket'}
                ]}
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
                id={'commission'}
                control={control}
                name="commission"
                label={t('third_party_company.form.commission')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      UYU
                    </InputAdornment>
                  )
                }}
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

export default VistaModalCompraTicket