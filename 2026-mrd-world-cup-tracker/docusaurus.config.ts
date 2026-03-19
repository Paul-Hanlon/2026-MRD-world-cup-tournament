import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: '2026 MRDA World Cup Tracker',
  tagline: 'Live score tracking for the 2026 MRDA World Cup',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://paul-hanlon.github.io',
  baseUrl: '/2026-MRDA-world-cup-tournament-/',

  organizationName: 'Paul-Hanlon',
  projectName: '2026-MRDA-world-cup-tournament-',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/Paul-Hanlon/2026-MRDA-world-cup-tournament-/tree/main/2026-mrd-world-cup-tracker/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '2026 MRDA World Cup Tracker',
      logo: {
        alt: 'MRDA World Cup Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/Paul-Hanlon/2026-MRDA-world-cup-tournament-',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
            {
              label: 'Tournament Format',
              to: '/docs/tournament-format',
            },
            {
              label: 'Ranking Algorithm',
              to: '/docs/ranking-algorithm',
            },
            {
              label: 'App Usage',
              to: '/docs/app-usage',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Paul-Hanlon/2026-MRDA-world-cup-tournament-',
            },
            {
              label: 'MRDA',
              href: 'https://www.mrda.info',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} MRDA World Cup Tracker. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
