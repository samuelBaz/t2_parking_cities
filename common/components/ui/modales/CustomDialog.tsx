import {
  Box,
  Breakpoint,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  PaperProps,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { BaseSyntheticEvent, FC, PropsWithChildren, ReactNode } from 'react'

import { TransitionSlide, TransitionZoom } from './Animations'
import { PortalProps } from '@mui/base/Portal'
import { Icono } from '../Icono'
import InfoPopper from '../botones/InfoPopper'

interface Props {
  isOpen: boolean
  handleClose: () => void
  title?: string
  fullScreen?: boolean
  maxWidth?: Breakpoint | undefined
  paperProps?: Partial<PaperProps>
  disableBackdropClick?: boolean
  disableEscapeKeyDown?: boolean
  scroll?: 'body' | 'paper'
  noTitle?: boolean
  titleColor?: string
  disablePortal?: PortalProps['disablePortal']
  disableScrollLock?: boolean
  info?: ReactNode | null
}

export const CustomDialog: FC<PropsWithChildren<Props>> = ({
  isOpen,
  handleClose,
  title,
  children,
  fullScreen = false,
  maxWidth,
  paperProps,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  scroll = 'body',
  noTitle = false,
  titleColor,
  disablePortal,
  disableScrollLock,
  info,
}) => {
  const theme = useTheme()
  let dsm = useMediaQuery(theme.breakpoints.down('sm'))

  const cerrarDialog = (event: BaseSyntheticEvent, reason: string) => {
    if (disableBackdropClick && reason === 'backdropClick') {
      return false
    }
    if (disableEscapeKeyDown && reason === 'escapeKeyDown') {
      return false
    }
    handleClose()
  }
  return (
    <Dialog
      PaperProps={paperProps}
      fullScreen={fullScreen || dsm}
      fullWidth={true}
      maxWidth={maxWidth}
      open={isOpen}
      TransitionComponent={dsm ? TransitionSlide : TransitionZoom}
      onClose={cerrarDialog}
      scroll={scroll}
      disablePortal={disablePortal}
      disableScrollLock={disableScrollLock}
    >
      {noTitle ? (
        <Box />
      ) : (
        <DialogTitle>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {title ? (
              <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Typography sx={{ fontWeight: '600', fontSize: 18, color: titleColor }}>
                  {title}
                </Typography>
                { info }
              </Box>
            ) : (
              <Box />
            )}
            <IconButton onClick={handleClose} color={'inherit'}>
              <Icono color={'inherit'}>close</Icono>
            </IconButton>
          </Grid>
        </DialogTitle>
      )}

      {children}
    </Dialog>
  )
}
