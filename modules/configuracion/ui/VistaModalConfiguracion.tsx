import { FormInputText, optionType } from "@/common/components/ui/form"
import ProgresoLineal from "@/common/components/ui/progreso/ProgresoLineal"
import { useAlerts, useSession } from "@/common/hooks"
import { InterpreteMensajes } from "@/common/utils"
import { imprimir } from "@/common/utils/imprimir"
import { Alert, Box, Button, Card, Checkbox, DialogActions, DialogContent, FormControlLabel, Grid, Radio, Typography } from "@mui/material"
import { useForm } from "react-hook-form"
import { useTranslation } from "@/common/hooks/useTranslation"
import { useAuth } from "@/context/auth"
import { Constantes } from "@/config"
import { useEffect, useState } from "react"
import { Bitacora } from "@/common/components/ui/bitacora/Bitacora"
import { IBitacoraItems } from "@/common/components/ui/bitacora/bitacoraTypes"
import { ConfigurationCRUDType, CreatePaymentMethod, PaymentMethodCRUDType, TypePaymentMethod, UpdateConfigurationCRUDType } from "../types/configurationCRUDTypes"
import { FormInputAutocomplete } from "@/common/components/ui/form/FormInputAutocomplete"

interface UpdateConfigTypeForm {
  id?: number
  fleets: boolean
  distributors: boolean
  paymentMethod: optionType | null
  publicKey: string | null
  secretKey: string | null
  apiKey: string | null
  clientId: string | null
}

export interface ModalParametroType {
  accionCancelar: () => void
}

