import * as React from 'react'
import Box from '@mui/material/Box'
import Popper, { PopperPlacementType } from '@mui/material/Popper'
import Typography from '@mui/material/Typography'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import { Icono } from '../Icono'

interface InfoPopperProps {
  title: string
  description: string
}

export default function InfoPopper({title, description}: InfoPopperProps) {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
	const [open, setOpen] = React.useState(false)
	const [placement, setPlacement] = React.useState<PopperPlacementType>()
	const detail = description.split('*')

	const handleClick = (newPlacement: PopperPlacementType) => (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
		setOpen((prev) => placement !== newPlacement || !prev)
		setPlacement(newPlacement)
	}

	return (
		<Box>
			<Popper open={open} anchorEl={anchorEl} placement={placement} transition sx={{zIndex: 2000}}>
				{({ TransitionProps }) => (
					<Fade {...TransitionProps} timeout={350}>
						<Paper sx={{width: 400}}>
							<Typography sx={{ paddingX: 2, paddingTop: 2, fontWeight: 700}}>{title}</Typography>
							{
								detail.map((d: string, index: number) => {
									return(
										<Typography 
											key={'detail-'+index} 
											sx={{ paddingX: 2, paddingBottom: index === detail.length -1 ? 2: 0}}>
											{'* '+d}
										</Typography>
									)
								})
							}</Paper>
					</Fade>
				)}
			</Popper>
			<IconButton color={'inherit'} onClick={handleClick('bottom-start')}>
				<Icono color={'inherit'}>info</Icono>
			</IconButton>
		</Box>
	)
}