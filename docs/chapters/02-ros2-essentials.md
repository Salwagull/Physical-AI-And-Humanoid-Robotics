---
sidebar_position: 2
title: Chapter 2 - ROS 2 Essentials
description: Building distributed robotics systems with the Robot Operating System 2
---

# Chapter 2: ROS 2 Essentials

## Introduction

The **Robot Operating System 2 (ROS 2)** is the industry-standard middleware for building distributed robotics systems. It provides the plumbing that lets multiple independent programs (called **nodes**) communicate, coordinate, and work together to control a robot.

In this chapter, you'll learn the core abstractions of ROS 2: **nodes**, **topics**, **services**, and **parameters**. By the end, you'll write your first ROS 2 publisher and subscriber in Python (rclpy).

**Prerequisites**: Chapter 1 (Physical AI Foundations) | **Read time**: 12-15 minutes | **Hands-on time**: 15-20 minutes

---

## Learning Objectives

By the end of this chapter, you will:

- ✅ Understand the ROS 2 architecture: nodes, topics, services, and parameters
- ✅ Write a ROS 2 publisher in Python (rclpy)
- ✅ Write a ROS 2 subscriber in Python
- ✅ Use ROS 2 command-line tools to inspect and debug a running system
- ✅ Create your first ROS 2 package and launch a multi-node system

---

## Core Concepts

### ROS 2 Architecture

ROS 2 is built on a **publish-subscribe** pattern, enabling loosely coupled distributed systems.

**Key components**:
- **Node**: An independent ROS 2 program (typically Python or C++)
- **Topic**: A named channel for data (e.g., `/cmd_vel` for velocity commands)
- **Publisher**: A node that sends data to a topic
- **Subscriber**: A node that receives data from a topic
- **Message**: The data structure sent over a topic (e.g., `geometry_msgs/Twist`)

### Why Publish-Subscribe?

Traditional centralized control:
```
Single program controls everything ← Single point of failure
```

ROS 2 distributed control:
```
Perception node → Topic 1 ↓
Planning node   → Topic 2 → Control node → Hardware
Monitoring node → Topic 3 ↓
```

**Advantages**:
- **Modularity**: Each node has a single responsibility
- **Scalability**: Add nodes without modifying existing ones
- **Fault tolerance**: Failure in one node doesn't crash the whole system
- **Testability**: Test nodes independently or integrated

### Messages and Data Types

ROS 2 uses **message** types to structure data. Common types:

```
geometry_msgs/Twist       # Linear and angular velocity
sensor_msgs/Image        # Camera images
sensor_msgs/LaserScan    # Lidar point cloud
std_msgs/Float32         # Single floating-point value
```

Each message has fields:
```python
# geometry_msgs/Twist
linear:           # Linear velocity (3D)
  x: float        # Forward (m/s)
  y: float        # Sideways (m/s)
  z: float        # Up (m/s)
angular:          # Angular velocity (3D)
  x: float        # Roll (rad/s)
  y: float        # Pitch (rad/s)
  z: float        # Yaw (rad/s)
```

### Topics vs. Services

| **Topics** (Pub-Sub) | **Services** (Request-Reply) |
|---|---|
| Asynchronous; fire-and-forget | Synchronous; wait for response |
| One-to-many communication | One-to-one communication |
| Continuous data streams | On-demand operations |
| Example: `/sensor_data`, `/camera/image` | Example: `robot/reset`, `gripper/open` |

---

## Practical Walkthrough

### Setting Up ROS 2

**Installation** (Ubuntu 22.04):
```bash
# Add ROS 2 repository
sudo curl -sSL https://repo.ros2.org/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://repo.ros2.org/ubuntu focal main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null

# Install ROS 2 Humble
sudo apt update
sudo apt install ros-humble-desktop python3-colcon-common-extensions

# Source setup
source /opt/ros/humble/setup.bash
```

### Your First Publisher

Create a file `publisher.py`:

```python
#!/usr/bin/env python3
import rclpy
from geometry_msgs.msg import Twist

def main(args=None):
    rclpy.init(args=args)
    node = rclpy.create_node('velocity_publisher')

    # Create publisher: topic name, message type, queue size
    pub = node.create_publisher(Twist, '/cmd_vel', queue_size=10)

    # Create a velocity message
    msg = Twist()
    msg.linear.x = 0.5       # Move forward 0.5 m/s
    msg.angular.z = 0.0      # Don't rotate

    # Publish at 10 Hz
    rate = node.create_rate(10)

    while rclpy.ok():
        pub.publish(msg)
        node.get_logger().info(f"Published: linear.x={msg.linear.x}")
        rate.sleep()

    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Your First Subscriber

Create a file `subscriber.py`:

```python
#!/usr/bin/env python3
import rclpy
from geometry_msgs.msg import Twist

def velocity_callback(msg):
    """Called every time a message is received"""
    print(f"Received velocity: x={msg.linear.x}, z={msg.angular.z}")

def main(args=None):
    rclpy.init(args=args)
    node = rclpy.create_node('velocity_subscriber')

    # Create subscriber: topic name, message type, callback
    sub = node.create_subscription(Twist, '/cmd_vel', velocity_callback, queue_size=10)

    print("Listening to /cmd_vel...")
    rclpy.spin(node)  # Keep node running, process messages

    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Running Publisher and Subscriber

