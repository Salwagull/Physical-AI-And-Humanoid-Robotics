import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/Physical-AI-And-Humanoid-Robotics/',
    component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/', 'ad7'),
    exact: true
  },
  {
    path: '/Physical-AI-And-Humanoid-Robotics/',
    component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/', '563'),
    routes: [
      {
        path: '/Physical-AI-And-Humanoid-Robotics/',
        component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/', 'f91'),
        routes: [
          {
            path: '/Physical-AI-And-Humanoid-Robotics/',
            component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/', 'e37'),
            routes: [
              {
                path: '/Physical-AI-And-Humanoid-Robotics/book-overview',
                component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/book-overview', '76e'),
                exact: true
              },
              {
                path: '/Physical-AI-And-Humanoid-Robotics/chapters/capstone-architecture',
                component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/chapters/capstone-architecture', 'de8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Physical-AI-And-Humanoid-Robotics/chapters/capstone-implementation',
                component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/chapters/capstone-implementation', '65a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Physical-AI-And-Humanoid-Robotics/chapters/control-planning',
                component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/chapters/control-planning', 'ee2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Physical-AI-And-Humanoid-Robotics/chapters/deployment-next-steps',
                component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/chapters/deployment-next-steps', '748'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Physical-AI-And-Humanoid-Robotics/chapters/gazebo-simulation',
                component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/chapters/gazebo-simulation', '26c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Physical-AI-And-Humanoid-Robotics/chapters/isaac-sim-setup',
                component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/chapters/isaac-sim-setup', '467'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Physical-AI-And-Humanoid-Robotics/chapters/perception-vision',
                component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/chapters/perception-vision', 'beb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Physical-AI-And-Humanoid-Robotics/chapters/physical-ai-foundations',
                component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/chapters/physical-ai-foundations', 'd20'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Physical-AI-And-Humanoid-Robotics/chapters/ros2-essentials',
                component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/chapters/ros2-essentials', 'a9d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Physical-AI-And-Humanoid-Robotics/chapters/testing-validation',
                component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/chapters/testing-validation', 'dc6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Physical-AI-And-Humanoid-Robotics/chapters/unity-digital-twins',
                component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/chapters/unity-digital-twins', 'fbd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Physical-AI-And-Humanoid-Robotics/chapters/vla-systems-intro',
                component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/chapters/vla-systems-intro', '91c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Physical-AI-And-Humanoid-Robotics/chapters/voice-robotics',
                component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/chapters/voice-robotics', '9db'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Physical-AI-And-Humanoid-Robotics/code-examples',
                component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/code-examples', '202'),
                exact: true
              },
              {
                path: '/Physical-AI-And-Humanoid-Robotics/diagrams',
                component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/diagrams', 'f09'),
                exact: true
              },
              {
                path: '/Physical-AI-And-Humanoid-Robotics/glossary',
                component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/glossary', '5b4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Physical-AI-And-Humanoid-Robotics/intro',
                component: ComponentCreator('/Physical-AI-And-Humanoid-Robotics/intro', 'fc7'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
