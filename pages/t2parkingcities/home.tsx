import { LayoutUser } from '@/common/components/layouts'
import GlobalStats from '@/common/components/stats/GlobalStats'
import StepChart from '@/common/components/stats/StepChart'
import { useTranslation } from '@/common/hooks/useTranslation'
import { Box, Grid } from '@mui/material'
import { useRouter } from 'next/router'

const data = [
	{
		company: 'Antel',
		hours: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15','16', '17', '18'],
		data: [0, 29, 70, 154, 254, 400, 600, 563, 305, 260, 900, 600, 100, 563, 305, 260, 150, 133, 125]
	},
	{
		company: 'Bea',
		hours: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15','16', '17', '18'],
		data: [0, 19, 60, 184, 214, 450, 350, 503, 205, 210, 600, 100, 70, 63, 305, 260, 50, 193, 175]
	},
	{
		company: 'Claro',
		hours: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15','16', '17', '18'],
		data: [0, 9, 80, 194, 204, 300, 500, 463, 205, 160, 190, 700, 500, 163, 305, 160, 50, 233, 25]
	},
	{
		company: 'Marcado Pago',
		hours: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15','16', '17', '18'],
		data: [0, 39, 10, 54, 94, 90, 60, 53, 35, 20, 90, 60, 10, 53, 35, 20, 10, 13, 15]
	},
	{
		company: 'Movistar',
		hours: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15','16', '17', '18'],
		data: [0, 2, 7, 15, 25, 40, 60, 56, 30, 26, 90, 60, 10, 56, 30, 26, 15, 13, 12]
	},
	{
		company: 'Oca',
		hours: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15','16', '17', '18'],
		data: [0, 39, 10, 10, 20, 40, 30, 63, 35, 60, 90, 6, 10, 63, 56, 60, 30, 53, 13]
	}
]

// const inspections = [
// 	{
// 		inspector: 'Insp 4563', inspections: 25, penalize: 4,
// 	},
// 	{
// 		inspector: '', inspections: 0, penalize: 0,
// 	},
// 	{
// 		inspector: 'Insp 4553', inspections: 20, penalize: 2,
// 	},
// 	{
// 		inspector: '  ', inspections: 0, penalize: 0,
// 	},
// 	{
// 		inspector: 'Insp 4560', inspections: 20, penalize: 6,
// 	},
// 	{
// 		inspector: '   ', inspections: 0, penalize: 0,
// 	}, 
// 	{
// 		inspector: 'Insp 4573', inspections: 18, penalize: 5,
// 	},
// 	{
// 		inspector: '    ', inspections: 0, penalize: 0,
// 	}, 
// 	{
// 		inspector: 'Insp 4963', inspections: 12, penalize: 4,
// 	}
// ]

const Home = () => {

	const { t } = useTranslation()
	const router = useRouter()

	return (
		<LayoutUser>
      <div className='flex column full-w'>
        <h2 className="mt-3">{t('home.continue_area')}</h2>
        <Grid container sx={{display: 'flex', flexDirection: 'row'}}>
          <Grid item xs={6}>
            <Grid container sx={{direction: 'flex', mt: 1, flexDirection: 'row'}} className="line-step mt-2">
              <Grid item xs={3} className="step step-active">
                1
              </Grid>
              <Grid item xs={3} className="step">
                2
              </Grid>
              <Grid item xs={3} className="step">
                3
              </Grid>
              <Grid item xs={3} className="step">
                4
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <div className="flex full-w mt-2">
          <div className="half">
            <h4 className="step-text">
              <b className="bold">{t('home.steps.one.title')}</b>{t('home.steps.one.description')}</h4>
          </div>
        </div>
        <div className="flex full-w mt-2">
          <div className="add" onClick={() => 
            { 
              router.push('/t2parkingcities/create-new-parking-area')
            } }>
            {t('home.continue_area_btn')}
            {/* <ArrowForwardOutlined className="c-white ml-2" fontSize="small" /> */}
          </div>
        </div>
        <Grid container>
          <Grid item xs={12} md={12} lg={9}>
            <h2 className="mt-2">{t('stats.tickets.title')}</h2>
            <h3 className="title-chart">{t('stats.tickets.description')}</h3>
            <GlobalStats data={data}/>
          </Grid>
          <Grid item xs={12} md={12} lg={3}>
            <h2 className="mt-2">{t('stats.inspectors.title')}</h2>
            <h3 className="title-chart">{t('stats.inspectors.description')}</h3>
            <StepChart/>
          </Grid>
        </Grid>
      </div>
    </LayoutUser>
	)
}

export default Home