---
sidebar_position: 4
title: Chapter 4 - Unity Digital Twins
description: Creating visual digital twins in Unity and bridging simulation with reality
---

# Chapter 4: Unity Digital Twins

## Introduction

A **digital twin** is a virtual replica of a physical system. In this chapter, you'll create a digital twin in Unity that mirrors your robot's state in real-time, updated via ROS 2 messages from Gazebo simulation or real hardware.

**Prerequisites**: Chapters 1-3 | **Read time**: 12-15 minutes | **Hands-on time**: 20-30 minutes

---

## Learning Objectives

- ✅ Understand digital twin architecture and benefits
- ✅ Set up Unity with ROS 2 integration (ROS#)
- ✅ Create a 3D robot model in Unity
- ✅ Subscribe to ROS 2 joint states and animate the robot
- ✅ Visualize sensor data (camera, lidar) in real-time

---

## Core Concepts

### What is a Digital Twin?

A **digital twin**:
- Is an accurate virtual model of a physical system
- Updates in real-time with sensor data
- Enables visualization, testing, and analysis
- Bridges simulation and reality

### Architecture

```
Real Hardware                Gazebo Simulation
     ↓                              ↓
ROS 2 topics                  ROS 2 topics
     ↓                              ↓
  Unity digital twin ←─────────────┘
     ↓
Visualization, analysis, testing
```

### Benefits

- **Visualization**: See what your robot is doing
- **Debugging**: Understand failures by replaying recorded data
- **Prediction**: Test plans without real hardware
- **Communication**: Show non-technical stakeholders what the robot does

---

## Practical Walkthrough

### Installing Unity and ROS#

1. Download **Unity 2022 LTS** from https://unity.com
2. Install **ROS# from OSRF**: Asset Store → ROS# for Unity
3. Create new 3D project

### Creating a Simple Robot in Unity

**Hierarchy** (Scene structure):
```
Robot (empty GameObject)
├── Base (Cube)
├── LeftWheel (Cylinder)
└── RightWheel (Cylinder)
```

**Scripts**: `RobotController.cs`

```csharp
using UnityEngine;
using RosSharp.RosBridgeClient;
using sensor_msgs = RosSharp.RosBridgeClient.MessageTypes.Sensor;

public class RobotController : MonoBehaviour
{
    public Transform[] joints;  // All robot joints
    private RosConnector rosConnector;

    void Start()
    {
        rosConnector = GetComponent<RosConnector>();

        // Subscribe to joint states
        rosConnector.RosSocket.Subscribe<sensor_msgs.JointState>(
            "/joint_states", OnJointStateReceived
        );
    }

    void OnJointStateReceived(sensor_msgs.JointState msg)
    {
        // Update joint angles in Unity based on ROS data
        for (int i = 0; i < msg.name.Length; i++)
        {
            string jointName = msg.name[i];
            float angle = (float)msg.position[i];

            // Find matching joint and update rotation
            foreach (Transform joint in joints)
            {
                if (joint.name == jointName)
                {
                    joint.localRotation = Quaternion.AngleAxis(
                        Mathf.Rad2Deg * angle, Vector3.up
                    );
                }
            }
        }
    }
}
```

### Integrating with ROS 2

**ROS Connector Setup**:
1. Add ROS Connector GameObject to scene
2. Set Protocol: `RosBridge` (WebSocket)
3. Server URL: `ws://localhost:9090` (local ROS 2 bridge)
4. Attach `RobotController.cs` script

---

## Diagrams & Visuals

### Digital Twin Data Flow

```
Gazebo/Hardware
     |
  ROS 2 topics
(e.g., /joint_states)
     |
  ROS Bridge
(WebSocket)
     |
  Unity
  (ROS# listener)
     |
  Update robot 3D model
     |
  Display on screen
```

### 3D Model Hierarchy

```
Robot_Root (parent)
├── base_link (Cube)
│   ├── camera_link (small Cube)
│   └── joint_1
│       └── link_1 (Cylinder)
│           └── joint_2
│               └── link_2 (Cylinder)
└── wheel_left (Cylinder)
└── wheel_right (Cylinder)
```

---

## Code Examples

### Visualizing Lidar Data

```csharp
using UnityEngine;
using RosSharp.RosBridgeClient;
using sensor_msgs = RosSharp.RosBridgeClient.MessageTypes.Sensor;

public class LidarVisualizer : MonoBehaviour
{
    public Material pointMaterial;
    private RosConnector rosConnector;

    void Start()
    {
        rosConnector = GetComponent<RosConnector>();
        rosConnector.RosSocket.Subscribe<sensor_msgs.PointCloud2>(
            "/scan", OnPointCloudReceived
        );
    }

    void OnPointCloudReceived(sensor_msgs.PointCloud2 msg)
    {
        // Decode point cloud data and visualize points in Unity
        // (Implementation details depend on PointCloud2 format)
    }
}
```

---

## Common Pitfalls

### ❌ Pitfall 1: Network Latency

**Mistake**: Digital twin lags behind actual robot.

**Why**: WebSocket communication has delays.

**Solution**: Use local ROS bridge; minimize message frequency.

### ❌ Pitfall 2: Model Mismatch

**Mistake**: Unity model doesn't match URDF.

**Why**: Manual model creation introduces errors.

**Solution**: Import URDF directly with URDF importer plugins.

### ❌ Pitfall 3: Scaling Issues

**Mistake**: Robot appears wrong size in Unity.

**Why**: Unit mismatch (meters vs. centimeters).

**Solution**: Verify URDF uses meters; set Unity scale correctly.

---

## Summary & Next Steps

### What You Learned

✅ **Digital twins** are virtual replicas updated by real-time sensor data
✅ **Unity + ROS#** enables WebSocket-based robot visualization
✅ You subscribed to joint states and animated a 3D model
✅ Digital twins aid debugging, visualization, and stakeholder communication

### Key Takeaway

> Digital twins bridge the gap between simulation and reality, enabling visualization and analysis of robot behavior in an intuitive 3D interface.

### What's Next

**Chapter 5** (Isaac Sim Setup) will teach you:
- NVIDIA's AI-native simulator with GPU acceleration
- High-fidelity physics and sensor simulation
- Training AI models in simulation

---

## Exercises

### Challenge 1: Animate Multiple Joints

**Task**: Create a robot with 5+ joints and update all of them from ROS 2 joint states.

### Challenge 2: Visualize Sensor Data

**Task**: Display lidar point cloud as spheres in Unity, colored by distance.

### Challenge 3: Control from Digital Twin

**Task**: Reverse the data flow—send velocity commands from Unity to control the real robot (or Gazebo).

---

**Ready for AI-native simulation? Move to [Chapter 5: Isaac Sim Setup](./05-isaac-sim-setup.md)** 🚀
