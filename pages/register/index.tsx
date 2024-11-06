import { LayoutLogin } from "@/common/components/layouts"
import { Icono } from "@/common/components/ui"
import { FormInputText, optionType } from "@/common/components/ui/form"
import { FormInputAutocomplete } from "@/common/components/ui/form/FormInputAutocomplete"
import LanguageMenu from "@/common/components/ui/language/LanguageMenu"
import ProgresoLineal from "@/common/components/ui/progreso/ProgresoLineal"
import { useAlerts, useSession } from "@/common/hooks"
import { useTranslation } from "@/common/hooks/useTranslation"
import { delay, InterpreteMensajes } from "@/common/utils"
import { imprimir } from "@/common/utils/imprimir"
import { Constantes } from "@/config"
import { useAuth } from "@/context/auth"
import { LoginType } from "@/modules/login/types/loginTypes"
import { Country, RegisterType } from "@/modules/register/types/registerTypes"
import { Box, Button, Card, CardActions, CardContent, Divider, Grid, InputAdornment, Typography, useTheme } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

interface RegisterTypeForm {
  email: string
  password: string
  name: string
  phone: string
  country: optionType
}

const Register = () => {
  
  const { t } = useTranslation()
  const router = useRouter()
  const { palette } = useTheme()
  const [loading, setloading] = useState<boolean>(true)
  const [countries, setCountries] = useState<Array<optionType>>([])
  const { sesionPeticion } = useSession()
  const { handleSubmit, control } = useForm<RegisterTypeForm>({})
  const { Alerta } = useAlerts()

  const registrarCiudad = async (form: RegisterTypeForm) => {
    try {
      setloading(true)
      const body : RegisterType = {
        email: form.email,
        password: form.password,
        name: form.name,
        phone: form.phone,
        countryId: form.country.value
      }
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/auth/insecure/create`,
        method: 'POST',
        body: body,
        withCredentials: false
      })
      if(respuesta.status !== 200){
        throw new Error(respuesta.message)
      }
      Alerta({ mensaje: "Registro exitoso, verifica tu email.", variant:'success' })
      router.push('/verify-email')
    } catch (e) {
      imprimir(`Error al registrar`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setloading(false)
    }
  }

  useEffect(() => {
    obtenerCiudadesPeticion()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const obtenerCiudadesPeticion = async () => {
    try {
      setloading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/auth/insecure/countries`,
        withCredentials: false
      })
      const dataResponse: Country[] = respuesta.data.content
      if(dataResponse){
        setCountries(
          dataResponse.map((country: Country) => {
            return { 
              value: country.id.toString(), 
              label: country.name, 
              key: country.id.toString()
            } as optionType
          })
        )
      }
    } catch (e) {
      imprimir(`Error al obtener ciudades`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setloading(false)
    }
  }

  return (
    <LayoutLogin>
      <Grid container justifyContent="space-evenly" alignItems={'center'}>
        <Grid item xl={3.2} md={5} xs={12}>
          <form onSubmit={handleSubmit(registrarCiudad)}>
            <Card
              sx={{
                width: '100%',
                borderRadius: 4,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  height: 123,
                  justifyContent: 'center',
                  backgroundColor: '#F7F2EC',
                  alignItems: 'center',
                }}
              >
                <Box height={40} component="img" src="/logo.png" alt="Sive V2" />
              </Box>
              <CardContent sx={{paddingX:4}}>
                  <Typography align={'center'} sx={{ fontWeight: '600' }}>
                  {t('authentication.register.title')} T2 Parking Cities
                  </Typography>
                  <Divider sx={{my: 2}}/>
                  <Grid container direction="column" spacing={{ xs: 2, sm: 1, md: 2 }}>
                    <Grid item xs={12} sm={12} md={12}>
                      <FormInputText
                        id={'email'}
                        control={control}
                        name="email"
                        label={t('email')}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Icono>email</Icono>
                            </InputAdornment>
                          )
                        }}
                        rules={{
                          required: { value: true, message: 'Campo de registro obligatorio' },
                          pattern: {
                            value: /[^-\s]/,
                            message: 'No se permite espacios en blanco',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <FormInputText
                        id={'phone'}
                        control={control}
                        name="phone"
                        label={t('authentication.register.phone')}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Icono>phone</Icono>
                            </InputAdornment>
                          )
                        }}
                        rules={{
                          required: { value: true, message: 'Campo de registro obligatorio' },
                          pattern: {
                            value: /[^-\s]/,
                            message: 'No se permite espacios en blanco',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <FormInputAutocomplete
                        id={'country'}
                        control={control}
                        name="country"
                        label={t('authentication.register.country')}
                        options={countries}
                        rules={{
                          required: { value: true, message: 'Campo de registro obligatorio' },
                          pattern: {
                            value: /[^-\s]/,
                            message: 'No se permite espacios en blanco',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <FormInputText
                        id={'name'}
                        control={control}
                        name="name"
                        label={t('authentication.register.name_city')}
                        rules={{
                          required: { value: true, message: 'Campo de registro obligatorio' },
                          pattern: {
                            value: /[^-\s]/,
                            message: 'No se permite espacios en blanco',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <FormInputText
                        id={'passowrd'}
                        type="password"
                        control={control}
                        name="password"
                        label={t('password')}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Icono>https</Icono>
                            </InputAdornment>
                          )
                        }}
                        rules={{
                          required: { value: true, message: 'Campo de registro obligatorio' },
                        }}
                      />
                    </Grid>
                  </Grid>
              </CardContent>
              <ProgresoLineal mostrar={loading}/>
              <CardActions sx={{paddingX:4, pb: 4}} >
                <Button
                  size='small' 
                  fullWidth 
                  variant="contained" 
                  type='submit'>
                  {t('authentication.create_account')}
                </Button>
              </CardActions>
              <Box sx={{px: 4, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mb: 4}}>
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <Typography variant="caption">
                    {t('authentication.register.already_account')}
                  </Typography>
                  <Box
                    sx={{cursor: 'pointer', ml: 1, display: 'flex', justifyContent: 'end'}}
                      onClick={() => {
                        router.push('/login')
                      }}>
                    <Typography variant="caption" color={palette.primary.main}>{t('authentication.login_account')}</Typography>
                  </Box>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <Typography variant="caption">
                    {t('language.language')}
                  </Typography>
                  <LanguageMenu/>
                </Box>
              </Box>
            </Card>
          </form>
        </Grid>
      </Grid>
    </LayoutLogin>
  )
}

export default Register