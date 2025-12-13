/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a set of docs in the sidebar
 - provide next/previous navigation

 The docusaurus-plugin-content-docs creates the files and a default sidebars file containing the sidebar structure of all docs.

 Learn more about sidebar configuration at: https://docusaurus.io/docs/sidebar
 */

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Module 1: Foundations & Communication',
      items: [
        'chapters/01-physical-ai-foundations',
        'chapters/02-ros2-essentials',
        'chapters/03-gazebo-simulation',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Digital Twins',
      items: [
        'chapters/04-unity-digital-twins',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: AI-Native Robotics',
      items: [
        'chapters/05-isaac-sim-setup',
        'chapters/06-perception-vision',
        'chapters/07-control-planning',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action',
      items: [
        'chapters/08-vla-systems-intro',
        'chapters/09-voice-robotics',
      ],
    },
    {
      type: 'category',
      label: 'Module 5: Capstone',
      items: [
        'chapters/10-capstone-architecture',
        'chapters/11-capstone-implementation',
        'chapters/12-testing-validation',
        'chapters/13-deployment-next-steps',
      ],
    },
    {
      type: 'doc',
      id: 'glossary',
      label: 'Glossary',
    },
    {
      type: 'doc',
      id: 'appendix',
      label: 'Appendix',
    },
  ],
};

module.exports = sidebars;
