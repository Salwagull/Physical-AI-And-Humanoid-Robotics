import React from 'react';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Physical AI Foundations',
    icon: '🤖',
    description: 'Understand embodied AI, sensor-motor systems, and the principles that power humanoid robots in the real world.',
    link: '/chapters/physical-ai-foundations',
  },
  {
    title: 'ROS 2 & Communication',
    icon: '🔧',
    description: 'Master the Robot Operating System with Python, publish-subscribe patterns, and distributed robotics architecture.',
    link: '/chapters/ros2-essentials',
  },
  {
    title: 'Simulation & Digital Twins',
    icon: '🌍',
    description: 'Build realistic simulations with Gazebo, create digital twins in Unity, and validate behavior before deployment.',
    link: '/chapters/gazebo-simulation',
  },
  {
    title: 'AI-Native Robotics',
    icon: '🧠',
    description: 'Implement perception, planning, and control using Isaac Sim, deep learning, and neural networks.',
    link: '/chapters/isaac-sim-setup',
  },
  {
    title: 'Vision-Language-Action',
    icon: '🗣️',
    description: 'Integrate large language models with robot perception for natural language understanding and voice control.',
    link: '/chapters/vla-systems-intro',
  },
  {
    title: 'Capstone Project',
    icon: '🏗️',
    description: 'Build an end-to-end Voice-Driven Mobile Manipulator that sees, thinks, speaks, and acts.',
    link: '/chapters/capstone-architecture',
  },
];

function Feature({icon, title, description, link, index}) {
  return (
    <a href={link} className={styles.featureCard} style={{'--delay': `${index * 0.1}s`}}>
      <div className={styles.featureIcon}>{icon}</div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
      <span className={styles.featureArrow}>→</span>
    </a>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>What You'll Learn</h2>
        <div className={styles.featureGrid}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} index={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
