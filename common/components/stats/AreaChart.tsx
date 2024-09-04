import Paper from '@mui/material/Paper'
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

ChartJS.register(
	CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend
)

const AreaChart = () => {
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

	const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
	const dataN: number[] = [125,356,486,632,100,256,545] 
	const data = {
		labels,
		datasets: [
			{
				fill: true,
				label: 'Dataset 2',
				data: dataN,
				borderColor: 'rgb(53, 162, 235)',
				backgroundColor: 'rgba(53, 162, 235, 0.5)',
			}
		],
	}

	return (
		<Paper>
			<Line options={options} data={data} />
		</Paper>
	)

}

export default AreaChart