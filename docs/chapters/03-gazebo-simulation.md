---
sidebar_position: 3
title: Chapter 3 - Gazebo Simulation
description: Building realistic physics simulations with Gazebo and ROS 2
---

# Chapter 3: Gazebo Simulation

## Introduction

**Gazebo** is the gold-standard open-source physics simulator for robotics. It lets you test robot algorithms in a realistic virtual environment before deploying to expensive hardware. In this chapter, you'll create robot models, simulate physics, and integrate Gazebo with ROS 2.

**Prerequisites**: Chapters 1-2 (Physical AI Foundations, ROS 2 Essentials) | **Read time**: 12-15 minutes | **Hands-on time**: 20-25 minutes

---

## Learning Objectives

By the end of this chapter, you will:

- ✅ Understand robot models: links, joints, and URDF (Unified Robot Description Format)
- ✅ Create a custom robot model in URDF
- ✅ Launch Gazebo and simulate a robot with physics
- ✅ Integrate ROS 2 with Gazebo for sensor simulation and actuator control
- ✅ Use RViz to visualize robot state and sensor data

---

## Core Concepts

### Robot Representation: URDF

**URDF (Unified Robot Description Format)** is an XML language describing robot structure:
- **Links**: Rigid bodies (body parts)
- **Joints**: Connections between links (motors, hinges, sliders)
- **Sensors**: Cameras, lidar, IMU, force/torque sensors
- **Collision geometry**: Shapes for collision detection
- **Visual geometry**: Shapes for rendering

### Physics Simulation

Gazebo simulates:
- **Rigid body dynamics**: F = ma; gravity, friction, inertia
- **Collisions**: Object-object and object-world collisions
- **Sensor simulation**: Realistic camera images, lidar point clouds, IMU noise
- **Actuator control**: Motor torques, gripper forces

### Integration with ROS 2

Gazebo plugins enable ROS 2 integration:
- **Joint State Publisher**: Publishes robot pose to `/joint_states`
- **Differential Drive Plugin**: Listens to `/cmd_vel` and moves the robot
- **Camera Plugin**: Publishes camera images to `/camera/image`
- **Lidar Plugin**: Publishes point clouds to `/scan`

---

## Practical Walkthrough

### Creating a Simple Robot Model (URDF)

Create `simple_robot.urdf`:

```xml
<?xml version="1.0"?>
<robot name="simple_robot">
  <!-- Base link -->
  <link name="base_link">
    <inertial>
      <mass value="1.0"/>
      <inertia ixx="0.01" ixy="0" ixz="0" iyy="0.01" iyz="0" izz="0.01"/>
    </inertial>
    <collision>
      <geometry>
        <box size="0.2 0.2 0.1"/>
      </geometry>
    </collision>
    <visual>
      <geometry>
        <box size="0.2 0.2 0.1"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 1 1"/>
      </material>
    </visual>
  </link>

  <!-- Wheel joint (left) -->
  <joint name="left_wheel_joint" type="continuous">
    <parent link="base_link"/>
    <child link="left_wheel"/>
    <axis xyz="0 1 0"/>
    <origin xyz="-0.1 0.05 0" rpy="0 0 0"/>
  </joint>

  <!-- Left wheel link -->
  <link name="left_wheel">
    <inertial>
      <mass value="0.5"/>
      <inertia ixx="0.001" ixy="0" ixz="0" iyy="0.001" iyz="0" izz="0.001"/>
    </inertial>
    <collision>
      <geometry>
        <cylinder radius="0.05" length="0.01"/>
      </geometry>
    </collision>
    <visual>
      <geometry>
        <cylinder radius="0.05" length="0.01"/>
      </geometry>
      <material name="black">
        <color rgba="0 0 0 1"/>
      </material>
    </visual>
  </link>

  <!-- Similar for right_wheel_joint and right_wheel -->
  <!-- (truncated for brevity) -->
</robot>
```

### Launching Gazebo with ROS 2

Create `launch_robot.py`:

```python
from launch import LaunchDescription
from launch_ros.actions import Node
from launch_ros.substitutions import FindPackageShare

def generate_launch_description():
    pkg_share = FindPackageShare(package='my_robot_pkg').find('my_robot_pkg')
    urdf_file = f'{pkg_share}/models/robot.urdf'

    gazebo_node = Node(
        package='gazebo_ros',
        executable='gazebo',
        arguments=['--verbose', f'--world={pkg_share}/worlds/default.world'],
    )

    spawn_entity_node = Node(
        package='gazebo_ros',
        executable='spawn_entity.py',
        arguments=['-entity', 'my_robot', '-file', urdf_file],
    )

    return LaunchDescription([gazebo_node, spawn_entity_node])
```

### Running the Simulation

```bash
# Build the package
colcon build --packages-select my_robot_pkg

# Source setup
source install/setup.bash

# Launch Gazebo
ros2 launch my_robot_pkg launch_robot.py
```

