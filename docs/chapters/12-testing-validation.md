---
sidebar_position: 12
title: Chapter 12 - Testing & Validation
description: Integration testing, performance profiling, and debugging the capstone system
---

# Chapter 12: Testing & Validation

## Introduction

A complex system like the Voice-Driven Mobile Manipulator requires comprehensive testing to ensure reliability. This chapter covers integration testing, performance profiling, and debugging strategies.

**Prerequisites**: Chapters 1-11 | **Read time**: 12-15 minutes | **Hands-on time**: 25-30 minutes

---

## Learning Objectives

- ✅ Design integration tests for multi-node systems
- ✅ Profile ROS 2 system performance
- ✅ Debug communication issues between nodes
- ✅ Validate system meets success criteria
- ✅ Identify and fix common bottlenecks

---

## Core Concepts

### Testing Strategy

```
Unit Tests (individual nodes)
    ↓
Integration Tests (node interactions)
    ↓
System Tests (full workflow)
    ↓
Performance Tests (latency, throughput)
    ↓
Deployment Tests (real hardware)
```

### Key Metrics

- **Latency**: Time from input to output (target: <100 ms for voice)
- **Throughput**: Commands processed per second (target: 10 Hz minimum)
- **Reliability**: System uptime without crashes (target: 99%+)
- **Accuracy**: Success rate of tasks (target: 90%+)

---

## Practical Walkthrough

### Integration Testing with pytest

```python
# tests/test_integration.py
import pytest
import rclpy
from geometry_msgs.msg import PoseStamped
from std_msgs.msg import String

@pytest.fixture
def ros_context():
    """Setup and teardown ROS 2 for tests"""
    rclpy.init()
    yield
    rclpy.shutdown()

def test_voice_to_motion_pipeline(ros_context):
    """Test end-to-end voice control"""
    node = rclpy.create_node('test_node')

    # Subscribe to final robot state
    final_state = None
    def state_callback(msg):
        nonlocal final_state
        final_state = msg

    state_sub = node.create_subscription(
        JointState, '/joint_states', state_callback, 10
    )

    # Send voice command
    goal_pub = node.create_publisher(String, '/task_goal', 10)
    goal = String()
    goal.data = "Pick up the red cube"
    goal_pub.publish(goal)

    # Wait for execution
    start = node.get_clock().now()
    while final_state is None and \
          (node.get_clock().now() - start).nanoseconds < 10e9:  # 10 second timeout
        rclpy.spin_once(node, timeout_sec=0.1)

    assert final_state is not None, "System did not complete task"
    assert len(final_state.position) > 0, "No robot state received"
```

### Performance Profiling

```python
# scripts/profile_system.py
import rclpy
import time
from std_msgs.msg import String
import statistics

def profile_latency():
    """Measure latency from voice input to motion execution"""
    rclpy.init()
    node = rclpy.create_node('profiler')

    latencies = []
    execution_times = []

    def motion_callback(msg):
        """Time motion execution"""
        current = time.time()
        execution_times.append(current)

    # Subscribe to motion
    motion_sub = node.create_subscription(
        JointState, '/joint_states', motion_callback, 10
    )

    # Send voice command and measure
    goal_pub = node.create_publisher(String, '/task_goal', 10)

    for i in range(10):
        execution_times.clear()

        goal = String()
        goal.data = "Move forward"
        start = time.time()
        goal_pub.publish(goal)

        # Wait for response
        while len(execution_times) == 0 and time.time() - start < 5:
            rclpy.spin_once(node, timeout_sec=0.01)

        if execution_times:
            latency = (execution_times[0] - start) * 1000  # ms
            latencies.append(latency)
            print(f"Trial {i+1}: {latency:.1f} ms")

    rclpy.shutdown()

    # Statistics
    print(f"\nLatency Statistics:")
    print(f"  Mean: {statistics.mean(latencies):.1f} ms")
    print(f"  Median: {statistics.median(latencies):.1f} ms")
    print(f"  Std Dev: {statistics.stdev(latencies):.1f} ms")
    print(f"  Min: {min(latencies):.1f} ms")
    print(f"  Max: {max(latencies):.1f} ms")

if __name__ == '__main__':
    profile_latency()
```

### Debugging Node Communication

