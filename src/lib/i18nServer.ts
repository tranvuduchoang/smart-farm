import i18next from "i18next";
import i18nConfig from "@/lib/i18nConfig";
import resourcesToBackend from "i18next-resources-to-backend";

let i18nInstance: typeof i18next | null = null;

export const getServerTranslation = async (ns: string, lng: string) => {
  if (!i18nInstance) {
    i18nInstance = i18next.createInstance();

    await i18nInstance
      .use(
        resourcesToBackend((language: string, namespace: string) =>
          import(`@/locales/${language}/${namespace}.json`)
        )
      )
      .init({
        supportedLngs: i18nConfig.supportedLngs,
        fallbackLng: i18nConfig.fallbackLng,
        lng,
        ns,
        defaultNS: ns,
        preload: [lng],
        interpolation: {
          escapeValue: false,
        },
      });
  }

  return {
    t: i18nInstance.getFixedT(lng, ns),
    i18n: i18nInstance,
  };
};