**Terminal 1** (Publisher):
```bash
source /opt/ros/humble/setup.bash
python3 publisher.py
```

**Terminal 2** (Subscriber):
```bash
source /opt/ros/humble/setup.bash
python3 subscriber.py
```

**Output**:
```
Listening to /cmd_vel...
Received velocity: x=0.5, z=0.0
Received velocity: x=0.5, z=0.0
...
```

---

## Diagrams & Visuals

### ROS 2 Pub-Sub Architecture

```
Publisher Node              Subscriber Node 1
   ↓                           ↑
   └─────── Topic /cmd_vel ────┤
                                ├─ Subscriber Node 2
                                ↑
                                (Any number of subscribers
                                 can listen to same topic)
```

### Life of a ROS 2 Message

```
Publisher          DDS (Data Distribution Service)       Subscriber
──────────                                              ───────────
Create message
     ↓
Publish to topic ──────────────→ Distributed ───────────→ Deliver to
(/cmd_vel)                      to all subscribers        callback
     ↓
Continue                                                      ↓
publishing                                              Process message
```

---

## Code Examples

### Creating a ROS 2 Package

```bash
# Create a package
ros2 pkg create my_robot_pkg --build-type ament_python --dependencies rclpy

# Structure
my_robot_pkg/
├── setup.py
├── setup.cfg
├── package.xml
└── my_robot_pkg/
    ├── __init__.py
    ├── publisher.py
    └── subscriber.py
```

### ROS 2 Command-Line Tools

```bash
# List all nodes
ros2 node list

# List all topics
ros2 topic list

# Echo a topic (print all messages)
ros2 topic echo /cmd_vel

# Publish a message manually
ros2 topic pub /cmd_vel geometry_msgs/Twist "linear: {x: 0.5, y: 0, z: 0}, angular: {x: 0, y: 0, z: 0}"

# Inspect a message type
ros2 msg show geometry_msgs/Twist
```

---

## Common Pitfalls

### ❌ Pitfall 1: Publishing Without Subscribers

**Mistake**: Messages are published but no one receives them.

**Why**: ROS 2 is asynchronous; publishers don't wait for subscribers.

**Solution**: Verify subscribers exist before publishing (`ros2 topic info /topic`).

### ❌ Pitfall 2: Wrong Message Type

**Mistake**: Publishing `String` to a topic expecting `Twist`.

**Why**: Message types must match; subscribers expect specific structure.

**Solution**: Always check message type with `ros2 msg show <type>`.

### ❌ Pitfall 3: Forgetting to Source Setup

**Mistake**: ROS 2 commands not found; import errors.

**Why**: Environment variables not set.

**Solution**: Always `source /opt/ros/humble/setup.bash` in each terminal.

### ❌ Pitfall 4: Unbounded Queue Size

**Mistake**: `queue_size=0` (unlimited) causes memory leaks.

**Why**: Old messages accumulate if subscriber is slow.

**Solution**: Use reasonable queue size (e.g., 10) to discard old messages.

---

## Summary & Next Steps

### What You Learned

✅ ROS 2 uses **publish-subscribe** architecture for distributed systems
✅ **Nodes** are independent programs; **topics** are communication channels
✅ **Publishers** send data; **subscribers** receive and process it
✅ ROS 2 command-line tools let you inspect and debug live systems
✅ You wrote your first **publisher and subscriber** in Python (rclpy)

### Key Takeaway

> ROS 2 enables **modular robotics systems** where each node has a single responsibility. Loosely coupled nodes communicate via topics, making systems scalable and fault-tolerant.

### What's Next

**Chapter 3** (Gazebo Simulation) will teach you:
- Running physics simulations with Gazebo
- Creating robot models (URDF)
- Integrating ROS 2 nodes with Gazebo

**By the end of Module 1**, you'll have:
- Multi-node ROS 2 systems
- Simulated robot control in Gazebo
- Complete sensor-to-actuator pipelines

---

## Exercises

### Challenge 1: Multi-Node Communication

**Task**: Create a system with 3 nodes:
1. **Sensor Publisher**: Publishes simulated sensor data (`std_msgs/Float32` on `/sensor_data`)
2. **Data Processor**: Subscribes to sensor data, processes it (e.g., converts C to F)
3. **Logger**: Subscribes to processed data, prints it

### Challenge 2: Service Server

**Task**: Create a service that rotates a value (e.g., `/rotate_angle`).
- Input: angle
- Output: rotated angle (angle + 90°)

Implement both server and client.

### Challenge 3: Parameter Server

**Task**: Use ROS 2 parameters to configure robot speed without code changes.
```bash
ros2 run my_robot_pkg publisher --ros-args -p speed:=1.0
```

---

## Glossary Quick Reference

| Term | Definition | Chapter |
|------|-----------|---------|
| **Node** | An independent ROS 2 program | 2, 10, 11 |
| **Topic** | Named channel for pub-sub communication | 2, 10, 11 |
| **Publisher** | Node that sends data to a topic | 2, 10, 11 |
| **Subscriber** | Node that receives data from a topic | 2, 10, 11 |
| **Message** | Data structure sent over a topic | 2, 10, 11 |
| **Service** | Request-response communication pattern | 2, 10, 11 |
| **DDS** | Data Distribution Service (ROS 2 transport layer) | 2 |

---

**Ready to simulate? Move to [Chapter 3: Gazebo Simulation](./03-gazebo-simulation.md)** 🚀
