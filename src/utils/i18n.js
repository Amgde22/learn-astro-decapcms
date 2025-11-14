import { getLocale } from "astro:i18n";

const locale = getLocale();

let translations = {};
 
try {
  translations = (await import(`../i18n/${locale}.json`)).default;
} catch (error) {
  console.error(`Could not load translations for locale: ${locale}`, error);
}

export function t(key) {
  return translations[key] || key;
}
