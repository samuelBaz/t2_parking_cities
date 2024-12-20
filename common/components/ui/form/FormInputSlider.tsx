import React, { useEffect } from 'react'

import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
  UseFormSetValue,
} from 'react-hook-form'
import { InputLabel, Slider, Typography } from '@mui/material'
import { Variant } from '@mui/material/styles/createTypography'

type FormInputSliderProps<T extends FieldValues> = {
  id: string
  name: Path<T>
  control: Control<T, object>
  label: string
  setValue: UseFormSetValue<T>
  size?: 'small' | 'medium'
  rules?: RegisterOptions
  labelVariant?: Variant
}

export const FormInputSlider = <T extends FieldValues>({
  id,
  name,
  control,
  setValue,
  label,
  size = 'small',
  rules,
  labelVariant = 'subtitle2',
}: FormInputSliderProps<T>) => {
  const [sliderValue, setSliderValue] = React.useState(0)

  useEffect(() => {
    if (sliderValue) setValue(name, sliderValue as PathValue<T, Path<T>>)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderValue])

  const handleChange = (event: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number)
  }

  return (
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
        render={() => (
          <Slider
            id={id}
            name={name}
            size={size}
            sx={{ width: '100%' }}
            value={sliderValue}
            onChange={handleChange}
          />
        )}
        rules={rules}
      />
    </div>
  )
}
