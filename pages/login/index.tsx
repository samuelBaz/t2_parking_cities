import { LayoutLogin } from "@/common/components/layouts"
import { Icono } from "@/common/components/ui"
import { FormInputText } from "@/common/components/ui/form"
import LanguageMenu from "@/common/components/ui/language/LanguageMenu"
import ProgresoLineal from "@/common/components/ui/progreso/ProgresoLineal"
import { useTranslation } from "@/common/hooks/useTranslation"
import { useAuth } from "@/context/auth"
import { LoginType } from "@/modules/login/types/loginTypes"
import { Box, Button, Card, CardActions, CardContent, Divider, Grid, InputAdornment, Typography, useTheme } from "@mui/material"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"

const Login = () => {
  
  const { t } = useTranslation()
  const { ingresar, progresoLogin } = useAuth()
  const router = useRouter()
  const { palette } = useTheme()
  const { handleSubmit, control } = useForm<LoginType>({})

  const iniciarSesion = async ({ email, password }: LoginType) => {
    
    await ingresar({ email, password })
  }

  return (
    <LayoutLogin>
      <Grid container justifyContent="space-evenly" alignItems={'center'}>
        <Grid item xl={3.2} md={5} xs={12}>
          <form onSubmit={handleSubmit(iniciarSesion)}>
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
                    {t('authentication.login.title').replace('TOKEN', 'T2 Parking Cities')} 
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
                      <Box
                        sx={{cursor: 'pointer', mt: 1, display: 'flex', justifyContent: 'end'}}
                          onClick={() => {
                            router.push('/forgot-password')
                          }}>
                        <Typography variant="caption" color={palette.primary.main}>{t('authentication.login.forgot')}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
              </CardContent>
              <ProgresoLineal mostrar={progresoLogin}/>
              <CardActions sx={{paddingX:4, pb: 4}} >
                <Button
                  size='small' 
                  fullWidth 
                  variant="contained" 
                  type='submit'>
                  {t('continue')}
                </Button>
              </CardActions>
              <Box sx={{px: 4, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mb: 4}}>
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <Typography variant="caption">
                    {t('authentication.login.no_account')}
                  </Typography>
                  <Box
                    sx={{cursor: 'pointer', ml: 1, display: 'flex', justifyContent: 'end'}}
                      onClick={() => {
                        router.push('/register')
                      }}>
                    <Typography variant="caption" color={palette.primary.main}>{t('authentication.create_account')}</Typography>
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

export default Login