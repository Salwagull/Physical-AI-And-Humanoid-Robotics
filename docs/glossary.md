---
sidebar_position: 99
title: Glossary
description: Terminology and definitions used throughout the book
---

# Glossary: Physical AI & Humanoid Robotics

This glossary defines 50+ key terms used throughout the book. Terms are organized alphabetically with cross-references showing how they relate to chapters and each other.

## A

### Actuator
A device that converts electrical signals into mechanical motion (motors, pumps, hydraulics). Actuators are the "muscles" of robots, controlled by a **ROS 2 controller**.

**See also**: Motor, Control System, Kinematics
**Chapters**: 1, 2, 7, 10, 11

### Autonomous
A system that operates independently without direct human control. Robotics autonomy ranges from basic (following waypoints) to advanced (understanding intent and adapting to unexpected situations).

**See also**: Behavior Tree, Motion Planning
**Chapters**: 5, 6, 7, 8, 9, 10

### Axis-Angle Representation
A rotation representation using a 3D axis vector and a scalar angle. Useful for interpolating rotations smoothly.

**See also**: Quaternion, Euler Angles, Rotation Matrix
**Chapters**: 7

## B

### Behavior Tree
A hierarchical decision-making structure for robots. Unlike state machines, behavior trees allow complex behaviors to be modular and reusable.

**Equation**: `Tree execution = Check conditions → Execute actions → Update state`

**See also**: State Machine, Autonomous, Planning
**Chapters**: 8, 10, 11

### Bounding Box
In computer vision, a rectangular region around detected objects. Used for object detection and localization.

**Notation**: (x, y, width, height) or (x1, y1, x2, y2)

**See also**: Computer Vision, Object Detection, YOLO
**Chapters**: 6

## C

### Camera Calibration
The process of determining a camera's intrinsic and extrinsic parameters (focal length, principal point, distortion). Essential for accurate 3D perception.

**See also**: Intrinsic Parameters, Extrinsic Parameters, Depth Estimation
**Chapters**: 3, 6

### Capstone Project
The final integrated system built across Module 5 (Chapters 10-13). A voice-driven mobile manipulator combining perception, planning, and control.

**Components**: ROS 2 nodes, Gazebo simulation, Isaac Sim, voice interface, motion planning, vision pipeline

**See also**: Modules, Mobile Manipulator, Vision-Language-Action
**Chapters**: 10, 11, 12, 13

### Cartesian Coordinates
A 3D coordinate system (x, y, z) representing positions in space. The standard for robot end-effector and world positions.

**See also**: Quaternion, Pose, Homogeneous Transformation
**Chapters**: 2, 5, 7

### Centralized Control
A single controller managing all robot subsystems. Compare with **distributed control** (ROS 2 approach).

**Pros**: Simpler to debug; **Cons**: Single point of failure
**See also**: Distributed Control, ROS 2, Publisher-Subscriber
**Chapters**: 2, 10, 11

### Closed-Loop Control
A control system that measures output and adjusts input to reach a target (feedback control). Essential for accurate robot motion.

**Equation**: `Error = Target - Current; Input = Kp * Error + Ki * Integral(Error) + Kd * Derivative(Error)` (PID control)

**See also**: Open-Loop Control, PID, Feedback
**Chapters**: 3, 7

### Collision Detection
Identifying when robot bodies intersect with obstacles or other robots. Used during motion planning to ensure safe paths.

**See also**: Motion Planning, Obstacle Avoidance, Safety
**Chapters**: 5, 7, 10

### Computer Vision
The field of AI that processes and understands images. Fundamental to robot perception (object detection, segmentation, depth estimation).

**See also**: Object Detection, Semantic Segmentation, Depth Estimation
**Chapters**: 6, 8, 9

### Convolution Neural Network (CNN)
A deep learning architecture optimized for image processing. Powers modern object detection and segmentation models.

**See also**: Deep Learning, Object Detection, YOLO, Semantic Segmentation
**Chapters**: 6

