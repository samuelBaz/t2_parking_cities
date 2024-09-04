import Icon from '@mui/material/Icon'

import { CSSProperties, FC, PropsWithChildren } from 'react'
import { OverridableStringUnion } from '@mui/types'
import {
  IconPropsColorOverrides,
  IconPropsSizeOverrides,
} from '@mui/material/Icon/Icon'
import { SxProps, Theme } from '@mui/material'
import 'material-icons/iconfont/filled.css'
import 'material-icons/iconfont/outlined.css'

interface Props {
  color?: OverridableStringUnion<
    | 'inherit'
    | 'action'
    | 'disabled'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning',
    IconPropsColorOverrides
  >
  fontSize?: OverridableStringUnion<
    'inherit' | 'large' | 'medium' | 'small',
    IconPropsSizeOverrides
  >
  sx?: SxProps<Theme>
  style?: CSSProperties,
  filled?: boolean
}

export const Icono: FC<PropsWithChildren<Props>> = ({
  color = 'primary',
  fontSize = 'medium',
  children,
  sx,
  style,
  filled = false
}) => {
  return (
    <Icon
      sx={{ ...sx }}
      style={{ ...style }}
      fontSize={fontSize}
      color={color}
      className={filled?'material-icons':'material-icons-outlined'}
    >
      {children}
    </Icon>
  )
}
