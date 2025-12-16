# Chapter 1: Physical AI Foundations - Content Plan

**Version**: 1.0.0
**Status**: Draft for Approval
**Created**: 2025-12-13
**Target Word Count**: 4,500-5,500 words (expanded from current ~2,800 words)

---

## 1. Learning Objectives (Refined)

By the end of this chapter, readers will be able to:

| # | Objective | Bloom's Level | Assessment |
|---|-----------|---------------|------------|
| 1 | **Define** embodied AI and explain why physical embodiment enables richer learning than pure software AI | Remember/Understand | Quiz question |
| 2 | **Explain** the sensor-motor loop and identify its five stages (sense, reason, plan, control, act) | Understand | Diagram labeling |
| 3 | **Distinguish** between kinematics (geometry of motion) and dynamics (forces/torques) with real examples | Understand/Apply | Comparison table exercise |
| 4 | **Describe** closed-loop vs open-loop control and why feedback is essential for real-world robotics | Understand | Scenario analysis |
| 5 | **Recognize** the role of simulation and domain randomization in bridging sim-to-real gaps | Remember/Understand | Conceptual quiz |
| 6 | **Preview** the technology stack (ROS 2, Gazebo, Isaac Sim, VLA) and how each chapter builds on foundations | Remember | Roadmap review |

---

## 2. Section Structure with Word Counts

### Section 2.1: Introduction (400-500 words)
**Purpose**: Hook the reader; establish why Physical AI matters now

**Content**:
- Opening hook: contrast between ChatGPT (digital AI) and a robot picking up a cup (physical AI)
- The 2024-2025 "Physical AI revolution" context (NVIDIA Cosmos, Tesla Optimus, Boston Dynamics)
- Why embodied systems are considered the path to AGI
- Chapter roadmap preview
- Reading/hands-on time estimates