### Control System
Software and hardware that regulates robot motion to achieve desired goals (reaching a target position, following a path, maintaining stability).

**See also**: PID, Closed-Loop Control, Feedback, Dynamics
**Chapters**: 1, 3, 7, 10, 11

### Coordinate Frame
A reference system (origin + axes) for measuring positions and orientations. Robots use multiple frames (base, end-effector, camera).

**Standard Notation**: frame1_from_frame2 or frame1_in_frame2

**See also**: Homogeneous Transformation, Quaternion, Cartesian Coordinates
**Chapters**: 2, 5, 7

### Custom Message
User-defined ROS 2 data type for publishing and subscribing. Allows structured communication between nodes.

**Example**:
```
geometry_msgs/Twist velocity
sensor_msgs/JointState state
```

**See also**: Publisher, Subscriber, Message, ROS 2
**Chapters**: 2, 10, 11

## D

### Deep Learning
A subfield of machine learning using neural networks with multiple layers. Powers modern perception systems in robotics.

**See also**: Neural Network, CNN, Object Detection
**Chapters**: 6, 8

### Digital Twin
A virtual replica of a physical system used for simulation, testing, and optimization before hardware deployment.

**Architecture**: Simulation engine (Gazebo/Isaac Sim) ↔ Visualization (Unity) ↔ Real robot

**See also**: Simulation, Gazebo, Isaac Sim, Unity
**Chapters**: 3, 4, 5, 10, 11

### Distributed Control
Multiple controllers managing different subsystems, communicating via **ROS 2**. Compare with **centralized control**.

**Pros**: Modularity, fault isolation; **Cons**: More complex debugging
**See also**: Centralized Control, ROS 2, Publisher-Subscriber
**Chapters**: 2, 10, 11

### Dynamics
The study of forces and motion. Robot dynamics governs how actuators must be controlled to achieve desired motions.

**Key Concept**: F = ma; robots must overcome gravity, friction, and inertia

**See also**: Kinematics, Control System, Actuator
**Chapters**: 1, 7

## E

### Embodied AI
AI systems that interact with the physical world through sensors and actuators. Combines perception, reasoning, and action.

**See also**: Physical AI, Vision-Language-Action, Autonomous
**Chapters**: 1, 8, 9

### End-Effector
The tool at the end of a robot arm (gripper, camera, laser, drill). Controlled through a chain of **joints** and **links**.

**See also**: Gripper, Link, Joint, Kinematics
**Chapters**: 1, 5, 7

### Euler Angles
A rotation representation using three angles (roll, pitch, yaw). Intuitive but subject to **gimbal lock**.

**Notation**: (α, β, γ) or (roll, pitch, yaw)
**Limitation**: Gimbal lock at pitch = ±90°

**See also**: Quaternion, Axis-Angle, Rotation Matrix
**Chapters**: 5, 7

### Extrinsic Parameters
Camera parameters describing its position and orientation relative to a world frame. Needed for 3D reconstruction.

**See also**: Intrinsic Parameters, Camera Calibration
**Chapters**: 6

## F

### Feedback
Information returned to a controller about system state. Essential for **closed-loop control**.

**See also**: Closed-Loop Control, PID, Sensor
**Chapters**: 1, 3, 7

### Forward Kinematics
Computing end-effector position/orientation from joint angles. Straightforward calculation; inverse is harder.

**Notation**: `end_effector = f(θ1, θ2, θ3, ...)`

**See also**: Inverse Kinematics, Jacobian, Link, Joint
**Chapters**: 2, 5, 7

## G

### Gazebo
An open-source physics simulator for robotics. Simulates rigid body dynamics, sensors, and actuators realistically.

**Capabilities**: Multiple robots, sensors (cameras, lidar, IMU), actuators, plugins
**Comparison**: Lighter than Isaac Sim; no GPU required; suitable for CPU-only development

**See also**: Simulation, Digital Twin, Isaac Sim, ROS 2
**Chapters**: 3, 5, 10, 11

### Gimbal Lock
A loss of rotational freedom when using **Euler angles**. Occurs at specific angles (pitch = ±90°), making certain rotations impossible.

