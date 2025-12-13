---
sidebar_position: 9
title: Chapter 9 - Voice-Driven Robotics
description: Building voice control interfaces for robots with speech recognition and NLP
---

# Chapter 9: Voice-Driven Robotics

## Introduction

**Voice-driven robotics** enables humans to control robots through natural speech. This chapter covers speech recognition, natural language understanding, and building end-to-end voice command systems integrated with ROS 2.

**Prerequisites**: Chapters 1-8 | **Read time**: 12-15 minutes | **Hands-on time**: 20-25 minutes

---

## Learning Objectives

- ✅ Implement speech-to-text with Whisper
- ✅ Parse voice commands with language understanding
- ✅ Build a voice control interface for robots
- ✅ Handle ambiguity and error recovery
- ✅ Deploy voice systems on edge devices

---

## Core Concepts

### Voice Control Pipeline

```
Microphone input (audio)
    ↓
[Speech-to-Text (ASR)]
    ↓
Text: "Pick up the red cube"
    ↓
[Intent Recognition]
    ↓
Intent: "grasp", Object: "red cube"
    ↓
[Action Planning]
    ↓
Robot commands
```

### Speech Recognition Models

**Whisper** (OpenAI): Robust, multilingual ASR

```
Audio waveform → Mel-spectrogram → Transformer → Text
```

**Key advantages**:
- Handles accents and background noise well
- Multilingual (99 languages)
- Open-source; runs locally

### Intent vs. Slots

Voice commands have **intent** (what to do) and **slots** (parameters):

```
Command: "Move forward 2 meters and turn left"
Intent: move
Slots: {distance: 2, unit: meters, direction: forward}
      {turn: left}
```

---

## Practical Walkthrough

### Speech-to-Text with Whisper

```python
import whisper
import sounddevice as sd
import soundfile as sf
import numpy as np

# Load Whisper model
model = whisper.load_model("base")  # or "tiny" for speed

def record_audio(duration=5, sr=16000):
    """Record audio from microphone"""
    print("Recording... speak now")
    audio = sd.rec(int(duration * sr), samplerate=sr, channels=1, dtype='float32')
    sd.wait()
    return audio.squeeze(), sr

def transcribe_audio():
    """Record and transcribe"""
    audio, sr = record_audio()

    # Save temporarily
    sf.write("/tmp/audio.wav", audio, sr)

    # Transcribe with Whisper
    result = model.transcribe("/tmp/audio.wav")
    text = result["text"]

    print(f"Transcribed: {text}")
    return text

# Example
command_text = transcribe_audio()
```

### Intent Recognition

```python
import json
import anthropic

def recognize_intent(voice_command):
    """Use LLM to extract intent and parameters"""
    client = anthropic.Anthropic()

    prompt = f"""Extract the intent and parameters from this robot voice command.

Command: "{voice_command}"

Respond with JSON:
{{
  "intent": "move|grasp|drop|stop",
  "parameters": {{
    "direction": "forward|backward|left|right",
    "distance": <number in meters or null>,
    "object": "<object name or null>",
    "confidence": <0.0-1.0>
  }}
}}

Only respond with JSON, no other text."""

    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=256,
        messages=[{"role": "user", "content": prompt}]
    )

    response_text = message.content[0].text
    intent_data = json.loads(response_text)

    return intent_data
```

### Voice Control Node

