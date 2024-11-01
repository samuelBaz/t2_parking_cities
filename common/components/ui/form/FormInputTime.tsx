import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
} from 'react-hook-form'
import {
  FormHelperText,
  IconButton,
  InputLabel,
  TextField,
  TextFieldVariants,
  Typography,
} from '@mui/material'
import esMX from 'dayjs/locale/es-mx'
import { Variant } from '@mui/material/styles/createTypography'
import { Dayjs } from 'dayjs'
import { Icono } from '../Icono'
import { TimePicker } from '@mui/x-date-pickers'

type FormDatePickerProps<T extends FieldValues> = {
  id: string
  name: Path<T>
  control: Control<T, object>
  label: string
  size?: 'small' | 'medium'
  format?: string
  disabled?: boolean
  rules?: RegisterOptions
  bgcolor?: string
  labelVariant?: Variant
  variant?: TextFieldVariants
  desktopModeMediaQuery?: string
  clearable?: boolean
}

export const FormInputTime = <T extends FieldValues>({
  id,
  name,
  control,
  label,
  size = 'small',
  format = 'HH:mm',
  disabled,
  rules,
  bgcolor,
  labelVariant = 'subtitle2',
  variant,
  desktopModeMediaQuery = '',
  clearable,
}: FormDatePickerProps<T>) => {
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
        render={({ field, fieldState: { error } }) => (
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={esMX}>
            {/* <TimePicker
              renderInput={(params) => 
                <TextField {...params}  />}
              value={startHour}
              onChange={(value) => {
                setStartHour(value)
              }}
            /> */}
            <TimePicker
              onChange={field.onChange}
              value={field.value}
              ref={field.ref}
              mask={'__:__'}
              inputFormat={format}
              disabled={disabled}
              desktopModeMediaQuery={desktopModeMediaQuery}
              renderInput={(params) => (
                <>
                  <TextField
                    id={id}
                    name={name}
                    variant={variant}
                    sx={{ width: '100%', bgcolor: bgcolor }}
                    size={size}
                    {...params}
                    error={!!error}
                    // Limpiar campo
                    InputProps={{
                      endAdornment:
                        field.value && clearable ? (
                          <IconButton
                            sx={{ marginRight: '-12px' }}
                            color={'primary'}
                            onClick={() => {
                              field.onChange(null)
                            }}
                          >
                            <Icono color={'primary'}>clear</Icono>
                          </IconButton>
                        ) : (
                          <>{params.InputProps?.endAdornment}</>
                        ),
                    }}
                    // Fin limpiar campo
                  />
                  {!!error && (
                    <FormHelperText error>{error?.message}</FormHelperText>
                  )}
                </>
              )}
            />
          </LocalizationProvider>
        )}
        rules={{
          ...rules,
        }}
        defaultValue={'' as PathValue<T, Path<T>>}
      />
    </div>
  )
}
