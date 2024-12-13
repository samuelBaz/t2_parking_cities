import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'
import { FC, PropsWithChildren } from 'react'
import { TransitionZoom } from './Animations'
import { PortalProps } from '@mui/base/Portal'

interface Props {
  isOpen: boolean
  titulo: string
  texto: string
  tituloColor?: string
  disablePortal?: PortalProps['disablePortal']
  disableScrollLock?: boolean
  label: string
  accionCorrecta: (comment: string) => void
}

export const AlertDialogWithComment: FC<PropsWithChildren<Props>> = ({
  isOpen,
  titulo,
  texto,
  tituloColor,
  children,
  disablePortal,
  disableScrollLock,
  label,
  accionCorrecta
}) => {
  return (
    <Dialog
      open={isOpen}
      TransitionComponent={TransitionZoom}
      disablePortal={disablePortal}
      disableScrollLock={disableScrollLock}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          const formJson = Object.fromEntries((formData as any).entries())
          const comment = formJson.comment
          accionCorrecta(comment)
        },
      }}
    >
      <DialogTitle sx={{ m: 1, px: 2, py: 1, fontWeight: '600' }} color={tituloColor}>
        {titulo}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography
            component={'span'}
            fontWeight={'400'}
            fontSize={'medium'}
            variant="body2"
            color="text.secondary"
          >
            {texto}
          </Typography>
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="comment"
          name="comment"
          label={label}
          multiline
          maxRows={2}
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>{children}</DialogActions>
    </Dialog>
  )
}
