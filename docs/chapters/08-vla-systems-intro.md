---
sidebar_position: 8
title: Chapter 8 - Vision-Language-Action Systems Intro
description: Combining vision, language models, and robot control for intelligent systems
---

# Chapter 8: Vision-Language-Action Systems Intro

## Introduction

A **Vision-Language-Action (VLA) system** combines three capabilities:
1. **Vision**: Perceiving the world through cameras
2. **Language**: Understanding goals via natural language (or voice)
3. **Action**: Executing commands to manipulate the environment

This chapter introduces VLA architectures and how large language models (LLMs) enable natural language robot control.

**Prerequisites**: Chapters 1-7 | **Read time**: 12-15 minutes | **Hands-on time**: 15-20 minutes

---

## Learning Objectives

- ✅ Understand VLA system architecture
- ✅ Use large language models for task planning
- ✅ Implement prompt engineering for robots
- ✅ Build a simple VLA system with vision + language
- ✅ Integrate with ROS 2 for robot control

---

## Core Concepts

### VLA Pipeline

```
Camera Image
    ↓
[Vision Encoder]
    ↓
Visual features → [Language Model] → Plan
    ↓
Goal (natural language)
    ↓
[Action Decoder]
    ↓
Robot commands (/cmd_vel, gripper, etc.)
```

### Large Language Models (LLMs)

LLMs like GPT-4, Claude, or Llama are **trained on vast text corpora** and can:
- Understand natural language instructions
- Reason about tasks
- Generate robot commands
- Plan multi-step actions

### Prompt Engineering

The key to VLA is **prompt design**: telling the LLM how to behave like a robot controller.

**Good prompt**:
```
"You are a robot control system. When given an image and a goal,
describe the robot's next action as a JSON command.

Image: [robot sees a mug on a table]
Goal: Pick up the mug
Action: {
  'type': 'reach',
  'target': 'mug',
  'confidence': 0.95
}"
```

---

## Practical Walkthrough

### Calling an LLM API

```python
import anthropic
import base64

client = anthropic.Anthropic(api_key="your-key")

# Read image from camera
with open("robot_scene.jpg", "rb") as img_file:
    image_data = base64.standard_b64encode(img_file.read()).decode("utf-8")

# Build prompt
goal = "Pick up the red cube"
prompt = f"""You are a robot control system.
I show you an image of the robot's environment and a goal.
Respond with a JSON action command.

Goal: {goal}

Image: [provided below]

Respond ONLY with valid JSON, no other text.
Example response:
{{"action": "reach_to_object", "object": "red cube", "confidence": 0.9}}
"""

# Call Claude API with vision
message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/jpeg",
                        "data": image_data,
                    },
                },
                {
                    "type": "text",
                    "text": prompt
                }
            ],
        }
    ],
)

# Parse response
import json
response_text = message.content[0].text
action = json.loads(response_text)
print(f"Robot action: {action}")
```

### Simple VLA System

```python
import rclpy
from geometry_msgs.msg import Twist
import anthropic
import cv2

class SimpleVLANode:
    def __init__(self):
        self.node = rclpy.create_node('simple_vla')
        self.cmd_pub = self.node.create_publisher(Twist, '/cmd_vel', queue_size=10)
        self.camera = cv2.VideoCapture(0)
        self.client = anthropic.Anthropic()

    def run(self):
        goal = "Move forward and avoid obstacles"

        while rclpy.ok():
            # Capture image
            ret, frame = self.camera.read()
            if not ret:
                continue

            # Encode image
            _, encoded = cv2.imencode('.jpg', frame)
            image_b64 = base64.b64encode(encoded).decode()

            # Call LLM
            prompt = f"Current goal: {goal}\nWhat should the robot do?"
            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=256,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": image_b64}},
                            {"type": "text", "text": prompt}
                        ]
                    }
                ]
            )

            # Parse and execute
            action_text = message.content[0].text
            cmd = self._parse_action(action_text)
            self.cmd_pub.publish(cmd)

    def _parse_action(self, action_text):
        cmd = Twist()
        if "forward" in action_text.lower():
            cmd.linear.x = 0.5
        elif "backward" in action_text.lower():
            cmd.linear.x = -0.5
        if "left" in action_text.lower():
            cmd.angular.z = 0.5
        elif "right" in action_text.lower():
            cmd.angular.z = -0.5
        return cmd
```

---

## Diagrams & Visuals

### VLA Architecture

```
Camera → Vision Encoder → Features
                           ↓
                    Language Model ← Natural language goal
                           ↓
                    Action Decoder
                           ↓
                      Robot commands
                      (/cmd_vel, gripper)
```

### LLM Prompt Engineering

```
[System prompt: "You are a robot control system"]
    ↓
[Task description: "Move to object X"]
    ↓
[Image input: Camera feed]
    ↓
[Output format: JSON action]
```

---

## Code Examples

### Multi-Step Task Planning

```python
def plan_task_with_llm(initial_state, goal):
    """Use LLM to break goal into steps"""
    prompt = f"""
    Current state: {initial_state}
    Goal: {goal}

    Generate a step-by-step plan (JSON array).
    Example:
    [
        {{"action": "move_to", "target": "table"}},
        {{"action": "grasp", "object": "mug"}},
        {{"action": "move_to", "target": "shelf"}}
    ]
    """

    response = llm_call(prompt)
    plan = json.loads(response)
    return plan
```

---

## Common Pitfalls

### ❌ Pitfall 1: Hallucination

**Mistake**: LLM generates incorrect or impossible actions.

**Why**: LLMs sometimes "hallucinate" plausible-sounding but wrong responses.

**Solution**: Use constrained generation (only allow specific action types).

### ❌ Pitfall 2: Latency

**Mistake**: LLM API calls take 2-5 seconds; robot control needs 10-100 Hz.

**Why**: Network round-trip time; LLM inference time.

**Solution**: Cache repeated queries; use lightweight local models for real-time.

### ❌ Pitfall 3: Context Window Limits

**Mistake**: Can't include full history of images and actions.

**Why**: LLMs have limited context (e.g., 100K tokens).

**Solution**: Summarize history; keep only recent observations.

---

## Summary & Next Steps

### What You Learned

✅ **VLA systems** combine vision, language, and action
✅ **LLMs** enable natural language understanding and reasoning
✅ **Prompt engineering** teaches LLMs to behave like robot controllers
✅ You built a simple VLA node with vision + LLM + ROS 2

### Key Takeaway

> Language models bridge the gap between human intent and robot action, enabling natural control interfaces.

### What's Next

**Chapter 9** (Voice-Driven Robotics) will teach you:
- Speech recognition
- Voice command interpretation
- Full voice-to-robot control pipelines

---

**Ready for voice robotics? Move to [Chapter 9: Voice-Driven Robotics](./09-voice-robotics.md)** 🎤
