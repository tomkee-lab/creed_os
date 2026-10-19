// Web Worker for Pyodide Execution
// Isolates Python execution from the main thread to ensure "Calm Intelligence" (no UI blocking).
// Pre-configured with full CREED OS Robotics, micro:bit, and AI Sensor runtime mock.

importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');

let pyodideReadyPromise;

const ROBOTICS_RUNTIME_INIT = `
import sys
import math
import time

class RobotMock:
    def __init__(self):
        self.x = 240.0
        self.y = 220.0
        self.heading = 0.0
        self.distance = 38.0
        self.light = 72.0
        self.battery = 94.0
        self.radiation = 1.4
        self.samples_collected = []
        self.solar_deployed = False
        self.timer_start = time.time()
        self.servos = {}
        self.continuous_servos = {}
        self.pins = {}
        self.last_action = "init"
        self.pen_is_down = False
        self.pen_color = "#06b6d4"
        self.pen_size = 3
        self.pen_trails = []
        self.sound_events = []
        self.radio_messages = []
        self.radio_group = 1
        self.speech_events = []
        self.speech_voice = "Rover Pilot"
        self.speech_rate = 1.05
        self.speech_pitch = 1.1
        self.emotion = "HAPPY"
        self.datalog_entries = []
        self.timeline = []

    def drive(self, direction="FORWARD", speed=75, duration=1.0):
        spd = float(speed)
        dur = float(duration)
        rad = math.radians((self.heading - 90) % 360)
        dist = (spd / 100.0) * dur * 35.0
        if direction.upper() == "BACKWARD":
            dist = -dist
        old_x, old_y = self.x, self.y
        self.x = max(20.0, min(460.0, self.x + math.cos(rad) * dist))
        self.y = max(20.0, min(340.0, self.y + math.sin(rad) * dist))
        self.battery = max(10.0, round(self.battery - (dur * 0.2), 1))
        self._update_distance()
        self.last_action = f"drive:{direction}:{speed}:{duration}"
        trail_entry = None
        if self.pen_is_down:
            trail_entry = {
                "x1": round(old_x, 1),
                "y1": round(old_y, 1),
                "x2": round(self.x, 1),
                "y2": round(self.y, 1),
                "color": self.pen_color,
                "size": self.pen_size
            }
            self.pen_trails.append(trail_entry)
        self.timeline.append({
            "type": "drive",
            "direction": direction.upper(),
            "speed": spd,
            "duration": dur,
            "fromX": round(old_x, 1),
            "fromY": round(old_y, 1),
            "toX": round(self.x, 1),
            "toY": round(self.y, 1),
            "heading": round(self.heading, 1),
            "distance": round(self.distance, 1),
            "trail": trail_entry,
            "action": f"Drive {direction.upper()} at {speed}% for {duration}s"
        })
        print(f"[ROBOT] Drive {direction.upper()} at {speed}% for {duration}s -> Pos: ({self.x:.1f}, {self.y:.1f})")

    def drive_distance(self, direction="FORWARD", distance_cm=20, speed=75):
        dist_cm = float(distance_cm)
        dur = max(0.2, round(dist_cm / 25.0, 2))
        spd = float(speed)
        rad = math.radians((self.heading - 90) % 360)
        dist_px = dist_cm * 1.5
        if direction.upper() == "BACKWARD":
            dist_px = -dist_px
        old_x, old_y = self.x, self.y
        self.x = max(20.0, min(460.0, self.x + math.cos(rad) * dist_px))
        self.y = max(20.0, min(340.0, self.y + math.sin(rad) * dist_px))
        self.battery = max(10.0, round(self.battery - (dur * 0.15), 1))
        self._update_distance()
        self.last_action = f"drive_dist:{direction}:{dist_cm}:{speed}"
        trail_entry = None
        if self.pen_is_down:
            trail_entry = {
                "x1": round(old_x, 1),
                "y1": round(old_y, 1),
                "x2": round(self.x, 1),
                "y2": round(self.y, 1),
                "color": self.pen_color,
                "size": self.pen_size
            }
            self.pen_trails.append(trail_entry)
        self.timeline.append({
            "type": "drive",
            "direction": direction.upper(),
            "speed": spd,
            "duration": dur,
            "fromX": round(old_x, 1),
            "fromY": round(old_y, 1),
            "toX": round(self.x, 1),
            "toY": round(self.y, 1),
            "heading": round(self.heading, 1),
            "distance": round(self.distance, 1),
            "trail": trail_entry,
            "action": f"Drive {direction.upper()} {distance_cm}cm at {speed}%"
        })
        print(f"[ROBOT] Drive {direction.upper()} {distance_cm}cm at {speed}% -> Pos: ({self.x:.1f}, {self.y:.1f})")

    def turn(self, direction="RIGHT", angle=90):
        deg = float(angle)
        old_h = self.heading
        if direction.upper() == "LEFT":
            self.heading = (self.heading - deg + 360) % 360
        else:
            self.heading = (self.heading + deg) % 360
        self._update_distance()
        self.last_action = f"turn:{direction}:{angle}"
        self.timeline.append({
            "type": "turn",
            "direction": direction.upper(),
            "angle": deg,
            "fromHeading": round(old_h, 1),
            "toHeading": round(self.heading, 1),
            "x": round(self.x, 1),
            "y": round(self.y, 1),
            "distance": round(self.distance, 1),
            "action": f"Turn {direction.upper()} by {angle}°"
        })
        print(f"[ROBOT] Turn {direction.upper()} by {angle}° -> Heading: {self.heading:.0f}°")

    def turn_to_heading(self, heading=0):
        target = float(heading) % 360
        old_h = self.heading
        self.heading = target
        self._update_distance()
        self.last_action = f"turn_heading:{target}"
        self.timeline.append({
            "type": "turn",
            "direction": "ABSOLUTE",
            "angle": abs(target - old_h),
            "fromHeading": round(old_h, 1),
            "toHeading": round(self.heading, 1),
            "x": round(self.x, 1),
            "y": round(self.y, 1),
            "distance": round(self.distance, 1),
            "action": f"Turn to Heading {target}°"
        })
        print(f"[ROBOT] Turn to Heading {target}° -> Heading: {self.heading:.0f}°")

    def curve_turn(self, direction="RIGHT", radius_cm=15, angle=90):
        deg = float(angle)
        rad_val = float(radius_cm)
        old_h = self.heading
        old_x, old_y = self.x, self.y
        if direction.upper() == "LEFT":
            self.heading = (self.heading - deg + 360) % 360
            turn_rad = math.radians((old_h - 90 - (deg / 2)) % 360)
        else:
            self.heading = (self.heading + deg) % 360
            turn_rad = math.radians((old_h - 90 + (deg / 2)) % 360)
        step_dist = rad_val * 1.2
        self.x = max(20.0, min(460.0, self.x + math.cos(turn_rad) * step_dist))
        self.y = max(20.0, min(340.0, self.y + math.sin(turn_rad) * step_dist))
        self._update_distance()
        trail_entry = None
        if self.pen_is_down:
            trail_entry = {
                "x1": round(old_x, 1), "y1": round(old_y, 1),
                "x2": round(self.x, 1), "y2": round(self.y, 1),
                "color": self.pen_color, "size": self.pen_size
            }
            self.pen_trails.append(trail_entry)
        self.last_action = f"curve:{direction}:{radius_cm}:{angle}"
        self.timeline.append({
            "type": "drive",
            "direction": direction.upper(),
            "speed": 60,
            "duration": 0.6,
            "fromX": round(old_x, 1), "fromY": round(old_y, 1),
            "toX": round(self.x, 1), "toY": round(self.y, 1),
            "fromHeading": round(old_h, 1), "toHeading": round(self.heading, 1),
            "heading": round(self.heading, 1),
            "distance": round(self.distance, 1),
            "trail": trail_entry,
            "action": f"Curve {direction.upper()} r:{radius_cm}cm by {angle}°"
        })
        print(f"[ROBOT] Curve {direction.upper()} r:{radius_cm}cm by {angle}° -> Pos: ({self.x:.1f}, {self.y:.1f})")

    def drive_continuous(self, direction="FORWARD", speed=75):
        spd = float(speed)
        rad = math.radians((self.heading - 90) % 360)
        dist = (spd / 100.0) * 15.0
        if direction.upper() == "BACKWARD":
            dist = -dist
        old_x, old_y = self.x, self.y
        self.x = max(20.0, min(460.0, self.x + math.cos(rad) * dist))
        self.y = max(20.0, min(340.0, self.y + math.sin(rad) * dist))
        self._update_distance()
        self.last_action = f"drive_cont:{direction}:{speed}"
        trail_entry = None
        if self.pen_is_down:
            trail_entry = {
                "x1": round(old_x, 1), "y1": round(old_y, 1),
                "x2": round(self.x, 1), "y2": round(self.y, 1),
                "color": self.pen_color, "size": self.pen_size
            }
            self.pen_trails.append(trail_entry)
        self.timeline.append({
            "type": "drive",
            "direction": direction.upper(),
            "speed": spd,
            "duration": 0.4,
            "fromX": round(old_x, 1), "fromY": round(old_y, 1),
            "toX": round(self.x, 1), "toY": round(self.y, 1),
            "heading": round(self.heading, 1),
            "distance": round(self.distance, 1),
            "trail": trail_entry,
            "action": f"Drive Continuously {direction.upper()} at {speed}%"
        })
        print(f"[ROBOT] Drive Continuously {direction.upper()} at {speed}% -> Pos: ({self.x:.1f}, {self.y:.1f})")

    def stop(self):
        self.last_action = "stop"
        self.timeline.append({
            "type": "stop",
            "x": round(self.x, 1), "y": round(self.y, 1),
            "heading": round(self.heading, 1),
            "distance": round(self.distance, 1),
            "action": "All Motors Halted ⏹"
        })
        print("[ROBOT] Stop -> All motors halted ⏹")

    def reset_position(self):
        old_x, old_y = self.x, self.y
        self.x = 240.0
        self.y = 220.0
        self.heading = 0.0
        self._update_distance()
        self.last_action = "reset_position"
        self.timeline.append({
            "type": "drive",
            "direction": "FORWARD",
            "speed": 100,
            "duration": 0.3,
            "fromX": round(old_x, 1), "fromY": round(old_y, 1),
            "toX": 240.0, "toY": 220.0,
            "fromHeading": round(self.heading, 1), "toHeading": 0.0,
            "heading": 0.0,
            "distance": round(self.distance, 1),
            "action": "Rover Position Reset to Origin (240, 220) 📍"
        })
        print("[ROBOT] Reset position to center origin (240, 220) 📍")

    def set_motors(self, left=0, right=0):
        left_spd = float(left)
        right_spd = float(right)
        avg_spd = (left_spd + right_spd) / 2.0
        turn_bias = (right_spd - left_spd) / 2.0
        old_x, old_y = self.x, self.y
        old_h = self.heading
        if abs(turn_bias) > 0.01:
            self.heading = (self.heading + turn_bias * 0.4 + 360) % 360
        rad = math.radians((self.heading - 90) % 360)
        dist = (avg_spd / 100.0) * 18.0
        self.x = max(20.0, min(460.0, self.x + math.cos(rad) * dist))
        self.y = max(20.0, min(340.0, self.y + math.sin(rad) * dist))
        self._update_distance()
        trail_entry = None
        if self.pen_is_down:
            trail_entry = {
                "x1": round(old_x, 1), "y1": round(old_y, 1),
                "x2": round(self.x, 1), "y2": round(self.y, 1),
                "color": self.pen_color, "size": self.pen_size
            }
            self.pen_trails.append(trail_entry)
        self.last_action = f"motors:{left}:{right}"
        self.timeline.append({
            "type": "drive",
            "direction": "FORWARD" if avg_spd >= 0 else "BACKWARD",
            "speed": abs(round(avg_spd, 1)),
            "duration": 0.4,
            "fromX": round(old_x, 1), "fromY": round(old_y, 1),
            "toX": round(self.x, 1), "toY": round(self.y, 1),
            "fromHeading": round(old_h, 1), "toHeading": round(self.heading, 1),
            "heading": round(self.heading, 1),
            "distance": round(self.distance, 1),
            "trail": trail_entry,
            "action": f"Tank Drive L:{left}% R:{right}% -> ({self.x:.0f}, {self.y:.0f})"
        })
        print(f"[ROBOT] Differential Drive: Left={left}%, Right={right}% -> Pos: ({self.x:.1f}, {self.y:.1f})")

    def _update_distance(self):
        rad = math.radians((self.heading - 90) % 360)
        vx = math.cos(rad)
        vy = math.sin(rad)
        border_d = 180.0
        if vx > 0.05: border_d = min(border_d, (460.0 - self.x) / vx)
        elif vx < -0.05: border_d = min(border_d, (self.x - 20.0) / -vx)
        if vy > 0.05: border_d = min(border_d, (340.0 - self.y) / vy)
        elif vy < -0.05: border_d = min(border_d, (self.y - 20.0) / -vy)
        measured = border_d
        self.distance = max(5.0, min(180.0, round(measured, 1)))

    def get_distance_cm(self):
        self._update_distance()
        print(f"[SENSOR] Ultrasonic Distance: {self.distance} cm")
        return self.distance

    def is_obstacle_near(self, threshold=20):
        self._update_distance()
        is_near = bool(self.distance <= float(threshold))
        print(f"[SENSOR] Obstacle Check (Threshold: {threshold}cm, Dist: {self.distance}cm) -> {is_near}")
        return is_near

    def get_line_raw(self, sensor="CENTER"):
        d_center_line = abs(self.y - 85.0) if self.x < 160.0 else abs(self.y - 215.0)
        val = 90.0 if d_center_line < 15.0 else 18.0
        print(f"[SENSOR] Line Raw Reflectance ({sensor}) -> {val}%")
        return val

    def check_line(self, sensor="CENTER", color="BLACK"):
        raw = self.get_line_raw(sensor)
        detected = (color.upper() == "BLACK" and raw > 50.0) or (color.upper() == "WHITE" and raw <= 50.0)
        print(f"[SENSOR] Line Detector ({sensor}, {color}) -> {detected}")
        return detected

    def get_color_sensor(self, channel="NAME"):
        if math.hypot(self.x - 240.0, self.y - 235.0) < 30.0:
            val = "emerald_green" if channel.upper() == "NAME" else 220
        elif math.hypot(self.x - 150.0, self.y - 28.0) < 30.0:
            val = "amber_orange" if channel.upper() == "NAME" else 240
        else:
            val = "mineral_gray" if channel.upper() == "NAME" else 120
        print(f"[SENSOR] Ground Color Sensor ({channel}) -> {val}")
        return val

    def is_bumper_pressed(self):
        pressed = bool(self.distance <= 7.0)
        print(f"[SENSOR] Front Bumper Switch -> {pressed}")
        return pressed

    def get_light_level(self):
        print(f"[SENSOR] Ambient Light: {self.light}%")
        return self.light

    def get_gyro(self, axis="yaw"):
        val = round(self.heading, 1)
        print(f"[SENSOR] Gyroscope ({axis}) -> {val}°")
        return val

    def reset_gyro(self):
        self.heading = 0.0
        print("[SENSOR] Gyroscope Calibrated -> 0° 🧭")

    def get_timer(self):
        elapsed = round(time.time() - self.timer_start, 2)
        print(f"[TIMER] Mission Timer: {elapsed}s ⏱️")
        return elapsed

    def reset_timer(self):
        self.timer_start = time.time()
        print("[TIMER] Mission Timer Reset to 0.0s ⏱️")

    def is_button_pressed(self, btn="A"):
        print(f"[INPUT] Button {btn} pressed -> False")
        return False

    def check_gesture(self, gesture="shake"):
        detected = (str(gesture).lower() == "shake")
        print(f"[micro:bit ACCEL] Gesture Check: '{gesture}' -> {detected}")
        return detected

    def set_servo(self, pin=1, angle=90):
        self.servos[pin] = angle
        self.last_action = f"servo:{pin}:{angle}"
        self.timeline.append({
            "type": "servo",
            "pin": int(pin),
            "angle": float(angle),
            "action": f"Servo Pin {pin} set to {angle}°"
        })
        print(f"[ACTUATOR] Servo Pin {pin} -> {angle}°")

    def set_continuous_servo(self, pin=1, speed=50):
        self.continuous_servos[pin] = speed
        self.last_action = f"cont_servo:{pin}:{speed}"
        self.timeline.append({
            "type": "servo",
            "pin": int(pin),
            "angle": float(speed),
            "action": f"Continuous Servo Pin {pin} speed {speed}%"
        })
        print(f"[ACTUATOR] Continuous Servo Pin {pin} Speed -> {speed}%")

    def digital_write(self, pin=13, value="HIGH"):
        self.pins[pin] = value
        self.last_action = f"digital:{pin}:{value}"
        self.timeline.append({
            "type": "led",
            "pin": int(pin),
            "value": str(value),
            "action": f"Digital Pin {pin} -> {value}"
        })
        print(f"[ACTUATOR] Digital Pin {pin} -> {value}")

    def set_rgb_led(self, pin=1, color="#06b6d4"):
        self.timeline.append({
            "type": "led",
            "pin": int(pin),
            "color": str(color),
            "action": f"RGB LED Pin {pin} color {color}"
        })
        print(f"[ACTUATOR] RGB LED Pin {pin} -> {color}")

    def tone(self, freq=440, duration_ms=250):
        ev = {"type": "tone", "freq": int(freq), "duration_ms": int(duration_ms)}
        self.sound_events.append(ev)
        self.timeline.append({
            "type": "tone", "freq": int(freq), "duration_ms": int(duration_ms),
            "action": f"Piezo Tone {freq}Hz ({duration_ms}ms)"
        })
        self.last_action = f"tone:{freq}:{duration_ms}"
        print(f"[BUZZER] Piezo Tone: {freq} Hz for {duration_ms} ms 🔊")

    def play_note(self, note="C4", beats=1):
        ev = {"type": "note", "note": str(note), "beats": float(beats)}
        self.sound_events.append(ev)
        self.timeline.append({
            "type": "note", "note": str(note), "beats": float(beats),
            "action": f"Musical Note {note} ({beats} beat{'s' if beats > 1 else ''})"
        })
        self.last_action = f"note:{note}:{beats}"
        print(f"[SOUND] Musical Note: {note} ({beats} beats) 🎼")

    def rest(self, beats=1):
        self.sound_events.append({"type": "rest", "beats": float(beats)})
        print(f"[SOUND] Rest: {beats} beats ⏸")

    def set_synth_wave(self, wave="square"):
        self.sound_events.append({"type": "wave", "wave": str(wave)})
        print(f"[SOUND] Synth Waveform: {wave} 🎹")

    def play_effect(self, effect="LASER"):
        ev = {"type": "effect", "effect": str(effect)}
        self.sound_events.append(ev)
        self.timeline.append({
            "type": "effect", "effect": str(effect),
            "action": f"Sound Effect: {effect} 🔊"
        })
        self.last_action = f"effect:{effect}"
        print(f"[SOUND] Acoustic Effect: {effect} 🔊")

    def stop_all_sound(self):
        self.timeline.append({"type": "stop_sound", "action": "All Synth Audio Halted 🔇"})
        print("[SOUND] Stop all sound output 🔇")

    def set_volume(self, vol=80):
        self.timeline.append({"type": "volume", "volume": int(vol), "action": f"Synth Volume {vol}% 🔈"})
        print(f"[SOUND] Synth volume: {vol}% 🔈")

    def set_tempo(self, bpm=120):
        self.timeline.append({"type": "tempo", "bpm": int(bpm), "action": f"Tempo {bpm} BPM 🎵"})
        print(f"[SOUND] Tempo: {bpm} BPM 🎵")

    def pen_down(self):
        self.pen_is_down = True
        self.last_action = "pen:down"
        print("[PEN] Pen down ✍️")

    def pen_up(self):
        self.pen_is_down = False
        self.last_action = "pen:up"
        print("[PEN] Pen up ✋")

    def set_pen_color(self, color="#06b6d4"):
        self.pen_color = str(color)
        print(f"[PEN] Pen color set: {color}")

    def set_pen_size(self, size=3):
        self.pen_size = max(1, int(size))
        print(f"[PEN] Pen size set: {size}px")

    def change_pen_size(self, delta=1):
        self.pen_size = max(1, self.pen_size + int(delta))
        print(f"[PEN] Pen size changed by {delta} -> {self.pen_size}px")

    def clear_pen(self):
        self.pen_trails = []
        self.last_action = "pen:clear"
        self.timeline.append({"type": "pen_clear", "action": "Pen trails cleared 🧹"})
        print("[PEN] Pen trails cleared 🧹")

    def collect_sample(self):
        site_name = "SAMPLE β (Ferrous Ore)" if math.hypot(self.x - 150.0, self.y - 28.0) < 40.0 else "SAMPLE α (Lithic Core)" if math.hypot(self.x - 240.0, self.y - 235.0) < 40.0 else f"Site ({self.x:.0f}, {self.y:.0f})"
        self.samples_collected.append(site_name)
        self.timeline.append({
            "type": "sample",
            "site": site_name,
            "x": round(self.x, 1), "y": round(self.y, 1),
            "action": f"Geological Sample Collected at {site_name} 🧪"
        })
        print(f"[MISSION SCIENCE] Drilled & Collected: {site_name} 🧪")

    def deploy_solar(self):
        self.solar_deployed = True
        self.battery = min(100.0, self.battery + 25.0)
        self.timeline.append({
            "type": "solar",
            "action": "Solar Panels Deployed (Battery Recharged +25%) ☀️"
        })
        print("[MISSION SCIENCE] Solar Arrays Deployed ☀️ -> Battery: 100%")

    def send_telemetry(self):
        self.timeline.append({"type": "telemetry_send", "action": "Telemetry Packet Transmitted 📡"})
        print("[DATA LOG] Telemetry stream transmitted to mission control 📡")

    def record_telemetry(self, key, val):
        self.datalog_entries.append({"key": str(key), "value": val, "time": self.get_timer()})
        self.timeline.append({"type": "telemetry", "key": str(key), "value": val, "action": f"DataLog: {key}={val} 📊"})
        print(f"[DATA LOG] Record: {key} = {val}")

    def get_battery_level(self):
        print(f"[MISSION SCIENCE] Rover Battery Level: {self.battery}% 🔋")
        return self.battery

    def get_radiation_level(self):
        rad_val = 2.8 if math.hypot(self.x - 215.0, self.y - 80.0) < 40.0 else 1.4
        self.radiation = rad_val
        print(f"[MISSION SCIENCE] Surface Radiation: {rad_val} µSv/h ☢️")
        return rad_val

    def radio_config(self, group=1):
        self.radio_group = int(group)
        print(f"[RADIO] Config group: {group} 📡")

    def radio_send(self, msg):
        self.radio_messages.append(str(msg))
        self.timeline.append({"type": "radio", "message": str(msg), "action": f"Radio TX: '{msg}' 📡"})
        print(f"[RADIO] Broadcast String: '{msg}' 📡")

    def radio_send_number(self, num):
        self.radio_messages.append(str(num))
        self.timeline.append({"type": "radio", "number": float(num), "action": f"Radio TX Num: {num} 📡"})
        print(f"[RADIO] Broadcast Number: {num} 📡")

    def radio_receive(self):
        return "ARES_BEACON_OK"

    def compass_heading(self):
        val = round(self.heading, 1)
        print(f"[COMPASS] Heading: {val}° 🧭")
        return val

    def vision_detect(self, label="obstacle"):
        detected = True
        print(f"[AI VISION] Object Recognition ('{label}') -> DETECTED (97.4%)")
        return detected

    def track_face(self, coord="X"):
        val = 150 if coord.upper() == "X" else 130
        print(f"[AI VISION] Face Track ({coord}) -> {val}")
        return val

    def detect_color(self, color="red"):
        print(f"[AI VISION] Color Identification ('{color}') -> Match found")
        return True

    def ai_classify_terrain(self, target="crater"):
        t = str(target).lower()
        if "crater" in t:
            match = math.hypot(self.x - 215.0, self.y - 80.0) < 45.0
        elif "ridge" in t or "basalt" in t:
            match = math.hypot(self.x - 55.0, self.y - 185.0) < 40.0
        elif "mineral" in t or "sample" in t:
            match = math.hypot(self.x - 150.0, self.y - 28.0) < 35.0 or math.hypot(self.x - 240.0, self.y - 235.0) < 35.0
        else:
            match = True
        print(f"[AI VISION] Terrain Classification ('{target}') -> {match}")
        return match

    def ai_read_beacon(self):
        if math.hypot(self.x - 38.0, self.y - 42.0) < 35.0: return "BASE_ALPHA"
        if math.hypot(self.x - 150.0, self.y - 28.0) < 35.0: return "SAMPLE_BETA"
        if math.hypot(self.x - 240.0, self.y - 235.0) < 35.0: return "SAMPLE_ALPHA"
        return "ARES_GLOBAL"

    def ai_object_distance(self):
        return self.distance

    def express(self, emotion="HAPPY"):
        emo = str(emotion).replace("Image.", "").upper()
        self.emotion = emo
        self.last_action = f"emotion:{emo}"
        display.current = emo
        self.timeline.append({
            "type": "emotion",
            "emotion": emo,
            "action": f"Robot Visor Face: {emo} 😊"
        })
        print(f"[EXPRESSION] Robot Visor Face: {emo} 😊")

    def jump(self, height="NORMAL", duration=0.8):
        h = str(height).upper()
        dur = float(duration)
        self.last_action = f"jump:{h}"
        self.timeline.append({
            "type": "jump",
            "height": h,
            "duration": dur,
            "action": f"Robot Jump ({h}) 🦘"
        })
        print(f"[PERFORMANCE] Robot Jump: {h} ({dur}s) 🦘")

    def dance(self, style="DISCO", duration=1.2):
        st = str(style).upper()
        dur = float(duration)
        self.last_action = f"dance:{st}"
        self.timeline.append({
            "type": "dance",
            "style": st,
            "duration": dur,
            "action": f"Robot Dance: {st} 💃"
        })
        print(f"[PERFORMANCE] Robot Choreography: {st} 💃")

    def play_beat(self, style="CHIPTUNE", beats=4):
        st = str(style).upper()
        b = int(beats)
        self.timeline.append({
            "type": "beat",
            "style": st,
            "beats": b,
            "action": f"Party Beat: {st} ({b} beats) 🎶"
        })
        print(f"[MUSIC] Party Rhythm Beat: {st} ({b} beats) 🎶")

    def sync_cue(self, cue="INTRO"):
        c = str(cue).upper()
        self.timeline.append({
            "type": "cue",
            "cue": c,
            "action": f"Synchronized Choreography Cue: [{c}] ⏱️"
        })
        print(f"[CHOREOGRAPHY] Team Sync Cue: [{c}] ⏱️")

    def formation_move(self, move="FORWARD", steps=2):
        m = str(move).upper()
        s = int(steps)
        self.timeline.append({
            "type": "formation",
            "move": m,
            "steps": s,
            "action": f"Formation Synchronized Step: {m} x{s} 👯"
        })
        print(f"[CHOREOGRAPHY] Formation Step: {m} ({s} beats) 👯")

    def speak(self, text, voice=None):
        v = str(voice) if voice else self.speech_voice
        self.speech_events.append(str(text))
        self.timeline.append({
            "type": "speech",
            "text": str(text),
            "voice": v,
            "action": f"Voice Speech ({v}): '{text}' 🗣️"
        })
        print(f"[AI SPEECH] Voice Synthesizer ({v}): '{text}' 🗣️")

    def set_voice(self, voice="Rover Pilot"):
        self.speech_voice = str(voice)
        print(f"[AI SPEECH] Voice Persona: {voice}")

    def set_pitch_rate(self, rate=1.0, pitch=1.0):
        self.speech_rate = float(rate)
        self.speech_pitch = float(pitch)
        print(f"[AI SPEECH] Rate: {rate}x, Pitch: {pitch}x")

class PenWrapper:
    def down(self): robot.pen_down()
    def up(self): robot.pen_up()
    def set_color(self, color): robot.set_pen_color(color)
    def set_size(self, size): robot.set_pen_size(size)
    def change_size(self, delta=1): robot.change_pen_size(delta)
    def clear(self): robot.clear_pen()

class SoundWrapper:
    def play_tone(self, freq=440, duration_ms=250): robot.tone(freq, duration_ms)
    def play_note(self, note="C4", beats=1): robot.play_note(note, beats)
    def play_effect(self, effect="LASER"): robot.play_effect(effect)
    def rest(self, beats=1): robot.rest(beats)
    def set_wave(self, wave="square"): robot.set_synth_wave(wave)
    def stop_all(self): robot.stop_all_sound()
    def set_volume(self, vol=80): robot.set_volume(vol)
    def set_tempo(self, bpm=120): robot.set_tempo(bpm)

class RadioWrapper:
    def config(self, group=1): robot.radio_config(group)
    def send_string(self, msg): robot.radio_send(msg)
    def send_number(self, num): robot.radio_send_number(num)
    def receive_string(self): return robot.radio_receive()

class CompassWrapper:
    def heading(self): return robot.compass_heading()
    def get_field_strength(self): return 42.5

class SpeechWrapper:
    def speak(self, text): robot.speak(text)
    def set_voice(self, voice): robot.set_voice(voice)
    def set_pitch_rate(self, rate=1.0, pitch=1.0): robot.set_pitch_rate(rate, pitch)

class DataLogWrapper:
    def record(self, key, val):
        robot.datalog_entries.append({"key": str(key), "value": val, "time": robot.get_timer()})
        robot.timeline.append({"type": "telemetry", "key": str(key), "value": val, "action": f"DataLog: {key}={val} 📊"})
        print(f"[DATA LOG] Record: {key} = {val}")
    def send(self):
        robot.timeline.append({"type": "telemetry_send", "action": "Telemetry Packet Transmitted 📡"})
        print("[DATA LOG] Telemetry stream transmitted to mission control 📡")
    def clear(self):
        robot.datalog_entries = []
        print("[DATA LOG] Telemetry log cleared 🧹")

class MicrobitWrapper:
    def temperature(self): return 22.4

class EventsManager:
    def __init__(self):
        self.handlers = {}
    def on(self, event_name, handler):
        self.handlers.setdefault(event_name, []).append(handler)
    def broadcast(self, event_name):
        print(f"[EVENT] Broadcast: '{event_name}' 📢")
        for fn in self.handlers.get(event_name, []):
            try: fn()
            except Exception as e: print(f"[EVENT ERROR] {e}")

class ImageMock:
    HAPPY = "HAPPY"
    HEART = "HEART"
    ARROW_N = "ARROW_N"
    YES = "YES"
    NO = "NO"
    def __init__(self): pass
    def __repr__(self): return "CLEAR"
    def __str__(self): return "CLEAR"

class DisplayMock:
    def __init__(self): self.current = "CLEAR"
    def show(self, icon):
        self.current = str(icon)
        robot.timeline.append({
            "type": "icon",
            "icon": str(icon),
            "action": f"micro:bit Display: {icon}"
        })
        print(f"[micro:bit 5x5 LED] Display Icon: {icon}")
    def scroll(self, text):
        self.current = str(text)
        robot.timeline.append({
            "type": "scroll",
            "text": str(text),
            "action": f"micro:bit Scroll: '{text}'"
        })
        print(f"[micro:bit 5x5 LED] Scroll Text: '{text}'")
    def clear(self):
        self.current = "CLEAR"
        robot.timeline.append({
            "type": "icon",
            "icon": "CLEAR",
            "action": "micro:bit Matrix Cleared"
        })
        print("[micro:bit 5x5 LED] Display Cleared")
    def set_pixel(self, x, y, brightness=9):
        robot.timeline.append({
            "type": "pixel",
            "x": int(x), "y": int(y), "brightness": int(brightness),
            "action": f"Plot Pixel ({x}, {y}) b:{brightness}"
        })
        print(f"[micro:bit 5x5 LED] Set Pixel ({x}, {y}) brightness {brightness}")

# Global instances
robot = RobotMock()
display = DisplayMock()
Image = ImageMock()
pen = PenWrapper()
sound = SoundWrapper()
radio = RadioWrapper()
compass = CompassWrapper()
speech = SpeechWrapper()
events = EventsManager()
datalog = DataLogWrapper()
microbit = MicrobitWrapper()
`;