export const VistaModalConfiguracion = ({
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
  const { usuario, estaAutenticado } = useAuth()
  const [configuration, setConfiguration] = useState<ConfigurationCRUDType | null>(null)

  const { handleSubmit, control, setValue, watch, getValues, reset } = useForm<UpdateConfigTypeForm>({
    defaultValues: {
      id: undefined,
    },
  })

  const guardarActualizarUsuario = async (
    data: UpdateConfigTypeForm
  ) => {
    await guardarActualizarUsuarioPeticion(data)
  }

  const guardarActualizarUsuarioPeticion = async (
    config: UpdateConfigTypeForm
  ) => {
    try {
      setLoading(true)
      if(selectedItem?.titulo === t('configuration.menu.payment_methods.title')){
        const paymentMethod = getValues('paymentMethod.value')
        const body: CreatePaymentMethod = {
          method: paymentMethod,
          cityConfigurationId: usuario?.dependency!,
          paypalSecretKey: '',
          paypalClientId: '',
          stripeApiKey: '',
          stripePublicKey: '',
          stripeSecretKey: ''
        }
        if(paymentMethod === TypePaymentMethod.PAYPAL){
          body.paypalSecretKey = config.secretKey!,
          body.paypalClientId = config.clientId!
        } else {
          body.stripeSecretKey = config.secretKey!,
          body.stripePublicKey = config.publicKey!
          body.stripeApiKey = config.apiKey!
        }
        const respuesta = await sesionPeticion({
          url: `${Constantes.baseUrl}/api/payment_methods`,
          method: 'post',
          body: body,
        })

        Alerta({
          mensaje: InterpreteMensajes(respuesta),
          variant: 'success',
        })
        reset({})
      }
      else {
        const body: UpdateConfigurationCRUDType = {
          id: configuration?.id!,
          distributors: config?.distributors,
          fleets: config?.fleets,
          version: configuration?.version!,
          cityId: configuration?.cityId!
        }

        const respuesta = await sesionPeticion({
          url: `${Constantes.baseUrl}/api/city_configurations`,
          method: 'put',
          body: body,
        })

        Alerta({
          mensaje: InterpreteMensajes(respuesta),
          variant: 'success',
        })
      }
      obtenerConfiguracionPeticion()
    } catch (e) {
      imprimir(`Error al crear o actualizar configuracion`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const obtenerConfiguracionPeticion = async () => { 
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/api/city_configurations/byCityId/${usuario?.dependency}`,
        method: 'GET'
      })
      setConfiguration(respuesta.data)
      setValue('fleets', respuesta.data.fleets)
      setValue('distributors', respuesta.data.distributors)
      
    } catch (e) {
      imprimir(`Error al obtener las configuraciones`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if(estaAutenticado) obtenerConfiguracionPeticion()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estaAutenticado])
  

  return (
    <form onSubmit={handleSubmit(guardarActualizarUsuario)}>
      <DialogContent dividers>
        <Grid container display='flex' direction={{xs: 'column', md: 'row'}} justifyContent="center">
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
                    // {
                    //   titulo: t('configuration.menu.messaging_channels.title'),
                    //   descripcion: '',
                    //   fecha: '',
                    //   color_icono: 'success',
                    //   icono: 'email',
                    // },
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
            <Grid container direction={'column'}>
              {
                selectedItem &&
                <Typography variant={'h6'} sx={{ fontWeight: '600' }}>
                  {selectedItem.titulo}
                </Typography> 
              }
              {
                selectedItem && selectedItem.titulo === t('configuration.menu.fleets') && 
                <Grid item>
                  <Grid my={2}>
                    <Alert variant="outlined" severity="info">
                      {t('configuration.fleet_description')}
                    </Alert>
                  </Grid>
                  <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                    <Grid item xs={12} sm={12} sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                      <Checkbox
                        checked={watch('fleets')? watch('fleets') : false}
                        onChange={(event) => {
                          setValue('fleets', event.target.checked)
                        }}
                      />
                      <Typography variant='body1' sx={{ fontWeight: '500', fontSize: 14}}>
                        {t('configuration.fleet_check')}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              }
              {
                selectedItem && selectedItem.titulo === t('configuration.menu.payment_methods.title') && 
                <Grid item xs={12}>
                  <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Grid container direction={'column'}>
                        <Grid item>
                          <Grid container>
                            <Grid item xs={12} md={8} mt={2}>
                              <FormInputAutocomplete
                                id={'method'}
                                control={control}
                                name="paymentMethod"
                                label={t('configuration.menu.payment_methods.select')}
                                options={[
                                  {key: '1', value: TypePaymentMethod.PAYPAL.toString(), label: TypePaymentMethod.PAYPAL.toString()}, 
                                  {key: '2', value: TypePaymentMethod.STRIPE.toString(), label: TypePaymentMethod.STRIPE.toString()}]}
                                rules={{ required: 'Este campo es requerido' }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Grid container>
                            <Grid item xs={12} md={8} mt={2}>
                              {
                                watch('paymentMethod') && watch('paymentMethod')?.value == TypePaymentMethod.STRIPE.toString() ? 
                                <Card sx={{p: 2, width: '100%'}}>
                                  <FormInputText
                                    id={'publicKey'}
                                    control={control}
                                    name="publicKey"
                                    label={'Public Key'}
                                    rules={{ required: 'Este campo es requerido' }}
                                  />
                                  <FormInputText
                                    id={'secretKey'}
                                    control={control}
                                    name="secretKey"
                                    label={'Secret Key'}
                                    rules={{ required: 'Este campo es requerido' }}
                                  />
                                  <FormInputText
                                    id={'apiKey'}
                                    control={control}
                                    name="apiKey"
                                    label={'Api Key'}
                                    rules={{ required: 'Este campo es requerido' }}
                                  />
                                </Card> :
                                watch('paymentMethod') && watch('paymentMethod')?.value == TypePaymentMethod.PAYPAL.toString() ? 
                                <Card sx={{p: 2}}>
                                  <FormInputText
                                    id={'password'}
                                    control={control}
                                    name="secretKey"
                                    label={'Secret Key'}
                                    rules={{ required: 'Este campo es requerido' }}
                                  />
                                  <FormInputText
                                    id={'password'}
                                    control={control}
                                    name="clientId"
                                    label={'Client ID'}
                                    rules={{ required: 'Este campo es requerido' }}
                                  />
                                </Card>
                                : null
                              }
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sm={6} sx={{display: 'flex', flexDirection: 'column',}}>
                      {
                        configuration?.paymentMethods && configuration.paymentMethods.length  === 0 &&
                        <Typography variant='body1' sx={{ fontWeight: '500', fontSize: 14}}>
                          {t('configuration.menu.payment_methods.add_description')}
                        </Typography>
                      }
                      {
                        configuration && configuration.paymentMethods
                          .map((paymentMethod: PaymentMethodCRUDType, index: number) => {
                            return (
                              <Card sx={{p: 2, mt: 1}} key={'payment-method-'+index}>
                                <Grid container direction={'row'}>
                                  <FormControlLabel
                                    checked={true}
                                    control={<Radio/>} 
                                    label={undefined}/>
                                  <Grid item xs>
                                    <Typography variant='h6' sx={{ fontWeight: '600', fontSize: 14}}>
                                      {paymentMethod.method}
                                    </Typography>
                                    <Typography variant='h6' sx={{ fontWeight: '300', fontSize: 14}}>
                                      {
                                        paymentMethod.method === TypePaymentMethod.PAYPAL ? 
                                        'The safer, easier way to pay online.' : 
                                        'Payments infrastructure for the internet.'
                                      }
                                    </Typography>
                                  </Grid>
                                  {
                                    paymentMethod.method === TypePaymentMethod.PAYPAL?
                                      <Box>
                                        <Box
                                          height={50}
                                          component="img"
                                          src="/images/paypal.jpg"
                                          alt="Paypal"
                                        />
                                      </Box>
                                      :<Box>
                                        <Box
                                          height={50}
                                          component="img"
                                          src="/images/stripe.jpg"
                                          alt="Stripe"
                                        />
                                      </Box>
                                  }
                                </Grid>
                              </Card>
                            )
                          })
                      }
                    </Grid>
                  </Grid>
                </Grid>
              }
              {/*{
                selectedItem && selectedItem.titulo === t('configuration.menu.messaging_channels.title') && 
                <Grid item>
                  <Grid my={2}>
                    <Alert variant="outlined" severity="info">La funcionalidad de crear flotas permite a los usuarios agrupar varios vehículos bajo un conjunto común, conocido como flota. Una flota se define como una colección organizada de automóviles o vehículos que pertenecen a un usuario o empresa y pueden ser gestionados de manera centralizada. Esta funcionalidad está diseñada para facilitar la administración de grandes cantidades de vehículos y ofrecer una visión consolidada de todos los activos vehiculares de un usuario.</Alert>
                  </Grid>
                  <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                    <Grid item xs={12} sm={12} sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                      <Checkbox
                        checked={watch('fleets')? watch('fleets') : false}
                        onChange={(event) => {
                          setValue('fleets', event.target.checked)
                        }}
                      />
                      <Typography variant='body1' sx={{ fontWeight: '500', fontSize: 14}}>
                        {t('configuration.messaging__check')}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              } */}
              {
                selectedItem && selectedItem.titulo === t('configuration.menu.distributors') && 
                <Grid item>
                  <Grid my={2}>
                    <Alert variant="outlined" severity="info">
                      {t('configuration.distributors_description')}
                    </Alert>
                  </Grid>
                  <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                    <Grid item xs={12} sm={12} sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                      <Checkbox
                        checked={watch('distributors')? watch('distributors') : false}
                        onChange={(event) => {
                          setValue('distributors', event.target.checked)
                        }}
                      />
                      <Typography variant='body1' sx={{ fontWeight: '500', fontSize: 14}}>
                        {t('configuration.distributors_check')}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
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