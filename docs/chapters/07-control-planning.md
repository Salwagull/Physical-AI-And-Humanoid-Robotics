---
sidebar_position: 7
title: Chapter 7 - Control & Planning
description: Motion planning, trajectory generation, and robot control systems
---

# Chapter 7: Control & Planning

## Introduction

**Motion planning** is how robots decide how to move from one configuration to another while avoiding obstacles. **Control systems** ensure the robot follows the planned trajectory accurately.

**Prerequisites**: Chapters 1-6 | **Read time**: 12-15 minutes | **Hands-on time**: 20-25 minutes

---

## Learning Objectives

- ✅ Understand inverse kinematics (IK)
- ✅ Implement sampling-based motion planning (RRT)
- ✅ Use MoveIt for production-grade planning
- ✅ Design and tune PID controllers
- ✅ Execute trajectories on real and simulated robots

---

## Core Concepts

### Forward vs. Inverse Kinematics

**Forward Kinematics**: Joint angles → End-effector pose
```
θ1, θ2, θ3 → [X, Y, Z, roll, pitch, yaw]
```

**Inverse Kinematics**: End-effector pose → Joint angles
```
[X, Y, Z, roll, pitch, yaw] → θ1, θ2, θ3
(multiple solutions often exist; IK is harder than FK)
```

### Motion Planning

Robots must find collision-free paths:
```
Start → Plan path avoiding obstacles → Goal
```

**RRT (Rapidly-exploring Random Tree)**: Sample random configurations and connect them.
**MoveIt**: Production framework that wraps multiple planners.

### PID Control

Feedback control law:
```
u(t) = Kp*e(t) + Ki*∫e(τ)dτ + Kd*de/dt

Kp = Proportional gain (respond to error)
Ki = Integral gain (correct steady-state error)
Kd = Derivative gain (damping/stability)
```

---

## Practical Walkthrough

### Inverse Kinematics with IKPy

```python
import ikpy.chain
import numpy as np

# Load URDF and build chain
chain = ikpy.chain.Chain.from_urdf_file(
    "/path/to/robot.urdf",
    active_links_mask=[True, True, True, True, True, True]
)

# Target position and orientation
target_position = np.array([0.3, 0.2, 0.5])
target_rotation = np.identity(3)  # Identity rotation

# Solve IK
joint_angles = chain.inverse_kinematics(
    target_position=target_position,
    target_orientation=target_rotation
)

print(f"Joint angles: {joint_angles}")
```

### Motion Planning with MoveIt

```python
import rclpy
from moveit_msgs.action import MoveGroup
from rclpy.action import ActionClient

def plan_and_move(target_pose):
    rclpy.init()
    node = rclpy.create_node('motion_planner')

    # Create action client for MoveIt
    client = ActionClient(node, MoveGroup, '/move_action_capabilities_server/move_group')
    client.wait_for_server()

    # Set target pose
    goal = MoveGroup.Goal()
    goal.request.group_name = "manipulator"
    goal.request.goal_constraints.append(
        create_pose_constraint(target_pose)
    )

    # Plan and execute
    future = client.send_goal_async(goal)
    rclpy.spin_until_future_complete(node, future)

    rclpy.shutdown()

def create_pose_constraint(pose):
    # Create constraint message from pose
    pass
```

### PID Controller Tuning

```python
import numpy as np

class PIDController:
    def __init__(self, Kp, Ki, Kd):
        self.Kp = Kp
        self.Ki = Ki
        self.Kd = Kd
        self.integral = 0.0
        self.prev_error = 0.0

    def compute(self, error, dt):
        # Proportional term
        p_term = self.Kp * error

        # Integral term (with anti-windup)
        self.integral += error * dt
        self.integral = np.clip(self.integral, -1.0, 1.0)
        i_term = self.Ki * self.integral

        # Derivative term
        d_term = self.Kd * (error - self.prev_error) / dt
        self.prev_error = error

        # Control output
        return p_term + i_term + d_term

# Tune gains empirically
controller = PIDController(Kp=10.0, Ki=0.5, Kd=1.0)

# Simulate feedback loop
for t in range(1000):
    current_pos = measure_position()
    error = target_pos - current_pos
    command = controller.compute(error, dt=0.01)
    send_to_motor(command)
```

---

## Diagrams & Visuals

### RRT Planning Algorithm

```
Start → Random sample → Nearest neighbor → Steer → Collision check
  ↑                                                    ↓
  └────────────── If valid, add to tree ─────────────┘
                      (repeat until goal reached)
```

### PID Control Loop

```
Target
  ↓
  ├─ e(t) ──→ [PID] ──→ Command ──→ System ──→ Actual
  │              ↑                                ↓
  └──────────── Feedback ────────────────────────┘
```

---

## Code Examples

### RRT Motion Planning

```python
import numpy as np
from scipy.spatial.distance import euclidean

class RRTPlanner:
    def __init__(self, start, goal, obstacles, max_iters=1000):
        self.start = start
        self.goal = goal
        self.obstacles = obstacles
        self.tree = [start]
        self.max_iters = max_iters

    def plan(self):
        for _ in range(self.max_iters):
            # Sample random configuration
            rand_config = np.random.uniform(-np.pi, np.pi, len(self.start))

            # Find nearest node in tree
            nearest = min(self.tree, key=lambda x: euclidean(x, rand_config))

            # Steer towards random config
            new_config = self._steer(nearest, rand_config)

            # Check collision
            if not self._collides(new_config):
                self.tree.append(new_config)

                # Check if goal reached
                if euclidean(new_config, self.goal) < 0.1:
                    return self.tree

        return None

    def _steer(self, start, target, step_size=0.1):
        direction = np.array(target) - np.array(start)
        distance = np.linalg.norm(direction)
        if distance == 0:
            return start
        return start + direction / distance * step_size

    def _collides(self, config):
        # Collision checking (simplified)
        return False
```

---

## Common Pitfalls

### ❌ Pitfall 1: IK Singularity

**Mistake**: IK fails in certain configurations.

**Why**: Arm loses degree of freedom near singularities.

**Solution**: Use redundancy resolution; check condition number.

### ❌ Pitfall 2: Poor PID Tuning

**Mistake**: Controller oscillates or overshoots.

**Why**: Gains not tuned for robot dynamics.

**Solution**: Use Ziegler-Nichols method or empirical tuning.

### ❌ Pitfall 3: Collision Checking Too Slow

**Mistake**: Path planning takes minutes.

**Why**: Naive collision checking is O(n²).

**Solution**: Use spatial indices (KD-tree, octree).

---

## Summary & Next Steps

### What You Learned

✅ **Inverse kinematics** maps desired poses to joint angles
✅ **Motion planning** computes collision-free paths
✅ **PID control** tracks planned trajectories
✅ **MoveIt** provides production-grade planning framework

### Key Takeaway

> Planning and control are complementary: planning decides what to do; control ensures it happens accurately.

### What's Next

**Chapter 8** (Vision-Language-Action Systems) will teach you:
- Large language models for robot task planning
- Natural language understanding
- End-to-end VLA systems

---

**Ready for VLA systems? Move to [Chapter 8: Vision-Language-Action Systems](./08-vla-systems-intro.md)** 🗣️