async function loadPyodideAndPackages() {
  self.pyodide = await loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
  });
  await self.pyodide.runPythonAsync(ROBOTICS_RUNTIME_INIT);

  // SANDBOX HARDENING: Neutralize network & dynamic script execution capabilities in worker
  try {
    self.fetch = () => Promise.reject(new Error('Network access is disabled in the Pyodide robotics sandbox.'));
    self.XMLHttpRequest = function() { throw new Error('Network access is disabled in the Pyodide robotics sandbox.'); };
    self.WebSocket = function() { throw new Error('WebSocket connections are disabled in the Pyodide robotics sandbox.'); };
    self.importScripts = () => { throw new Error('Dynamic script imports are disabled in the Pyodide robotics sandbox.'); };
  } catch {}
}

pyodideReadyPromise = loadPyodideAndPackages();

const MAX_STDOUT_BYTES = 65536; // 64KB buffer cap to prevent memory exhaustion
const EXECUTION_TIMEOUT_MS = 5000; // 5-second CPU limit watchdog

self.onmessage = async (event) => {
  const { id, code } = event.data;
  if (!code) return;

  try {
    await pyodideReadyPromise;

    let stdOut = '';
    self.pyodide.setStdout({
      batched: (msg) => {
        if (stdOut.length < MAX_STDOUT_BYTES) {
          stdOut += msg + '\n';
          if (stdOut.length >= MAX_STDOUT_BYTES) {
            stdOut += '\n[OUTPUT TRUNCATED: 64KB sandbox buffer threshold reached]\n';
          }
        }
      }
    });

    await self.pyodide.runPythonAsync(`
robot.x = 240.0
robot.y = 220.0
robot.heading = 0.0
robot.distance = 38.0
robot.battery = 94.0
robot.radiation = 1.4
robot.solar_deployed = False
robot.pen_is_down = False
robot.emotion = "HAPPY"
display.current = "HAPPY"
robot.last_action = "running"
robot.sound_events = []
robot.speech_events = []
robot.timeline = []
robot.samples_collected = []
robot.pen_trails = []

def _kinematic_sleep(seconds):
    dur = float(seconds)
    if dur > 0.01:
        robot.timeline.append({
            "type": "wait",
            "duration": dur,
            "action": f"Pause {dur:.1f}s ⏱️"
        })
time.sleep = _kinematic_sleep

`);

    // Execute with 5-second watchdog timer race
    const executionPromise = self.pyodide.runPythonAsync(code);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Execution timed out: CPU limit exceeded (5-second watchdog limit)')), EXECUTION_TIMEOUT_MS);
    });

    const result = await Promise.race([executionPromise, timeoutPromise]);

    let telemetry = null;
    try {
      const x = self.pyodide.runPython('float(robot.x)');
      const y = self.pyodide.runPython('float(robot.y)');
      const heading = self.pyodide.runPython('float(robot.heading)');
      const distance = self.pyodide.runPython('float(robot.distance)');
      const battery = self.pyodide.runPython('float(robot.battery)');
      const radiation = self.pyodide.runPython('float(robot.radiation)');
      const solarDeployed = self.pyodide.runPython('bool(robot.solar_deployed)');
      const samplesJson = self.pyodide.runPython('import json; json.dumps(robot.samples_collected)');
      const lastAction = self.pyodide.runPython('str(robot.last_action)');
      const displayIcon = self.pyodide.runPython('str(display.current)');
      const emotion = self.pyodide.runPython('str(robot.emotion)');
      const penTrailsJson = self.pyodide.runPython('import json; json.dumps(robot.pen_trails)');
      const soundEventsJson = self.pyodide.runPython('import json; json.dumps(robot.sound_events)');
      const speechEventsJson = self.pyodide.runPython('import json; json.dumps(robot.speech_events)');
      const timelineJson = self.pyodide.runPython('import json; json.dumps(robot.timeline)');
      const penTrails = JSON.parse(penTrailsJson || '[]');
      const soundEvents = JSON.parse(soundEventsJson || '[]');
      const speechEvents = JSON.parse(speechEventsJson || '[]');
      const timeline = JSON.parse(timelineJson || '[]');
      const samplesCollected = JSON.parse(samplesJson || '[]');
      telemetry = {
        x,
        y,
        heading,
        distance,
        battery,
        radiation,
        solarDeployed,
        samplesCollected,
        lastAction,
        displayIcon,
        emotion,
        penTrails,
        soundEvents,
        speechEvents,
        timeline
      };
    } catch {}

    self.postMessage({
      id,
      success: true,
      result,
      stdOut,
      telemetry
    });
  } catch (error) {
    self.postMessage({
      id,
      success: false,
      error: error.message
    });
  }
};
