// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'From ROS 2 to Vision-Language-Action Systems',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://salwagull.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For local development, use '/' ; for GitHub pages deployment, use '/<projectName>/'
  baseUrl: '/Physical-AI-And-Humanoid-Robotics/',

  // GitHub pages deployment config.
  organizationName: 'Salwagull', // Usually your GitHub org/user name.
  projectName: 'Physical-AI-And-Humanoid-Robotics', // Usually your repo name.
  trailingSlash: false,
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Docs available at /intro, /chapters, /glossary etc.
          routeBasePath: '/',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Salwagull/Physical-AI-And-Humanoid-Robotics/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/logo.svg',
      navbar: {
        title: 'Physical AI & Robotics',
        logo: {
          alt: 'Physical AI Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: '/intro',
            label: 'Introduction',
            position: 'left',
          },
          {
            type: 'dropdown',
            label: 'Chapters',
            position: 'left',
            items: [
              {
                type: 'html',
                value: '<span class="dropdown-header">Module 1: Foundations</span>',
              },
              {
                to: '/chapters/physical-ai-foundations',
                label: '1. Physical AI Foundations',
              },
              {
                to: '/chapters/ros2-essentials',
                label: '2. ROS 2 Essentials',
              },
              {
                to: '/chapters/gazebo-simulation',
                label: '3. Gazebo Simulation',
              },
              {
                type: 'html',
                value: '<span class="dropdown-header">Module 2: Digital Twins</span>',
              },
              {
                to: '/chapters/unity-digital-twins',
                label: '4. Unity Digital Twins',
              },
              {
                type: 'html',
                value: '<span class="dropdown-header">Module 3: AI-Native</span>',
              },
              {
                to: '/chapters/isaac-sim-setup',
                label: '5. Isaac Sim Setup',
              },
              {
                to: '/chapters/perception-vision',
                label: '6. Perception & Vision',
              },
              {
                to: '/chapters/control-planning',
                label: '7. Control & Planning',
              },
              {
                type: 'html',
                value: '<span class="dropdown-header">Module 4: VLA</span>',
              },
              {
                to: '/chapters/vla-systems-intro',
                label: '8. VLA Systems Intro',
              },
              {
                to: '/chapters/voice-robotics',
                label: '9. Voice-Driven Robotics',
              },
              {
                type: 'html',
                value: '<span class="dropdown-header">Module 5: Capstone</span>',
              },
              {
                to: '/chapters/capstone-architecture',
                label: '10. Capstone Architecture',
              },
              {
                to: '/chapters/capstone-implementation',
                label: '11. Capstone Implementation',
              },
              {
                to: '/chapters/testing-validation',
                label: '12. Testing & Validation',
              },
              {
                to: '/chapters/deployment-next-steps',
                label: '13. Deployment & Next Steps',
              },
            ],
          },
          {
            to: '/glossary',
            label: 'Glossary',
            position: 'left',
          },
          {
            href: 'https://github.com/Salwagull/Physical-AI-And-Humanoid-Robotics',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Learn',
            items: [
              {
                label: 'Introduction',
                to: '/intro',
              },
              {
                label: 'Chapter 1: Physical AI',
                to: '/chapters/physical-ai-foundations',
              },
              {
                label: 'Glossary',
                to: '/glossary',
              },
            ],
          },
          {
            title: 'Modules',
            items: [
              {
                label: 'Foundations & Communication',
                to: '/chapters/ros2-essentials',
              },
              {
                label: 'AI-Native Robotics',
                to: '/chapters/isaac-sim-setup',
              },
              {
                label: 'Vision-Language-Action',
                to: '/chapters/vla-systems-intro',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/Salwagull/Physical-AI-And-Humanoid-Robotics',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Physical AI & Humanoid Robotics. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.oneDark,
        darkTheme: prismThemes.oneDark,
        additionalLanguages: ['bash', 'yaml', 'python'],
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
};

export default config;
