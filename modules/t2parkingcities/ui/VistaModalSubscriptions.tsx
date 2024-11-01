import { FormInputDropdown, FormInputText, optionType } from "@/common/components/ui/form"
import ProgresoLineal from "@/common/components/ui/progreso/ProgresoLineal"
import { useAlerts, useSession } from "@/common/hooks"
import { InterpreteMensajes } from "@/common/utils"
import { imprimir } from "@/common/utils/imprimir"
import { Box, Button, Checkbox, DialogActions, DialogContent, FormControlLabel, Grid, Paper, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "@/common/hooks/useTranslation"
import { useAuth } from "@/context/auth"
import { CreateUpdateSubscriptionBlockType, CreateUpdateSubscriptionType, Subscription, SubscriptionBlock } from "../types/subscriptionTypes"
import { Vehicle } from "../types/scheduleTypes"
import { Constantes } from "@/config"

interface CreateEditSusbcriptionTypeForm {
  id?: number
  name: string
  currencyId: string | undefined
  prices: Record<string, any>
  version: number
}

export interface ModalParametroType {
  subscription?: Subscription | null
  currencies: Array<optionType>
  vehicles: Array<Vehicle>
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalSubscriptions = ({
  subscription,
  currencies,
  vehicles,
  accionCorrecta,
  accionCancelar,
}: ModalParametroType) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  const { t } = useTranslation()

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()
  const { usuario } = useAuth()

  const { handleSubmit, control, watch, setValue, getValues } = useForm<CreateEditSusbcriptionTypeForm>({
    defaultValues: {
      id: subscription?.id,
      name: subscription?.name,
      currencyId: subscription?.currencyId? subscription.currencyId.toString() : undefined,
      version: subscription?.version
    },
  })

  useEffect(() => {
    setLoadingModal(true)
    vehicles.forEach(vehicle => {
      setValue(`prices.[${vehicle.id}].checked`, subscription? false : true)
      setValue(`prices.[${vehicle.id}].vehicle`, vehicle.id)
    })
    if(subscription){
      subscription?.subscriptionBlocks.forEach((subscription: SubscriptionBlock) => {
        setValue(`prices.[${subscription.vehicleId}].checked`, true)
        setValue(`prices.[${subscription.vehicleId}].value`, subscription.price)
        setValue(`prices.[${subscription.vehicleId}].id`, subscription.id)
      })
    }
    setLoadingModal(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscription])

  const guardarActualizarSubscription = async (
    data: CreateEditSusbcriptionTypeForm
  ) => {
    await guardarActualizarSubscriptionPeticion(data)
  }

  const guardarActualizarSubscriptionPeticion = async (
    subscriptionForm: CreateEditSusbcriptionTypeForm
  ) => {
    try {
      setLoading(true)
      
      const body: CreateUpdateSubscriptionType = {
        id: subscriptionForm.id,
        name: subscriptionForm.name,
        currencyId: subscriptionForm.currencyId!,
        subscriptionBlocks: subscriptionForm.prices
          .filter((price: any) => price.checked)
          .map((price: any) => {
            const vehicle = vehicles.find((vehicle: Vehicle) => vehicle.id === price.vehicle)

            return {name: vehicle? vehicle.name : price.vehicle, price: price.value, vehicleId: price.vehicle, id: price.id} as CreateUpdateSubscriptionBlockType
          }),
        cityId: usuario?.dependency!,
        version: subscriptionForm.version,
      }

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/subscriptions`,
        method: !!subscriptionForm.id ? 'put' : 'post',
        body: body,
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar suscripción`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(guardarActualizarSubscription)}>
      <DialogContent dividers>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'name'}
                control={control}
                name="name"
                label={t('subscriptions.form.name_of_subscription')}
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box height={8}></Box>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputDropdown
                id={'name'}
                control={control}
                name="currencyId"
                label={t('schedules.form.currency')}
                options={currencies}
                disabled={false}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box height={8}></Box>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Typography variant="subtitle2" fontWeight={600}>
            Precios
          </Typography>
          {
            !loadingModal && vehicles.map((vehicle: Vehicle, index: number) => {
              return (
                <Paper key={'vehicle-price-'+index} sx={{mb: 1}}>
                  <Grid container sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Grid item xs>
                      <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Grid item>
                          <Checkbox
                            defaultChecked={true} 
                            checked={watch(`prices.[${vehicle.id}].checked`)}
                            onChange={(event) => {
                              setValue(`prices.[${vehicle.id}].checked`, event.target.checked)
                              if(!event.target.checked){
                                setValue(`prices.[${vehicle.id}].value`, '')
                              }
                            }}
                            inputProps={{ 'aria-label': 'controlled' }}/>
                        </Grid>
                        <Grid item>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {vehicle.name}
                          </Typography>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid item xs>
                      <Typography variant="subtitle2" fontWeight={400}>
                        {t('subscription')}
                      </Typography>
                    </Grid>
                    <Grid item xs>
                      <Typography variant="subtitle2" fontWeight={400}>
                        {`${t('schedules.form.price')} ${watch('currencyId')? `(${currencies.find(currency => currency.value === watch('currencyId'))?.label})`: ``} `}
                      </Typography>
                    </Grid>
                    <Grid item xs sx={{pr: 1}}>
                      <FormInputText
                        id={'price'}
                        control={control}
                        name={`prices.[${vehicle.id}].value`}
                        label={''}
                        disabled={watch(`prices.[${vehicle.id}].checked`) === undefined ? false : !watch(`prices.[${vehicle.id}].checked`)}
                        rules={{ required: { value: watch(`prices.[${vehicle.id}].checked`), message:'Este campo es requerido'}}}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              )
            })
          }
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
          disabled={loadingModal}
          onClick={accionCancelar}
        >
          {t('cancel')}
        </Button>
        <Button variant={'contained'} disabled={loadingModal} type={'submit'}>
          {t('save')}
        </Button>
      </DialogActions>
    </form>
  )
}

export default VistaModalSubscriptions