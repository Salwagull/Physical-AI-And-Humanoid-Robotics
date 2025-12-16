# sensor_motor_loop.py
# Chapter 1: Physical AI Foundations
# Demonstrates the fundamental sensor-motor control loop
# System: Python 3.10+ (no external dependencies for conceptual demo)

"""
The Sensor-Motor Loop: The Heartbeat of Every Robot

This script demonstrates the fundamental cycle that every robot follows:
SENSE -> REASON -> PLAN -> CONTROL -> ACT -> (feedback loop)

This is conceptual pseudocode showing the structure. Actual ROS 2
implementation will be covered in Chapter 2.
"""

import time
from dataclasses import dataclass
from typing import Dict, Any, Optional


@dataclass
class SensorData:
    """Container for all sensor readings at one instant."""
    camera_frame: Optional[Any] = None  # Image data
    lidar_scan: Optional[list] = None   # Distance measurements
    joint_positions: Optional[list] = None  # Encoder readings (radians)
    imu_orientation: Optional[tuple] = None  # (roll, pitch, yaw)
    timestamp: float = 0.0


@dataclass
class RobotState:
    """Estimated state of the robot computed from sensors."""
    position: tuple = (0.0, 0.0, 0.0)  # (x, y, z) in meters
    orientation: tuple = (0.0, 0.0, 0.0)  # (roll, pitch, yaw) in radians
    velocity: tuple = (0.0, 0.0, 0.0)  # (vx, vy, vz) in m/s
    joint_angles: tuple = ()  # Current joint positions


@dataclass
class MotorCommand:
    """Commands to send to robot actuators."""
    joint_velocities: tuple = ()  # Velocity for each joint (rad/s)
    gripper_position: float = 0.0  # 0.0 = closed, 1.0 = open


class SimulatedRobot:
    """
    Simulated robot interface for demonstration.

    In a real system, this would communicate with actual hardware
    or a simulator like Gazebo or Isaac Sim.
    """

    def __init__(self, num_joints: int = 6):
        self.num_joints = num_joints
        self.joint_positions = [0.0] * num_joints
        self.running = True
        print(f"Robot initialized with {num_joints} joints")

    def read_sensors(self) -> SensorData:
        """
        SENSE: Read all sensor data.

        In a real robot, this would:
        - Capture images from cameras
        - Read LiDAR scans
        - Query joint encoders
        - Read IMU orientation
        """
        return SensorData(
            camera_frame="[simulated image data]",
            lidar_scan=[1.5, 2.0, 1.8, 2.2],  # Sample distances in meters
            joint_positions=self.joint_positions.copy(),
            imu_orientation=(0.0, 0.0, 0.0),
            timestamp=time.time()
        )

    def send_command(self, command: MotorCommand) -> None:
        """
        ACT: Send commands to motors.

        In a real robot, this would write velocity or torque
        commands to motor controllers.
        """
        # Simulate motor response (simplified physics)
        dt = 0.01  # 10ms time step
        for i, velocity in enumerate(command.joint_velocities):
            if i < self.num_joints:
                self.joint_positions[i] += velocity * dt

    def is_running(self) -> bool:
        """Check if robot should continue operating."""
        return self.running

    def stop(self) -> None:
        """Safely stop the robot."""
        self.running = False
        print("Robot stopped")


def estimate_state(sensor_data: SensorData) -> RobotState:
    """
    REASON: Compute robot state from sensor data.

    This is where perception algorithms run:
    - Object detection from camera
    - Localization from LiDAR
    - State estimation from encoders and IMU
    """
    return RobotState(
        position=(0.0, 0.0, 0.0),
        orientation=sensor_data.imu_orientation or (0.0, 0.0, 0.0),
        velocity=(0.0, 0.0, 0.0),
        joint_angles=tuple(sensor_data.joint_positions or [])
    )


def plan_trajectory(current_state: RobotState, target: Dict[str, Any]) -> list:
    """
    PLAN: Compute trajectory from current state to target.

    This is where motion planning algorithms run:
    - Path planning (A*, RRT, etc.)
    - Trajectory optimization
    - Collision avoidance
    """
    # Simplified: just return target as single waypoint
    return [target]


