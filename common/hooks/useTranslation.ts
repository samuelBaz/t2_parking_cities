// hooks/useTranslation.js
import { useRouter } from 'next/router'
import en from '../../public/locales/en/common.json'
import es from '../../public/locales/es/common.json'

type TranslationsMap = {
  en: any
  es: any
  [key: string]: any
}

const translations: TranslationsMap = {
  en,
  es,
}

export function useTranslation() {
  const { locale } = useRouter();
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
  };

  return { t };
}
