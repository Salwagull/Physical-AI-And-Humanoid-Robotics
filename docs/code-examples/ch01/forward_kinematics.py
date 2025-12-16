# forward_kinematics.py
# Chapter 1: Physical AI Foundations
# Forward kinematics for a simple 2-link planar arm
# System: Python 3.10+, uses only standard library (math)

"""
Forward Kinematics: From Joint Angles to End-Effector Position

This demonstrates KINEMATICS - the geometry of motion.
Given joint angles, where is the end-effector (robot hand)?

Key distinction:
- Kinematics: Geometry only (WHERE does it move?)
- Dynamics: Forces included (HOW HARD to move?)

This script covers kinematics. Dynamics requires knowing masses,
inertias, and forces - covered conceptually in the chapter.
"""

import math
from dataclasses import dataclass
from typing import Tuple, List


@dataclass
class Point2D:
    """A point in 2D space."""
    x: float
    y: float

    def __str__(self) -> str:
        return f"({self.x:.3f}, {self.y:.3f})"


@dataclass
class LinkConfig:
    """Configuration of a robot link."""
    length: float  # Link length in meters
    angle: float   # Joint angle in radians


def forward_kinematics_2link(theta1: float, theta2: float,
                              L1: float = 1.0, L2: float = 1.0) -> Tuple[Point2D, Point2D]:
    """
    Compute joint and end-effector positions for a 2-link planar arm.

    This is FORWARD KINEMATICS:
    Given joint angles -> Find end-effector position

    The arm is anchored at the origin (0, 0).
    - Link 1 rotates about the origin by theta1
    - Link 2 rotates about the elbow by theta2 (relative to Link 1)

    Args:
        theta1: Angle of first joint from horizontal (radians)
        theta2: Angle of second joint relative to first link (radians)
        L1: Length of first link (meters)
        L2: Length of second link (meters)

    Returns:
        Tuple of (elbow_position, end_effector_position)
    """
    # Position of elbow (end of link 1)
    elbow_x = L1 * math.cos(theta1)
    elbow_y = L1 * math.sin(theta1)
    elbow = Point2D(elbow_x, elbow_y)

    # Position of end-effector (end of link 2)
    # theta2 is relative to link 1, so we add the angles
    total_angle = theta1 + theta2
    end_x = elbow_x + L2 * math.cos(total_angle)
    end_y = elbow_y + L2 * math.sin(total_angle)
    end_effector = Point2D(end_x, end_y)

    return elbow, end_effector


def inverse_kinematics_2link(target_x: float, target_y: float,
                              L1: float = 1.0, L2: float = 1.0) -> Tuple[float, float]:
    """
    Compute joint angles to reach a target position (simplified).

    This is INVERSE KINEMATICS:
    Given target position -> Find joint angles

    Note: This uses the "elbow-up" solution. Real robots may have
    multiple valid configurations (elbow-up vs elbow-down).

    Args:
        target_x: Target x position (meters)
        target_y: Target y position (meters)
        L1: Length of first link (meters)
        L2: Length of second link (meters)

    Returns:
        Tuple of (theta1, theta2) in radians, or raises ValueError if unreachable
    """
    # Distance to target
    d = math.sqrt(target_x**2 + target_y**2)

    # Check if target is reachable
    if d > L1 + L2:
        raise ValueError(f"Target ({target_x}, {target_y}) is too far. "
                        f"Max reach is {L1 + L2}")
    if d < abs(L1 - L2):
        raise ValueError(f"Target ({target_x}, {target_y}) is too close. "
                        f"Min reach is {abs(L1 - L2)}")

    # Use law of cosines to find theta2
    cos_theta2 = (d**2 - L1**2 - L2**2) / (2 * L1 * L2)
    cos_theta2 = max(-1, min(1, cos_theta2))  # Clamp for numerical stability
    theta2 = math.acos(cos_theta2)  # Elbow-up solution

    # Find theta1 using geometry
    alpha = math.atan2(target_y, target_x)
    beta = math.acos((d**2 + L1**2 - L2**2) / (2 * d * L1))
    theta1 = alpha - beta

    return theta1, theta2


def workspace_analysis(L1: float = 1.0, L2: float = 1.0) -> dict:
    """
    Analyze the workspace of a 2-link arm.

    The workspace is all points the end-effector can reach.
    For a 2-link arm, it's a ring (annulus) shape.
    """
    max_reach = L1 + L2  # Both links extended
    min_reach = abs(L1 - L2)  # Links folded

    return {
        'max_reach': max_reach,
        'min_reach': min_reach,
        'workspace_area': math.pi * (max_reach**2 - min_reach**2)
    }