def compute_command(trajectory: list, current_state: RobotState) -> MotorCommand:
    """
    CONTROL: Compute motor commands to follow trajectory.

    This is where control algorithms run:
    - PID control
    - Trajectory tracking
    - Force/impedance control
    """
    if not trajectory:
        return MotorCommand(joint_velocities=(0.0,) * 6)

    target = trajectory[0]
    target_angles = target.get('joint_angles', [0.0] * 6)

    # Simple proportional control (P-controller)
    kp = 1.0  # Proportional gain
    velocities = []

    for i, target_angle in enumerate(target_angles):
        if i < len(current_state.joint_angles):
            error = target_angle - current_state.joint_angles[i]
            velocity = kp * error
            velocities.append(velocity)
        else:
            velocities.append(0.0)

    return MotorCommand(joint_velocities=tuple(velocities))


def run_control_loop(robot: SimulatedRobot, target: Dict[str, Any],
                     duration_seconds: float = 2.0) -> None:
    """
    Main sensor-motor loop running at approximately 100 Hz.

    This is the fundamental cycle every robot follows:
    1. SENSE: Read sensors
    2. REASON: Estimate state
    3. PLAN: Compute trajectory
    4. CONTROL: Compute motor commands
    5. ACT: Send to motors
    6. Repeat (feedback loop)
    """
    LOOP_RATE_HZ = 100
    LOOP_PERIOD = 1.0 / LOOP_RATE_HZ

    start_time = time.time()
    loop_count = 0

    print(f"\nStarting control loop at {LOOP_RATE_HZ} Hz")
    print(f"Target: {target}")
    print("-" * 50)

    while robot.is_running():
        loop_start = time.time()

        # Check duration limit
        if time.time() - start_time > duration_seconds:
            print(f"\nReached duration limit ({duration_seconds}s)")
            break

        # 1. SENSE: Read current state from sensors
        sensor_data = robot.read_sensors()

        # 2. REASON: Estimate robot state from sensor data
        current_state = estimate_state(sensor_data)

        # 3. PLAN: Compute trajectory to target
        trajectory = plan_trajectory(current_state, target)

        # 4. CONTROL: Compute motor commands
        command = compute_command(trajectory, current_state)

        # 5. ACT: Send commands to motors
        robot.send_command(command)

        # Print status every 50 iterations (0.5 seconds)
        loop_count += 1
        if loop_count % 50 == 0:
            print(f"Loop {loop_count}: Joint 0 = {current_state.joint_angles[0]:.3f} rad "
                  f"(target: {target['joint_angles'][0]:.3f})")

        # 6. FEEDBACK: Maintain loop frequency
        # The next iteration will read new sensor data, closing the loop
        elapsed = time.time() - loop_start
        if elapsed < LOOP_PERIOD:
            time.sleep(LOOP_PERIOD - elapsed)

    print(f"\nControl loop completed after {loop_count} iterations")
    print(f"Final joint positions: {[f'{p:.3f}' for p in robot.joint_positions]}")


# === Main Execution ===
if __name__ == "__main__":
    print("=" * 60)
    print("SENSOR-MOTOR LOOP DEMONSTRATION")
    print("Chapter 1: Physical AI Foundations")
    print("=" * 60)

    # Create simulated robot with 6 joints
    robot = SimulatedRobot(num_joints=6)

    # Define target configuration
    target = {
        'joint_angles': [0.5, 0.3, -0.2, 0.0, 0.1, 0.0],  # radians
        'gripper': 0.5  # half open
    }

    # Run the control loop
    run_control_loop(robot, target, duration_seconds=2.0)

    # Clean shutdown
    robot.stop()

    print("\n" + "=" * 60)
    print("KEY INSIGHT: Without the feedback loop (reading sensors each")
    print("iteration), the robot cannot correct errors or respond to")
    print("changes in the environment. This is why closed-loop control")
    print("is essential for real-world robotics.")
    print("=" * 60)
