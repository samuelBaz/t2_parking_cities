import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form'
import { Box, FormControlLabel, InputLabel, Radio, RadioGroup } from '@mui/material'
import Typography from '@mui/material/Typography'
import React from 'react'
import { Variant } from '@mui/material/styles/createTypography'

type FormInputRadioProps<T extends FieldValues> = {
  id: string
  name: Path<T>
  control: Control<T, object>
  label: string
  size?: 'small' | 'medium'
  options: any[]
  rules?: RegisterOptions
  disabled?: boolean
  direccion?: 'column' | 'row'
  labelVariant?: Variant
}

export const FormInputRadio = <T extends FieldValues>({
  id,
  name,
  control,
  label,
  options,
  rules,
  disabled,
  direccion = 'column',
  labelVariant = 'subtitle2',
}: FormInputRadioProps<T>) => (
  <div>
    <InputLabel htmlFor={id}>
      <Typography
        variant={labelVariant}
        sx={{ color: 'text.primary', fontWeight: '500' }}
      >
        {label}
      </Typography>
    </InputLabel>
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <RadioGroup value={value} onChange={onChange} id={id} name={name}>
          <Box display={'flex'} flexDirection={direccion}>
            {options.map((singleOption, index) => (
              <FormControlLabel
                key={index}
                disabled={disabled}
                value={singleOption.value}
                label={singleOption.label}
                control={<Radio />}
              />
            ))}
          </Box>
        </RadioGroup>
      )}
      rules={rules}
    />
  </div>
)
