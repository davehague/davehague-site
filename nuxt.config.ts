export default defineNuxtConfig({
  typescript: {
    strict: true,
  },

  css: ["~/assets/styles.css"],
  plugins: ["~/plugins/analytics.client.ts"],
  ignore: ["experiments", "posts"],
  runtimeConfig: {
    adminToken: process.env.ADMIN_TOKEN,
  },

  app: {
    head: {
      title: "Dave Hague",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "msapplication-TileColor", content: "#2b5797" },
        { name: "theme-color", content: "#ffffff" },
      ],
      link: [
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5" },
      ],
    },
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  compatibilityDate: "2024-09-05",
});