def demonstrate_forward_kinematics():
    """Show various arm configurations and their end-effector positions."""

    print("\n" + "=" * 60)
    print("FORWARD KINEMATICS EXAMPLES")
    print("=" * 60)

    L1, L2 = 1.0, 1.0  # 1 meter links

    configurations = [
        ("Straight out (0, 0)", 0, 0),
        ("Arm up 45 deg (45, 0)", math.radians(45), 0),
        ("Elbow bent 90 deg (0, 90)", 0, math.radians(90)),
        ("Reaching up (90, -45)", math.radians(90), math.radians(-45)),
        ("Folded back (0, 180)", 0, math.radians(180)),
    ]

    print(f"\nLink lengths: L1 = {L1}m, L2 = {L2}m")
    print("-" * 60)
    print(f"{'Configuration':<25} {'Elbow':<15} {'End-Effector':<15}")
    print("-" * 60)

    for name, theta1, theta2 in configurations:
        elbow, end = forward_kinematics_2link(theta1, theta2, L1, L2)
        print(f"{name:<25} {str(elbow):<15} {str(end):<15}")


def demonstrate_inverse_kinematics():
    """Show how to find joint angles for target positions."""

    print("\n" + "=" * 60)
    print("INVERSE KINEMATICS EXAMPLES")
    print("=" * 60)

    L1, L2 = 1.0, 1.0

    targets = [
        (1.5, 0.5),
        (1.0, 1.0),
        (0.5, 1.5),
        (0.0, 1.8),
    ]

    print(f"\nLink lengths: L1 = {L1}m, L2 = {L2}m")
    print("-" * 60)
    print(f"{'Target':<15} {'theta1 (deg)':<15} {'theta2 (deg)':<15} {'Verified'}")
    print("-" * 60)

    for target_x, target_y in targets:
        try:
            theta1, theta2 = inverse_kinematics_2link(target_x, target_y, L1, L2)

            # Verify by computing forward kinematics
            _, end = forward_kinematics_2link(theta1, theta2, L1, L2)
            error = math.sqrt((end.x - target_x)**2 + (end.y - target_y)**2)
            verified = "YES" if error < 0.001 else "NO"

            print(f"({target_x}, {target_y}){'':<5} "
                  f"{math.degrees(theta1):<15.1f} "
                  f"{math.degrees(theta2):<15.1f} {verified}")
        except ValueError as e:
            print(f"({target_x}, {target_y}){'':<5} UNREACHABLE: {e}")


def visualize_arm_ascii(theta1: float, theta2: float,
                        L1: float = 1.0, L2: float = 1.0) -> None:
    """Create a simple ASCII visualization of the arm configuration."""

    elbow, end = forward_kinematics_2link(theta1, theta2, L1, L2)

    # Simple text-based visualization
    print(f"\n  Arm Configuration:")
    print(f"  Base (origin): (0, 0)")
    print(f"  Elbow: {elbow}")
    print(f"  End-effector: {end}")
    print(f"\n  [Base] ----({math.degrees(theta1):.0f}deg)---- [Elbow] ----({math.degrees(theta2):.0f}deg)---- [End]")


# === Main Execution ===
if __name__ == "__main__":
    print("=" * 60)
    print("FORWARD & INVERSE KINEMATICS DEMONSTRATION")
    print("Chapter 1: Physical AI Foundations")
    print("=" * 60)

    # Analyze workspace
    workspace = workspace_analysis(L1=1.0, L2=1.0)
    print(f"\nWorkspace Analysis (L1=L2=1m):")
    print(f"  Maximum reach: {workspace['max_reach']:.2f}m")
    print(f"  Minimum reach: {workspace['min_reach']:.2f}m")
    print(f"  Workspace area: {workspace['workspace_area']:.2f} m^2")

    # Demonstrate forward kinematics
    demonstrate_forward_kinematics()

    # Demonstrate inverse kinematics
    demonstrate_inverse_kinematics()

    # Show a specific configuration
    print("\n" + "=" * 60)
    print("DETAILED EXAMPLE")
    print("=" * 60)

    theta1 = math.radians(30)
    theta2 = math.radians(60)

    print(f"\nJoint angles: theta1 = 30 deg, theta2 = 60 deg")
    visualize_arm_ascii(theta1, theta2)

    print("\n" + "=" * 60)
    print("KEY INSIGHTS:")
    print("1. Forward kinematics: Joint angles -> End position (straightforward)")
    print("2. Inverse kinematics: Target position -> Joint angles (harder)")
    print("3. Multiple solutions may exist (elbow-up vs elbow-down)")
    print("4. Not all positions are reachable (workspace limits)")
    print("5. This is GEOMETRY only - forces require DYNAMICS")
    print("=" * 60)
