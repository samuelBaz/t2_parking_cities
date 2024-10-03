import { LayoutUser } from "@/common/components/layouts"
import { Icono } from "@/common/components/ui"
import CustomMensajeEstado from "@/common/components/ui/estados/CustomMensajeEstado"
import { useTranslation } from "@/common/hooks/useTranslation"
import { titleCase } from "@/common/utils"
import { useAuth } from "@/context/auth"
import { Box, Card, Grid, Typography, useMediaQuery, useTheme } from "@mui/material"

const Profile = () => {

  const { usuario } = useAuth()
  const { t } = useTranslation()

  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.only('sm'))
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  return (
    <LayoutUser>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant={'h5'} sx={{ fontWeight: '600' }}>
          {t('menu.profile')}
        </Typography>
      </Grid>
      <Box height={'20px'} />
      <Grid container>
        <Grid item xl={6} md={6} xs={12}>
          <Box>
            <Card sx={{ borderRadius: 3 }}>
              <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                sx={{
                  width: '100%',
                  height: sm || xs ? '' : 370,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease-out !important',
                  p: 2,
                }}
              >
                <Icono
                  sx={{ color: 'text.secondary' }}
                  style={{ fontSize: 100 }}
                >
                  account_circle
                </Icono>

                <Typography variant={'body1'} color="text.secondary">
                  {titleCase(
                    `${usuario?.email}`
                  )}
                </Typography>
              </Box>
            </Card>
          </Box>
        </Grid>
        <Grid
          item
          xl={6}
          md={6}
          xs={12}
          sx={{ pl: sm || xs ? 0 : 6, pr: sm || xs ? 0 : 6 }}
        >
          <Box justifyContent={'center'} alignItems={'center'}>
            <Box justifyContent={'center'} alignItems={'center'}>
              <Grid container direction={'column'}>
                <Box height={'20px'} />
                <Grid
                  container
                  justifyContent="space-between"
                  direction={'column'}
                >
                  <Typography
                    sx={{ fontWeight: '600' }}
                    variant={'subtitle2'}
                  >
                    Usuario
                  </Typography>
                  <Typography>{`${usuario?.email}`}</Typography>
                </Grid>

                <Box height={'20px'} />
                <Grid
                  container
                  justifyContent="space-between"
                  direction={'column'}
                >
                  <Typography
                    sx={{ fontWeight: '600' }}
                    variant={'subtitle2'}
                  >
                    Rol
                  </Typography>
                  <Grid>
                    <CustomMensajeEstado color="info" titulo={usuario?.rol}/>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </LayoutUser>
  )
}

export default Profile