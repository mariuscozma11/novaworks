import 'server-only';
import type { Locale } from './i18n-config';

export { i18n, type Locale } from './i18n-config';

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  ro: () => import('@/dictionaries/ro.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};
