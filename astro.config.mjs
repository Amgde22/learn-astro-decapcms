import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import vue from "@astrojs/vue";

import i18n from "@astrolicious/i18n";



export default defineConfig({
// update me!
  site: "https://www.yourwebsite.com",

  integrations: [icon(),
   sitemap({    
      i18n: {
        defaultLocale: 'ar', // All urls that don't contain `es` or `fr` after `"https://www.yourwebsite.com/"` will be treated as default locale, i.e. `en`
        locales: {
          // key/value pairs of all languages supported
          ar: 'ar-DZ', // The `defaultLocale` value must be present in `locales` keys
          fr: 'fr-FR',
        },
      },
    filter: (page) => !page.includes("/admin"),
    changefreq: "weekly",
    priority: 0.7,
   }),
   i18n({
    defaultLocale: "ar",
    locales: ["ar", "fr"],
    client: {
      data: true,
      paths: true,
    },
  }), 
  vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.includes('-'),
      },
    },
  })],

});