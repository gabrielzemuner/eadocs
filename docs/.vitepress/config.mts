import { defineConfig } from "vitepress";
import { generateSidebar } from "vitepress-sidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/eadocs/",
  title: "EADocs",
  description: "Minhas anotações de estudo",
  cleanUrls: true,
  markdown: {
    config(md) {
      const defaultRender = md.renderer.rules.html_inline!
      md.renderer.rules.html_inline = (tokens, idx, options, env, self) => {
        const content = tokens[idx].content
        if (content.match(/^<[a-zA-Z]/) && !content.match(/^<(a |br|hr|img|input|link|meta|div|span|p |ul|ol|li|table|tr|td|th|h[1-6]|script|style|button|form|label|select|option|textarea)/i)) {
          return content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
        }
        if (defaultRender) {
          return defaultRender(tokens, idx, options, env, self)
        }
        return self.renderToken(tokens, idx, options)
      }
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: "local",
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],

    // sidebar: [
    //   {
    //     text: "Examples",
    //     items: [
    //       { text: "Markdown Examples", link: "/markdown-examples" },
    //       { text: "Runtime API Examples", link: "/api-examples" },
    //     ],
    //   },
    // ],

    sidebar: generateSidebar({
      documentRootPath: "docs",
      useTitleFromFileHeading: true,
      useFolderTitleFromIndexFile: true,
      sortMenusByFrontmatterOrder: true,
      collapsed: true,
    }),

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
