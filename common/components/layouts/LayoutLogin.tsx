import { Box } from '@mui/material'
import Head from 'next/head'
import { FC, PropsWithChildren } from 'react'

import Toolbar from '@mui/material/Toolbar'
import { NavbarLogin } from '../ui/navbars/NavbarLogin'
import { siteName } from '../../utils'

interface Props {
  title?: string
}

export const LayoutLogin: FC<PropsWithChildren<Props>> = ({
  title = siteName(),
  children,
}) => {
  return (
    <>
      {
        <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100vh',
            }}>
          <Head>
            <title>{title}</title>
          </Head>

          <NavbarLogin />

          <Box component="main" sx={{ flexGrow: 1, p: 2,
            height: '100%',
            backgroundImage: 'url(/background.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat', 
          }} >
            <Toolbar />
              {children}
          </Box>
        </Box>
      }
    </>
  )
}
