import { LayoutUser } from "@/common/components/layouts"
import AreaChart from "@/common/components/stats/AreaChart"
import DoughnutChart from "@/common/components/stats/DoughnutChart"
import { useTranslation } from "@/common/hooks/useTranslation"
import { Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"

const Stats = () => {

  const [areaCharts, setAreaCharts] = useState<any[]>([])
	const { t } = useTranslation()

	useEffect(() => {
		const list = []

		for(let i=0; i< 6; i++){
			const char = []

			for(let j = 0; j < 19; j++){
				char.push({
					hour: j, tickets: Math.round((Math.random() * (71 - 0 + 1)) * j)
				})
			}
			list.push(char)
		}
		setAreaCharts(list)
	}, [])

	// const time = [
	// 	{ region: '30 Min', val: 458 },
	// 	{ region: '60 MIn', val: 12 },
	// 	{ region: '90 Min', val: 150 },
	// 	{ region: '180 Min', val: 30 },
	// 	{ region: '120 Min', val: 42 },
	// 	{ region: '300 Min', val: 10 },
	// 	{ region: '15 Min', val: 5 },
	// 	{ region: '45 Min', val: 2 },
	// ]

	const payments = [
		{ region: 'ANTEL', val: 156329 },
		{ region: 'MOVISTAR', val: 54236 },
		{ region: 'CLARO', val: 15005 },
		{ region: 'MERCADOPAGO', val: 20365 },
		{ region: 'BEA', val: 9563 },
		{ region: 'OCA', val: 5000 },
	]

  return (
    <LayoutUser>
      <div className='flex column'>
        <h3 className="mt-3 f-size-16 f-weigth-700">{t('today')}</h3>
        <h4 className="stats-sub-title mb-3">{t('stats.tickets.title')}</h4>
        <Grid container spacing={1}>
          {
            areaCharts.map((e: any, index: number) => {
              return (
                <Grid item key={'chart-'+index} className="chart" xs={12} sm={6} md={4} lg={3}>
                  <Typography variant={'h6'} fontSize={15} sx={{ fontWeight: '600' }}>
                    {t('sales_volume')} {payments[index].region}
                  </Typography>
                  <Typography variant={'h6'} fontSize={13} sx={{ fontWeight: '700', color: '#00000080' }}>
                    {payments[index].val} Tickets
                  </Typography>
                  {/* <h3 className="title-chart">{t('sales_volume')} {payments[index].region}</h3>
                  <h3 className="subtitle-chart">{payments[index].val} Tickets</h3> */}
                  <AreaChart />
                </Grid>
              )
            })
          }
        </Grid>
              
        <h4 className="stats-sub-title mb-3">{t('stats.tickets.by_methods')}</h4>

        <Grid container spacing={2}>
          {
            areaCharts.map((e: any, index: number) => {
              return (
                <Grid item key={'chart-'+index} className="chart" xs={12} sm={12} md={4} lg={4}>
                  <Typography variant={'h6'} fontSize={15} sx={{ fontWeight: '600' }}>
                    {t('sales_volume')} {payments[index].region}
                  </Typography>
                  <Typography variant={'h6'} fontSize={13} sx={{ fontWeight: '700', color: '#00000080' }}>
                    {payments[index].val} Tickets
                  </Typography>
                  {/* <h3 className="title-chart">{t('sales_volume')} {payments[index].region}</h3>
                  <h3 className="subtitle-chart">{payments[index].val} Tickets</h3> */}
                  <DoughnutChart />
                </Grid>
              )
            })
          }
        </Grid>
      </div>
    </LayoutUser>
  )
}

export default Stats