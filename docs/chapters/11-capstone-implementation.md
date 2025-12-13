---
sidebar_position: 11
title: Chapter 11 - Capstone Implementation
description: Building and integrating the Voice-Driven Mobile Manipulator system
---

# Chapter 11: Capstone Implementation

## Introduction

In this chapter, you'll implement the Voice-Driven Mobile Manipulator from architecture to working system. You'll code each ROS 2 node, test components individually, and integrate them into a cohesive system.

**Prerequisites**: Chapters 1-10 | **Read time**: 12-15 minutes | **Hands-on time**: 40-50 minutes

---

## Learning Objectives

- ✅ Implement voice control node with Whisper integration
- ✅ Build task planner with LLM decomposition
- ✅ Create motion planning node with MoveIt
- ✅ Implement perception node with YOLO
- ✅ Integrate all nodes into a working system

---

## Core Concepts

### Implementation Strategy

1. **Module-first**: Implement each node independently
2. **Test-driven**: Verify each node with unit tests
3. **Integration**: Connect modules and test interactions
4. **Optimization**: Profile and improve performance

### Node Implementation Order

```
1. Perception (easiest; standalone)
2. Motion control (simple feedback loops)
3. Motion planning (uses motion control)
4. Task planner (uses planning)
5. Voice control (ties everything together)
```

---

## Practical Walkthrough

### 1. Perception Node Implementation

```python
# src/perception_node.py
import rclpy
import cv2
from ultralytics import YOLO
from sensor_msgs.msg import Image
from custom_msgs.msg import ObjectList, DetectedObject

class PerceptionNode(rclpy.node.Node):
    def __init__(self):
        super().__init__('perception_node')
        self.model = YOLO('yolov8n.pt')
        self.camera = cv2.VideoCapture(0)

        self.image_sub = self.create_subscription(
            Image, '/camera/image', self.image_callback, 10
        )
        self.objects_pub = self.create_publisher(ObjectList, '/detected_objects', 10)

    def image_callback(self, msg):
        # Convert ROS image to OpenCV
        frame = self.ros_image_to_cv(msg)

        # Run YOLO
        results = self.model(frame)

        # Parse detections
        objects = ObjectList()
        for det in results[0].boxes:
            obj = DetectedObject()
            obj.class_name = self.model.names[int(det.cls[0])]
            obj.confidence = float(det.conf[0])
            x1, y1, x2, y2 = det.xyxy[0]
            obj.bbox = [int(x1), int(y1), int(x2), int(y2)]
            objects.objects.append(obj)

        # Publish
        self.objects_pub.publish(objects)

    def ros_image_to_cv(self, ros_image):
        # Convert ROS Image message to OpenCV format
        pass

def main(args=None):
    rclpy.init(args=args)
    node = PerceptionNode()
    rclpy.spin(node)
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### 2. Motion Control Node

```python
# src/motion_control_node.py
import rclpy
from trajectory_msgs.msg import JointTrajectory, JointTrajectoryPoint
from control_msgs.action import FollowJointTrajectory

class MotionControlNode(rclpy.node.Node):
    def __init__(self):
        super().__init__('motion_control_node')

        # Create action client for trajectory execution
        self.trajectory_client = ActionClient(
            self, FollowJointTrajectory, '/joint_trajectory_controller/follow_joint_trajectory'
        )

        # Subscribe to trajectory goals
        self.traj_sub = self.create_subscription(
            JointTrajectory, '/planned_trajectory', self.trajectory_callback, 10
        )

    def trajectory_callback(self, trajectory):
        """Execute received trajectory"""
        goal = FollowJointTrajectory.Goal()
        goal.trajectory = trajectory

        self.trajectory_client.send_goal_async(goal)
        self.get_logger().info(f"Executing trajectory with {len(trajectory.points)} points")

def main(args=None):
    rclpy.init(args=args)
    node = MotionControlNode()
    rclpy.spin(node)
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### 3. Motion Planning Node (with MoveIt)

```python
# src/motion_planning_node.py
import rclpy
from moveit_msgs.action import MoveGroup
from geometry_msgs.msg import PoseStamped
from rclpy.action import ActionClient

class MotionPlannerNode(rclpy.node.Node):
    def __init__(self):
        super().__init__('motion_planning_node')

        self.move_group_client = ActionClient(
            self, MoveGroup, '/move_group'
        )
        self.move_group_client.wait_for_server()

        # Subscribe to goals
        self.goal_sub = self.create_subscription(
            PoseStamped, '/manipulation_goal', self.goal_callback, 10
        )

        # Publish planned trajectories
        self.traj_pub = self.create_publisher(
            JointTrajectory, '/planned_trajectory', 10
        )

    def goal_callback(self, goal_pose):
        """Plan trajectory to target pose"""
        self.get_logger().info(f"Planning to {goal_pose}")

        # Create MoveIt goal
        movegroup_goal = MoveGroup.Goal()
        movegroup_goal.request.group_name = "manipulator"
        movegroup_goal.request.goal_constraints.append(
            self.create_pose_constraint(goal_pose)
        )

        # Send planning request
        future = self.move_group_client.send_goal_async(movegroup_goal)
        rclpy.spin_until_future_complete(self, future)

        # Execute planned trajectory
        result = future.result()
        if result.planned_trajectory:
            self.traj_pub.publish(result.planned_trajectory.joint_trajectory)

    def create_pose_constraint(self, pose):
        # Create constraint message
        pass
```

