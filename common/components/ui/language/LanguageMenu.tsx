import spain from '../assets/images/spain.png'
import english from '../assets/images/usa.png'
import portuguese from '../assets/images/bandera-de-brasil.png'
import germany from '../assets/images/german.png'
import french from '../assets/images/france.png'
import italian from '../assets/images/italy.png'
import sweden from '../assets/images/sweden.png'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'
import { useTranslation } from '@/common/hooks/useTranslation'


const LanguageMenu = () => {

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)
	const { t, changeLanguage, currentLanguage } = useTranslation()

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}
	
	const handleClose = () => {
		setAnchorEl(null)
	}

	return (
		<>
			<div>
				<Tooltip title={t('language.language')}>
					<IconButton
						onClick={handleClick}
						size="small"
						aria-controls={open ? 'language-menu' : undefined}
						aria-haspopup="true"
						aria-expanded={open ? 'true' : undefined}
					>
						<Avatar
							alt={`${t('language.language')}`}
							src={currentLanguage === 'en'? '/images/uk.png':
								currentLanguage === 'es'? '/images/spain.png' : 
									currentLanguage === 'pt' ? '/images/br.png' : 
										currentLanguage === 'de'? '/images/german.png' : 
											currentLanguage === 'fr'? '/images/fr.png' : 
												currentLanguage === 'it'? '/images/italy.png' : 
													currentLanguage === 'sv'? '/images/sweden.png': '/images/spain.png'}
							sx={{ width: 24, height: 24 }}
						/>
					</IconButton>
				</Tooltip>
			</div>
			<Menu
				anchorEl={anchorEl}
				id="language-menu"
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: 'visible',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1.5,
						'& .MuiAvatar-root': {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						'&:before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: 'background.paper',
							transform: 'translateY(-50%) rotate(45deg)',
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<MenuItem onClick={() => changeLanguage('es')}>
					<Avatar
						alt={`${t('language.spanish')}`}
						src={'/images/spain.png'}
						sx={{ width: 24, height: 24 }}
					/> {t('language.spanish')}
				</MenuItem>
				<MenuItem onClick={() => changeLanguage('en')}>
					<Avatar
						alt={`${t('language.english')}`}
						src={'/images/uk.png'}
						sx={{ width: 24, height: 24 }}
					/> {t('language.english')}
				</MenuItem>
				<MenuItem onClick={() => changeLanguage('pt')}>
					<Avatar
						alt={`${t('language.portuguese')}`}
						src={'/images/br.png'}
						sx={{ width: 24, height: 24 }}
					/> {t('language.portuguese')}
				</MenuItem>
				<MenuItem onClick={() => changeLanguage('de')}>
					<Avatar
						alt={`${t('language.german')}`}
						src={'/images/german.png'}
						sx={{ width: 24, height: 24 }}
					/> {t('language.german')}
				</MenuItem>
				<MenuItem onClick={() => changeLanguage('fr')}>
					<Avatar
						alt={`${t('language.french')}`}
						src={'/images/fr.png'}
						sx={{ width: 24, height: 24 }}
					/> {t('language.french')}
				</MenuItem>
				<MenuItem onClick={() => changeLanguage('it')}>
					<Avatar
						alt={`${t('language.italian')}`}
						src={'/images/italy.png'}
						sx={{ width: 24, height: 24 }}
					/> {t('language.italian')}
				</MenuItem>
				<MenuItem onClick={() => changeLanguage('sv')}>
					<Avatar
						alt={`${t('language.sweden')}`}
						src={'/images/sweden.png'}
						sx={{ width: 24, height: 24 }}
					/> {t('language.sweden')}
				</MenuItem>
			</Menu>
		</>
	)
}

export default LanguageMenu