---

## Diagrams & Visuals

### Robot Structure (URDF)

```
      base_link (main body)
           |
    ┌──────┴──────┐
    |             |
left_wheel    right_wheel
```

### Gazebo Simulation Loop

```
Gazebo Simulator
┌────────────────────────────┐
│ Physics engine (50-1000 Hz)│
│ • Gravity                  │
│ • Collision                │
│ • Friction                 │
└────────────────────────────┘
        ↓
┌────────────────────────────┐
│ Sensor simulation          │
│ • Camera images            │
│ • Lidar scans              │
│ • Joint positions          │
└────────────────────────────┘
        ↓
   ROS 2 topics
   /camera/image, /scan, /joint_states
        ↓
   Your control nodes
   (subscribers to /cmd_vel, etc.)
```

---

## Code Examples

### Spawning a Robot in Gazebo

```python
import rclpy
from gazebo_ros import SpawnEntity
from ament_index_python.packages import get_package_share_directory

def spawn_robot():
    rclpy.init()
    node = rclpy.create_node('spawn_robot')

    pkg_share = get_package_share_directory('my_robot_pkg')
    urdf_file = f'{pkg_share}/models/robot.urdf'

    with open(urdf_file, 'r') as f:
        urdf_xml = f.read()

    spawn_entity = SpawnEntity(
        name='my_robot',
        xml=urdf_xml,
        robot_namespace='',
        initial_pose=None,
        timeout=100.0,
    )

    rclpy.shutdown()

if __name__ == '__main__':
    spawn_robot()
```

### Subscribing to Joint States

```python
import rclpy
from sensor_msgs.msg import JointState

def joint_state_callback(msg):
    print(f"Joint names: {msg.name}")
    print(f"Positions: {msg.position}")
    print(f"Velocities: {msg.velocity}")

def main():
    rclpy.init()
    node = rclpy.create_node('joint_monitor')

    sub = node.create_subscription(
        JointState, '/joint_states', joint_state_callback, 10
    )

    rclpy.spin(node)
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

---

## Common Pitfalls

### ❌ Pitfall 1: Wrong Inertia Values

**Mistake**: Mass and inertia tensors don't match robot reality.

**Why it fails**: Robot becomes unstable or unrealistically fast.

**Solution**: Compute inertia from CAD models or empirical measurements.

### ❌ Pitfall 2: Unrealistic Friction

**Mistake**: Friction values don't match real-world materials.

**Why it fails**: Simulated robot behavior differs from real hardware.

**Solution**: Tune friction in simulation to match real robot measurements.

### ❌ Pitfall 3: Missing Collision Geometry

**Mistake**: Robot or environment has no collision shapes.

**Why it fails**: Robot passes through walls; unrealistic behavior.

**Solution**: Define collision geometry for all moving parts.

---

## Summary & Next Steps

### What You Learned

✅ **URDF** is the standard language for describing robot structure
✅ **Gazebo** simulates physics, sensors, and actuators
✅ **ROS 2 integration** lets you control simulated robots like real ones
✅ You created and launched a simulated robot

### Key Takeaway

> Gazebo enables safe, repeatable robot development. Test algorithms in simulation before deploying to expensive hardware.

### What's Next

**Chapter 4** (Unity Digital Twins) will teach you:
- Creating visual representations of robots in Unity
- Building digital twins that mirror Gazebo simulations
- Real-time visualization for debugging and demonstration

---

## Exercises

### Challenge 1: Create a Custom Robot

**Task**: Design a simple 2-wheel robot (differential drive) in URDF with:
- Base link (box 0.2×0.2×0.1 m)
- Two wheels (cylinders, radius 0.05 m)
- Caster wheel (ball, radius 0.02 m) for stability

### Challenge 2: Sensor Integration

**Task**: Add sensors to your robot:
- Camera (looking forward)
- Lidar (looking down/around)
- IMU (measuring orientation and acceleration)

### Challenge 3: Physics Tuning

**Task**: Spawn your robot in Gazebo and observe its motion.
- Does it accelerate smoothly?
- Does it slide realistically?
- Adjust friction and mass to improve realism.

---

## Glossary Quick Reference

| Term | Definition | Chapter |
|------|-----------|---------|
| **URDF** | Unified Robot Description Format; XML language for robot structure | 2, 3, 5 |
| **Link** | Rigid body segment of a robot | 1, 2, 3, 5, 7 |
| **Joint** | Connection between two links (motor, hinge, slider) | 1, 2, 3, 5, 7 |
| **Inertia** | Resistance to acceleration; depends on mass and shape | 3, 7 |
| **Physics Simulation** | Computing motion under forces and constraints | 3, 5 |
| **Gazebo** | Open-source physics simulator for robotics | 3, 5, 10, 11 |

---

**Ready for digital twins? Move to [Chapter 4: Unity Digital Twins](./04-unity-digital-twins.md)** 🎮
