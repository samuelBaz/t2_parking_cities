// hooks/useTranslation.js
import { useRouter } from 'next/router'
import en from '../../public/locales/en/common.json'
import es from '../../public/locales/es/common.json'
import fr from '../../public/locales/fr/common.json'
import pt from '../../public/locales/pt/common.json'
import de from '../../public/locales/de/common.json'
import it from '../../public/locales/it/common.json'
import sv from '../../public/locales/sv/common.json'

type TranslationsMap = {
  en: any
  es: any
  fr: any
  pt: any
  de: any
  it: any
  sv: any
  [key: string]: any
}

const translations: TranslationsMap = {
  en,
  es,
  fr,
  pt,
  de,
  it,
  sv,
}

export function useTranslation() {
  const router = useRouter()
  const { locale } = router

  const t = (key: any): string => {
    if (locale && translations[locale]) {
      const keys = key.split('.') as any[]
      let result: any = translations[locale]

      for (const k of keys) {
        if (result[k] === undefined) {
          return key
        }
        result = result[k]
      }
      return result
    }
    return key
  }

  const changeLanguage = (lang: string) => {
    router.push(router.pathname, router.asPath, { locale: lang })
  }

  const currentLanguage = locale

  return { t, changeLanguage, currentLanguage }
}