```python
import rclpy
from geometry_msgs.msg import Twist
from std_msgs.msg import String
import whisper
import sounddevice as sd
import soundfile as sf
import json

class VoiceControlNode:
    def __init__(self):
        self.node = rclpy.create_node('voice_control')
        self.cmd_pub = self.node.create_publisher(Twist, '/cmd_vel', queue_size=10)
        self.model = whisper.load_model("tiny")  # Fast model for real-time

    def run(self):
        """Main voice control loop"""
        print("Voice control ready. Listening...")

        while rclpy.ok():
            # Record audio (5 second max)
            audio = self._record_audio(duration=5)
            if audio is None:
                continue

            # Transcribe
            text = self._transcribe(audio)
            print(f"Heard: {text}")

            # Recognize intent
            intent = self._recognize_intent(text)
            print(f"Intent: {intent}")

            # Execute command
            cmd = self._intent_to_command(intent)
            self.cmd_pub.publish(cmd)

    def _record_audio(self, duration=5):
        """Record from microphone"""
        try:
            sr = 16000
            audio = sd.rec(int(duration * sr), samplerate=sr, channels=1, dtype='float32')
            sd.wait()
            return audio.squeeze()
        except Exception as e:
            print(f"Recording error: {e}")
            return None

    def _transcribe(self, audio):
        """Transcribe audio with Whisper"""
        sf.write("/tmp/audio.wav", audio, 16000)
        result = self.model.transcribe("/tmp/audio.wav")
        return result["text"]

    def _recognize_intent(self, text):
        """Parse intent with LLM"""
        # (use function from above)
        pass

    def _intent_to_command(self, intent):
        """Convert intent to ROS 2 Twist message"""
        cmd = Twist()

        if intent["intent"] == "move":
            if intent["parameters"]["direction"] == "forward":
                cmd.linear.x = 0.5
            elif intent["parameters"]["direction"] == "backward":
                cmd.linear.x = -0.5

        return cmd

def main():
    rclpy.init()
    node = VoiceControlNode()
    node.run()

if __name__ == '__main__':
    main()
```

---

## Diagrams & Visuals

### Voice Control Loop

```
Human speech
    ↓
Microphone capture
    ↓
Whisper ASR
    ↓
Text: "Move forward"
    ↓
Intent recognition (LLM)
    ↓
Intent + parameters
    ↓
Command generation
    ↓
Robot execution
    ↓
Feedback (optional)
```

### Intent Extraction

```
"Move the robot forward 2 meters and turn left"
    ↓
Intent: move
Parameters:
  - distance: 2
  - unit: meters
  - direction: forward
  - turn: left
```

---

## Code Examples

### Dialogue System

```python
class VoiceDialogue:
    def __init__(self):
        self.history = []
        self.client = anthropic.Anthropic()

    def multi_turn_interaction(self):
        """Support multi-turn voice dialogue"""
        messages = []

        while True:
            # Record user speech
            audio = record_audio()
            user_text = transcribe(audio)
            print(f"You: {user_text}")

            messages.append({"role": "user", "content": user_text})

            # Get robot response
            response = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=512,
                messages=messages
            )

            assistant_text = response.content[0].text
            print(f"Robot: {assistant_text}")
            messages.append({"role": "assistant", "content": assistant_text})

            # Execute action if needed
            action = parse_action(assistant_text)
            if action:
                execute_action(action)
```

---

## Common Pitfalls

### ❌ Pitfall 1: Background Noise

**Mistake**: Whisper misheard due to noise.

**Why**: Whisper is robust but not immune to loud noise.

**Solution**: Use noise suppression filter (webrtcvad); test in realistic environments.

### ❌ Pitfall 2: Ambiguous Commands

**Mistake**: "Pick up it" - unclear what "it" refers to.

**Why**: Pronouns need context.

**Solution**: Ask clarifying questions; maintain conversation history.

### ❌ Pitfall 3: Network Latency

**Mistake**: Cloud-based STT causes 1-2 second delay.

**Why**: Network round-trip time.

**Solution**: Use local Whisper model for real-time response.

---

## Summary & Next Steps

### What You Learned

✅ **Whisper** provides accurate speech-to-text
✅ **Intent recognition** parses commands into actionable plans
✅ **Voice control nodes** integrate with ROS 2
✅ **Multi-turn dialogue** enables complex interactions

### Key Takeaway

> Voice control makes robots accessible to non-experts, enabling natural human-robot interaction.

### What's Next

**Chapter 10** (Capstone Architecture) will teach you:
- Integrating all previous concepts
- Designing the Voice-Driven Mobile Manipulator
- System architecture and component interactions

---

**Ready for the capstone? Move to [Chapter 10: Capstone Architecture](./10-capstone-architecture.md)** 🏗️
