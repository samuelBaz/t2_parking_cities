import { Breadcrumbs, Divider, Link, Typography } from "@mui/material"
import { Icono } from "../Icono"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { imprimir } from "../../../utils/imprimir"
import { useAuth } from "../../../../context/auth"
import { default as NextLink } from 'next/link'
import { ModuloType } from "../../../../modules/login/types/loginTypes"
import { useThemeContext } from "../../../../context/ui/ThemeContext"

const MigaPan = () => {

  const router = useRouter()
  const { themeMode } = useThemeContext()

  const { usuario, usuarioRolNivel } = useAuth()
  const [ modulos, setModulos ] = useState<ModuloType[]>([])

  const interpretarModulos = () => {
    imprimir(`Cambio en módulos`)

    const rolSeleccionado = usuario?.rolesNiveles.find(
      (itemRol) => itemRol.idRolNivel == usuarioRolNivel?.idRolNivel
    )

    imprimir(`rolSeleccionado`, rolSeleccionado)
    const rolModulos = rolSeleccionado?.modulos?? []

    rolModulos.forEach((modulo) => {
      modulo.subModulo.forEach((submodulo) => {
        if(submodulo.url == router.pathname){
          setModulos([modulo, submodulo])
        }
        if(submodulo.subModulo){
          submodulo.subModulo.map((submodulo2) => {
            if(submodulo2.url == router.pathname){
              setModulos([modulo, submodulo, submodulo2])
            }
          })
        }
      })
    })
    
  }

  useEffect(() => {
    imprimir(`reinterpretando módulos`)
    interpretarModulos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario])
  
  return(
    <>
      <Breadcrumbs aria-label="breadcrumb">
        {
          modulos.map((modulo, index) => {
            if(index === 0){
              return (
                <Typography
                  key={index}
                  sx={{ display: 'flex', alignItems: 'center' }}
                  color="text.primary"
                >
                  <Icono sx={{ mr: 0.5 }} fontSize="inherit">home</Icono>
                  {modulo.label}
                </Typography>
              )
            }
            if(index === modulos.length - 1){
              return (
                <Typography
                  key={index}
                  sx={{ display: 'flex', alignItems: 'center' }}
                  color="text.primary"
                >
                  <Icono sx={{ mr: 0.5 }} fontSize="inherit">{modulo.icono}</Icono>
                  {modulo.label}
                </Typography>
              )
            }
            else return (
              <NextLink 
                  key={index} href={modulo.url} passHref 
                  style={{ textDecoration: 'none', color:  themeMode === 'light' ?  'black': 'white' }}>
                <Link
                  underline="hover"
                  sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                  color="inherit"
                >
                  <Typography
                    key={index}
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="text.primary"
                  >
                    <Icono sx={{ mr: 0.5 }} fontSize="inherit">{modulo.icono}</Icono>
                    {modulo.label}
                  </Typography>
                </Link>
              </NextLink>
            )
          })
        }
      </Breadcrumbs>
      <Divider sx={{my: 1}}/>
    </>
  )
}

export default MigaPan