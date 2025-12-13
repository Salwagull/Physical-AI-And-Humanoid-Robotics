---
sidebar_position: 6
title: Chapter 6 - Perception & Vision
description: Computer vision fundamentals and robot perception pipelines
---

# Chapter 6: Perception & Vision

## Introduction

**Robot perception** is how robots understand their environment through sensors. This chapter covers computer vision fundamentals: object detection, 3D reconstruction, and building perception pipelines that power autonomous robots.

**Prerequisites**: Chapters 1-5 | **Read time**: 12-15 minutes | **Hands-on time**: 20-25 minutes

---

## Learning Objectives

- ✅ Understand camera models and calibration
- ✅ Implement object detection with YOLO
- ✅ Reconstruct 3D scenes from depth cameras
- ✅ Build ROS 2 perception pipelines
- ✅ Debug vision systems with visualization tools

---

## Core Concepts

### The Pinhole Camera Model

Cameras project 3D points onto 2D images:

```
3D World Point (X, Y, Z)
        ↓
   Projection (focal point)
        ↓
2D Image Point (u, v) = K @ [R|t] @ [X, Y, Z]
```

Where **K** is the **intrinsic matrix** and **[R|t]** is the **extrinsic transformation**.

### Object Detection with YOLO

**YOLO (You Only Look Once)** is a real-time object detection algorithm:

```
Input Image (640×480)
        ↓
CNN Feature Extraction
        ↓
Output: Bounding boxes + class labels + confidence
```

**Output format**: `(x, y, width, height, class, confidence)`

### Depth and 3D Reconstruction

Depth cameras (RealSense, Kinect) provide depth maps:

```
RGB Image       Depth Map       3D Point Cloud
(color)     +  (distance)  →    (X, Y, Z for each pixel)
```

---

## Practical Walkthrough

### Camera Calibration

```python
import cv2
import numpy as np

# Detect checkerboard corners in calibration images
criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_COUNT, 30, 0.001)

objpoints = []  # 3D object points
imgpoints = []  # 2D image points

for image_file in calibration_images:
    img = cv2.imread(image_file)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    ret, corners = cv2.findChessboardCorners(gray, (9, 6), None)

    if ret:
        objpoints.append(objp)
        corners2 = cv2.cornerSubPix(gray, corners, (11,11), (-1,-1), criteria)
        imgpoints.append(corners2)

# Compute camera matrix K and distortion coefficients
ret, K, dist, rvecs, tvecs = cv2.calibrateCamera(
    objpoints, imgpoints, gray.shape[::-1], None, None
)

print(f"Camera matrix:\n{K}")
print(f"Distortion coefficients:\n{dist}")
```

### Object Detection with YOLO

```python
import cv2
from ultralytics import YOLO

# Load pretrained YOLO model
model = YOLO('yolov8n.pt')  # nano model for speed

# Run detection on image
image = cv2.imread('robot_scene.jpg')
results = model(image)

# Parse results
for det in results[0].boxes:
    x1, y1, x2, y2 = det.xyxy[0]  # Bounding box
    conf = det.conf[0]             # Confidence
    cls = det.cls[0]               # Class label

    print(f"Object: {model.names[int(cls)]}, Confidence: {conf:.2f}")

    # Draw bounding box
    cv2.rectangle(image, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)

cv2.imshow('Detections', image)
cv2.waitKey(0)
```

### 3D Reconstruction from Depth

```python
import numpy as np
import cv2

# Load RGB and depth images
rgb = cv2.imread('rgb.jpg')
depth = cv2.imread('depth.png', cv2.IMREAD_UNCHANGED)

# Camera intrinsics (from calibration)
K = np.array([
    [fx, 0, cx],
    [0, fy, cy],
    [0, 0, 1]
])

# Create 3D point cloud
height, width = depth.shape
points_3d = []

for v in range(height):
    for u in range(width):
        z = depth[v, u] / 1000.0  # Convert to meters
        if z > 0:
            x = (u - K[0, 2]) * z / K[0, 0]
            y = (v - K[1, 2]) * z / K[1, 1]
            points_3d.append([x, y, z])

points_3d = np.array(points_3d)
print(f"Generated {len(points_3d)} 3D points")
```

---

## Diagrams & Visuals

### Camera Projection

```
3D World
  • (X, Y, Z)
     |
     | Pinhole camera
     |
2D Image
  • (u, v)
```

### YOLO Pipeline

```
Input Image → Backbone → Neck → Head → Detections
   640×480     Feature   Feature  Predictions
             Extraction  Fusion
```

---

## Common Pitfalls

### ❌ Pitfall 1: Uncalibrated Camera

**Mistake**: Using default camera matrix.

**Why**: Wrong focal length and principal point.

**Solution**: Calibrate your specific camera.

### ❌ Pitfall 2: YOLO Model Size Mismatch

**Mistake**: Using tiny model on complex scenes; or huge model on edge devices.

**Why**: Accuracy/speed tradeoff.

**Solution**: Benchmark YOLOv8 nano/small/medium for your hardware.

### ❌ Pitfall 3: Depth Camera Range Limits

**Mistake**: Expecting depth at 20 meters; camera maxes out at 5 m.

**Why**: Depth cameras have limited range.

**Solution**: Know your sensor specs; verify distance to target.

---

## Summary & Next Steps

### What You Learned

✅ **Camera calibration** removes optical distortion
✅ **YOLO** detects objects in real-time
✅ **Depth cameras** enable 3D reconstruction
✅ **Perception pipelines** combine vision with ROS 2

### Key Takeaway

> Robot perception translates images into actionable 3D understanding of the world.

### What's Next

**Chapter 7** (Control & Planning) will teach you:
- Motion planning algorithms
- Trajectory generation
- Real-time control loops

---

**Ready for motion planning? Move to [Chapter 7: Control & Planning](./07-control-planning.md)** 🎯
