import { Line } from 'react-chartjs-2'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Filler,
	Legend,
} from 'chart.js'
import { Paper } from '@mui/material'

ChartJS.register(
	CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend
)

interface GlobalStatsProps {
  data: any
}


const GlobalStats = (props: GlobalStatsProps) => {
	

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'bottom' as const,
			},
			title: {
				display: false,
				text: 'Chart.js Line Chart',
			},

		},
	}

	const labels = props.data[0].hours
	const dataN: number[] = [125,356,486,632,100,256,545] 
	const data = {
		labels,
		datasets: [
			{
				fill: true,
				label: props.data[0].company,
				data: props.data[0].data,
				borderColor: 'rgb(53, 162, 235)',
				backgroundColor: 'rgba(53, 162, 235, 0.5)',
			},
			{
				fill: true,
				label: props.data[1].company,
				data: props.data[1].data,
				borderColor: 'rgb(255, 155, 155)',
				backgroundColor: 'rgba(255, 155, 155, 0.5)',
			},
			{
				fill: true,
				label: props.data[2].company,
				data: props.data[2].data,
				borderColor: 'rgb(255, 214, 165)',
				backgroundColor: 'rgba(255, 214, 165, 0.5)',
			},
			{
				fill: true,
				label: props.data[3].company,
				data: props.data[3].data,
				borderColor: 'rgb(22, 75, 96)',
				backgroundColor: 'rgba(22, 75, 96, 0.5)',
			},
			{
				fill: true,
				label: props.data[4].company,
				data: props.data[4].data,
				borderColor: 'rgb(162, 255, 134)',
				backgroundColor: 'rgba(162, 255, 134, 0.5)',
			},
			{
				fill: true,
				label: props.data[5].company,
				data: props.data[5].data,
				borderColor: 'rgb(179, 19, 18)',
				backgroundColor: 'rgba(179, 19, 18, 0.5)',
			}
		],
	}

	return (
		<Paper>
			<Line options={options} data={data} />
		</Paper>
	)

}

export default GlobalStats
