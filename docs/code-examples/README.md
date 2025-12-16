# Code Examples

This directory contains runnable code examples for each chapter of the Physical AI & Humanoid Robotics book.

## Directory Structure

```
code-examples/
├── ch01/    # Chapter 1: Physical AI Foundations
├── ch02/    # Chapter 2: ROS 2 Essentials
├── ch03/    # Chapter 3: Gazebo Simulation
├── ch04/    # Chapter 4: Unity Digital Twins
├── ch05/    # Chapter 5: Isaac Sim Setup
├── ch06/    # Chapter 6: Perception & Vision
├── ch07/    # Chapter 7: Control & Planning
├── ch08/    # Chapter 8: VLA Systems Intro
├── ch09/    # Chapter 9: Voice Robotics
├── ch10/    # Chapter 10: Capstone Architecture
├── ch11/    # Chapter 11: Capstone Implementation
├── ch12/    # Chapter 12: Testing & Validation
└── ch13/    # Chapter 13: Deployment & Next Steps
```

## Requirements

- Python 3.10+
- ROS 2 Humble (Ubuntu 22.04 recommended)
- Gazebo Garden
- NVIDIA Isaac Sim 2024.x (for Chapters 5-7, 10-13)

## Running Examples

Each chapter directory contains a README with specific setup instructions. Generally:

```bash
# Source ROS 2
source /opt/ros/humble/setup.bash

# Run Python examples
python3 <example_name>.py
```

## Code Standards

All code examples follow:
- PEP 8 style guide
- ROS 2 naming conventions (rclpy)
- Inline comments explaining *why*, not just *what*
