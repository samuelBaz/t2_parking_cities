import Paper from '@mui/material/Paper'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'


ChartJS.register(
	CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
)

const StepChart = () => {

	const options = {
		plugins: {
			title: {
				display: false,
				text: 'Chart.js Bar Chart - Stacked',
			},
			legend: {
				position: 'bottom' as const,
			},
		},
		responsive: true,
		scales: {
			x: {
				stacked: true,
			},
			y: {
				stacked: true,
			},
		},
	}

	const labels = ['Inspector 1', 'Inspector 2', 'Inspector 3', 'Inspector 4', 'Inspector 5']

	const data = {
		labels,
		datasets: [
			{
				label: 'Inspection',
				data: [25,24,12,5,23],
				backgroundColor: '#7A73FF',
			},
			{
				label: 'Penalize',
				data: [12,4,1,0,6],
				backgroundColor: '#c0c0c0',
			},
		],
	}

	return (
		<Paper className='full-w'>
			<Bar options={options} data={data} />
		</Paper>
	)
}

export default StepChart