```python
# scripts/debug_topics.py
import rclpy
from ros2cli.command import main as ros2_main

def debug_system():
    """Visualize node graph and message flow"""
    # List all active nodes
    print("=== Active Nodes ===")
    ros2_main(args=['node', 'list'])

    # List all topics
    print("\n=== Active Topics ===")
    ros2_main(args=['topic', 'list'])

    # Show topic info
    print("\n=== Topic Info ===")
    ros2_main(args=['topic', 'info', '/joint_states'])

    # Monitor single topic
    print("\n=== Monitoring /joint_states ===")
    ros2_main(args=['topic', 'echo', '/joint_states', '--count', '5'])

    # Check node graph
    print("\n=== Node Graph ===")
    ros2_main(args=['graph', 'dot'])
```

### Validation Checklist

```python
# tests/test_validation.py
def test_all_nodes_running():
    """Verify all required nodes are active"""
    import subprocess

    result = subprocess.run(['ros2', 'node', 'list'], capture_output=True, text=True)
    nodes = result.stdout.strip().split('\n')

    required_nodes = [
        'voice_control_node',
        'task_planner_node',
        'motion_planning_node',
        'motion_control_node',
        'perception_node'
    ]

    for node in required_nodes:
        assert node in nodes, f"{node} not running"

def test_all_topics_publishing():
    """Verify all expected topics have data"""
    rclpy.init()
    node = rclpy.create_node('validator')

    topics = {
        '/task_goal': String,
        '/planned_trajectory': JointTrajectory,
        '/detected_objects': ObjectList,
        '/joint_states': JointState,
    }

    topic_received = {topic: False for topic in topics}

    # Create subscribers
    for topic, msg_type in topics.items():
        def make_callback(t):
            def callback(msg):
                topic_received[t] = True
            return callback
        node.create_subscription(msg_type, topic, make_callback(topic), 10)

    # Spin briefly
    start = node.get_clock().now()
    while (node.get_clock().now() - start).nanoseconds < 5e9:
        rclpy.spin_once(node, timeout_sec=0.1)

    # Verify all received
    for topic, received in topic_received.items():
        assert received, f"{topic} never published"

    rclpy.shutdown()
```

---

## Diagrams & Visuals

### Testing Pyramid

```
        Integration Tests
    (multi-node interactions)
       ┌─────────────────┐
       │   System Tests  │
       ├──────────────── │
       │ (full workflow) │
       │                 │
       │  Performance    │
       │  Profiling      │
       │                 │
       └─────────────────┘
    Unit Tests (nodes)
```

### Latency Breakdown

```
Voice Input
    ↓ (5 ms: audio capture)
Whisper ASR
    ↓ (200 ms: speech-to-text)
Intent Recognition
    ↓ (150 ms: LLM inference)
Task Planning
    ↓ (300 ms: decomposition & MoveIt planning)
Motion Execution
    ↓ (500 ms: physical motion)
Goal Achieved

Total latency: ~1155 ms (1.2 seconds)
Target: < 2 seconds for acceptable user experience
```

---

## Common Pitfalls

### ❌ Pitfall 1: Network Congestion

**Mistake**: Too many publishers on same topic.

**Why**: Network bandwidth exhausted; messages dropped.

**Solution**: Reduce publish frequency; use message filtering.

### ❌ Pitfall 2: Deadlocks

**Mistake**: Node A waits for B; B waits for A.

**Why**: Circular dependencies.

**Solution**: Use timeouts; design acyclic communication.

### ❌ Pitfall 3: Unbounded Memory Growth

**Mistake**: System memory increases over time.

**Why**: Message queue overflow; no cleanup.

**Solution**: Monitor memory; set reasonable queue sizes; clean resources.

---

## Summary & Next Steps

### What You Learned

✅ **Integration testing** validates multi-node interactions
✅ **Performance profiling** identifies bottlenecks
✅ **Debugging tools** (`ros2 topic`, `ros2 node`) help troubleshoot
✅ **Validation checklist** ensures system meets specs

### Key Takeaway

> Comprehensive testing catches issues early and builds confidence for deployment.

### What's Next

**Chapter 13** (Deployment & Next Steps) will teach you:
- Deploying on real hardware
- Containerization with Docker
- Production best practices

---

**Ready for deployment? Move to [Chapter 13: Deployment & Next Steps](./13-deployment-next-steps.md)** 🚀