**Solution**: Use **quaternions** instead

**See also**: Euler Angles, Quaternion
**Chapters**: 5, 7

### Gradient Descent
An optimization algorithm that iteratively updates model parameters to minimize error. Fundamental to training neural networks.

**See also**: Deep Learning, Neural Network, Optimization
**Chapters**: 6, 8

### Gripper
A mechanical hand that grasps objects. Controlled via ROS 2 commands to open/close.

**See also**: End-Effector, Actuator
**Chapters**: 1, 10, 11

## H

### Homogeneous Transformation
A 4×4 matrix representing position and orientation (rotation + translation) in a single unified format.

**Notation**:
```
[R11 R12 R13 Tx]
[R21 R22 R23 Ty]
[R31 R32 R33 Tz]
[  0   0   0  1]
```

**See also**: Rotation Matrix, Translation, Coordinate Frame
**Chapters**: 5, 7

### Humanoid Robot
A robot designed with a human-like body (head, torso, arms, legs). Enables use of human-designed environments and tools.

**See also**: Mobile Manipulator, Bipedal Locomotion
**Chapters**: 1, 10, 11

## I

### Intrinsic Parameters
Camera parameters describing how light is projected onto the image sensor (focal length, principal point, distortion). Determined via **camera calibration**.

**Notation**: Camera matrix K; distortion coefficients (k1, k2, p1, p2)

**See also**: Extrinsic Parameters, Camera Calibration
**Chapters**: 6

### Inverse Kinematics (IK)
Computing joint angles from a desired end-effector pose. Harder than **forward kinematics**; multiple solutions often exist.

**Notation**: `(θ1, θ2, θ3, ...) = f_inv(end_effector_pose)`

**See also**: Forward Kinematics, Jacobian
**Chapters**: 7, 10, 11

### Isaac Sim
NVIDIA's AI-native physics simulator with GPU acceleration. Enables large-scale sim-to-real training and high-fidelity simulation.

**Features**: GPU-accelerated physics, synthetic data generation, RL training integration
**Requirements**: NVIDIA GPU with CUDA; CPU fallback available

**See also**: Simulation, Gazebo, Digital Twin, ROS 2
**Chapters**: 5, 10, 11

## J

### Jacobian
A matrix of partial derivatives relating joint velocities to end-effector velocities. Essential for inverse kinematics and impedance control.

**Notation**: `ẋ = J(θ) * θ̇`

**See also**: Inverse Kinematics, Forward Kinematics, Control
**Chapters**: 7

### Joint
A movable connection between two **links** (e.g., revolute, prismatic, continuous). Rotates or translates to enable motion.

**Types**: Revolute (rotates around axis), Prismatic (slides along axis), Fixed (no motion)

**See also**: Link, End-Effector, Kinematics, URDF
**Chapters**: 1, 2, 5, 7

## K

### Kinematics
The study of motion without considering forces. Describes how robot joint angles relate to end-effector position and orientation.

**See also**: Forward Kinematics, Inverse Kinematics, Dynamics, Jacobian
**Chapters**: 2, 5, 7

## L

### Large Language Model (LLM)
A neural network trained on vast text corpora to understand and generate human language. Powers natural language interfaces for robots.

**Examples**: GPT-4, Claude, Llama
**Use in VLA**: Task planning, natural language understanding, instruction following

**See also**: Vision-Language-Action, Transformer, Natural Language Processing
**Chapters**: 8, 9, 10

### Latency
The time delay between input and output. Critical for responsive robot control and real-time perception.

**Typical ROS 2 latency**: 1-10 ms (real-time optimizations reduce this)

**See also**: Real-Time, Frequency, Topic
**Chapters**: 2, 10, 11

### Learning Objective
A specific, measurable outcome learners should achieve by completing a chapter. Guides study and self-assessment.

**Structure**: Verb + noun; measurable via exercises or projects

**See also**: Acceptance Criteria, Chapter Structure
**Chapters**: All

