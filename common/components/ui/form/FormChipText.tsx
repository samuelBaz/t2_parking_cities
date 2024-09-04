import {
  Chip,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useController } from 'react-hook-form'
import { Icono } from '../../../../common/components/ui'
import { imprimir } from '../../../../common/utils/imprimir'

export interface FormChipTextProps {
  index: number
  name: string
  label: string
  descripcion: string
  control: any
  variantes?: string[]
  placeholder: string
  textoAyuda?: string
  limite?: number

  onChangeVariantes: (variantes: string[]) => void
}

const FormChipText = ({
  label,
  placeholder = '',
  name,
  limite = 1000,
  control,
  onChangeVariantes,
}: FormChipTextProps) => {
  const [tagsData, setTagsData] = useState<string[]>([])
  const [textCaracteristica, setTextCaracteristica] = useState<string>('')

  const { field } = useController({ name, control })

  useEffect(() => {
    if (field.value) {
      setTagsData(field.value.split('|'))
    } else {
      setTagsData([])
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    onChangeVariantes(tagsData)
    field.onChange(tagsData.join('|'))
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsData])

  const adicionarCaracteristica = () => {
    setTagsData((items) =>
      [...new Set([...items, textCaracteristica])].filter(
        (item, index) => index < limite
      )
    )
    setTextCaracteristica('')
  }
  const eliminarChip = (itemEliminado: string) => {
    setTagsData((items) => items.filter((item) => item != itemEliminado))
  }
  const Tags = () => {
    return (
      <Grid
        container
        // spacing={1}
        direction={'column'}
        alignItems={'flex-start'}
        justifyContent={'center'}
        // sx={{ padding: 2 }}
      >
        <Grid>
          {tagsData.map((item, index) => {
            return (
              <Chip
                key={index}
                sx={{
                  m: 0.2,
                  // width: 100,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',

                  textOverflow: 'ellipsis',
                }}
                variant="outlined"
                color="primary"
                label={item}
                onDelete={() => {
                  eliminarChip(item)
                }}
              />
            )
          })}
        </Grid>
      </Grid>
    )
  }
  return (
    <>
      <Typography variant={'body2'} sx={{ fontWeight: 'fontWeightMedium' }}>
        {label}
      </Typography>

      {/* <Tags /> */}

      <TextField
        placeholder={tagsData.length > 0 ? '' : placeholder}
        value={textCaracteristica}
        id="outlined-name"
        fullWidth
        onKeyDown={(e) => {
          imprimir(`e: ${e.key}`)
          if (
            (e.code === 'Enter' || e.code === 'Comma') &&
            textCaracteristica != '' &&
            textCaracteristica != '↵'
          ) {
            adicionarCaracteristica()
          }
        }}
        InputProps={{
          endAdornment: (
            <Stack direction={'row'}>
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => {
                  adicionarCaracteristica()
                }}
                edge="end"
              >
                <Icono>add_circle</Icono>
              </IconButton>
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => {
                  setTagsData([])
                }}
                edge="end"
              >
                <Icono>clear</Icono>
              </IconButton>
            </Stack>
          ),
        }}
        onChange={(e) => {
          setTextCaracteristica(e.target.value.replace(/(\r\n|\n|\r|,)/gm, ''))
          //   textoCaracteristica.current = e.target.value
        }}
      />

      <Tags />
    </>
  )
}
export default FormChipText
