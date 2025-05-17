import {defineConfig} from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Spequoia',
  description: 'A specification format for web applications',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    nav: [
      {text: 'Home', link: '/'},
      {text: 'Guide', link: '/guide'},
      {text: 'Schema', link: '/schema'}
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          {text: 'Why Spequoia', link: '/guide'},
          {text: 'Schema', link: '/schema'},
        ],
      }
    ],
    socialLinks: [{icon: 'github', link: 'https://github.com/pckerneis/spequoia'}]
  }
});