### Lidar
Light-based radar; a sensor that measures distances by scanning a laser. Provides 3D point clouds for obstacle detection and mapping.

**See also**: Sensor, Point Cloud, Depth Estimation, SLAM
**Chapters**: 3, 6, 10, 11

### Link
A rigid body connecting two **joints**. Forms the structural skeleton of a robot.

**Representation**: URDF `<link>` element; includes geometry, inertia, collision properties

**See also**: Joint, End-Effector, URDF, Kinematics
**Chapters**: 2, 5, 7

### Localization
Determining a robot's position and orientation in its environment. Often combined with **SLAM**.

**See also**: SLAM, Mapping, Perception
**Chapters**: 3, 6, 10

## M

### Mapping
Creating a representation of the environment (occupancy grid, map, 3D model). Often combined with **localization** (SLAM).

**See also**: SLAM, Localization, Lidar, Point Cloud
**Chapters**: 3, 6, 10

### Message
A data structure used for ROS 2 communication. Standardized (e.g., `geometry_msgs/Twist`) or **custom**.

**See also**: Custom Message, Publisher, Subscriber, Topic
**Chapters**: 2, 10, 11

### Mobile Manipulator
A robot combining a mobile base (wheels/legs) with a robotic arm (manipulator). Enables reach beyond the base footprint.

**See also**: Humanoid Robot, End-Effector, Locomotion
**Chapters**: 1, 10, 11, 12, 13

### Module
A thematic grouping of chapters covering related topics (e.g., Module 1: Foundations & Communication). Each module builds on the previous.

**5 Modules**: Foundations, Digital Twins, AI-Native Robotics, Vision-Language-Action, Capstone

**See also**: Chapter, Learning Path, Capstone Project
**Chapters**: All

### Motion Planning
Computing collision-free paths for robots to move from one configuration to another. Essential for safe autonomous navigation.

**Algorithms**: RRT, PRM, Dijkstra's algorithm
**Tools**: MoveIt (ROS 2), ompl library

**See also**: Collision Detection, Inverse Kinematics, Autonomous
**Chapters**: 5, 7, 10, 11

### Motor
An actuator that converts electrical energy into rotational motion. Most common actuator in robots.

**See also**: Actuator, Servo, End-Effector, Dynamics
**Chapters**: 1, 7

## N

### Natural Language Processing (NLP)
The field of AI that understands and generates human language. Foundation for voice robotics and **Vision-Language-Action** systems.

**See also**: Large Language Model, Vision-Language-Action, Voice Control
**Chapters**: 8, 9

### Neural Network
A computational model inspired by biological neurons. Fundamental to modern deep learning and AI.

**Layers**: Input → Hidden (multiple) → Output
**Training**: Gradient descent optimization

**See also**: Deep Learning, CNN, Transformer
**Chapters**: 6, 8

### Node
A ROS 2 program that publishes to or subscribes from **topics**. Nodes are modular, independent processes.

**Lifecycle**: Startup → Active → Shutdown
**Communication**: Publish-subscribe via topics; service calls; parameters

**See also**: Publisher, Subscriber, Topic, ROS 2
**Chapters**: 2, 10, 11

### Non-Functional Requirement (NFR)
A quality attribute independent of functionality (performance, reliability, security, usability).

**Examples for this book**: Readability (Flesch 8-10), Code quality (PEP 8), Reproducibility (tested on Ubuntu/WSL2)

**See also**: Functional Requirement, Success Criteria
**Chapters**: All

## O

### Object Detection
Identifying and locating objects in images. Fundamental perception task for robotics.

**Methods**: YOLO, Faster R-CNN, SSD
**Output**: Bounding boxes + class labels + confidence scores

**See also**: Computer Vision, CNN, Semantic Segmentation, Bounding Box
**Chapters**: 6, 8

### Occupancy Grid
A grid representation of an environment where each cell is "occupied," "free," or "unknown." Used in **mapping** and **motion planning**.

**See also**: Mapping, SLAM, Motion Planning
**Chapters**: 3, 6, 10

