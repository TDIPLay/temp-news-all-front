import { createI18n } from "vue-i18n";
function loadLocaleMessages() {
  const locales = require.context(
    "./locales",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      (messages as any)[locale] = locales(key);
    }
  });
  return messages;
}

export default createI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || "kr",
  legacy: false,
  globalInjection: true,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "kr",
  messages: loadLocaleMessages(),
});
