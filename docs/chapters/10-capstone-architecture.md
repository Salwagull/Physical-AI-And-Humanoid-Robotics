---
sidebar_position: 10
title: Chapter 10 - Capstone Architecture
description: Designing the Voice-Driven Mobile Manipulator system architecture
---

# Chapter 10: Capstone Architecture

## Introduction

The **Capstone Project** integrates everything learned in Modules 1-4: ROS 2, simulation, perception, control, and VLA systems. You'll design a complete **Voice-Driven Mobile Manipulator** that understands voice commands and executes complex manipulation tasks.

**Prerequisites**: Chapters 1-9 | **Read time**: 12-15 minutes | **Hands-on time**: 10-15 minutes

---

## Learning Objectives

- ✅ Understand the overall system architecture
- ✅ Design modular ROS 2 node structure
- ✅ Integrate perception, planning, control, and voice subsystems
- ✅ Define communication protocols between modules
- ✅ Plan implementation phases and milestones

---

## Core Concepts

### System Overview

The **Voice-Driven Mobile Manipulator** is a robot that:
1. **Listens** to voice commands
2. **Perceives** the environment (camera, lidar)
3. **Plans** manipulation tasks (motion planning)
4. **Controls** motion (ROS 2 actuator commands)
5. **Responds** with status updates

### Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│         VOICE-DRIVEN MOBILE MANIPULATOR         │
├─────────────────────────────────────────────────┤
│                                                   │
│  Voice Control       Perception       Planning   │
│  ─────────────       ───────────      ─────────  │
│  • Microphone        • Camera         • MoveIt   │
│  • Whisper ASR       • Lidar          • RRT      │
│  • Intent recog.     • YOLO OD        • IK       │
│        ↓                ↓                ↓       │
│        └─────────── ROS 2 Core ────────┘        │
│             (nodes, topics, services)           │
│                        ↓                         │
│  Control & Hardware                             │
│  ──────────────────────                         │
│  • Motion controller                            │
│  • Gripper controller                           │
│  • Base controller                              │
│        ↓                                         │
│  ┌─────────────────────────────────┐            │
│  │ Robot (Real or Gazebo Sim)      │            │
│  │ • Mobile base (wheels)          │            │
│  │ • Robotic arm (7-DOF)           │            │
│  │ • Gripper                       │            │
│  │ • Sensors                       │            │
│  └─────────────────────────────────┘            │
│                                                   │
└─────────────────────────────────────────────────┘
```

### Node Structure

```
voice_control_node
  ↓ (goal)
task_planner_node
  ├─ (plan) → motion_planning_node
  │             ↓ (trajectory)
  │           motion_control_node
  │             ↓ (joint commands)
  │           hardware_interface
  │
  └─ (perception request) → perception_node
      ↓ (object location, obstacles)
```

---

## Practical Walkthrough

### Node Design

**Voice Control Node**:
```python
# Listens to microphone
# Transcribes with Whisper
# Sends goal to task planner
```

**Task Planner Node**:
```python
# Receives goal from voice control
# Calls LLM to decompose into subtasks
# Requests motion plans for each subtask
# Monitors progress
```

**Motion Planning Node**:
```python
# Receives target pose
# Uses MoveIt to plan collision-free trajectory
# Executes trajectory via motion control
```

**Perception Node**:
```python
# Subscribes to camera/lidar
# Detects objects (YOLO)
# Publishes detected objects
```

### Communication Protocol

**Topics**:
```
/voice_command (String): "Pick up the red cube"
/goal (std_msgs/String): Structured goal
/trajectory (trajectory_msgs/JointTrajectory): Planned path
/joint_commands (control_msgs/JointControllerStateList): Motor commands
/objects (custom_msgs/ObjectList): Detected objects
/robot_state (sensor_msgs/JointState): Current state
```

**Services**:
```
/plan_motion (MoveIt): Request trajectory planning
/perceive (custom_msgs/PerceptionRequest): Request object detection
/execute_plan (std_msgs/Empty): Start trajectory execution
```

---

## Diagrams & Visuals

### Data Flow

```
Voice input → Whisper → Intent → LLM decomposition
                                        ↓
                            Task 1, Task 2, Task 3
                                ↓
                    Motion planner (MoveIt)
                                ↓
                    Trajectory (joint angles over time)
                                ↓
                    Motion controller (ROS 2 drivers)
                                ↓
                    Robot execution
```

### Module Dependencies

```
Voice → Task Planner → Motion Planner → Motion Control → Robot
         ↑                                    ↓
         └─────── Perception (continuous) ──┘
```

---

## Code Examples

### System Launch File

```python
# launch_capstone.py
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    voice_node = Node(
        package='voice_control_pkg',
        executable='voice_control',
        name='voice_control_node',
        remappings=[('/cmd_vel', '/mobile_base/cmd_vel')]
    )

    perception_node = Node(
        package='perception_pkg',
        executable='perception',
        name='perception_node'
    )

    planner_node = Node(
        package='planning_pkg',
        executable='task_planner',
        name='task_planner_node'
    )

    motion_node = Node(
        package='motion_pkg',
        executable='motion_control',
        name='motion_control_node'
    )

    return LaunchDescription([
        voice_node,
        perception_node,
        planner_node,
        motion_node,
    ])
```

### Service Definition

```python
# custom_msgs/srv/Plan.srv
string goal_description
geometry_msgs/Pose target_pose
---
trajectory_msgs/JointTrajectory trajectory
bool success
```

---

## Common Pitfalls

### ❌ Pitfall 1: Tight Coupling

**Mistake**: Voice node directly calls control node.

**Why**: Hard to debug; changes break dependencies.

**Solution**: Use pub-sub and services; keep nodes loosely coupled.

### ❌ Pitfall 2: No Timeout Handling

**Mistake**: System hangs if perception node crashes.

**Why**: Task planner waits forever for response.

**Solution**: Add timeouts to all service calls.

### ❌ Pitfall 3: Single Point of Failure

**Mistake**: If task planner crashes, whole system fails.

**Why**: Poor error handling.

**Solution**: Implement fallback behaviors; health monitoring.

---

## Summary & Next Steps

### What You Learned

✅ **System architecture** integrates perception, planning, control, and voice
✅ **ROS 2 structure** with nodes, topics, and services
✅ **Module dependencies** and data flows
✅ **Design principles**: modularity, loose coupling, error handling

### Key Takeaway

> Good architecture enables incremental development and testing of each module independently.

### What's Next

**Chapter 11** (Capstone Implementation) will teach you:
- Implementing each node
- Testing individual modules
- Integration and debugging

---

**Ready to implement? Move to [Chapter 11: Capstone Implementation](./11-capstone-implementation.md)** 💻