### Open-Loop Control
A control system that doesn't use **feedback**. Applies preset commands without monitoring actual system behavior.

**Downside**: No error correction; sensitive to disturbances
**See also**: Closed-Loop Control, Feedback, Control System
**Chapters**: 3, 7

## P

### Package
A ROS 2 organizational unit containing nodes, launch files, configuration, and tests.

**Structure**: `src/my_package/` with `setup.py`, `package.xml`, `my_package/` (Python code)

**See also**: Node, Launch File, ROS 2
**Chapters**: 2, 10, 11

### Perception
The process of understanding the world through sensors (cameras, lidar, IMU). Fundamental to autonomous robots.

**Pipeline**: Sensor data → Processing → Feature extraction → Decision making

**See also**: Computer Vision, Sensor, Lidar, Camera
**Chapters**: 1, 6, 8, 10, 11

### PID Control
Proportional-Integral-Derivative control; a classic feedback controller using three terms to compute control input.

**Equation**: `u(t) = Kp*e(t) + Ki*∫e(τ)dτ + Kd*de/dt`
- **Kp**: Proportional gain
- **Ki**: Integral gain
- **Kd**: Derivative gain

**See also**: Closed-Loop Control, Feedback, Control System
**Chapters**: 3, 7

### Physical AI
The intersection of AI and robotics, where intelligent algorithms control physical systems in real-world environments.

**Key Principle**: Embodied cognition; understanding emerges from interaction with the world

**See also**: Embodied AI, Autonomous, Perception
**Chapters**: 1, 8, 9

### Pinhole Camera Model
A simplified camera model treating light as traveling in straight lines through a focal point. Foundation for camera calibration and 3D vision.

**See also**: Camera Calibration, Intrinsic Parameters, Projection
**Chapters**: 6

### Point Cloud
A 3D representation of a scene as a set of (x, y, z) points, often with additional attributes (color, intensity, normal).

**Sources**: Lidar, depth cameras, stereo vision
**Processing**: Filtering, segmentation, registration (alignment)

**See also**: Lidar, 3D Reconstruction, Depth Estimation
**Chapters**: 3, 6, 10

### Pose
A combination of position (3D coordinates) and orientation (rotation). Represents "where" and "how oriented" a robot or object is.

**Notation**: (x, y, z, roll, pitch, yaw) or 4×4 **homogeneous transformation**

**See also**: Cartesian Coordinates, Quaternion, Homogeneous Transformation
**Chapters**: 2, 5, 7

### Publisher
A ROS 2 node or process that sends data to a **topic**. One-to-many communication; subscribers listen to the topic.

**See also**: Subscriber, Topic, Message, Node
**Chapters**: 2, 10, 11

## Q

### Quaternion
A 4-dimensional representation of rotation (w, x, y, z). Avoids **gimbal lock** and enables smooth interpolation.

**Notation**: q = w + xi + yj + zk
**Unit quaternion**: |q| = 1

**See also**: Euler Angles, Axis-Angle, Rotation Matrix
**Chapters**: 5, 7

## R

### Real-Time
A system that meets strict timing deadlines. Robot control often requires real-time guarantees (e.g., 100 Hz control loop).

**Hard real-time**: Missing deadline = failure (safety-critical)
**Soft real-time**: Missing deadline = degraded performance

**See also**: Frequency, Latency, ROS 2 real-time kernel
**Chapters**: 2, 3, 10, 11

### Representation Learning
Training neural networks to extract useful features from raw data (images, sensor readings). Powers perception systems.

**See also**: Deep Learning, CNN, Feature Extraction
**Chapters**: 6, 8

### Robot Operating System 2 (ROS 2)
A middleware framework for distributed robotics software. Enables modular, scalable robot systems via publish-subscribe communication.

**Key Features**: Topics, services, actions, parameters, launch system, bag recording
**Language Support**: C++, Python (rclpy)

**See also**: Node, Publisher, Subscriber, Topic, Package
**Chapters**: 2, 3, 5, 10, 11

