import { LayoutLogin } from "@/common/components/layouts"
import { useTranslation } from "@/common/hooks/useTranslation"
import { Box, Button, Card, CardActions, CardContent, Grid } from "@mui/material"
import { useRouter } from "next/router"

const VerifyEmail = () => {
  const { t } = useTranslation()
  const router = useRouter()
  return (
    <LayoutLogin>
      <Grid container justifyContent="space-evenly" alignItems={'center'}>
        <Grid item xl={3.2} md={5} xs={12}>
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
            <CardContent sx={{ paddingTop: 4, paddingX: 4 }}>
              
              <div className="flex column">
                <h3 className='f-size-22 f-weigth-600 pb-2'>{t('verify.title')}</h3>
                <h4 className='f-size-16 f-weigth-500'>{t('check')} {''} {t('verify.description')}</h4>
              </div>
            </CardContent>
            <CardActions sx={{paddingX:4, marginY: 4}} >
              <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                <Button size='small' variant="contained" color="secondary"
                    onClick={() =>  { window.open('https://mail.google.com/', '_blank', 'noopener,noreferrer') }} >{t('reset.open_email')}
                </Button>
                <Button size='small' variant="contained" className='btn-form-second' 
                  onClick={() => {
                    router.replace('/login')
                  }}>{t('verify.already_verify')}
                </Button>
              </Box>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </LayoutLogin>
  )
}

export default VerifyEmail