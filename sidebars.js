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
        'chapters/physical-ai-foundations',
        'chapters/ros2-essentials',
        'chapters/gazebo-simulation',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Digital Twins',
      items: [
        'chapters/unity-digital-twins',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: AI-Native Robotics',
      items: [
        'chapters/isaac-sim-setup',
        'chapters/perception-vision',
        'chapters/control-planning',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action',
      items: [
        'chapters/vla-systems-intro',
        'chapters/voice-robotics',
      ],
    },
    {
      type: 'category',
      label: 'Module 5: Capstone',
      items: [
        'chapters/capstone-architecture',
        'chapters/capstone-implementation',
        'chapters/testing-validation',
        'chapters/deployment-next-steps',
      ],
    },
    {
      type: 'doc',
      id: 'glossary',
      label: 'Glossary',
    },
  ],
};

module.exports = sidebars;
