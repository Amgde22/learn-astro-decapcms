import { defineConfig, passthroughImageService } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import vue from "@astrojs/vue";
import i18n from "@astrolicious/i18n";

// This checks if we are NOT running on Netlify
const isLocal = process.env.NETLIFY !== "true";

export default defineConfig({
  // Only apply passthroughImageService if we are local
  image: isLocal ? { service: passthroughImageService() } : undefined,

  site: "https://www.infopc-sba.com",

  integrations: [
    icon(),
    sitemap({
      i18n: {
        defaultLocale: 'ar',
        locales: {
          ar: 'ar-DZ',
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
    })
  ],
});