### Rotation Matrix
A 3×3 matrix representing rotation in 3D space. Orthogonal matrix with determinant = 1.

**Properties**: Invertible (inverse = transpose); preserves lengths and angles
**Limitation**: 9 values for 3 DOF (overconstrained)

**See also**: Quaternion, Euler Angles, Homogeneous Transformation
**Chapters**: 5, 7

## S

### Sampling-Based Motion Planning
Motion planning that samples random configurations and connects them into a path (RRT, PRM). Handles high-dimensional spaces.

**See also**: Motion Planning, Collision Detection, RRT
**Chapters**: 7

### Segmentation
Partitioning an image into meaningful regions (objects, surfaces). More detailed than **object detection**.

**Types**: Semantic (per-pixel class) vs. Instance (per-pixel instance)

**See also**: Object Detection, Computer Vision, CNN
**Chapters**: 6

### Semantic Segmentation
Assigning a class label to every pixel in an image. Enables detailed scene understanding.

**See also**: Segmentation, Object Detection, Computer Vision
**Chapters**: 6

### Sensor
A device that measures physical quantities (position, velocity, force, light, distance). Input to robot perception.

**Common types**: Camera, lidar, IMU, force/torque, joint encoders

**See also**: Perception, Actuator, Feedback
**Chapters**: 1, 2, 3, 6

### Service
A ROS 2 request-response communication pattern (synchronous). Unlike **topics** (async), services wait for replies.

**Use case**: On-demand computations, mode changes

**See also**: Topic, Publisher, Subscriber, Node
**Chapters**: 2, 10, 11

### Sim-to-Real Transfer
Applying policies trained in simulation to real robots. Requires bridging reality gap (dynamics mismatch, sensor noise, etc.).

**See also**: Simulation, Domain Randomization, Reinforcement Learning
**Chapters**: 5, 10, 11

### Simulation
Creating a virtual environment that mimics real-world physics. Enables safe, repeatable robot development.

**Tools**: Gazebo, Isaac Sim, PyBullet, Webots

**See also**: Digital Twin, Gazebo, Isaac Sim, Physics Engine
**Chapters**: 3, 4, 5, 10, 11

### SLAM (Simultaneous Localization and Mapping)
Jointly solving **localization** and **mapping** as a robot explores an unknown environment.

**Algorithms**: FastSLAM, ORB-SLAM, LOAM
**Tools**: Google Cartographer (ROS 2)

**See also**: Localization, Mapping, Lidar
**Chapters**: 3, 6, 10

### State Machine
A discrete system with finite states and transitions between them. Often used for robot behavior control.

**Alternative**: **Behavior trees** offer more modularity

**See also**: Behavior Tree, Autonomous, Planning
**Chapters**: 8, 11

### Subscriber
A ROS 2 node or process that receives data from a **topic**. One-to-many communication; publisher sends to topic.

**See also**: Publisher, Topic, Message, Node
**Chapters**: 2, 10, 11

### Success Criteria
Measurable, objective conditions that define when a task or project is complete.

**Example**: "All 13 chapters written, code tested on Ubuntu 22.04, Flesch score 8-10, plagiarism < 5%"

**See also**: Acceptance Criteria, Learning Objective
**Chapters**: All

## T

### Topic
A named channel for **publish-subscribe** communication in ROS 2. Many nodes can publish or subscribe to the same topic.

**Example**: `/cmd_vel` (velocity commands), `/camera/image` (camera images)
**Message type**: Each topic carries a specific message type

**See also**: Publisher, Subscriber, Message, Node
**Chapters**: 2, 10, 11

### Transformer
A neural network architecture using self-attention mechanisms. Powers large language models and modern vision models.

**Advantages**: Parallelizable, captures long-range dependencies
**Used in**: Vision-Language models (CLIP), LLMs (GPT, Claude)

**See also**: Deep Learning, Large Language Model, Self-Attention
**Chapters**: 6, 8

### Translation
A shift in position without rotation. Represented as a 3D vector (Δx, Δy, Δz).