### 4. Task Planner Node

```python
# src/task_planner_node.py
import rclpy
import anthropic
import json
from std_msgs.msg import String
from geometry_msgs.msg import PoseStamped

class TaskPlannerNode(rclpy.node.Node):
    def __init__(self):
        super().__init__('task_planner_node')
        self.client = anthropic.Anthropic()

        # Subscribe to goals
        self.goal_sub = self.create_subscription(
            String, '/task_goal', self.goal_callback, 10
        )

        # Publish subtasks
        self.subtask_pub = self.create_publisher(
            PoseStamped, '/manipulation_goal', 10
        )

    def goal_callback(self, msg):
        """Decompose high-level goal into subtasks"""
        goal = msg.data
        self.get_logger().info(f"Planning goal: {goal}")

        # Use LLM to decompose
        prompt = f"""Decompose this robot task into concrete steps:
        Goal: {goal}

        Respond with JSON array:
        [
            {{"action": "move_to", "target_position": [x, y, z]}},
            {{"action": "grasp", "object": "cube"}},
            {{"action": "move_to", "target_position": [x, y, z]}}
        ]"""

        message = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=512,
            messages=[{"role": "user", "content": prompt}]
        )

        plan = json.loads(message.content[0].text)

        # Execute subtasks
        for subtask in plan:
            if subtask["action"] == "move_to":
                pose = PoseStamped()
                pose.pose.position.x = subtask["target_position"][0]
                pose.pose.position.y = subtask["target_position"][1]
                pose.pose.position.z = subtask["target_position"][2]
                self.subtask_pub.publish(pose)
                self.get_logger().info(f"Subtask: {subtask}")
```

### 5. Voice Control Node

```python
# src/voice_control_node.py
import rclpy
import whisper
import sounddevice as sd
import soundfile as sf
from std_msgs.msg import String

class VoiceControlNode(rclpy.node.Node):
    def __init__(self):
        super().__init__('voice_control_node')
        self.model = whisper.load_model("tiny")

        # Publish goals
        self.goal_pub = self.create_publisher(String, '/task_goal', 10)

        # Timer for continuous listening
        self.create_timer(1.0, self.listen_callback)

    def listen_callback(self):
        """Continuously listen for voice commands"""
        try:
            # Record audio
            audio = self._record_audio(duration=3)
            if audio is None:
                return

            # Transcribe
            text = self._transcribe(audio)
            self.get_logger().info(f"Heard: {text}")

            # Send as goal
            goal_msg = String()
            goal_msg.data = text
            self.goal_pub.publish(goal_msg)

        except Exception as e:
            self.get_logger().error(f"Voice control error: {e}")

    def _record_audio(self, duration=3):
        """Record from microphone"""
        sr = 16000
        audio = sd.rec(int(duration * sr), samplerate=sr, channels=1)
        sd.wait()
        return audio.squeeze()

    def _transcribe(self, audio):
        """Transcribe with Whisper"""
        sf.write("/tmp/audio.wav", audio, 16000)
        result = self.model.transcribe("/tmp/audio.wav")
        return result["text"]

def main(args=None):
    rclpy.init(args=args)
    node = VoiceControlNode()
    rclpy.spin(node)
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

---

## Integration Testing

### Unit Tests

```python
# tests/test_perception.py
import unittest
from perception_node import PerceptionNode

class TestPerceptionNode(unittest.TestCase):
    def test_object_detection(self):
        """Test YOLO detection"""
        node = PerceptionNode()
        # Test with sample image
        objects = node.detect_objects("test_image.jpg")
        self.assertGreater(len(objects), 0)

# Run: python -m pytest tests/
```

---

## Summary & Next Steps

### What You Learned

✅ **Node implementation**: Perception, planning, control, task planning, voice control
✅ **ROS 2 integration**: Pub-sub, actions, services
✅ **Testing**: Unit tests and integration tests
✅ **Debugging**: Logging and monitoring

### Key Takeaway

> Incremental, modular implementation allows testing of each component before full integration.

### What's Next

**Chapter 12** (Testing & Validation) will teach you:
- Integration testing
- Performance profiling
- Debugging common issues

---

**Ready for testing? Move to [Chapter 12: Testing & Validation](./12-testing-validation.md)** 🧪
