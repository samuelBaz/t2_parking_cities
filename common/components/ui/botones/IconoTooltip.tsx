import { FC, MouseEventHandler, ReactNode, useState } from 'react'
import { IconButton, IconPropsSizeOverrides, Tooltip } from '@mui/material'
import { Icono } from '../Icono'
import { OverridableStringUnion } from '@mui/types'

interface Props {
  color?:
    | 'inherit'
    | 'action'
    | 'disabled'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning'
  titulo: string
  icono: ReactNode
  accion: MouseEventHandler<any> | undefined
  desactivado?: boolean
  filled?: boolean
  name: string
  size?: OverridableStringUnion<
    'inherit' | 'large' | 'medium' | 'small',
    IconPropsSizeOverrides
  >
  id: string
}

export const IconoTooltip: FC<Props> = ({
  color = 'primary',
  icono,
  titulo,
  accion,
  filled = false,
  desactivado = false,
  name,
  size = 'medium',
  id,
}) => {
  const [openTooltip, setOpenTooltip] = useState(false)

  const handleTooltipClose = () => {
    setOpenTooltip(false)
  }

  const handleTooltipOpen = () => {
    setOpenTooltip(true)
  }

  return (
    <Tooltip
      title={titulo}
      onClose={handleTooltipClose}
      open={openTooltip}
      onMouseOver={handleTooltipOpen}
    >
      <span>
        <IconButton
          id={id}
          name={name}
          disabled={desactivado}
          classes={{
            root: 'icon-button-root',
            disabled: 'icon-button-disabled',
          }}
          aria-label={titulo}
          onClick={(event) => {
            handleTooltipClose()
            if (accion) {
              accion(event)
            }
          }}
        >
          <Icono color={desactivado ? 'disabled' : color} filled={filled} fontSize={size}> {icono}</Icono>
        </IconButton>
      </span>
    </Tooltip>
  )
}