**See also**: Rotation Matrix, Homogeneous Transformation, Pose
**Chapters**: 5, 7

## U

### URDF (Unified Robot Description Format)
An XML format describing robot structure (links, joints, collision geometry, inertia). Interpreted by Gazebo, RViz, and other tools.

**Example**:
```xml
<robot name="my_robot">
  <link name="base_link">...</link>
  <link name="end_effector">...</link>
  <joint name="joint_1" type="revolute">...</joint>
</robot>
```

**See also**: Link, Joint, Gazebo, RViz
**Chapters**: 2, 3, 5

### Unity
A cross-platform game engine and simulation platform. Used in this book for creating **digital twins** and visualization.

**Robotics integration**: ROS 2 connector, NVIDIA Omniverse bridge
**Advantages**: High-quality graphics, cross-platform deployment

**See also**: Digital Twin, Gazebo, Visualization
**Chapters**: 4, 10

## V

### Velocity Control
Commanding robot movement by specifying desired velocity (linear and angular). Common in mobile robots.

**Message type**: `geometry_msgs/Twist` (linear.x, angular.z for 2D; full 6D for 3D)

**See also**: Control System, Motion Planning, Actuator
**Chapters**: 2, 3, 7, 10, 11

### Vision-Language-Action (VLA) System
An AI system combining computer vision (perception), language models (reasoning), and robot control (action).

**Pipeline**: Camera input → Vision encoder → Language model → Action decoder → Motor commands
**Example**: Voice command → LLM planning → Robot execution

**See also**: Large Language Model, Computer Vision, Control System, Embodied AI
**Chapters**: 8, 9, 10, 11

### Visualization
Graphically displaying robot state, simulation, and sensor data. Aids debugging and understanding.

**Tools**: RViz (ROS 2), Gazebo GUI, Unity
**Common visualizations**: Robot pose, trajectory, sensor data, collision geometry

**See also**: RViz, Gazebo, Digital Twin
**Chapters**: 3, 4, 5, 10

### Voice Control
Controlling robots through spoken commands. Combines speech recognition, NLP, and robot control.

**See also**: Natural Language Processing, Vision-Language-Action, Large Language Model
**Chapters**: 8, 9, 10

## W

### Waypoint
A target location or pose for a robot to reach. Motion planning computes paths connecting waypoints.

**See also**: Motion Planning, Trajectory, Path
**Chapters**: 3, 7, 10

### Workspace
The reachable volume of space for a robot manipulator. Defined by joint limits and link lengths.

**See also**: Kinematics, Joint, Link, End-Effector
**Chapters**: 5, 7

## X

*(No terms currently)*

## Y

### YOLO (You Only Look Once)
A real-time object detection algorithm. Predicts object classes and bounding boxes directly from images.

**Speed**: Suitable for real-time robotic applications
**Accuracy**: Good balance between speed and accuracy

**See also**: Object Detection, Computer Vision, CNN
**Chapters**: 6, 8

## Z

### Zero-Shot Learning
A machine learning approach where a model generalizes to unseen classes without training examples.

**Use in VLA**: Language models can reason about novel tasks described in natural language

**See also**: Large Language Model, Transfer Learning
**Chapters**: 8, 9

---

## Cross-Chapter Term Reference

| Term | Chapters | Module |
|------|----------|--------|
| ROS 2 | 2, 10, 11 | Foundations, Capstone |
| Gazebo | 3, 5, 10, 11 | Foundations, Capstone |
| Isaac Sim | 5, 10, 11 | AI-Native Robotics, Capstone |
| Motion Planning | 5, 7, 10, 11 | AI-Native Robotics, Capstone |
| Computer Vision | 6, 8, 9 | AI-Native Robotics, VLA |
| Large Language Model | 8, 9, 10 | VLA, Capstone |
| Vision-Language-Action | 8, 9, 10, 11 | VLA, Capstone |

---

**Last Updated**: December 2025
**Coverage**: 55+ terms across all 5 modules and 13 chapters
**Format**: Alphabetical with cross-references, equations, and chapter citations
