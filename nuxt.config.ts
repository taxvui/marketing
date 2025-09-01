// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
    },
  },

  css: ["~/assets/css/main.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  vue: {},

  runtimeConfig: {
    // Private server-side variables
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseApiKey: process.env.SUPABASE_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
    public: {
      strapiUrl: process.env.STRAPI_URL,
    },
  },

  routeRules: {
    "/docs": { redirect: "/docs/getting-started/introduction" },
    "/docs/**": { proxy: "https://activepieces.mintlify.dev/docs/**" },
    "/plans": { redirect: "/pricing" },
    "/roadmap": {
      redirect: "https://github.com/orgs/activepieces/projects/53",
    },
    "/report-issue": {
      redirect: "https://community.activepieces.com/c/need-help/5",
    },
    "/pieces-roadmap": {
      redirect: "https://community.activepieces.com/c/feature-requests/9",
    },
    "/request-a-piece": {
      redirect: "https://community.activepieces.com/c/feature-requests/9",
    },
    "/request-a-feature": {
      redirect: "https://community.activepieces.com/c/feature-requests/9",
    },
    "/school": {
      redirect:
        "https://community.activepieces.com/c/tutorials/automation-school/11",
    },
    "/subprocessors": {
      redirect: "https://trust.activepieces.com/subprocessors"
    },
    "/security": {
      redirect: "https://trust.activepieces.com"
    },
    "/spells": {
      redirect: "https://community.activepieces.com/t/ai-spells-month-15-ai-use-case/7023"
    }
  },

  hooks: {
    "pages:extend"(pages) {
      // playbook- is a functional name that we use in the code to replace and parse the paths
      pages.push({
        name: "playbook-embedded-ipaas",
        path: "/embedded-ipaas:all(.*)",
        file: "~/pages/playbook/[...all].vue",
        meta: { layout: "playbook" },
      });

      pages.push({
        name: "playbook-ai-transformation",
        path: "/ai-transformation:all(.*)",
        file: "~/pages/playbook/[...all].vue",
        meta: { layout: "playbook" },
      });
    },
  },

  modules: ["@nuxtjs/sitemap"],

  sitemap: {
    urls: async () => {
      return [...(await getBlogUrls()), ...(await getPieceUrls())];
    },
  },
});



const getPieceUrls = async function () {
  const piecesUrl = "https://cloud.activepieces.com/api/v1/pieces";
  const piecesResponse = await fetch(piecesUrl);
  const pieces = await piecesResponse.json();

  return pieces.map(
    (piece) => `/pieces/${piece.name.match(/(?:^@[\w-]+\/piece-)([\w-]+)$/)[1]}`
  );
};
