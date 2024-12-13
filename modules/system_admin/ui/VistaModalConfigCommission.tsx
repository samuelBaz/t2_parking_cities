import { FormInputText, optionType } from "@/common/components/ui/form"
import ProgresoLineal from "@/common/components/ui/progreso/ProgresoLineal"
import { useAlerts, useSession } from "@/common/hooks"
import { delay, InterpreteMensajes } from "@/common/utils"
import { imprimir } from "@/common/utils/imprimir"
import { Box, Button, DialogActions, DialogContent, Grid, InputAdornment } from "@mui/material"
import { useForm } from "react-hook-form"
import { useTranslation } from "@/common/hooks/useTranslation"
import { useAuth } from "@/context/auth"
import { Constantes } from "@/config"
import { useState } from "react"
import { CreateEditUserType } from "@/modules/users/types/UserTypes"
import { FormInputAutocomplete } from "@/common/components/ui/form/FormInputAutocomplete"
import { Commission, UpdateCommission } from "@/modules/configuracion/types/configurationCRUDTypes"

const commissionsType = [
  {key: '1', value: 'PERCENTAGE', label: 'Porcentaje'},
  {key: '2', value: 'FIXED', label: 'Fijo'}
]

interface EditCommissionTypeForm {
  id?: number
  commissionType: optionType | null
  commissionBy: optionType | null
  commission: number
}

export interface ModalCommissionType {
  commission: Commission | null
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalConfigCommission = ({
  commission,
  accionCorrecta,
  accionCancelar,
}: ModalCommissionType) => {
  const [loading, setLoading] = useState<boolean>(false)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  const { t } = useTranslation()

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()
  const { usuario } = useAuth()

  const { handleSubmit, control, watch } = useForm<EditCommissionTypeForm>({
    defaultValues: {
      id: commission?.id,
      commissionType: commissionsType.find((option: optionType) => option.value === commission?.name),
      commissionBy: commission?.byMonth? {key: '1', value: 'BY_MONTH', label: 'Por Mes'} : commission?.byTicket? {key: '2', value: 'BY_TICKET', label: 'Por Ticket'} : null,
      commission: commission?.value
    },
  })

  const guardarActualizarUsuario = async (
    data: EditCommissionTypeForm
  ) => {
    await guardarActualizarUsuarioPeticion(data)
  }

  const guardarActualizarUsuarioPeticion = async (
    commissionUpdate: EditCommissionTypeForm
  ) => {
    try {
      setLoading(true)

      const body: UpdateCommission = {
        id: commissionUpdate.id!,
        name: commissionUpdate.commissionType?.value!,
        value: commissionUpdate.commission,
        byMonth: commissionUpdate.commissionBy?.value === 'BY_MONTH',
        byTicket: commissionUpdate.commissionBy?.value === 'BY_TICKET',
        version: commission?.version!
      }

      await delay(500)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/commissions`,
        method: 'put',
        body: body,
      })
      if(respuesta.status !== 200){
        throw new Error(respuesta.message)
      }
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al actualizar comision: `, e)
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
              <FormInputAutocomplete
                id={'commissionType'}
                control={control}
                name="commissionType"
                label={t('third_party_company.form.commission_types')}
                options={commissionsType}
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
                      { watch('commissionType') && watch('commissionType')?.value === 'FIXED' ? 'UYU' : '%'}
                    </InputAdornment>
                  )
                }}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box height={8}></Box>
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

export default VistaModalConfigCommission