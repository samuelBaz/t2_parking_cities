import { Button, IconProps, Tooltip } from '@mui/material'
import { IconoTooltip } from './IconoTooltip'
import { OverridableStringUnion } from '@mui/types'
import { ButtonProps, ButtonPropsVariantOverrides } from '@mui/material/Button/Button'
import { Icono } from '../Icono'

interface IconoBotonParams {
  id: string
  variante?: 'icono' | 'boton' | 'boton-icono'
  variant?: OverridableStringUnion<
    'text' | 'outlined' | 'contained',
    ButtonPropsVariantOverrides
  >
  texto: string
  icono: string
  color?: OverridableStringUnion<
    'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
    ButtonProps['color']
  >;
  iconColor?: OverridableStringUnion<
    'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
    IconProps['color']
  >;
  descripcion: string
  desactivado?: boolean
  filled?: boolean
  accion: () => void
}

export const IconoBoton = ({
  id,
  texto,
  icono,
  color = 'primary',
  iconColor = 'info',
  variante = 'boton',
  variant = 'contained',
  descripcion,
  desactivado = false,
  accion,
}: IconoBotonParams) => {
  return variante == 'boton' ? (
    <Tooltip title={descripcion}>
      <span>
        <Button
          id={id}
          variant={variant}
          sx={{ ml: 1, mr: 1 }}
          color={color}
          size={'small'}
          disabled={desactivado}
          onClick={() => {
            accion()
          }}
        >
          {texto}
        </Button>
      </span>
    </Tooltip>
  ) : variante == 'boton-icono' ?
    <Tooltip title={descripcion}>
      <span>
        <Button
          startIcon={
            <Icono color={iconColor}>
              {icono}
            </Icono>
          }
          color={color}
          id={id}
          variant={variant}
          sx={{ ml: 1, mr: 1 }}
          size={'small'}
          disabled={desactivado}
          onClick={() => {
            accion()
          }}
        >
          {texto}
        </Button>
      </span>
    </Tooltip>
    :(
    <IconoTooltip
      id={id}
      titulo={descripcion}
      accion={() => {
        accion()
      }}
      desactivado={desactivado}
      icono={icono}
      name={texto}
    />
  )
}