**Key Citations**:
- [World Economic Forum Physical AI White Paper 2025](https://reports.weforum.org/docs/WEF_Physical_AI_Powering_the_New_Age_of_Industrial_Operations_2025.pdf)
- [Microsoft Research Embodied AI 2025](https://www.microsoft.com/en-us/research/articles/redefining-robot-intelligence-2024-microsoft-research-asia-startrack-scholars-program-accelerates-embodied-ai-and-large-robotics-models/)

---

### Section 2.2: Core Concept 1 - What is Physical AI? (600-700 words)
**Purpose**: Define the field and establish foundational vocabulary

**Subsections**:
1. **Definition** (150 words): Physical AI = AI + real-world interaction through sensors/actuators
2. **The Embodiment Hypothesis** (200 words): Cognition emerges from body-environment interaction (cite Turing 1950, modern embodied cognition research)
3. **Physical AI vs Digital AI** (150 words): Comparison table with examples
4. **The Five Capabilities** (200 words): Perceive → Reason → Plan → Control → Adapt

**Key Citations**:
- [Frontiers in Robotics: Three-Layer Framework for Embodied Intelligence 2025](https://www.frontiersin.org/journals/robotics-and-ai/articles/10.3389/frobt.2025.1668910/full)
- [Springer: Embodied Intelligence for Robot Manipulation 2025](https://link.springer.com/article/10.1007/s44336-025-00020-1)

**Beginner Analogy**: "Learning to ride a bicycle by reading a book vs. actually riding one"

---

### Section 2.3: Core Concept 2 - The Sensor-Motor Loop (800-900 words)
**Purpose**: Teach the fundamental control cycle every robot follows

**Subsections**:
1. **The Loop Diagram** (150 words): SENSE → REASON → PLAN → CONTROL → ACT → (feedback)
2. **Stage-by-Stage Breakdown** (400 words):
   - SENSE: Cameras, LiDAR, IMU, encoders, force-torque sensors
   - REASON: State estimation, object detection, scene understanding
   - PLAN: Task planning, motion planning, trajectory optimization
   - CONTROL: PID, trajectory tracking, compliance control
   - ACT: Motor commands, gripper actuation
3. **Loop Frequency** (150 words): Why 10-100 Hz matters; real-time constraints
4. **Feedback's Critical Role** (100 words): Without feedback, robots are blind

**Key Citations**:
- [ROS 2 Control Documentation 2025](https://control.ros.org/rolling/doc/getting_started/getting_started.html)
- [FIRST Robotics PID Tutorial](https://docs.wpilib.org/en/stable/docs/software/advanced-controls/introduction/introduction-to-pid.html)

**Beginner Analogy**: "Driving a car: eyes (sense), brain (reason/plan), hands/feet (control), car moves (act), check mirrors (feedback)"

---

### Section 2.4: Core Concept 3 - Kinematics vs Dynamics (700-800 words)
**Purpose**: Distinguish geometry of motion from forces/torques

**Subsections**:
1. **Kinematics Defined** (200 words): Geometry only; joint angles → end-effector pose
   - Forward kinematics: "Given joint angles, where is the hand?"
   - Inverse kinematics: "Given target position, what joint angles?"
2. **Dynamics Defined** (200 words): Forces matter; torques → accelerations
   - Forward dynamics: "Given torques, how does robot accelerate?"
   - Inverse dynamics: "Given desired motion, what torques needed?"
3. **Comparison Table** (100 words): Side-by-side with equations (simplified)
4. **Why Both Matter** (150 words): Kinematics for planning, dynamics for execution
5. **Real-World Example** (150 words): Robot arm holding 5 kg object overhead

**Key Citations**:
- [ETH Zurich Robot Dynamics Lecture Notes](https://ethz.ch/content/dam/ethz/special-interest/mavt/robotics-n-intelligent-systems/rsl-dam/documents/RobotDynamics2017/RD_HS2017script.pdf)
- [Theory of Applied Robotics by Jazar](https://nibmehub.com/opac-service/pdf/read/Theory%20of%20Applied%20Robotics%20Kinematics-%20Dynamics-%20and%20Control.pdf)
- [Introduction to Humanoid Robotics (Springer)](https://link.springer.com/book/10.1007/978-3-642-54536-8)

**Beginner Analogy**: "Kinematics = GPS directions; Dynamics = how much gas you need to climb a hill"

---

### Section 2.5: Core Concept 4 - Closed-Loop Control (500-600 words)
**Purpose**: Explain why feedback control is non-negotiable in robotics

**Subsections**:
1. **Open-Loop vs Closed-Loop** (150 words): Command-and-hope vs sense-and-correct
2. **The PID Controller** (200 words): Proportional, Integral, Derivative explained simply
   - P: "How far am I from target?"
   - I: "How long have I been off?"
   - D: "How fast am I approaching?"
3. **Practical Example** (150 words): Robot arm reaching for object
4. **Tuning Intuition** (100 words): Start with P, add D for stability, I for steady-state error

**Key Citations**:
- [Autonomous Robots Lab PID Control](https://www.autonomousrobotslab.com/pid-control.html)
- [Medium: Understanding Robot Motion PID Control](https://medium.com/@jaems33/understanding-robot-motion-pid-control-8931899c31df)
- [Game Manual 0: Control Loops](https://gm0.org/en/latest/docs/software/concepts/control-loops.html)

**Beginner Analogy**: "Thermostat: measure temperature, compare to setpoint, adjust heating"

---

### Section 2.6: Core Concept 5 - The Role of Simulation (600-700 words)
**Purpose**: Establish simulation as essential development tool; introduce sim-to-real

**Subsections**:
1. **Why Simulate?** (150 words): Safety, speed, cost, scalability
2. **Simulator Overview** (200 words):
   - Gazebo: Open-source, ROS 2 native, physics engine
   - Isaac Sim: NVIDIA, GPU-accelerated, AI-native
   - Unity: Digital twins, visualization, hybrid workflows
3. **The Reality Gap** (150 words): Why simulation ≠ reality
4. **Domain Randomization** (200 words): Introducing noise/variation to bridge the gap

**Key Citations**:
- [Sim2Real Domain Randomization Tutorial](https://www.reinforcementlearningpath.com/sim2real/)
- [Lil'Log Domain Randomization](https://lilianweng.github.io/posts/2019-05-05-domain-randomization/)
- [Continual Domain Randomization 2024](https://arxiv.org/abs/2403.12193)

**Beginner Analogy**: "Flight simulators: pilots train virtually before flying real aircraft"

---

### Section 2.7: Practical Walkthrough - Anatomy of a Mobile Manipulator (600-700 words)
**Purpose**: Concrete example tying all concepts together

**Subsections**:
1. **System Components** (200 words):
   - Mobile base: wheels, LiDAR, IMU
   - Robotic arm: links, joints, gripper
   - Compute: NVIDIA Jetson / industrial PC
2. **Sensor Suite** (150 words): Camera, LiDAR, encoders, force-torque
3. **Control Architecture** (150 words): How components coordinate
4. **End-to-End Task** (200 words): "Pick up object from table" step-by-step

**Diagram**: Mobile manipulator architecture (see Diagram Plan below)

---

### Section 2.8: Code Examples (400-500 words prose + code)
**Purpose**: Illustrate concepts with runnable pseudocode

See **Code Example Plan** below for details.

---

### Section 2.9: Diagrams & Visuals (reference section)
See **Diagram Plan** below.

---

### Section 2.10: Common Pitfalls (400-500 words)
**Purpose**: Prevent common beginner mistakes

**Pitfalls**:
1. **Ignoring Feedback** (100 words): Open-loop commands fail in real world
2. **Confusing Kinematics/Dynamics** (100 words): Planning without considering forces
3. **Trusting Simulation Blindly** (100 words): No domain randomization = failed deployment
4. **Ignoring Real-Time Constraints** (100 words): Control loop too slow = instability
5. **Over-engineering First Attempt** (100 words): Start simple, iterate

---

### Section 2.11: Summary & Next Steps (300-400 words)
**Purpose**: Recap key takeaways; connect to Chapter 2

**Content**:
- 5 bullet point summary (one per core concept)
- Key quote/takeaway
- What Chapter 2 (ROS 2 Essentials) will cover
- Module 1 roadmap preview

---

### Section 2.12: Exercises (300-400 words)
**Purpose**: Reinforce learning through active engagement

**Exercises**:
1. **Feedback Loop Analysis**: Analyze a household robot (Roomba, robot vacuum)
2. **Kinematics vs Dynamics Thought Experiment**: Robot arm holding weight
3. **Simulation Exploration**: Gazebo preparation exercise
4. **Concept Mapping**: Draw your own sensor-motor loop diagram

---

### Section 2.13: Glossary Quick Reference (200 words)
**Purpose**: Quick-lookup table for chapter terms

| Term | Definition | Chapters Used |
|------|------------|---------------|
| Embodied AI | AI interacting with physical world | 1, 8, 9 |
| Sensor-Motor Loop | Fundamental robot control cycle | 1, 2, 3, 7 |
| Kinematics | Geometry of motion | 1, 5, 7 |
| Dynamics | Forces and motion | 1, 7 |
| PID Control | Proportional-Integral-Derivative controller | 1, 3, 7 |
| Domain Randomization | Sim-to-real transfer technique | 1, 5 |

---

## 3. Diagram Plan

### Diagram 3.1: The Sensor-Motor Loop
**Type**: Flowchart/cycle diagram
**Format**: SVG (scalable for web)
**Colors**: Use theme palette (teal #0d9488, cyan #06b6d4, green #10b981)
**Elements**:
- 5 boxes: SENSE, REASON, PLAN, CONTROL, ACT
- Arrows showing flow
- Feedback arrow from ACT back to SENSE
- Annotations: frequency (10-100 Hz), example sensors/actuators

**Placement**: Section 2.3 (Core Concept 2)

---

### Diagram 3.2: Kinematics vs Dynamics Comparison
**Type**: Side-by-side comparison diagram
**Format**: SVG
**Elements**:
- Left side: Robot arm with joint angles labeled (θ₁, θ₂, etc.)
- Right side: Same arm with force vectors and torque arrows
- Caption: "Kinematics: Where? | Dynamics: How hard?"

**Placement**: Section 2.4 (Core Concept 3)

---

### Diagram 3.3: Closed-Loop Control Block Diagram
**Type**: Control systems block diagram
**Format**: SVG
**Elements**:
- Reference input (r)
- Summing junction (error = r - y)
- PID Controller block
- Plant/Robot block
- Output (y)
- Feedback path

**Placement**: Section 2.5 (Core Concept 4)

---

### Diagram 3.4: Mobile Manipulator Architecture
**Type**: System architecture diagram
**Format**: SVG
**Elements**:
- Mobile base with labeled components (wheels, LiDAR, IMU)
- Robotic arm with labeled joints/links
- Compute unit
- Sensor connections
- Data flow arrows

**Placement**: Section 2.7 (Practical Walkthrough)

---

### Diagram 3.5: Sim-to-Real Pipeline
**Type**: Pipeline/flow diagram
**Format**: SVG
**Elements**:
- Simulation environment (Gazebo/Isaac Sim)
- Domain randomization box
- Trained policy
- Real robot
- Reality gap bridge illustration

**Placement**: Section 2.6 (Core Concept 5)

---

## 4. Code Example Plan

### Code 4.1: Sensor-Motor Loop Pseudocode (Python-style)
**Purpose**: Illustrate the fundamental robot control loop
**Lines**: ~25-30
**File**: `docs/code-examples/ch01/sensor_motor_loop.py`

```python
# sensor_motor_loop.py
# Chapter 1: Physical AI Foundations
# Demonstrates the fundamental sensor-motor control loop
# This is conceptual pseudocode - actual ROS 2 implementation in Chapter 2

import time

class Robot:
    """Simplified robot interface for demonstration."""

    def read_sensors(self):
        """SENSE: Read all sensor data."""
        return {
            'camera': self.camera.read_frame(),
            'lidar': self.lidar.get_scan(),
            'encoders': self.get_joint_positions(),
            'imu': self.imu.get_orientation()
        }

    def send_command(self, velocities):
        """ACT: Send velocity commands to motors."""
        for joint, velocity in velocities.items():
            self.motors[joint].set_velocity(velocity)

def run_control_loop(robot, controller, target):
    """Main sensor-motor loop running at 100 Hz."""

    LOOP_RATE_HZ = 100
    LOOP_PERIOD = 1.0 / LOOP_RATE_HZ

    while robot.is_running():
        loop_start = time.time()

        # 1. SENSE: Read current state
        sensor_data = robot.read_sensors()

        # 2. REASON: Estimate robot state from sensors
        current_state = estimate_state(sensor_data)

        # 3. PLAN: Compute trajectory to target
        trajectory = plan_trajectory(current_state, target)

        # 4. CONTROL: Compute motor commands
        command = controller.compute(trajectory, current_state)

        # 5. ACT: Send to motors
        robot.send_command(command)

        # Maintain loop frequency
        elapsed = time.time() - loop_start
        if elapsed < LOOP_PERIOD:
            time.sleep(LOOP_PERIOD - elapsed)

# Key insight: This loop runs continuously at high frequency.
# Without feedback (step 1), the robot cannot correct errors.
```

---

### Code 4.2: PID Controller Implementation (Python)
**Purpose**: Demonstrate closed-loop feedback control
**Lines**: ~35-40
**File**: `docs/code-examples/ch01/pid_controller.py`

```python
# pid_controller.py
# Chapter 1: Physical AI Foundations
# Simple PID controller demonstrating feedback control
# System: Python 3.10+ (no external dependencies)

class PIDController:
    """
    Proportional-Integral-Derivative controller.

    The three gains work together:
    - Kp (Proportional): Responds to current error
    - Ki (Integral): Accumulates past errors to eliminate steady-state offset
    - Kd (Derivative): Anticipates future errors based on rate of change
    """

    def __init__(self, kp: float, ki: float, kd: float):
        self.kp = kp  # Proportional gain
        self.ki = ki  # Integral gain
        self.kd = kd  # Derivative gain

        self.previous_error = 0.0
        self.integral = 0.0

    def compute(self, setpoint: float, measurement: float, dt: float) -> float:
        """
        Compute control output given setpoint and current measurement.

        Args:
            setpoint: Desired value (e.g., target position)
            measurement: Current value (e.g., actual position from encoder)
            dt: Time step in seconds

        Returns:
            Control output (e.g., motor velocity command)
        """
        # Calculate error: how far are we from the target?
        error = setpoint - measurement

        # Proportional term: respond to current error
        p_term = self.kp * error

        # Integral term: accumulate error over time
        self.integral += error * dt
        i_term = self.ki * self.integral

        # Derivative term: respond to rate of change
        derivative = (error - self.previous_error) / dt
        d_term = self.kd * derivative

        # Store error for next iteration
        self.previous_error = error

        # Sum all terms for final output
        output = p_term + i_term + d_term

        return output


# Example usage: Position control
if __name__ == "__main__":
    # Create controller with tuned gains
    controller = PIDController(kp=1.0, ki=0.1, kd=0.05)

    # Simulate: target position = 10.0, starting at 0.0
    position = 0.0
    target = 10.0
    dt = 0.01  # 100 Hz

    for step in range(500):  # 5 seconds of simulation
        # Compute control command
        velocity_cmd = controller.compute(target, position, dt)

        # Simulate robot response (simplified physics)
        position += velocity_cmd * dt

        if step % 50 == 0:  # Print every 0.5 seconds
            print(f"Step {step}: Position = {position:.2f}, Target = {target}")
```

---

### Code 4.3: Kinematics Example - 2-Link Arm (Python)
**Purpose**: Demonstrate forward kinematics calculation
**Lines**: ~30-35
**File**: `docs/code-examples/ch01/forward_kinematics.py`

```python
# forward_kinematics.py
# Chapter 1: Physical AI Foundations
# Forward kinematics for a simple 2-link planar arm
# System: Python 3.10+, requires numpy

import numpy as np

def forward_kinematics_2link(theta1: float, theta2: float,
                              L1: float = 1.0, L2: float = 1.0) -> tuple:
    """
    Compute end-effector position for a 2-link planar arm.

    This is KINEMATICS: geometry only, no forces involved.
    Given joint angles, where is the end-effector?

    Args:
        theta1: Angle of first joint (radians)
        theta2: Angle of second joint (radians)
        L1: Length of first link (meters)
        L2: Length of second link (meters)

    Returns:
        (x, y) position of end-effector in base frame
    """
    # Position of elbow (end of link 1)
    x1 = L1 * np.cos(theta1)
    y1 = L1 * np.sin(theta1)

    # Position of end-effector (end of link 2)
    # Note: theta2 is relative to link 1
    x2 = x1 + L2 * np.cos(theta1 + theta2)
    y2 = y1 + L2 * np.sin(theta1 + theta2)

    return (x2, y2)


if __name__ == "__main__":
    # Example: arm pointing straight out
    theta1 = 0  # First joint at 0 degrees
    theta2 = 0  # Second joint at 0 degrees
    x, y = forward_kinematics_2link(theta1, theta2)
    print(f"Joint angles: θ1={np.degrees(theta1):.1f}°, θ2={np.degrees(theta2):.1f}°")
    print(f"End-effector position: ({x:.2f}, {y:.2f})")

    # Example: arm bent 90 degrees at elbow
    theta1 = np.radians(45)   # 45 degrees
    theta2 = np.radians(90)   # 90 degrees at elbow
    x, y = forward_kinematics_2link(theta1, theta2)
    print(f"\nJoint angles: θ1={np.degrees(theta1):.1f}°, θ2={np.degrees(theta2):.1f}°")
    print(f"End-effector position: ({x:.2f}, {y:.2f})")

    # Key insight: This is pure geometry - no forces, no physics.
    # Dynamics would answer: "How much torque at each joint to hold this position?"
```

---

### Code 4.4: Robot State Variables (Python Data Structures)
**Purpose**: Show typical data structures in robot systems
**Lines**: ~25
**File**: `docs/code-examples/ch01/robot_state.py`

```python
# robot_state.py
# Chapter 1: Physical AI Foundations
# Common data structures representing robot state
# System: Python 3.10+ (no external dependencies)

from dataclasses import dataclass
from typing import List

@dataclass
class Pose:
    """6 Degrees of Freedom pose: position + orientation."""
    x: float        # meters
    y: float        # meters
    z: float        # meters
    roll: float     # radians (rotation around x-axis)
    pitch: float    # radians (rotation around y-axis)
    yaw: float      # radians (rotation around z-axis)

@dataclass
class Velocity:
    """Linear and angular velocity."""
    linear_x: float   # m/s
    linear_y: float   # m/s
    linear_z: float   # m/s
    angular_x: float  # rad/s
    angular_y: float  # rad/s
    angular_z: float  # rad/s

@dataclass
class JointState:
    """State of a single robot joint."""
    position: float   # radians (for revolute) or meters (for prismatic)
    velocity: float   # rad/s or m/s
    effort: float     # torque (N·m) or force (N)

@dataclass
class RobotState:
    """Complete robot state at a single instant."""
    timestamp: float              # seconds since epoch
    base_pose: Pose               # mobile base position/orientation
    base_velocity: Velocity       # mobile base velocities
    joint_states: List[JointState]  # all arm joint states

# These structures map directly to ROS 2 message types in Chapter 2
```

---

## 5. Research Sources

### 5.1 Primary Academic Sources

| Source | Topic | Use In Chapter |
|--------|-------|----------------|
| [Introduction to Humanoid Robotics (Springer)](https://link.springer.com/book/10.1007/978-3-642-54536-8) | Kinematics, dynamics, ZMP | Sections 2.4, 2.7 |
| [Theory of Applied Robotics (Jazar)](https://nibmehub.com/opac-service/pdf/read/Theory%20of%20Applied%20Robotics%20Kinematics-%20Dynamics-%20and%20Control.pdf) | Kinematics/dynamics fundamentals | Section 2.4 |
| [ETH Zurich Robot Dynamics Notes](https://ethz.ch/content/dam/ethz/special-interest/mavt/robotics-n-intelligent-systems/rsl-dam/documents/RobotDynamics2017/RD_HS2017script.pdf) | Dynamics equations | Section 2.4 |
| [Murray, Li, Sastry - Mathematical Introduction to Robotic Manipulation](https://www.cse.lehigh.edu/~trink/Courses/RoboticsII/reading/murray-li-sastry-94-complete.pdf) | Rigorous kinematics/dynamics | Background reference |

### 5.2 Industry & Research Reports (2024-2025)

| Source | Topic | Use In Chapter |
|--------|-------|----------------|
| [World Economic Forum Physical AI White Paper 2025](https://reports.weforum.org/docs/WEF_Physical_AI_Powering_the_New_Age_of_Industrial_Operations_2025.pdf) | Industry context, market data | Introduction |
| [Frontiers: Embodied Intelligence Three-Layer Framework](https://www.frontiersin.org/journals/robotics-and-ai/articles/10.3389/frobt.2025.1668910/full) | Technical architecture | Section 2.2 |
| [Microsoft Research Embodied AI 2025](https://www.microsoft.com/en-us/research/articles/redefining-robot-intelligence-2024-microsoft-research-asia-startrack-scholars-program-accelerates-embodied-ai-and-large-robotics-models/) | Research directions | Introduction |
| [Springer: Embodied Intelligence for Robot Manipulation](https://link.springer.com/article/10.1007/s44336-025-00020-1) | Manipulation foundations | Section 2.2 |

### 5.3 Technical Documentation

| Source | Topic | Use In Chapter |
|--------|-------|----------------|
| [ROS 2 Control Documentation](https://control.ros.org/rolling/doc/getting_started/getting_started.html) | Control architecture | Section 2.3, 2.5 |
| [FIRST Robotics PID Tutorial](https://docs.wpilib.org/en/stable/docs/software/advanced-controls/introduction/introduction-to-pid.html) | Beginner PID | Section 2.5 |
| [Autonomous Robots Lab PID Control](https://www.autonomousrobotslab.com/pid-control.html) | PID theory | Section 2.5 |

### 5.4 Sim-to-Real & Domain Randomization

| Source | Topic | Use In Chapter |
|--------|-------|----------------|
| [Sim2Real Tutorial (RL Path)](https://www.reinforcementlearningpath.com/sim2real/) | Sim-to-real overview | Section 2.6 |
| [Lil'Log Domain Randomization](https://lilianweng.github.io/posts/2019-05-05-domain-randomization/) | DR techniques | Section 2.6 |
| [Continual Domain Randomization (arXiv 2024)](https://arxiv.org/abs/2403.12193) | Recent DR advances | Section 2.6 |

---

## 6. Quality Checklist (Constitution Alignment)

### 6.1 Beginner-First Accessibility (Principle I)
- [ ] Flesch reading grade 8-10 verified
- [ ] Every technical term defined before use
- [ ] Real-world analogies for each core concept
- [ ] Step-by-step progressions, no jumps
- [ ] No assumed knowledge beyond basic Python

### 6.2 Spec-Driven Technical Accuracy (Principle II)
- [ ] All code examples tested on Python 3.10+
- [ ] Kinematics/dynamics equations verified against textbooks
- [ ] Industry context reflects 2024-2025 state
- [ ] All citations are authoritative sources

### 6.3 Consistent Structure & Tone (Principle III)
- [ ] Chapter follows template structure exactly
- [ ] Active voice preferred
- [ ] Conversational but professional tone
- [ ] Jargon introduced with definition

### 6.4 Actionable Examples (Principle IV)
- [ ] All 4 code examples are runnable
- [ ] Inline comments explain "why" not just "what"
- [ ] All 5 diagrams created and properly labeled
- [ ] No "left as exercise" without scaffolding

### 6.5 Modular, Maintainable (Principle V)
- [ ] Chapter is self-contained (dependencies explicit)
- [ ] Metadata in frontmatter correct
- [ ] Cross-references to other chapters working
- [ ] Version-controlled in git

---

## 7. Estimated Effort

| Task | Estimated Hours |
|------|-----------------|
| Research & note-taking | 2-3 hours |
| Section writing (2,000+ new words) | 4-5 hours |
| Code example development & testing | 2-3 hours |
| Diagram creation (5 diagrams) | 3-4 hours |
| Quality review (Flesch, plagiarism) | 1-2 hours |
| Revision based on feedback | 1-2 hours |
| **Total** | **13-19 hours** |

---

## 8. Approval Request

### What This Plan Delivers

1. **Expanded chapter** from ~2,800 words to 4,500-5,500 words with deeper technical content
2. **5 professional diagrams** (SVG format, theme-consistent)
3. **4 runnable code examples** demonstrating core concepts
4. **20+ authoritative citations** from academic and industry sources
5. **Constitution-compliant** structure and quality standards

### Questions for Approval

1. **Scope**: Is the word count (4,500-5,500) appropriate, or should we target longer/shorter?
2. **Code Examples**: Should code examples be pure Python (Chapter 1) or introduce ROS 2 early?
3. **Diagrams**: Should diagrams be created manually (SVG) or use diagramming tools (Mermaid, draw.io)?
4. **Depth**: Is the technical depth appropriate for beginners?
5. **Citations**: Are the research sources sufficient and appropriate?

---

**Status**: Awaiting Approval
**Next Step**: Upon approval, begin writing Section 2.1 (Introduction)
