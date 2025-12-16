# pid_controller.py
# Chapter 1: Physical AI Foundations
# Simple PID controller demonstrating feedback control
# System: Python 3.10+ (no external dependencies)

"""
PID Controller: The Workhorse of Robot Control

A PID controller uses three terms to compute control output:
- P (Proportional): Responds to current error
- I (Integral): Accumulates past errors
- D (Derivative): Anticipates future errors

This creates smooth, accurate control that can handle disturbances
and reach targets precisely.
"""

from dataclasses import dataclass
from typing import List, Tuple
import math


@dataclass
class PIDGains:
    """Container for PID tuning parameters."""
    kp: float  # Proportional gain
    ki: float  # Integral gain
    kd: float  # Derivative gain


class PIDController:
    """
    Proportional-Integral-Derivative controller.

    The three gains work together:
    - Kp (Proportional): "How far am I from target?"
      Larger error = stronger response
    - Ki (Integral): "How long have I been off?"
      Eliminates steady-state error over time
    - Kd (Derivative): "How fast am I approaching?"
      Dampens oscillations and overshooting

    Think of it like driving a car to a parking spot:
    - P: Steer harder when you're far from the spot
    - I: Keep adjusting if you've been slightly off for a while
    - D: Ease off as you get close to avoid overshooting
    """

    def __init__(self, kp: float = 1.0, ki: float = 0.0, kd: float = 0.0):
        """
        Initialize PID controller with gains.

        Args:
            kp: Proportional gain (start here when tuning)
            ki: Integral gain (add to eliminate steady-state error)
            kd: Derivative gain (add to reduce oscillations)
        """
        self.kp = kp
        self.ki = ki
        self.kd = kd

        # Internal state
        self.previous_error = 0.0
        self.integral = 0.0

        # Optional: limits to prevent integral windup
        self.integral_limit = 100.0

    def compute(self, setpoint: float, measurement: float, dt: float) -> float:
        """
        Compute control output given setpoint and current measurement.

        Args:
            setpoint: Desired value (e.g., target position)
            measurement: Current value (e.g., actual position from encoder)
            dt: Time step in seconds (e.g., 0.01 for 100 Hz)

        Returns:
            Control output (e.g., motor velocity command)
        """
        # Calculate error: how far are we from the target?
        error = setpoint - measurement

        # --- Proportional term ---
        # Responds immediately to current error
        # Larger error = larger correction
        p_term = self.kp * error

        # --- Integral term ---
        # Accumulates error over time
        # Helps eliminate small persistent errors
        self.integral += error * dt

        # Prevent integral windup (runaway accumulation)
        self.integral = max(-self.integral_limit,
                          min(self.integral_limit, self.integral))

        i_term = self.ki * self.integral

        # --- Derivative term ---
        # Responds to rate of change of error
        # Helps dampen oscillations and reduce overshoot
        if dt > 0:
            derivative = (error - self.previous_error) / dt
        else:
            derivative = 0.0

        d_term = self.kd * derivative

        # Store error for next iteration
        self.previous_error = error

        # Sum all terms for final output
        output = p_term + i_term + d_term

        return output

    def reset(self) -> None:
        """Reset controller state (useful when changing setpoints)."""
        self.previous_error = 0.0
        self.integral = 0.0


def simulate_system(controller: PIDController, target: float,
                    initial_position: float, duration: float,
                    dt: float = 0.01) -> Tuple[List[float], List[float], List[float]]:
    """
    Simulate a simple 1D system with PID control.

    This simulates a mass that responds to velocity commands.
    The controller tries to move the mass to a target position.

    Args:
        controller: PID controller instance
        target: Target position
        initial_position: Starting position
        duration: Simulation duration in seconds
        dt: Time step

    Returns:
        Tuple of (times, positions, errors)
    """
    position = initial_position
    velocity = 0.0

    times = []
    positions = []
    errors = []

    steps = int(duration / dt)

    for step in range(steps):
        t = step * dt

        # Compute control output (velocity command)
        velocity_cmd = controller.compute(target, position, dt)

        # Simulate system response (simplified physics)
        # In a real system, this would be the actual robot dynamics
        velocity = velocity_cmd  # Assume instant velocity response
        position += velocity * dt

        # Add some simulated noise/disturbance
        if step == steps // 2:  # Disturbance at midpoint
            position += 0.5  # External push

        # Record data
        times.append(t)
        positions.append(position)
        errors.append(target - position)

    return times, positions, errors


def print_results(times: List[float], positions: List[float],
                  errors: List[float], target: float) -> None:
    """Print simulation results in a readable format."""
    print(f"\n{'Time (s)':<10} {'Position':<12} {'Error':<12} {'Status'}")
    print("-" * 50)

    # Print every 0.5 seconds
    for i in range(0, len(times), 50):
        t = times[i]
        pos = positions[i]
        err = errors[i]

        status = "CONVERGED" if abs(err) < 0.01 else "MOVING"
        print(f"{t:<10.2f} {pos:<12.4f} {err:<12.4f} {status}")

    # Final state
    final_error = errors[-1]
    print("-" * 50)
    print(f"Final error: {final_error:.6f}")
    print(f"Target reached: {'YES' if abs(final_error) < 0.01 else 'NO'}")


def demonstrate_pid_tuning():
    """
    Demonstrate the effect of different PID gains.

    This shows why tuning matters:
    - P-only: May oscillate or have steady-state error
    - PD: Reduces oscillations
    - PID: Eliminates steady-state error
    """
    target = 10.0
    initial = 0.0
    duration = 3.0

    print("\n" + "=" * 60)
    print("PID TUNING DEMONSTRATION")
    print("=" * 60)
    print(f"Target: {target}, Starting position: {initial}")

    # Test different gain configurations
    configs = [
        ("P-only (Kp=1.0)", PIDController(kp=1.0, ki=0.0, kd=0.0)),
        ("PD (Kp=1.0, Kd=0.1)", PIDController(kp=1.0, ki=0.0, kd=0.1)),
        ("PID (Kp=1.0, Ki=0.1, Kd=0.05)", PIDController(kp=1.0, ki=0.1, kd=0.05)),
    ]

    for name, controller in configs:
        print(f"\n--- {name} ---")
        times, positions, errors = simulate_system(
            controller, target, initial, duration
        )
        print_results(times, positions, errors, target)


# === Main Execution ===
if __name__ == "__main__":
    print("=" * 60)
    print("PID CONTROLLER DEMONSTRATION")
    print("Chapter 1: Physical AI Foundations")
    print("=" * 60)

    # Basic example
    print("\n--- BASIC PID EXAMPLE ---")
    print("Controlling a simulated robot joint to reach target position")

    controller = PIDController(kp=2.0, ki=0.5, kd=0.1)

    target_position = 5.0
    current_position = 0.0
    dt = 0.01  # 100 Hz

    print(f"\nTarget: {target_position}")
    print(f"Initial position: {current_position}")
    print(f"Gains: Kp={controller.kp}, Ki={controller.ki}, Kd={controller.kd}")

    times, positions, errors = simulate_system(
        controller, target_position, current_position, duration=2.0, dt=dt
    )

    print_results(times, positions, errors, target_position)

    # Demonstrate tuning effects
    demonstrate_pid_tuning()

    print("\n" + "=" * 60)
    print("KEY INSIGHTS:")
    print("1. P-only control responds quickly but may oscillate")
    print("2. Adding D (derivative) dampens oscillations")
    print("3. Adding I (integral) eliminates steady-state error")
    print("4. Tuning is about balancing speed, stability, and accuracy")
    print("=" * 60)
