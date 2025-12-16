import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import styles from './index.module.css';

function HomepageHero() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      {/* Animated background elements */}
      <div className={styles.heroBackground}>
        {/* Animated grid */}
        <div className={styles.gridLines}></div>

        {/* Floating particles */}
        <div className={styles.floatingParticles}>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
        </div>

        {/* Central Humanoid Robot */}
        <div className={styles.humanoidRobot}>
          <svg viewBox="0 0 300 400" className={styles.humanoidSvg}>
            <defs>
              <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="glowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
              </linearGradient>
              <filter id="robotGlow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="strongGlow">
                <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Head */}
            <ellipse cx="150" cy="60" rx="40" ry="45" fill="none" stroke="url(#robotGradient)" strokeWidth="3" filter="url(#robotGlow)" className={styles.robotHead}/>

            {/* Eyes */}
            <circle cx="135" cy="50" r="8" fill="#06b6d4" filter="url(#strongGlow)" className={styles.robotEye}/>
            <circle cx="165" cy="50" r="8" fill="#06b6d4" filter="url(#strongGlow)" className={styles.robotEye}/>
            <circle cx="135" cy="50" r="4" fill="#fff" className={styles.robotPupil}/>
            <circle cx="165" cy="50" r="4" fill="#fff" className={styles.robotPupil}/>

            {/* Antenna */}
            <line x1="150" y1="15" x2="150" y2="0" stroke="url(#robotGradient)" strokeWidth="2" filter="url(#robotGlow)"/>
            <circle cx="150" cy="0" r="5" fill="#a855f7" filter="url(#strongGlow)" className={styles.antennaPulse}/>

            {/* Neck */}
            <rect x="140" y="105" width="20" height="25" rx="5" fill="none" stroke="url(#robotGradient)" strokeWidth="2" filter="url(#robotGlow)"/>

            {/* Torso */}
            <path d="M100 130 L200 130 L210 200 L190 250 L110 250 L90 200 Z" fill="none" stroke="url(#robotGradient)" strokeWidth="3" filter="url(#robotGlow)" className={styles.robotTorso}/>

            {/* Core reactor */}
            <circle cx="150" cy="180" r="20" fill="none" stroke="#06b6d4" strokeWidth="2" filter="url(#strongGlow)" className={styles.coreOuter}/>
            <circle cx="150" cy="180" r="12" fill="#06b6d4" opacity="0.5" filter="url(#strongGlow)" className={styles.coreInner}/>
            <circle cx="150" cy="180" r="6" fill="#fff" filter="url(#strongGlow)" className={styles.corePulse}/>

            {/* Left arm */}
            <g className={styles.leftArm}>
              <rect x="60" y="135" width="35" height="60" rx="8" fill="none" stroke="url(#robotGradient)" strokeWidth="2" filter="url(#robotGlow)"/>
              <rect x="65" y="200" width="25" height="50" rx="6" fill="none" stroke="url(#robotGradient)" strokeWidth="2" filter="url(#robotGlow)"/>
              <circle cx="77" cy="135" r="10" fill="none" stroke="#10b981" strokeWidth="2" filter="url(#robotGlow)" className={styles.jointPulse}/>
              <circle cx="77" cy="200" r="8" fill="none" stroke="#10b981" strokeWidth="2" filter="url(#robotGlow)" className={styles.jointPulse}/>
              {/* Hand */}
              <path d="M60 255 L55 275 M70 255 L70 280 M80 255 L85 275" stroke="url(#robotGradient)" strokeWidth="3" strokeLinecap="round" filter="url(#robotGlow)" className={styles.robotFingers}/>
            </g>

            {/* Right arm */}
            <g className={styles.rightArm}>
              <rect x="205" y="135" width="35" height="60" rx="8" fill="none" stroke="url(#robotGradient)" strokeWidth="2" filter="url(#robotGlow)"/>
              <rect x="210" y="200" width="25" height="50" rx="6" fill="none" stroke="url(#robotGradient)" strokeWidth="2" filter="url(#robotGlow)"/>
              <circle cx="223" cy="135" r="10" fill="none" stroke="#10b981" strokeWidth="2" filter="url(#robotGlow)" className={styles.jointPulse}/>
              <circle cx="223" cy="200" r="8" fill="none" stroke="#10b981" strokeWidth="2" filter="url(#robotGlow)" className={styles.jointPulse}/>
              {/* Hand */}
              <path d="M215 255 L210 275 M225 255 L225 280 M235 255 L240 275" stroke="url(#robotGradient)" strokeWidth="3" strokeLinecap="round" filter="url(#robotGlow)" className={styles.robotFingers}/>
            </g>

            {/* Left leg */}
            <g className={styles.leftLeg}>
              <rect x="110" y="255" width="30" height="70" rx="8" fill="none" stroke="url(#robotGradient)" strokeWidth="2" filter="url(#robotGlow)"/>
              <rect x="105" y="330" width="40" height="50" rx="6" fill="none" stroke="url(#robotGradient)" strokeWidth="2" filter="url(#robotGlow)"/>
              <circle cx="125" cy="255" r="10" fill="none" stroke="#a855f7" strokeWidth="2" filter="url(#robotGlow)" className={styles.jointPulse}/>
              <circle cx="125" cy="330" r="8" fill="none" stroke="#a855f7" strokeWidth="2" filter="url(#robotGlow)" className={styles.jointPulse}/>
              {/* Foot */}
              <ellipse cx="125" cy="385" rx="25" ry="10" fill="none" stroke="url(#robotGradient)" strokeWidth="2" filter="url(#robotGlow)"/>
            </g>

            {/* Right leg */}
            <g className={styles.rightLeg}>
              <rect x="160" y="255" width="30" height="70" rx="8" fill="none" stroke="url(#robotGradient)" strokeWidth="2" filter="url(#robotGlow)"/>
              <rect x="155" y="330" width="40" height="50" rx="6" fill="none" stroke="url(#robotGradient)" strokeWidth="2" filter="url(#robotGlow)"/>
              <circle cx="175" cy="255" r="10" fill="none" stroke="#a855f7" strokeWidth="2" filter="url(#robotGlow)" className={styles.jointPulse}/>
              <circle cx="175" cy="330" r="8" fill="none" stroke="#a855f7" strokeWidth="2" filter="url(#robotGlow)" className={styles.jointPulse}/>
              {/* Foot */}
              <ellipse cx="175" cy="385" rx="25" ry="10" fill="none" stroke="url(#robotGradient)" strokeWidth="2" filter="url(#robotGlow)"/>
            </g>

            {/* Energy waves */}
            <circle cx="150" cy="180" r="35" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.3" className={styles.energyWave1}/>
            <circle cx="150" cy="180" r="50" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.2" className={styles.energyWave2}/>
            <circle cx="150" cy="180" r="65" fill="none" stroke="#a855f7" strokeWidth="1" opacity="0.1" className={styles.energyWave3}/>
          </svg>
        </div>

        {/* Scanning lines */}
        <div className={styles.scanLine}></div>
        <div className={styles.scanLine2}></div>

        {/* Circuit patterns left */}
        <div className={styles.circuitLeft}>
          <svg viewBox="0 0 200 400" className={styles.circuitSvg}>
            <path d="M0 50 L50 50 L70 70 L70 150 L100 180" stroke="#06b6d4" strokeWidth="2" fill="none" className={styles.circuit1}/>
            <path d="M0 150 L80 150 L100 170 L100 250" stroke="#10b981" strokeWidth="2" fill="none" className={styles.circuit2}/>
            <path d="M0 250 L60 250 L80 230 L150 230" stroke="#a855f7" strokeWidth="2" fill="none" className={styles.circuit3}/>
            <path d="M0 350 L100 350 L120 330 L200 330" stroke="#06b6d4" strokeWidth="2" fill="none" className={styles.circuit4}/>
            <circle cx="100" cy="180" r="5" fill="#06b6d4" className={styles.circuitNode}/>
            <circle cx="100" cy="250" r="5" fill="#10b981" className={styles.circuitNode}/>
            <circle cx="150" cy="230" r="5" fill="#a855f7" className={styles.circuitNode}/>
          </svg>
        </div>

        {/* Circuit patterns right */}
        <div className={styles.circuitRight}>
          <svg viewBox="0 0 200 400" className={styles.circuitSvg}>
            <path d="M200 80 L150 80 L130 100 L130 180 L100 210" stroke="#06b6d4" strokeWidth="2" fill="none" className={styles.circuit1}/>
            <path d="M200 180 L120 180 L100 200 L100 280" stroke="#10b981" strokeWidth="2" fill="none" className={styles.circuit2}/>
            <path d="M200 280 L140 280 L120 260 L50 260" stroke="#a855f7" strokeWidth="2" fill="none" className={styles.circuit3}/>
            <path d="M200 380 L100 380 L80 360 L0 360" stroke="#06b6d4" strokeWidth="2" fill="none" className={styles.circuit4}/>
            <circle cx="100" cy="210" r="5" fill="#06b6d4" className={styles.circuitNode}/>
            <circle cx="100" cy="280" r="5" fill="#10b981" className={styles.circuitNode}/>
            <circle cx="50" cy="260" r="5" fill="#a855f7" className={styles.circuitNode}/>
          </svg>
        </div>

        {/* Data streams */}
        <div className={styles.dataStream1}></div>
        <div className={styles.dataStream2}></div>
        <div className={styles.dataStream3}></div>
      </div>

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          <span className={styles.titleWrapper}>
            <span className={styles.titleLetter} style={{'--i': 0}}>P</span>
            <span className={styles.titleLetter} style={{'--i': 1}}>h</span>
            <span className={styles.titleLetter} style={{'--i': 2}}>y</span>
            <span className={styles.titleLetter} style={{'--i': 3}}>s</span>
            <span className={styles.titleLetter} style={{'--i': 4}}>i</span>
            <span className={styles.titleLetter} style={{'--i': 5}}>c</span>
            <span className={styles.titleLetter} style={{'--i': 6}}>a</span>
            <span className={styles.titleLetter} style={{'--i': 7}}>l</span>
            <span className={styles.titleSpace}>&nbsp;</span>
            <span className={styles.titleLetter} style={{'--i': 8}}>A</span>
            <span className={styles.titleLetter} style={{'--i': 9}}>I</span>
          </span>
          <br />
          <span className={styles.titleSecondary}>
            <span className={styles.ampersand}>&</span> Humanoid Robotics
          </span>
        </h1>
        <p className={styles.heroSubtitle}>
          Build intelligent robots that <span className={styles.highlight}>see</span>, <span className={styles.highlight}>think</span>, <span className={styles.highlight}>speak</span>, and <span className={styles.highlight}>act</span>
        </p>
        <p className={styles.heroTagline}>
          From ROS 2 fundamentals to Vision-Language-Action systems
        </p>
        <div className={styles.heroButtons}>
          <Link
            className={styles.primaryButton}
            to="/intro">
            <span className={styles.buttonGlow}></span>
            Get Started
            <span className={styles.buttonArrow}>→</span>
          </Link>
          <Link
            className={styles.secondaryButton}
            to="/chapters/physical-ai-foundations">
            Start Learning
          </Link>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>13</span>
            <span className={styles.statLabel}>Chapters</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>50+</span>
            <span className={styles.statLabel}>Code Examples</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>5</span>
            <span className={styles.statLabel}>Modules</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Master robot development from ROS 2 to Vision-Language-Action systems">
      <HomepageHero />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
