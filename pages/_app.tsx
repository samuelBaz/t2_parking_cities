import { AppProps } from 'next/app'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import createEmotionCache from '../common/utils/createEmotionCache'
import DebugBanner from '../common/components/ui/utils/DebugBanner'
import { FullScreenLoadingProvider, SideBarProvider } from '../context/ui'
import { imprimir } from '../common/utils/imprimir'
import { ThemeProvider } from '../context/ui/ThemeContext'
import { AuthProvider } from '../context/auth'
import { Sidebar } from '../common/components/ui'
import { Constantes } from '../config'
import { SnackbarProvider } from 'notistack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { appWithTranslation } from 'next-i18next'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
	const queryClient = new QueryClient()

  const entorno = Constantes.appEnv
  imprimir(`🚀 iniciando en modo ${entorno}`)

  return (
    <CacheProvider value={emotionCache}>
      <FullScreenLoadingProvider>
        <SnackbarProvider maxSnack={1}>
          <DebugBanner />
          <AuthProvider>
            <SideBarProvider>
              <ThemeProvider>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Sidebar />
                <QueryClientProvider client={queryClient}>
                  <Component {...pageProps} />
                </QueryClientProvider>
              </ThemeProvider>
            </SideBarProvider>
          </AuthProvider>
        </SnackbarProvider>
      </FullScreenLoadingProvider>
    </CacheProvider>
  )
}

export default appWithTranslation(MyApp)
