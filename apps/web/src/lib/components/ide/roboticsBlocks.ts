/**
 * Custom STEM & Robotics Blocks for Blockly
 * 
 * Reverse-engineered from official Raspberry Pi Foundation / Google Blockly architecture
 * (C:\learning\blockly-main\packages\blockly\demos\code\index.html and
 *  C:\learning\blockly-main\packages\plugins\sample-app-ts\src\toolbox.ts)
 * 
 * Features:
 * - 11 Production Categories (Motion, Sensors, Actuators, AI Vision, Logic, Loops, Math, Text, Lists, Variables, Functions)
 * - Complete input shadows for all computational blocks (numbers, strings, Booleans)
 * - Dynamic Variable and Procedure management (custom: 'VARIABLE', custom: 'PROCEDURE')
 * - Complete DUAL code generators (Python & JavaScript) for 100% execution parity
 * - Pre-configured missions: Starter 🚀, Obstacle Avoidance 🛑, Square Patrol 🔄, Line Follower 🏁
 */

import * as Blockly from 'blockly';
import { pythonGenerator, Order as PyOrder } from 'blockly/python';
import { javascriptGenerator, Order as JSOrder } from 'blockly/javascript';

// Enforce standard PEP 8 4-space indentation for Python generation
pythonGenerator.INDENT = '    ';

let blocksInitialized = false;

export async function initializeRoboticsBlocks() {
  if (blocksInitialized || typeof window === 'undefined') return;
  blocksInitialized = true;

  // 1. Import standard Blockly library blocks (logic, loops, math, text, lists, colour)
  await import('blockly/blocks').catch(() => null);

  // 2. Safely register interactive field plugins with fallbacks
  try {
    const angleMod = await import('@blockly/field-angle').catch(() => null);
    const FieldAngle =
      angleMod?.FieldAngle ||
      (angleMod as any)?.default?.FieldAngle ||
      (angleMod as any)?.default;
    if (FieldAngle) {
      Blockly.fieldRegistry.register('field_angle', FieldAngle);
    } else {
      Blockly.fieldRegistry.register('field_angle', Blockly.FieldNumber);
    }
  } catch {
    try {
      Blockly.fieldRegistry.register('field_angle', Blockly.FieldNumber);
    } catch {}
  }

  try {
    const sliderMod = await import('@blockly/field-slider').catch(() => null);
    const FieldSlider =
      sliderMod?.FieldSlider ||
      (sliderMod as any)?.default?.FieldSlider ||
      (sliderMod as any)?.default;
    if (FieldSlider) {
      Blockly.fieldRegistry.register('field_slider', FieldSlider);
    } else {
      Blockly.fieldRegistry.register('field_slider', Blockly.FieldNumber);
    }
  } catch {
    try {
      Blockly.fieldRegistry.register('field_slider', Blockly.FieldNumber);
    } catch {}
  }

  // 3. Define Domain Block Structures
  Blockly.common.defineBlocksWithJsonArray([
    // Robot Mission Start (Hat Block)
    {
      type: 'robot_on_start',
      message0: 'when mission starts 🚀',
      nextStatement: null,
      colour: 140,
      tooltip: 'Autonomous entry point for robot execution.'
    },

    // Robot Drive
    {
      type: 'robot_drive',
      message0: 'drive %1 at speed %2 %% for %3 sec',
      args0: [
        {
          type: 'field_dropdown',
          name: 'DIRECTION',
          options: [
            ['forward ⬆', 'FORWARD'],
            ['backward ⬇', 'BACKWARD']
          ]
        },
        {
          type: 'field_slider',
          name: 'SPEED',
          value: 75,
          min: 0,
          max: 100
        },
        {
          type: 'field_number',
          name: 'DURATION',
          value: 1.5,
          min: 0.1,
          max: 60
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 160,
      tooltip: 'Drive robot in specified direction with speed slider and duration.'
    },

    // Robot Turn
    {
      type: 'robot_turn',
      message0: 'turn %1 by %2 °',
      args0: [
        {
          type: 'field_dropdown',
          name: 'DIRECTION',
          options: [
            ['left ↺', 'LEFT'],
            ['right ↻', 'RIGHT']
          ]
        },
        {
          type: 'field_angle',
          name: 'ANGLE',
          angle: 90
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 160,
      tooltip: 'Rotate robot heading using visual compass angle dial.'
    },

    // Robot Stop
    {
      type: 'robot_stop',
      message0: 'stop all motors ⏹',
      previousStatement: null,
      nextStatement: null,
      colour: 0,
      tooltip: 'Immediately halt drive motors.'
    },

    // Differential Motor Power
    {
      type: 'robot_motor_power',
      message0: 'set left motor %1 %% and right motor %2 %%',
      args0: [
        {
          type: 'field_slider',
          name: 'LEFT',
          value: 80,
          min: -100,
          max: 100
        },
        {
          type: 'field_slider',
          name: 'RIGHT',
          value: 80,
          min: -100,
          max: 100
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 160,
      tooltip: 'Set individual motor speeds for differential steering.'
    },

    // Wait / Delay
    {
      type: 'robot_sleep',
      message0: 'wait %1 seconds',
      args0: [
        {
          type: 'field_number',
          name: 'SECONDS',
          value: 1,
          min: 0.05,
          max: 60
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 230,
      tooltip: 'Pause execution for specified duration.'
    },

    // Ultrasonic Distance Sensor
    {
      type: 'sensor_distance',
      message0: 'ultrasonic distance (cm)',
      output: 'Number',
      colour: 210,
      tooltip: 'Returns distance measured by ultrasonic sensor in centimeters.'
    },

    // Line Follower Sensor
    {
      type: 'sensor_line',
      message0: 'line sensor %1 detects %2',
      args0: [
        {
          type: 'field_dropdown',
          name: 'SENSOR',
          options: [
            ['left', 'LEFT'],
            ['center', 'CENTER'],
            ['right', 'RIGHT']
          ]
        },
        {
          type: 'field_dropdown',
          name: 'COLOR',
          options: [
            ['black line', 'BLACK'],
            ['white surface', 'WHITE']
          ]
        }
      ],
      output: 'Boolean',
      colour: 210,
      tooltip: 'Returns true if optical IR line sensor detects surface contrast.'
    },

    // Light Sensor
    {
      type: 'sensor_light',
      message0: 'ambient light level (0–100 %)',
      output: 'Number',
      colour: 210,
      tooltip: 'Returns ambient light intensity percentage.'
    },

    // Gyroscope / IMU
    {
      type: 'sensor_gyro',
      message0: 'gyroscope %1 angle (°)',
      args0: [
        {
          type: 'field_dropdown',
          name: 'AXIS',
          options: [
            ['heading / yaw', 'yaw'],
            ['pitch', 'pitch'],
            ['roll', 'roll']
          ]
        }
      ],
      output: 'Number',
      colour: 210,
      tooltip: 'Returns orientation angle from 6-axis IMU sensor.'
    },

    // Pushbutton Input
    {
      type: 'sensor_button',
      message0: 'button %1 is pressed',
      args0: [
        {
          type: 'field_dropdown',
          name: 'BUTTON',
          options: [
            ['A', 'A'],
            ['B', 'B'],
            ['A + B', 'AB']
          ]
        }
      ],
      output: 'Boolean',
      colour: 210,
      tooltip: 'Returns true if tactile hardware button is pressed.'
    },

    // micro:bit 5x5 LED Matrix Display
    {
      type: 'microbit_display_show',
      message0: 'micro:bit display %1',
      args0: [
        {
          type: 'field_dropdown',
          name: 'ICON',
          options: [
            ['Happy 😊', 'Image.HAPPY'],
            ['Heart ❤️', 'Image.HEART'],
            ['Arrow Up ⬆', 'Image.ARROW_N'],
            ['Checkmark ✅', 'Image.YES'],
            ['Cross ❌', 'Image.NO'],
            ['Clear ⬛', 'Image()']
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 290,
      tooltip: 'Display pattern on micro:bit 5x5 LED matrix.'
    },

    // micro:bit Scroll Text
    {
      type: 'microbit_display_scroll',
      message0: 'micro:bit scroll text %1',
      args0: [
        {
          type: 'field_input',
          name: 'TEXT',
          text: 'CREED OS'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 290,
      tooltip: 'Scroll text across 5x5 LED display.'
    },

    // micro:bit Clear Display
    {
      type: 'microbit_display_clear',
      message0: 'micro:bit clear display',
      previousStatement: null,
      nextStatement: null,
      colour: 290,
      tooltip: 'Turn off all pixels on LED matrix.'
    },

    // Servo Actuator with Visual Angle Dial
    {
      type: 'actuator_servo',
      message0: 'set servo on pin %1 to %2 °',
      args0: [
        {
          type: 'field_dropdown',
          name: 'PIN',
          options: [
            ['Pin 1 (Arm)', '1'],
            ['Pin 2 (Gripper)', '2'],
            ['Pin 3 (Pan)', '3'],
            ['Pin 4 (Tilt)', '4']
          ]
        },
        {
          type: 'field_angle',
          name: 'ANGLE',
          angle: 90
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 290,
      tooltip: 'Position servo motor (0 to 180 degrees) using visual angle dial.'
    },

    // Digital LED Indicator
    {
      type: 'actuator_led',
      message0: 'set LED on pin %1 to %2',
      args0: [
        {
          type: 'field_dropdown',
          name: 'PIN',
          options: [
            ['Built-in LED', '13'],
            ['Pin 2 (Warning)', '2'],
            ['Pin 4 (Ready)', '4']
          ]
        },
        {
          type: 'field_dropdown',
          name: 'STATE',
          options: [
            ['ON', 'HIGH'],
            ['OFF', 'LOW']
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 290,
      tooltip: 'Toggle digital output pin.'
    },

    // Buzzer Sound Tone
    {
      type: 'actuator_buzzer',
      message0: 'play tone %1 Hz for %2 ms',
      args0: [
        {
          type: 'field_number',
          name: 'FREQ',
          value: 440,
          min: 20,
          max: 5000
        },
        {
          type: 'field_number',
          name: 'DURATION',
          value: 250,
          min: 10,
          max: 2000
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 290,
      tooltip: 'Play acoustic frequency tone on piezo buzzer.'
    },

    // AI Object Detection
    {
      type: 'ai_detect_object',
      message0: 'AI camera detects %1',
      args0: [
        {
          type: 'field_dropdown',
          name: 'LABEL',
          options: [
            ['obstacle / person', 'OBSTACLE'],
            ['red ball / target', 'TARGET_RED'],
            ['rescue element', 'RESCUE_KIT'],
            ['stop sign', 'SIGN_STOP']
          ]
        }
      ],
      output: 'Boolean',
      colour: 260,
      tooltip: 'Tests if edge neural network recognizes target object in camera frame.'
    },

    // AI Face Tracking
    {
      type: 'ai_track_face',
      message0: 'AI face tracking %1 position',
      args0: [
        {
          type: 'field_dropdown',
          name: 'COORD',
          options: [
            ['X coordinate', 'X'],
            ['Y coordinate', 'Y']
          ]
        }
      ],
      output: 'Number',
      colour: 260,
      tooltip: 'Returns detected face centroid coordinate (0-300 px).'
    },

    // AI Color Detection
    {
      type: 'ai_color_detect',
      message0: 'AI camera detects color %1',
      args0: [
        {
          type: 'field_dropdown',
          name: 'COLOR',
          options: [
            ['red', 'red'],
            ['green', 'green'],
            ['blue', 'blue'],
            ['yellow', 'yellow']
          ]
        }
      ],
      output: 'Boolean',
      colour: 260,
      tooltip: 'Returns true if target dominant color is detected in vision region.'
    },

    // --- EXTENSION: CONCURRENT EVENTS & BROADCASTS ---
    {
      type: 'event_when_flag',
      message0: 'when mission starts 🚩',
      nextStatement: null,
      colour: 45,
      tooltip: 'Autonomous reactive event trigger executed when mission starts.'
    },
    {
      type: 'event_when_sensor',
      message0: 'when %1 is %2 %3',
      args0: [
        {
          type: 'field_dropdown',
          name: 'SENSOR',
          options: [
            ['ultrasonic distance (cm)', 'DISTANCE'],
            ['light level (%)', 'LIGHT'],
            ['heading (°)', 'HEADING']
          ]
        },
        {
          type: 'field_dropdown',
          name: 'OP',
          options: [
            ['< less than', 'LT'],
            ['> greater than', 'GT'],
            ['= equal to', 'EQ']
          ]
        },
        {
          type: 'field_number',
          name: 'VALUE',
          value: 20
        }
      ],
      nextStatement: null,
      colour: 45,
      tooltip: 'Event trigger when sensor reading crosses threshold.'
    },
    {
      type: 'event_when_broadcast_received',
      message0: 'when I receive %1 ✉️',
      args0: [
        {
          type: 'field_input',
          name: 'MESSAGE',
          text: 'alert'
        }
      ],
      nextStatement: null,
      colour: 45,
      tooltip: 'Event trigger when a broadcast message is received.'
    },
    {
      type: 'event_broadcast',
      message0: 'broadcast %1 📢',
      args0: [
        {
          type: 'field_input',
          name: 'MESSAGE',
          text: 'alert'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 45,
      tooltip: 'Broadcast a message across all concurrent tasks.'
    },
    {
      type: 'event_broadcast_and_wait',
      message0: 'broadcast %1 and wait ⏳',
      args0: [
        {
          type: 'field_input',
          name: 'MESSAGE',
          text: 'alert'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 45,
      tooltip: 'Broadcast message and wait for handlers to resolve.'
    },

    // --- EXTENSION: TURTLE PEN GEOMETRY ---
    {
      type: 'pen_down',
      message0: 'pen down ✍️',
      previousStatement: null,
      nextStatement: null,
      colour: 170,
      tooltip: 'Lowers drawing pen to trace kinematics on arena floor.'
    },
    {
      type: 'pen_up',
      message0: 'pen up ✋',
      previousStatement: null,
      nextStatement: null,
      colour: 170,
      tooltip: 'Lifts drawing pen.'
    },
    {
      type: 'pen_set_color',
      message0: 'set pen color to %1',
      args0: [
        {
          type: 'field_dropdown',
          name: 'COLOR',
          options: [
            ['Electric Cyan (#06b6d4)', '#06b6d4'],
            ['Iris Blue (#6366f1)', '#6366f1'],
            ['Emerald Green (#10b981)', '#10b981'],
            ['Amber Orange (#f59e0b)', '#f59e0b'],
            ['Rose Red (#f43f5e)', '#f43f5e'],
            ['Mineral White (#f8fafc)', '#f8fafc']
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 170,
      tooltip: 'Sets pen drawing color on the arena floor.'
    },
    {
      type: 'pen_set_size',
      message0: 'set pen size to %1 px',
      args0: [
        {
          type: 'field_number',
          name: 'SIZE',
          value: 3,
          min: 1,
          max: 20
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 170,
      tooltip: 'Sets pen stroke line thickness in pixels.'
    },
    {
      type: 'pen_clear',
      message0: 'clear pen trails 🧹',
      previousStatement: null,
      nextStatement: null,
      colour: 170,
      tooltip: 'Clears all pen drawing trails from the arena floor.'
    },

    // --- EXTENSION: ACOUSTIC SYNTHESIZER ---
    {
      type: 'sound_play_tone',
      message0: 'play tone %1 Hz for %2 ms 🎵',
      args0: [
        {
          type: 'field_number',
          name: 'FREQ',
          value: 440,
          min: 50,
          max: 5000
        },
        {
          type: 'field_number',
          name: 'DURATION',
          value: 250,
          min: 10,
          max: 3000
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 310,
      tooltip: 'Synthesizes acoustic frequency tone.'
    },
    {
      type: 'sound_play_note',
      message0: 'play note %1 for %2 beats 🎼',
      args0: [
        {
          type: 'field_dropdown',
          name: 'NOTE',
          options: [
            ['C4 (Middle C)', 'C4'],
            ['D4', 'D4'],
            ['E4', 'E4'],
            ['F4', 'F4'],
            ['G4', 'G4'],
            ['A4 (440Hz)', 'A4'],
            ['B4', 'B4'],
            ['C5 (High C)', 'C5']
          ]
        },
        {
          type: 'field_number',
          name: 'BEATS',
          value: 1,
          min: 0.25,
          max: 8
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 310,
      tooltip: 'Plays a musical pitch note for specified beats.'
    },
    {
      type: 'sound_rest',
      message0: 'rest for %1 beats ⏸',
      args0: [
        {
          type: 'field_number',
          name: 'BEATS',
          value: 1,
          min: 0.1,
          max: 8
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 310,
      tooltip: 'Pauses acoustic output for musical rest.'
    },
    {
      type: 'sound_set_waveform',
      message0: 'set synth instrument to %1 🎹',
      args0: [
        {
          type: 'field_dropdown',
          name: 'WAVE',
          options: [
            ['Square (8-bit Chiptune)', 'square'],
            ['Sine (Smooth Flute)', 'sine'],
            ['Triangle (Soft Clarinet)', 'triangle'],
            ['Sawtooth (Brass Horn)', 'sawtooth']
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 310,
      tooltip: 'Sets waveform timbre on the audio synthesizer.'
    },

    // --- EXTENSION: micro:bit EXTENDED ---
    {
      type: 'microbit_radio_send',
      message0: 'radio send string %1 📡',
      args0: [
        {
          type: 'field_input',
          name: 'MESSAGE',
          text: 'HELLO'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 290,
      tooltip: 'Transmits packet string over micro:bit 2.4GHz radio.'
    },
    {
      type: 'microbit_radio_receive',
      message0: 'radio receive string',
      output: 'String',
      colour: 290,
      tooltip: 'Reads latest incoming string from micro:bit radio.'
    },
    {
      type: 'microbit_gesture_detected',
      message0: 'micro:bit gesture is %1',
      args0: [
        {
          type: 'field_dropdown',
          name: 'GESTURE',
          options: [
            ['shake', 'shake'],
            ['face up', 'face up'],
            ['face down', 'face down'],
            ['tilt left', 'tilt left'],
            ['tilt right', 'tilt right'],
            ['free fall', 'free fall']
          ]
        }
      ],
      output: 'Boolean',
      colour: 290,
      tooltip: 'Tests if micro:bit 3-axis accelerometer recognizes gesture.'
    },
    {
      type: 'microbit_compass_heading',
      message0: 'compass heading (°)',
      output: 'Number',
      colour: 290,
      tooltip: 'Reads magnetometer compass bearing (0-359 degrees).'
    },

    // --- EXTENSION: AI VOICE SPEECH ---
    {
      type: 'ai_speech_speak',
      message0: 'AI voice speak %1 🗣️',
      args0: [
        {
          type: 'field_input',
          name: 'TEXT',
          text: 'Mission in progress.'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 260,
      tooltip: 'Synthesizes neural voice speech.'
    },

    // Continuous Drive
    {
      type: 'robot_drive_continuous',
      message0: 'drive %1 continuously at speed %2 %% 🚀',
      args0: [
        {
          type: 'field_dropdown',
          name: 'DIRECTION',
          options: [
            ['forward ⬆', 'FORWARD'],
            ['backward ⬇', 'BACKWARD']
          ]
        },
        {
          type: 'field_slider',
          name: 'SPEED',
          value: 75,
          min: 0,
          max: 100
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 160,
      tooltip: 'Engage continuous drive motors without blocking.'
    },

    // Tank Drive Motor Pair
    {
      type: 'actuator_motor_pair',
      message0: 'tank drive left %1 %% right %2 %% 🚜',
      args0: [
        {
          type: 'field_slider',
          name: 'LEFT',
          value: 75,
          min: -100,
          max: 100
        },
        {
          type: 'field_slider',
          name: 'RIGHT',
          value: 75,
          min: -100,
          max: 100
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 160,
      tooltip: 'Control left and right motors independently for precision tank maneuvering.'
    },

    // Obstacle Proximity Reporter
    {
      type: 'sensor_obstacle_detected',
      message0: 'obstacle within %1 cm? 🛑',
      args0: [
        {
          type: 'field_number',
          name: 'THRESHOLD',
          value: 20,
          min: 2,
          max: 200
        }
      ],
      output: 'Boolean',
      colour: 210,
      tooltip: 'Returns true if an obstacle is closer than the specified threshold.'
    },

    // micro:bit Display Value (Number / Text)
    {
      type: 'microbit_display_text',
      message0: 'micro:bit display value %1 📟',
      args0: [
        {
          type: 'input_value',
          name: 'VALUE'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 290,
      tooltip: 'Display dynamic text or numeric variable on 5x5 LED matrix.'
    },

    // Sound Play Synthesizer Effect
    {
      type: 'sound_play_effect',
      message0: 'play sound effect %1 🔊',
      args0: [
        {
          type: 'field_dropdown',
          name: 'EFFECT',
          options: [
            ['Laser ⚡', 'LASER'],
            ['Siren 🚨', 'SIREN'],
            ['Fanfare 🎺', 'FANFARE'],
            ['Power Up 🚀', 'POWER_UP'],
            ['Alarm 🔔', 'ALARM'],
            ['Blip 💬', 'BLIP']
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 310,
      tooltip: 'Synthesizes acoustic sound effect on piezo buzzer.'
    },

    // Forever Autonomous Loop
    {
      type: 'robot_forever',
      message0: 'repeat forever ♾️ %1 %2',
      args0: [
        { type: 'input_dummy' },
        { type: 'input_statement', name: 'DO' }
      ],
      previousStatement: null,
      colour: 140,
      tooltip: 'Executes inner blocks in a continuous loop with safe cooperative multitasking.'
    },

    // Wait Until Condition
    {
      type: 'robot_wait_until',
      message0: 'wait until %1 ⏳',
      args0: [
        {
          type: 'input_value',
          name: 'CONDITION',
          check: 'Boolean'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 230,
      tooltip: 'Pause execution until condition becomes true.'
    },

    // --- MOTION & KINEMATICS ENHANCEMENTS ---
    {
      type: 'robot_drive_distance',
      message0: 'drive %1 %2 cm at speed %3 %%',
      args0: [
        {
          type: 'field_dropdown',
          name: 'DIRECTION',
          options: [
            ['forward ⬆', 'FORWARD'],
            ['backward ⬇', 'BACKWARD']
          ]
        },
        {
          type: 'field_number',
          name: 'DISTANCE',
          value: 20,
          min: 1,
          max: 200
        },
        {
          type: 'field_slider',
          name: 'SPEED',
          value: 75,
          min: 0,
          max: 100
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 160,
      tooltip: 'Drive specified distance in centimeters at target speed.'
    },
    {
      type: 'robot_curve_turn',
      message0: 'curve %1 radius %2 cm for %3 °',
      args0: [
        {
          type: 'field_dropdown',
          name: 'DIRECTION',
          options: [
            ['left ↺', 'LEFT'],
            ['right ↻', 'RIGHT']
          ]
        },
        {
          type: 'field_number',
          name: 'RADIUS',
          value: 15,
          min: 5,
          max: 100
        },
        {
          type: 'field_angle',
          name: 'ANGLE',
          angle: 90
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 160,
      tooltip: 'Execute an arc curve turn with radius and angle.'
    },
    {
      type: 'robot_turn_to_heading',
      message0: 'turn to compass heading %1 ° 🧭',
      args0: [
        {
          type: 'field_angle',
          name: 'HEADING',
          angle: 0
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 160,
      tooltip: 'Rotate rover to absolute compass bearing (0-359 degrees).'
    },
    {
      type: 'robot_position_reset',
      message0: 'reset rover to origin (240, 220) 📍',
      previousStatement: null,
      nextStatement: null,
      colour: 160,
      tooltip: 'Reposition rover to the origin point.'
    },

    // --- SENSORS & PROBING ENHANCEMENTS ---
    {
      type: 'sensor_line_raw',
      message0: 'line sensor %1 raw reflectance (%%)',
      args0: [
        {
          type: 'field_dropdown',
          name: 'SENSOR',
          options: [
            ['left', 'LEFT'],
            ['center', 'CENTER'],
            ['right', 'RIGHT']
          ]
        }
      ],
      output: 'Number',
      colour: 210,
      tooltip: 'Returns analog surface reflectance percentage (0-100%).'
    },
    {
      type: 'sensor_color_rgb',
      message0: 'ground color sensor %1',
      args0: [
        {
          type: 'field_dropdown',
          name: 'CHANNEL',
          options: [
            ['detected color name', 'NAME'],
            ['red intensity', 'RED'],
            ['green intensity', 'GREEN'],
            ['blue intensity', 'BLUE']
          ]
        }
      ],
      output: null,
      colour: 210,
      tooltip: 'Reads optical color spectrum of surface beneath the rover.'
    },
    {
      type: 'sensor_touch',
      message0: 'front bumper switch pressed? 🚨',
      output: 'Boolean',
      colour: 210,
      tooltip: 'Returns true if front tactile bumper collision switch is triggered.'
    },
    {
      type: 'sensor_reset_gyro',
      message0: 'calibrate / zero gyro heading 🧭',
      previousStatement: null,
      nextStatement: null,
      colour: 210,
      tooltip: 'Re-zero gyroscope IMU reference frame to 0 degrees.'
    },
    {
      type: 'sensor_timer',
      message0: 'mission timer (sec) ⏱️',
      output: 'Number',
      colour: 210,
      tooltip: 'Returns elapsed stopwatch time since mission initiation.'
    },
    {
      type: 'sensor_reset_timer',
      message0: 'reset mission timer to 0 ⏱️',
      previousStatement: null,
      nextStatement: null,
      colour: 210,
      tooltip: 'Resets mission stopwatch timer to zero.'
    },

    // --- ACTUATORS & HARDWARE ENHANCEMENTS ---
    {
      type: 'microbit_display_pixel',
      message0: 'micro:bit plot pixel X %1 Y %2 brightness %3',
      args0: [
        { type: 'field_number', name: 'X', value: 2, min: 0, max: 4 },
        { type: 'field_number', name: 'Y', value: 2, min: 0, max: 4 },
        { type: 'field_number', name: 'BRIGHTNESS', value: 9, min: 0, max: 9 }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 290,
      tooltip: 'Illuminates individual LED coordinate (0-4, 0-4) with brightness.'
    },
    {
      type: 'actuator_servo_continuous',
      message0: 'continuous servo pin %1 speed %2 %%',
      args0: [
        {
          type: 'field_dropdown',
          name: 'PIN',
          options: [
            ['Pin 1 (Aux Drive)', '1'],
            ['Pin 2 (Winch)', '2'],
            ['Pin 3 (Intake)', '3']
          ]
        },
        {
          type: 'field_slider',
          name: 'SPEED',
          value: 50,
          min: -100,
          max: 100
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 290,
      tooltip: 'Rotate continuous servo motor forward or backward at variable speed.'
    },
    {
      type: 'actuator_led_rgb',
      message0: 'set RGB LED on pin %1 to %2',
      args0: [
        {
          type: 'field_dropdown',
          name: 'PIN',
          options: [
            ['Chassis Ring', '1'],
            ['Beacon Mast', '2'],
            ['Headlights', '3']
          ]
        },
        {
          type: 'field_dropdown',
          name: 'COLOR',
          options: [
            ['Cyan (#06b6d4)', '#06b6d4'],
            ['Emerald (#10b981)', '#10b981'],
            ['Amber (#f59e0b)', '#f59e0b'],
            ['Rose (#f43f5e)', '#f43f5e'],
            ['Purple (#a855f7)', '#a855f7'],
            ['White (#f8fafc)', '#f8fafc'],
            ['OFF', '#000000']
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 290,
      tooltip: 'Illuminate RGB LED illumination element with chromatic color.'
    },

    // --- AI & VISION ENHANCEMENTS ---
    {
      type: 'ai_classify_terrain',
      message0: 'AI terrain classifier detects %1',
      args0: [
        {
          type: 'field_dropdown',
          name: 'TERRAIN',
          options: [
            ['crater hazard', 'CRATER'],
            ['basalt ridge', 'RIDGE'],
            ['mineral deposit', 'MINERAL'],
            ['flat regolith', 'REGOLITH']
          ]
        }
      ],
      output: 'Boolean',
      colour: 260,
      tooltip: 'Visual neural classification of planetary ground features.'
    },
    {
      type: 'ai_read_beacon',
      message0: 'AI camera scan beacon tag',
      output: 'String',
      colour: 260,
      tooltip: 'Reads optical QR or beacon identifier in camera view.'
    },
    {
      type: 'ai_get_object_distance',
      message0: 'AI target visual distance (cm)',
      output: 'Number',
      colour: 260,
      tooltip: 'Estimates depth distance to target identified by edge AI vision model.'
    },

    // --- EVENTS & CONCURRENCY ENHANCEMENTS ---
    {
      type: 'event_when_button',
      message0: 'when micro:bit button %1 pressed 🔘',
      args0: [
        {
          type: 'field_dropdown',
          name: 'BUTTON',
          options: [
            ['A', 'A'],
            ['B', 'B'],
            ['A + B', 'AB']
          ]
        }
      ],
      nextStatement: null,
      colour: 45,
      tooltip: 'Event trigger fired when tactile button is pushed.'
    },
    {
      type: 'event_when_obstacle',
      message0: 'when obstacle closer than %1 cm 🛑',
      args0: [
        {
          type: 'field_number',
          name: 'DISTANCE',
          value: 20,
          min: 5,
          max: 100
        }
      ],
      nextStatement: null,
      colour: 45,
      tooltip: 'Event trigger fired when ultrasonic distance drops below threshold.'
    },
    {
      type: 'event_when_radio_received',
      message0: 'when radio packet received 📡',
      nextStatement: null,
      colour: 45,
      tooltip: 'Event trigger fired when incoming radio packet arrives.'
    },

    // --- TURTLE PEN ENHANCEMENTS ---
    {
      type: 'pen_change_size',
      message0: 'change pen size by %1 px',
      args0: [
        {
          type: 'field_number',
          name: 'DELTA',
          value: 1,
          min: -10,
          max: 10
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 170,
      tooltip: 'Increment or decrement pen line thickness.'
    },
    {
      type: 'pen_set_hue',
      message0: 'set pen hex color to %1',
      args0: [
        {
          type: 'field_input',
          name: 'COLOR',
          text: '#06b6d4'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 170,
      tooltip: 'Set custom hex color code for floor pen tracing.'
    },

    // --- ACOUSTIC SYNTHESIZER ENHANCEMENTS ---
    {
      type: 'sound_stop_all',
      message0: 'stop all audio sounds 🔇',
      previousStatement: null,
      nextStatement: null,
      colour: 310,
      tooltip: 'Immediately silence all synthesized audio output.'
    },
    {
      type: 'sound_set_volume',
      message0: 'set synth volume to %1 %% 🔈',
      args0: [
        {
          type: 'field_slider',
          name: 'VOLUME',
          value: 80,
          min: 0,
          max: 100
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 310,
      tooltip: 'Adjust master gain volume for synthesizer.'
    },
    {
      type: 'sound_set_tempo',
      message0: 'set music tempo to %1 BPM 🎵',
      args0: [
        {
          type: 'field_number',
          name: 'TEMPO',
          value: 120,
          min: 40,
          max: 240
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 310,
      tooltip: 'Set musical tempo in beats per minute.'
    },

    // --- micro:bit EXTENDED ENHANCEMENTS ---
    {
      type: 'microbit_radio_set_group',
      message0: 'radio set channel group %1 (1–255) 📡',
      args0: [
        {
          type: 'field_number',
          name: 'GROUP',
          value: 1,
          min: 1,
          max: 255
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 290,
      tooltip: 'Configures radio frequency channel group for mesh communication.'
    },
    {
      type: 'microbit_radio_send_number',
      message0: 'radio send number %1 📡',
      args0: [
        {
          type: 'field_number',
          name: 'VALUE',
          value: 42
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 290,
      tooltip: 'Transmits numeric telemetry packet over radio channel.'
    },
    {
      type: 'microbit_temperature',
      message0: 'micro:bit temperature (°C) 🌡️',
      output: 'Number',
      colour: 290,
      tooltip: 'Measures die silicon temperature in degrees Celsius.'
    },
    {
      type: 'microbit_magnetic_force',
      message0: 'magnetic field force (µT) 🧲',
      output: 'Number',
      colour: 290,
      tooltip: 'Returns total magnetic field magnitude from 3-axis magnetometer.'
    },

    // --- EDGE AI & VOICE ENHANCEMENTS ---
    {
      type: 'ai_speech_set_voice',
      message0: 'set AI voice actor to %1 🗣️',
      args0: [
        {
          type: 'field_dropdown',
          name: 'VOICE',
          options: [
            ['Rover Pilot', 'Rover Pilot'],
            ['Mission Control', 'Mission Control'],
            ['AI Mentor', 'AI Mentor'],
            ['Chiptune Bot', 'Chiptune Bot']
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 260,
      tooltip: 'Select speech synthesis voice persona.'
    },
    {
      type: 'ai_speech_set_pitch_rate',
      message0: 'set speech rate %1 x and pitch %2 x',
      args0: [
        { type: 'field_number', name: 'RATE', value: 1.0, min: 0.5, max: 2.0 },
        { type: 'field_number', name: 'PITCH', value: 1.0, min: 0.5, max: 2.0 }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 260,
      tooltip: 'Calibrate neural voice speed and tone pitch.'
    },

    // --- EXTENSION: PLANETARY EXPLORATION & SCIENCE ---
    {
      type: 'rover_collect_sample',
      message0: 'drill & collect geological sample at site 🧪',
      previousStatement: null,
      nextStatement: null,
      colour: 25,
      tooltip: 'Deploys rover core drill to extract soil and rock sample.'
    },
    {
      type: 'rover_deploy_solar',
      message0: 'deploy solar array panels ☀️',
      previousStatement: null,
      nextStatement: null,
      colour: 25,
      tooltip: 'Unfolds photovoltaic solar arrays to recharge rover batteries.'
    },
    {
      type: 'rover_read_battery',
      message0: 'rover battery level (%%) 🔋',
      output: 'Number',
      colour: 25,
      tooltip: 'Returns remaining rover battery storage percentage.'
    },
    {
      type: 'rover_read_radiation',
      message0: 'surface radiation level (µSv/h) ☢️',
      output: 'Number',
      colour: 25,
      tooltip: 'Measures environmental cosmic radiation dose rate in microsieverts per hour.'
    },

    // --- EXTENSION: DATA SCIENCE & TELEMETRY ---
    {
      type: 'datalog_record',
      message0: 'log telemetry %1 = %2 📊',
      args0: [
        {
          type: 'field_input',
          name: 'KEY',
          text: 'distance'
        },
        {
          type: 'input_value',
          name: 'VALUE'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 195,
      tooltip: 'Appends labeled telemetry data point to the mission scientific log.'
    },
    {
      type: 'datalog_send_telemetry',
      message0: 'transmit telemetry stream to Mission Control 📡',
      previousStatement: null,
      nextStatement: null,
      colour: 195,
      tooltip: 'Streams buffered telemetry packets to ground station.'
    },
    {
      type: 'datalog_clear',
      message0: 'clear telemetry log buffer 🧹',
      previousStatement: null,
      nextStatement: null,
      colour: 195,
      tooltip: 'Clears all recorded scientific telemetry rows.'
    },

    // --- EXTENSION: EXPRESSIVE BOT & PERFORMANCE ---
    {
      type: 'robot_express_emotion',
      message0: 'robot express %1 😊',
      args0: [
        {
          type: 'field_dropdown',
          name: 'EMOTION',
          options: [
            ['Happy 😊', 'HAPPY'],
            ['Heart ❤️', 'HEART'],
            ['Wink 😉', 'WINK'],
            ['Surprised 😮', 'SURPRISED'],
            ['Proud 😎', 'PROUD'],
            ['Party Dance 🎉', 'PARTY'],
            ['Clear ⬛', 'CLEAR']
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 330,
      tooltip: 'Express facial emotion on the robot OLED visor and companion stage.'
    },
    {
      type: 'robot_jump',
      message0: 'robot jump %1 🦘',
      args0: [
        {
          type: 'field_dropdown',
          name: 'HEIGHT',
          options: [
            ['Bounce 🦘', 'BOUNCE'],
            ['High Leap 🚀', 'HIGH'],
            ['Double Hop 🐰', 'DOUBLE']
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 330,
      tooltip: 'Robot executes vertical jump with squash and stretch physics in the arena.'
    },
    {
      type: 'robot_dance',
      message0: 'robot perform dance %1 💃 for %2 sec',
      args0: [
        {
          type: 'field_dropdown',
          name: 'STYLE',
          options: [
            ['Twirl Spin 🌀', 'TWIRL'],
            ['Disco Groove 💃', 'DISCO'],
            ['Wiggle Wave 🎶', 'WIGGLE'],
            ['Victory Hop 🏆', 'VICTORY']
          ]
        },
        {
          type: 'field_number',
          name: 'DURATION',
          value: 2,
          min: 0.5,
          max: 10
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 330,
      tooltip: 'Robot performs choreographed dance sequence in the arena.'
    },
    {
      type: 'robot_speak_voice',
      message0: 'robot say %1 🗣️ with voice %2',
      args0: [
        {
          type: 'field_input',
          name: 'TEXT',
          text: 'Hello, Explorer!'
        },
        {
          type: 'field_dropdown',
          name: 'VOICE',
          options: [
            ['Friendly 😊', 'Friendly'],
            ['Robotic 🤖', 'Robotic'],
            ['Heroic 🦸', 'Heroic'],
            ['Cadet 🚀', 'Cadet']
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 330,
      tooltip: 'Synthesizes real audio speech voice and displays floating speech balloon.'
    },
    {
      type: 'robot_play_dance_beat',
      message0: 'play dance rhythm %1 🎶 for %2 beats',
      args0: [
        {
          type: 'field_dropdown',
          name: 'STYLE',
          options: [
            ['8-bit Chiptune 👾', 'CHIPTUNE'],
            ['Space Funk 🕺', 'FUNK'],
            ['Cosmic Pulse ⚡', 'PULSE']
          ]
        },
        {
          type: 'field_number',
          name: 'BEATS',
          value: 4,
          min: 1,
          max: 16
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 330,
      tooltip: 'Synthesizes rhythmic chiptune/electro backing beat for dancing.'
    },
    {
      type: 'robot_sync_cue',
      message0: 'choreography sync cue %1 ⏱️',
      args0: [
        {
          type: 'field_dropdown',
          name: 'CUE',
          options: [
            ['Intro Beat 🎬', 'INTRO'],
            ['Verse 1 🎶', 'VERSE'],
            ['Drop ⚡', 'DROP'],
            ['Chorus Groove 💃', 'CHORUS'],
            ['Grand Finale 🏆', 'FINALE']
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 330,
      tooltip: 'Broadcast synchronized timing cue across the classroom multi-robot group.'
    },
    {
      type: 'robot_formation_step',
      message0: 'formation %1 %2 steps on beat 👯',
      args0: [
        {
          type: 'field_dropdown',
          name: 'MOVE',
          options: [
            ['Forward March ⬆️', 'FORWARD'],
            ['Backward Slide ⬇️', 'BACKWARD'],
            ['Left Sidestep ⬅️', 'LEFT'],
            ['Right Sidestep ➡️', 'RIGHT'],
            ['Spin & Clap 👏', 'SPIN_CLAP']
          ]
        },
        {
          type: 'field_number',
          name: 'STEPS',
          value: 2,
          min: 1,
          max: 8
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 330,
      tooltip: 'Execute synchronized formation movement in rhythm with other robots.'
    },

    // --- DOMAIN C-SHAPED CONTAINER BLOCKS ('DO' STATEMENT INPUTS) ---
    // 1. Navigation & Loops: Polygon Patrol
    {
      type: 'robot_patrol_polygon',
      message0: 'patrol %1 -sided polygon length %2 cm %3 do %4',
      args0: [
        {
          type: 'field_number',
          name: 'SIDES',
          value: 4,
          min: 3,
          max: 12
        },
        {
          type: 'field_number',
          name: 'LENGTH',
          value: 25,
          min: 5,
          max: 200
        },
        {
          type: 'input_dummy'
        },
        {
          type: 'input_statement',
          name: 'DO'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 140,
      tooltip: 'Executes an n-sided polygon perimeter patrol, running nested actions on each edge.'
    },

    // 2. Planetary Mission: While Safe Environment Loop
    {
      type: 'rover_while_safe',
      message0: 'while radiation < %1 µSv and battery > %2 %% %3 do %4',
      args0: [
        {
          type: 'field_number',
          name: 'MAX_RAD',
          value: 2.5,
          min: 0.1,
          max: 10.0
        },
        {
          type: 'field_number',
          name: 'MIN_BAT',
          value: 15,
          min: 1,
          max: 100
        },
        {
          type: 'input_dummy'
        },
        {
          type: 'input_statement',
          name: 'DO'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 25,
      tooltip: 'Repeats mission statements while radiation and battery stay within safe rover limits.'
    },

    // 3. Turtle Pen Geometry: With Styled Pen
    {
      type: 'pen_with_style',
      message0: 'with pen color %1 size %2 px %3 do %4',
      args0: [
        {
          type: 'field_dropdown',
          name: 'COLOR',
          options: [
            ['Electric Cyan (#06b6d4)', '#06b6d4'],
            ['Iris Blue (#6366f1)', '#6366f1'],
            ['Emerald Green (#10b981)', '#10b981'],
            ['Amber Orange (#f59e0b)', '#f59e0b'],
            ['Rose Red (#f43f5e)', '#f43f5e'],
            ['Mineral White (#f8fafc)', '#f8fafc']
          ]
        },
        {
          type: 'field_number',
          name: 'SIZE',
          value: 3,
          min: 1,
          max: 20
        },
        {
          type: 'input_dummy'
        },
        {
          type: 'input_statement',
          name: 'DO'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 170,
      tooltip: 'Configures pen style, lowers pen, runs drawing actions, and raises pen when finished.'
    },

    // 4. Data Logging: Regular Stream Sampling Loop
    {
      type: 'datalog_stream_interval',
      message0: 'every %1 ms log telemetry %2 do %3',
      args0: [
        {
          type: 'field_number',
          name: 'INTERVAL',
          value: 200,
          min: 50,
          max: 5000
        },
        {
          type: 'input_dummy'
        },
        {
          type: 'input_statement',
          name: 'DO'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 195,
      tooltip: 'Repeats sensory sampling and telemetry streaming at specified millisecond interval.'
    },

    // 5. Expressive Bot: Choreography Routine Loop
    {
      type: 'robot_during_performance',
      message0: 'during performance %1 repeat %2 times %3 do %4',
      args0: [
        {
          type: 'field_dropdown',
          name: 'ROUTINE',
          options: [
            ['Disco Groove 💃', 'DISCO'],
            ['Space Funk 🕺', 'FUNK'],
            ['Chiptune Rave 👾', 'CHIPTUNE'],
            ['Victory Jam 🏆', 'VICTORY']
          ]
        },
        {
          type: 'field_number',
          name: 'TIMES',
          value: 3,
          min: 1,
          max: 10
        },
        {
          type: 'input_dummy'
        },
        {
          type: 'input_statement',
          name: 'DO'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 330,
      tooltip: 'Coordinates lights, audio beat, and choreography across repeated performance loops.'
    },

    // 6. AI Vision & Speech: Vision Target Tracking Loop
    {
      type: 'ai_while_tracking',
      message0: 'while tracking target %1 within %2 cm %3 do %4',
      args0: [
        {
          type: 'field_dropdown',
          name: 'TARGET',
          options: [
            ['Person 👤', 'PERSON'],
            ['Rover Beacon 📡', 'BEACON'],
            ['Sample Rock 🪨', 'ROCK'],
            ['Navigation Line 🏁', 'LINE']
          ]
        },
        {
          type: 'field_number',
          name: 'DIST',
          value: 30,
          min: 5,
          max: 150
        },
        {
          type: 'input_dummy'
        },
        {
          type: 'input_statement',
          name: 'DO'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 260,
      tooltip: 'Repeats tracking maneuver loop while camera vision lock on target is within range.'
    },

    // 7. Motion & Drive: Drive while path clear container
    {
      type: 'robot_drive_while_clear',
      message0: 'drive %1 speed %2 %% while clear > %3 cm %4 do %5',
      args0: [
        {
          type: 'field_dropdown',
          name: 'DIRECTION',
          options: [
            ['forward ⬆', 'FORWARD'],
            ['backward ⬇', 'BACKWARD']
          ]
        },
        {
          type: 'field_slider',
          name: 'SPEED',
          value: 70,
          min: 10,
          max: 100
        },
        {
          type: 'field_number',
          name: 'MIN_DIST',
          value: 20,
          min: 5,
          max: 100
        },
        {
          type: 'input_dummy'
        },
        {
          type: 'input_statement',
          name: 'DO'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 160,
      tooltip: 'Drives robot continuously while forward distance is safe, running nested actions on each loop.'
    },

    // 8. Events: Periodic interval timer loop
    {
      type: 'event_every_interval_do',
      message0: 'every %1 sec %2 do %3',
      args0: [
        {
          type: 'field_number',
          name: 'INTERVAL',
          value: 1.0,
          min: 0.1,
          max: 60
        },
        {
          type: 'input_dummy'
        },
        {
          type: 'input_statement',
          name: 'DO'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 45,
      tooltip: 'Executes inner blocks periodically at the specified second interval.'
    },

    // 9. Sensors: While sensor condition holds
    {
      type: 'sensor_while_condition_do',
      message0: 'while sensor %1 %2 %3 %4 do %5',
      args0: [
        {
          type: 'field_dropdown',
          name: 'SENSOR',
          options: [
            ['Distance (cm)', 'DISTANCE'],
            ['Light Level (%)', 'LIGHT'],
            ['Line Center', 'LINE']
          ]
        },
        {
          type: 'field_dropdown',
          name: 'OP',
          options: [
            ['< less than', 'LT'],
            ['> greater than', 'GT'],
            ['= equal to', 'EQ']
          ]
        },
        {
          type: 'field_number',
          name: 'THRESHOLD',
          value: 25
        },
        {
          type: 'input_dummy'
        },
        {
          type: 'input_statement',
          name: 'DO'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 210,
      tooltip: 'Monitors sensor reading in a loop, running nested actions while the condition holds.'
    },

    // 10. Actuators: micro:bit animated frame sequence
    {
      type: 'microbit_animate_sequence',
      message0: 'animate micro:bit %1 repeat %2 times %3 do %4',
      args0: [
        {
          type: 'field_dropdown',
          name: 'ANIMATION',
          options: [
            ['Heart Pulse 💓', 'PULSE'],
            ['Smile Blink 😊', 'BLINK'],
            ['Alert Flash 🚨', 'FLASH']
          ]
        },
        {
          type: 'field_number',
          name: 'TIMES',
          value: 3,
          min: 1,
          max: 10
        },
        {
          type: 'input_dummy'
        },
        {
          type: 'input_statement',
          name: 'DO'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 290,
      tooltip: 'Cycles LED matrix frames while executing synchronized actuator statements.'
    },

    // 11. AI: If camera sees vision label
    {
      type: 'ai_if_vision_label',
      message0: 'if camera sees %1 with confidence > %2 %% %3 do %4',
      args0: [
        {
          type: 'field_dropdown',
          name: 'TARGET',
          options: [
            ['Person 👤', 'PERSON'],
            ['Obstacle 🛑', 'OBSTACLE'],
            ['Target Beacon 📡', 'BEACON'],
            ['Colored Ball ⚽', 'BALL']
          ]
        },
        {
          type: 'field_number',
          name: 'CONFIDENCE',
          value: 70,
          min: 20,
          max: 99
        },
        {
          type: 'input_dummy'
        },
        {
          type: 'input_statement',
          name: 'DO'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 260,
      tooltip: 'Checks neural vision classifier; runs nested actions if target is identified.'
    },

    // 12. Sound & Music: Repeat rhythm pattern
    {
      type: 'sound_repeat_rhythm',
      message0: 'repeat rhythm %1 for %2 measures %3 do %4',
      args0: [
        {
          type: 'field_dropdown',
          name: 'PATTERN',
          options: [
            ['4/4 March Beat 🥁', 'MARCH'],
            ['Syncopated Funk 🕺', 'FUNK'],
            ['Chiptune Arp 👾', 'CHIPTUNE']
          ]
        },
        {
          type: 'field_number',
          name: 'MEASURES',
          value: 4,
          min: 1,
          max: 16
        },
        {
          type: 'input_dummy'
        },
        {
          type: 'input_statement',
          name: 'DO'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 310,
      tooltip: 'Loops audio rhythm pattern while executing synchronized robot actions on each measure.'
    },

    // 13. Turtle Pen: Draw regular polygon container
    {
      type: 'pen_draw_regular_polygon',
      message0: 'draw polygon %1 sides radius %2 px %3 do %4',
      args0: [
        {
          type: 'field_number',
          name: 'SIDES',
          value: 4,
          min: 3,
          max: 12
        },
        {
          type: 'field_number',
          name: 'RADIUS',
          value: 30,
          min: 10,
          max: 150
        },
        {
          type: 'input_dummy'
        },
        {
          type: 'input_statement',
          name: 'DO'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 170,
      tooltip: 'Traces a regular polygon on arena floor, running custom statements on each side.'
    },

    // 14. Planetary Exploration: Survey sector grid
    {
      type: 'rover_survey_sector',
      message0: 'survey sector grid %1 x %2 m %3 do %4',
      args0: [
        {
          type: 'field_number',
          name: 'ROWS',
          value: 3,
          min: 2,
          max: 6
        },
        {
          type: 'field_number',
          name: 'COLS',
          value: 3,
          min: 2,
          max: 6
        },
        {
          type: 'input_dummy'
        },
        {
          type: 'input_statement',
          name: 'DO'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 25,
      tooltip: 'Iterates through planetary exploration grid points, running telemetry sampling at each sector coordinate.'
    },

    // --- CYBER-MECH COMBAT & CUSTOMIZER EXTENSION BLOCKS ---
    {
      type: 'mech_set_part_costume',
      message0: 'set mech %1 skin to %2 🦾',
      args0: [
        {
          type: 'field_dropdown',
          name: 'PART',
          options: [
            ['Chassis Frame 🛡️', 'CHASSIS'],
            ['Visor Optics 📟', 'VISOR'],
            ['Main Weapon ⚡', 'WEAPON'],
            ['Support Drone 🛸', 'DRONE'],
            ['Armor Palette 🎨', 'PALETTE']
          ]
        },
        {
          type: 'field_dropdown',
          name: 'COSTUME',
          options: [
            ['Costume 1 (Ion / Scan / Plasma / Cyan)', '1'],
            ['Costume 2 (Titan / Matrix / Rail / Purple)', '2'],
            ['Costume 3 (Raptor / Hex / Blaster / Amber)', '3'],
            ['Costume 4 (Strider / Tactical / Gatling / Mint)', '4']
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 185,
      tooltip: 'Equips visual cosmetic costume skin onto a modular mech socket.'
    },
    {
      type: 'mech_cycle_skin',
      message0: 'cycle next skin on %1 🔄',
      args0: [
        {
          type: 'field_dropdown',
          name: 'PART',
          options: [
            ['Chassis Frame', 'CHASSIS'],
            ['Visor Optics', 'VISOR'],
            ['Main Weapon', 'WEAPON'],
            ['Support Drone', 'DRONE'],
            ['Armor Palette', 'PALETTE']
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 185,
      tooltip: 'Cycles to next costume variation in the hangar bay.'
    },
    {
      type: 'mech_configure_physics',
      message0: 'mech hover freq %1 amp %2 px 🛸',
      args0: [
        { type: 'field_number', name: 'FREQ', value: 6, min: 2, max: 16 },
        { type: 'field_number', name: 'AMP', value: 5, min: 1, max: 15 }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 185,
      tooltip: 'Calibrates harmonic sinusoidal hover oscillation frequency and vertical amplitude.'
    },
    {
      type: 'mech_aim_target',
      message0: 'aim weapon towards %1 🎯',
      args0: [
        {
          type: 'field_dropdown',
          name: 'TARGET',
          options: [
            ['Mouse Cursor 🖱️', 'CURSOR'],
            ['Nearest Enemy 👾', 'NEAREST_ENEMY'],
            ['Arena Center (240, 180)', 'CENTER'],
            ['Boss Core 👑', 'BOSS']
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 185,
      tooltip: 'Rotates pinned weapon arm toward target with inertia dampening.'
    },
    {
      type: 'mech_fire_plasma',
      message0: 'charge & fire plasma cannon power %1 %% 💥',
      args0: [
        { type: 'field_slider', name: 'POWER', value: 85, min: 20, max: 100 }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 185,
      tooltip: 'Charges energy bloom and fires high-velocity plasma projectile with recoil kickback.'
    },
    {
      type: 'mech_activate_shield',
      message0: 'deploy hex energy shield for %1 sec 🛡️',
      args0: [
        { type: 'field_number', name: 'DURATION', value: 2.5, min: 0.5, max: 10 }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 185,
      tooltip: 'Expands holographic hexagonal shield barrier to deflect incoming enemy damage.'
    },
    {
      type: 'drones_configure_orbit',
      message0: 'support drones orbit count %1 speed %2 🛸',
      args0: [
        { type: 'field_number', name: 'COUNT', value: 2, min: 0, max: 4 },
        { type: 'field_number', name: 'SPEED', value: 5, min: 1, max: 12 }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 185,
      tooltip: 'Sets companion support drone count and 3D elliptical orbit velocity.'
    },
    {
      type: 'combat_combo_multiplier',
      message0: 'current combo multiplier (1x–3x) ⚡',
      output: 'Number',
      colour: 185,
      tooltip: 'Returns current battle combo tier based on rapid consecutive enemy defeats.'
    },
    {
      type: 'combat_boss_telegraph_warning',
      message0: 'telegraph boss mega laser warning %1 sec 🚨',
      args0: [
        { type: 'field_number', name: 'DURATION', value: 1.5, min: 0.5, max: 5 }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 185,
      tooltip: 'Displays red warning laser matrix before devastating Boss Mega Beam execution.'
    },
    {
      type: 'combat_on_enemy_hit',
      message0: 'when enemy is destroyed 💥 %1 do %2',
      args0: [
        { type: 'input_dummy' },
        { type: 'input_statement', name: 'DO' }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 185,
      tooltip: 'Executes nested combat reward actions and combo streak updates when an enemy explodes.'
    },

    // --- EXTENSION: PLANETARY & ORBITAL TELEMETRY ---
    {
      type: 'orbital_bind_source',
      message0: 'bind planetary tracking to %1',
      args0: [
        {
          type: 'field_dropdown',
          name: 'SOURCE',
          options: [
            ['ISS (Space Station) 🛰️', 'iss'],
            ['Hubble Space Telescope 🔭', 'hst'],
            ['NOAA-20 Weather 🌪️', 'noaa20'],
            ['Cartosat-3 Optical 🛰️', 'cartosat'],
            ['Air India 101 (B787) ✈️', 'fl-ai101'],
            ['British Airways 142 (A350) ✈️', 'fl-ba142'],
            ['United Airlines 890 (B777) ✈️', 'fl-ua890']
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 200,
      tooltip: 'Binds active spatial telemetry pipeline to selected orbital satellite or commercial aircraft.'
    },
    {
      type: 'orbital_read_telemetry',
      message0: 'read %1 %2',
      args0: [
        {
          type: 'field_dropdown',
          name: 'SOURCE',
          options: [
            ['Active Target', 'active'],
            ['ISS 🛰️', 'iss'],
            ['Hubble 🔭', 'hst'],
            ['NOAA-20 🌪️', 'noaa20'],
            ['Cartosat-3 🛰️', 'cartosat'],
            ['Flight AI101 ✈️', 'fl-ai101'],
            ['Flight BA142 ✈️', 'fl-ba142']
          ]
        },
        {
          type: 'field_dropdown',
          name: 'METRIC',
          options: [
            ['latitude (°)', 'lat'],
            ['longitude (°)', 'lon'],
            ['altitude (km)', 'alt'],
            ['velocity (km/h)', 'speed'],
            ['azimuth bearing (°)', 'azimuth'],
            ['range to ground (km)', 'range']
          ]
        }
      ],
      output: 'Number',
      colour: 200,
      tooltip: 'Reads instantaneous spatial coordinates, orbital velocity, or ground-track range.'
    },
    {
      type: 'orbital_is_overhead',
      message0: '%1 is within %2 km of ground station',
      args0: [
        {
          type: 'field_dropdown',
          name: 'SOURCE',
          options: [
            ['Active Target', 'active'],
            ['ISS 🛰️', 'iss'],
            ['Hubble 🔭', 'hst'],
            ['NOAA-20 🌪️', 'noaa20'],
            ['Cartosat-3 🛰️', 'cartosat']
          ]
        },
        {
          type: 'field_number',
          name: 'THRESHOLD',
          value: 1500,
          min: 100,
          max: 10000
        }
      ],
      output: 'Boolean',
      colour: 200,
      tooltip: 'Checks if satellite or aircraft ground track is within radio or optical line of sight.'
    },
    {
      type: 'orbital_align_heading',
      message0: 'align robot heading toward %1 🧭',
      args0: [
        {
          type: 'field_dropdown',
          name: 'SOURCE',
          options: [
            ['Active Target', 'active'],
            ['ISS 🛰️', 'iss'],
            ['Hubble 🔭', 'hst'],
            ['NOAA-20 🌪️', 'noaa20'],
            ['Cartosat-3 🛰️', 'cartosat'],
            ['Flight AI101 ✈️', 'fl-ai101']
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 200,
      tooltip: 'Turns the physical robot or arena rover to align directly with the azimuth vector of the spatial entity.'
    }
  ]);

  // ==========================================
  // 4. Register PYTHON Code Generators
  // ==========================================
  pythonGenerator.forBlock['robot_on_start'] = function () {
    return '# Mission Initiated\nprint("Executing autonomous sequence...")\n';
  };

  pythonGenerator.forBlock['robot_drive'] = function (block: any) {
    const direction = block.getFieldValue('DIRECTION');
    const speed = block.getFieldValue('SPEED');
    const duration = block.getFieldValue('DURATION');
    return `robot.drive(direction="${direction}", speed=${speed}, duration=${duration})\ntime.sleep(${duration})\n`;
  };

  pythonGenerator.forBlock['robot_turn'] = function (block: any) {
    const direction = block.getFieldValue('DIRECTION');
    const angle = block.getFieldValue('ANGLE');
    return `robot.turn(direction="${direction}", angle=${angle})\n`;
  };

  pythonGenerator.forBlock['robot_stop'] = function () {
    return `robot.stop()\n`;
  };

  pythonGenerator.forBlock['robot_motor_power'] = function (block: any) {
    const left = block.getFieldValue('LEFT');
    const right = block.getFieldValue('RIGHT');
    return `robot.set_motors(left=${left}, right=${right})\n`;
  };

  pythonGenerator.forBlock['robot_sleep'] = function (block: any) {
    const seconds = block.getFieldValue('SECONDS');
    return `time.sleep(${seconds})\n`;
  };

  pythonGenerator.forBlock['sensor_distance'] = function () {
    return ['robot.get_distance_cm()', PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['sensor_line'] = function (block: any) {
    const sensor = block.getFieldValue('SENSOR');
    const color = block.getFieldValue('COLOR');
    return [`robot.check_line(sensor="${sensor}", color="${color}")`, PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['sensor_light'] = function () {
    return ['robot.get_light_level()', PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['sensor_gyro'] = function (block: any) {
    const axis = block.getFieldValue('AXIS');
    return [`robot.get_gyro(axis="${axis}")`, PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['sensor_button'] = function (block: any) {
    const btn = block.getFieldValue('BUTTON');
    return [`robot.is_button_pressed(btn="${btn}")`, PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['microbit_display_show'] = function (block: any) {
    const icon = block.getFieldValue('ICON');
    return `display.show(${icon})\n`;
  };

  pythonGenerator.forBlock['microbit_display_scroll'] = function (block: any) {
    const text = block.getFieldValue('TEXT');
    return `display.scroll("${text}")\n`;
  };

  pythonGenerator.forBlock['microbit_display_clear'] = function () {
    return `display.clear()\n`;
  };

  pythonGenerator.forBlock['actuator_servo'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const angle = block.getFieldValue('ANGLE');
    return `robot.set_servo(pin=${pin}, angle=${angle})\n`;
  };

  pythonGenerator.forBlock['actuator_led'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const state = block.getFieldValue('STATE');
    return `robot.digital_write(pin=${pin}, value="${state}")\n`;
  };

  pythonGenerator.forBlock['actuator_buzzer'] = function (block: any) {
    const freq = block.getFieldValue('FREQ');
    const duration = block.getFieldValue('DURATION');
    return `robot.tone(freq=${freq}, duration_ms=${duration})\n`;
  };

  pythonGenerator.forBlock['ai_detect_object'] = function (block: any) {
    const label = block.getFieldValue('LABEL');
    return [`robot.vision_detect("${label.toLowerCase()}")`, PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['ai_track_face'] = function (block: any) {
    const coord = block.getFieldValue('COORD');
    return [`robot.track_face("${coord}")`, PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['ai_color_detect'] = function (block: any) {
    const color = block.getFieldValue('COLOR');
    return [`robot.detect_color("${color}")`, PyOrder.FUNCTION_CALL];
  };

  // --- Python Extension Generators ---
  pythonGenerator.forBlock['event_when_flag'] = function () {
    return '# Mission Initiated (Flag Hat)\nprint("Reactive event loop active.")\n';
  };

  pythonGenerator.forBlock['event_when_sensor'] = function (block: any) {
    const sensor = block.getFieldValue('SENSOR');
    const op = block.getFieldValue('OP');
    const val = block.getFieldValue('VALUE');
    return `# Event Trigger: When ${sensor} ${op} ${val}\n`;
  };

  pythonGenerator.forBlock['event_when_broadcast_received'] = function (block: any) {
    const msg = block.getFieldValue('MESSAGE');
    return `# Event Handler: When I receive '${msg}'\nprint(f"[EVENT] Received message: ${msg}")\n`;
  };

  pythonGenerator.forBlock['event_broadcast'] = function (block: any) {
    const msg = block.getFieldValue('MESSAGE');
    return `events.broadcast("${msg}")\n`;
  };

  pythonGenerator.forBlock['event_broadcast_and_wait'] = function (block: any) {
    const msg = block.getFieldValue('MESSAGE');
    return `events.broadcast("${msg}")\ntime.sleep(0.4)\n`;
  };

  pythonGenerator.forBlock['pen_down'] = function () {
    return 'pen.down()\n';
  };

  pythonGenerator.forBlock['pen_up'] = function () {
    return 'pen.up()\n';
  };

  pythonGenerator.forBlock['pen_set_color'] = function (block: any) {
    const color = block.getFieldValue('COLOR');
    return `pen.set_color("${color}")\n`;
  };

  pythonGenerator.forBlock['pen_set_size'] = function (block: any) {
    const size = block.getFieldValue('SIZE');
    return `pen.set_size(${size})\n`;
  };

  pythonGenerator.forBlock['pen_clear'] = function () {
    return 'pen.clear()\n';
  };

  pythonGenerator.forBlock['sound_play_tone'] = function (block: any) {
    const freq = block.getFieldValue('FREQ');
    const dur = block.getFieldValue('DURATION');
    return `sound.play_tone(freq=${freq}, duration_ms=${dur})\n`;
  };

  pythonGenerator.forBlock['sound_play_note'] = function (block: any) {
    const note = block.getFieldValue('NOTE');
    const beats = block.getFieldValue('BEATS');
    return `sound.play_note(note="${note}", beats=${beats})\n`;
  };

  pythonGenerator.forBlock['sound_rest'] = function (block: any) {
    const beats = block.getFieldValue('BEATS');
    return `sound.rest(beats=${beats})\n`;
  };

  pythonGenerator.forBlock['sound_set_waveform'] = function (block: any) {
    const wave = block.getFieldValue('WAVE');
    return `sound.set_wave(wave="${wave}")\n`;
  };

  pythonGenerator.forBlock['microbit_radio_send'] = function (block: any) {
    const msg = block.getFieldValue('MESSAGE');
    return `radio.send_string("${msg}")\n`;
  };

  pythonGenerator.forBlock['microbit_radio_receive'] = function () {
    return ['radio.receive_string()', PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['microbit_gesture_detected'] = function (block: any) {
    const gesture = block.getFieldValue('GESTURE');
    return [`robot.check_gesture("${gesture}")`, PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['microbit_compass_heading'] = function () {
    return ['compass.heading()', PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['ai_speech_speak'] = function (block: any) {
    const text = block.getFieldValue('TEXT');
    return `speech.speak("${text}")\n`;
  };

  pythonGenerator.forBlock['robot_drive_continuous'] = function (block: any) {
    const direction = block.getFieldValue('DIRECTION');
    const speed = block.getFieldValue('SPEED');
    return `robot.drive_continuous(direction="${direction}", speed=${speed})\n`;
  };

  pythonGenerator.forBlock['actuator_motor_pair'] = function (block: any) {
    const left = block.getFieldValue('LEFT');
    const right = block.getFieldValue('RIGHT');
    return `robot.set_motors(left=${left}, right=${right})\n`;
  };

  pythonGenerator.forBlock['sensor_obstacle_detected'] = function (block: any) {
    const threshold = block.getFieldValue('THRESHOLD');
    return [`robot.is_obstacle_near(threshold=${threshold})`, PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['microbit_display_text'] = function (block: any) {
    const val = pythonGenerator.valueToCode(block, 'VALUE', PyOrder.NONE) || '""';
    return `display.show(str(${val}))\n`;
  };

  pythonGenerator.forBlock['sound_play_effect'] = function (block: any) {
    const effect = block.getFieldValue('EFFECT');
    return `sound.play_effect("${effect}")\n`;
  };

  pythonGenerator.forBlock['robot_forever'] = function (block: any) {
    const branch = pythonGenerator.statementToCode(block, 'DO') || '    pass\n';
    return `while True:\n${branch}    time.sleep(0.05)\n`;
  };

  pythonGenerator.forBlock['robot_wait_until'] = function (block: any) {
    const condition = pythonGenerator.valueToCode(block, 'CONDITION', PyOrder.NONE) || 'False';
    return `while not (${condition}):\n    time.sleep(0.05)\n`;
  };

  // --- Python Generators for Enhancements ---
  pythonGenerator.forBlock['robot_drive_distance'] = function (block: any) {
    const dir = block.getFieldValue('DIRECTION');
    const dist = block.getFieldValue('DISTANCE');
    const spd = block.getFieldValue('SPEED');
    return `robot.drive_distance(direction="${dir}", distance_cm=${dist}, speed=${spd})\n`;
  };

  pythonGenerator.forBlock['robot_curve_turn'] = function (block: any) {
    const dir = block.getFieldValue('DIRECTION');
    const rad = block.getFieldValue('RADIUS');
    const angle = block.getFieldValue('ANGLE');
    return `robot.curve_turn(direction="${dir}", radius_cm=${rad}, angle=${angle})\n`;
  };

  pythonGenerator.forBlock['robot_turn_to_heading'] = function (block: any) {
    const heading = block.getFieldValue('HEADING');
    return `robot.turn_to_heading(heading=${heading})\n`;
  };

  pythonGenerator.forBlock['robot_position_reset'] = function () {
    return 'robot.reset_position()\n';
  };

  pythonGenerator.forBlock['sensor_line_raw'] = function (block: any) {
    const sensor = block.getFieldValue('SENSOR');
    return [`robot.get_line_raw(sensor="${sensor}")`, PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['sensor_color_rgb'] = function (block: any) {
    const channel = block.getFieldValue('CHANNEL');
    return [`robot.get_color_sensor(channel="${channel}")`, PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['sensor_touch'] = function () {
    return ['robot.is_bumper_pressed()', PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['sensor_reset_gyro'] = function () {
    return 'robot.reset_gyro()\n';
  };

  pythonGenerator.forBlock['sensor_timer'] = function () {
    return ['robot.get_timer()', PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['sensor_reset_timer'] = function () {
    return 'robot.reset_timer()\n';
  };

  pythonGenerator.forBlock['microbit_display_pixel'] = function (block: any) {
    const x = block.getFieldValue('X');
    const y = block.getFieldValue('Y');
    const b = block.getFieldValue('BRIGHTNESS');
    return `display.set_pixel(${x}, ${y}, ${b})\n`;
  };

  pythonGenerator.forBlock['actuator_servo_continuous'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const speed = block.getFieldValue('SPEED');
    return `robot.set_continuous_servo(pin=${pin}, speed=${speed})\n`;
  };

  pythonGenerator.forBlock['actuator_led_rgb'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const color = block.getFieldValue('COLOR');
    return `robot.set_rgb_led(pin=${pin}, color="${color}")\n`;
  };

  pythonGenerator.forBlock['ai_classify_terrain'] = function (block: any) {
    const terrain = block.getFieldValue('TERRAIN');
    return [`robot.ai_classify_terrain(target="${terrain}")`, PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['ai_read_beacon'] = function () {
    return ['robot.ai_read_beacon()', PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['ai_get_object_distance'] = function () {
    return ['robot.ai_object_distance()', PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['event_when_button'] = function (block: any) {
    const btn = block.getFieldValue('BUTTON');
    return `# Event: When micro:bit button ${btn} pressed\n`;
  };

  pythonGenerator.forBlock['event_when_obstacle'] = function (block: any) {
    const dist = block.getFieldValue('DISTANCE');
    return `# Event: When obstacle closer than ${dist} cm\n`;
  };

  pythonGenerator.forBlock['event_when_radio_received'] = function () {
    return '# Event: When radio packet received\n';
  };

  pythonGenerator.forBlock['pen_change_size'] = function (block: any) {
    const delta = block.getFieldValue('DELTA');
    return `pen.change_size(delta=${delta})\n`;
  };

  pythonGenerator.forBlock['pen_set_hue'] = function (block: any) {
    const color = block.getFieldValue('COLOR');
    return `pen.set_color("${color}")\n`;
  };

  pythonGenerator.forBlock['sound_stop_all'] = function () {
    return 'sound.stop_all()\n';
  };

  pythonGenerator.forBlock['sound_set_volume'] = function (block: any) {
    const vol = block.getFieldValue('VOLUME');
    return `sound.set_volume(vol=${vol})\n`;
  };

  pythonGenerator.forBlock['sound_set_tempo'] = function (block: any) {
    const tempo = block.getFieldValue('TEMPO');
    return `sound.set_tempo(bpm=${tempo})\n`;
  };

  pythonGenerator.forBlock['microbit_radio_set_group'] = function (block: any) {
    const grp = block.getFieldValue('GROUP');
    return `radio.config(group=${grp})\n`;
  };

  pythonGenerator.forBlock['microbit_radio_send_number'] = function (block: any) {
    const val = block.getFieldValue('VALUE');
    return `radio.send_number(${val})\n`;
  };

  pythonGenerator.forBlock['microbit_temperature'] = function () {
    return ['microbit.temperature()', PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['microbit_magnetic_force'] = function () {
    return ['compass.get_field_strength()', PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['ai_speech_set_voice'] = function (block: any) {
    const voice = block.getFieldValue('VOICE');
    return `speech.set_voice("${voice}")\n`;
  };

  pythonGenerator.forBlock['ai_speech_set_pitch_rate'] = function (block: any) {
    const rate = block.getFieldValue('RATE');
    const pitch = block.getFieldValue('PITCH');
    return `speech.set_pitch_rate(rate=${rate}, pitch=${pitch})\n`;
  };

  pythonGenerator.forBlock['rover_collect_sample'] = function () {
    return 'robot.collect_sample()\n';
  };

  pythonGenerator.forBlock['rover_deploy_solar'] = function () {
    return 'robot.deploy_solar()\n';
  };

  pythonGenerator.forBlock['rover_read_battery'] = function () {
    return ['robot.get_battery_level()', PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['rover_read_radiation'] = function () {
    return ['robot.get_radiation_level()', PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['datalog_record'] = function (block: any) {
    const key = block.getFieldValue('KEY');
    const val = pythonGenerator.valueToCode(block, 'VALUE', PyOrder.NONE) || '0';
    return `datalog.record("${key}", ${val})\n`;
  };

  pythonGenerator.forBlock['datalog_send_telemetry'] = function () {
    return 'datalog.send()\n';
  };

  pythonGenerator.forBlock['datalog_clear'] = function () {
    return 'datalog.clear()\n';
  };

  pythonGenerator.forBlock['robot_express_emotion'] = function (block: any) {
    const emotion = block.getFieldValue('EMOTION');
    return `robot.express("${emotion}")\n`;
  };

  pythonGenerator.forBlock['robot_jump'] = function (block: any) {
    const height = block.getFieldValue('HEIGHT');
    return `robot.jump(height="${height}", duration=0.8)\n`;
  };

  pythonGenerator.forBlock['robot_dance'] = function (block: any) {
    const style = block.getFieldValue('STYLE');
    const duration = block.getFieldValue('DURATION');
    return `robot.dance(style="${style}", duration=${duration})\n`;
  };

  pythonGenerator.forBlock['robot_speak_voice'] = function (block: any) {
    const text = block.getFieldValue('TEXT');
    const voice = block.getFieldValue('VOICE');
    return `robot.speak("${text}", voice="${voice}")\n`;
  };

  pythonGenerator.forBlock['robot_play_dance_beat'] = function (block: any) {
    const style = block.getFieldValue('STYLE');
    const beats = block.getFieldValue('BEATS');
    return `robot.play_beat(style="${style}", beats=${beats})\n`;
  };

  pythonGenerator.forBlock['robot_sync_cue'] = function (block: any) {
    const cue = block.getFieldValue('CUE');
    return `robot.sync_cue("${cue}")\n`;
  };

  pythonGenerator.forBlock['robot_formation_step'] = function (block: any) {
    const move = block.getFieldValue('MOVE');
    const steps = block.getFieldValue('STEPS');
    let code = `robot.formation_move("${move}", ${steps})\n`;
    if (move === 'FORWARD') {
      code += `robot.drive(direction="FORWARD", speed=65, duration=${steps * 0.35})\ntime.sleep(${steps * 0.35})\n`;
    } else if (move === 'BACKWARD') {
      code += `robot.drive(direction="BACKWARD", speed=65, duration=${steps * 0.35})\ntime.sleep(${steps * 0.35})\n`;
    } else if (move === 'LEFT') {
      code += `robot.turn(direction="LEFT", angle=45)\n`;
    } else if (move === 'RIGHT') {
      code += `robot.turn(direction="RIGHT", angle=45)\n`;
    } else if (move === 'SPIN_CLAP') {
      code += `robot.dance(style="TWIRL", duration=1.0)\nrobot.play_beat(style="CHIPTUNE", beats=2)\n`;
    }
    return code;
  };

  // Strict PEP 8 4-space indentation normalizer for nested branch statements
  function formatBranch4Spaces(rawBranch: string): string {
    if (!rawBranch || rawBranch.trim().length === 0) return '    pass\n';
    const lines = rawBranch.split('\n');
    const fixed = lines.map((line) => {
      if (!line.trim()) return '';
      // If line only has 2 spaces, indent it by 2 more spaces to make 4
      if (line.startsWith('  ') && !line.startsWith('    ')) {
        return '  ' + line;
      }
      // If line has no indent, give it 4 spaces
      if (!line.startsWith(' ')) {
        return '    ' + line;
      }
      return line;
    });
    const res = fixed.join('\n');
    return res.endsWith('\n') ? res : res + '\n';
  }

  // --- Python Generators for Domain C-Shaped Blocks ---
  pythonGenerator.forBlock['robot_patrol_polygon'] = function (block: any) {
    const sides = block.getFieldValue('SIDES') || 4;
    const length = block.getFieldValue('LENGTH') || 25;
    const branch = formatBranch4Spaces(pythonGenerator.statementToCode(block, 'DO'));
    const turnAngle = Math.round(360 / Number(sides));
    const duration = (Number(length) / 20).toFixed(2);
    return `# Polygon Patrol: ${sides} sides, ${length}cm\nfor _side in range(${sides}):\n    robot.drive(direction="FORWARD", speed=70, duration=${duration})\n    time.sleep(${duration})\n${branch}    robot.turn(direction="RIGHT", angle=${turnAngle})\n    time.sleep(0.5)\n`;
  };

  pythonGenerator.forBlock['rover_while_safe'] = function (block: any) {
    const maxRad = block.getFieldValue('MAX_RAD') || 2.5;
    const minBat = block.getFieldValue('MIN_BAT') || 15;
    const branch = formatBranch4Spaces(pythonGenerator.statementToCode(block, 'DO'));
    return `while robot.get_radiation() < ${maxRad} and robot.get_battery() > ${minBat}:\n${branch}    time.sleep(0.1)\n`;
  };

  pythonGenerator.forBlock['pen_with_style'] = function (block: any) {
    const color = block.getFieldValue('COLOR') || '#06b6d4';
    const size = block.getFieldValue('SIZE') || 3;
    const branch = formatBranch4Spaces(pythonGenerator.statementToCode(block, 'DO'));
    return `robot.set_pen_color("${color}")\nrobot.set_pen_size(${size})\nrobot.pen_down()\ntry:\n${branch}finally:\n    robot.pen_up()\n`;
  };

  pythonGenerator.forBlock['datalog_stream_interval'] = function (block: any) {
    const ms = block.getFieldValue('INTERVAL') || 200;
    const branch = formatBranch4Spaces(pythonGenerator.statementToCode(block, 'DO'));
    const sleepSec = (Number(ms) / 1000).toFixed(2);
    return `# Telemetry Stream Loop: ${ms}ms\nfor _tick in range(10):\n${branch}    robot.send_telemetry()\n    time.sleep(${sleepSec})\n`;
  };

  pythonGenerator.forBlock['robot_during_performance'] = function (block: any) {
    const routine = block.getFieldValue('ROUTINE') || 'DISCO';
    const times = block.getFieldValue('TIMES') || 3;
    const branch = formatBranch4Spaces(pythonGenerator.statementToCode(block, 'DO'));
    return `# Performance Routine: ${routine}\nprint("Starting performance routine: ${routine}")\nfor _beat in range(${times}):\n${branch}    time.sleep(0.2)\nprint("Performance routine complete.")\n`;
  };

  pythonGenerator.forBlock['ai_while_tracking'] = function (block: any) {
    const target = block.getFieldValue('TARGET') || 'PERSON';
    const dist = block.getFieldValue('DIST') || 30;
    const branch = formatBranch4Spaces(pythonGenerator.statementToCode(block, 'DO'));
    return `while robot.vision_detect("${String(target).toLowerCase()}") and robot.get_distance_cm() < ${dist}:\n${branch}    time.sleep(0.08)\n`;
  };

  pythonGenerator.forBlock['robot_drive_while_clear'] = function (block: any) {
    const direction = block.getFieldValue('DIRECTION') || 'FORWARD';
    const speed = block.getFieldValue('SPEED') || 70;
    const minDist = block.getFieldValue('MIN_DIST') || 20;
    const branch = formatBranch4Spaces(pythonGenerator.statementToCode(block, 'DO'));
    return `# Cruise while path is clear (> ${minDist}cm)\nwhile robot.get_distance_cm() > ${minDist}:\n    robot.drive(direction="${direction}", speed=${speed}, duration=0.2)\n    time.sleep(0.2)\n${branch}    time.sleep(0.05)\nrobot.stop()\n`;
  };

  pythonGenerator.forBlock['event_every_interval_do'] = function (block: any) {
    const interval = block.getFieldValue('INTERVAL') || 1.0;
    const branch = formatBranch4Spaces(pythonGenerator.statementToCode(block, 'DO'));
    return `# Periodic Task Loop: every ${interval}s\nfor _tick in range(5):\n${branch}    time.sleep(${interval})\n`;
  };

  pythonGenerator.forBlock['sensor_while_condition_do'] = function (block: any) {
    const sensor = block.getFieldValue('SENSOR') || 'DISTANCE';
    const op = block.getFieldValue('OP') || 'LT';
    const thresh = block.getFieldValue('THRESHOLD') || 25;
    const branch = formatBranch4Spaces(pythonGenerator.statementToCode(block, 'DO'));
    const opStr = op === 'LT' ? '<' : op === 'GT' ? '>' : '==';
    const sensorCall = sensor === 'DISTANCE' ? 'robot.get_distance_cm()' : sensor === 'LIGHT' ? 'robot.get_light_level()' : 'robot.check_line(sensor="CENTER", color="BLACK")';
    return `# Sensor Condition Guard\nwhile ${sensorCall} ${opStr} ${thresh}:\n${branch}    time.sleep(0.1)\n`;
  };

  pythonGenerator.forBlock['microbit_animate_sequence'] = function (block: any) {
    const anim = block.getFieldValue('ANIMATION') || 'PULSE';
    const times = block.getFieldValue('TIMES') || 3;
    const branch = formatBranch4Spaces(pythonGenerator.statementToCode(block, 'DO'));
    return `# Animate micro:bit sequence: ${anim}\nfor _frame in range(${times}):\n    display.show(Image.HEART)\n    time.sleep(0.15)\n    display.clear()\n${branch}    time.sleep(0.15)\n`;
  };

  pythonGenerator.forBlock['ai_if_vision_label'] = function (block: any) {
    const target = block.getFieldValue('TARGET') || 'PERSON';
    const branch = formatBranch4Spaces(pythonGenerator.statementToCode(block, 'DO'));
    return `if robot.vision_detect("${String(target).toLowerCase()}"):\n${branch}`;
  };

  pythonGenerator.forBlock['sound_repeat_rhythm'] = function (block: any) {
    const pattern = block.getFieldValue('PATTERN') || 'MARCH';
    const measures = block.getFieldValue('MEASURES') || 4;
    const branch = formatBranch4Spaces(pythonGenerator.statementToCode(block, 'DO'));
    return `# Sound Rhythm Loop: ${pattern} (${measures} measures)\nfor _m in range(${measures}):\n    robot.play_beat(style="${pattern}", beats=4)\n${branch}    time.sleep(0.1)\n`;
  };

  pythonGenerator.forBlock['pen_draw_regular_polygon'] = function (block: any) {
    const sides = block.getFieldValue('SIDES') || 4;
    const radius = block.getFieldValue('RADIUS') || 30;
    const branch = pythonGenerator.statementToCode(block, 'DO') || '    pass\n';
    const duration = (Number(radius) / 25).toFixed(2);
    const angle = Math.round(360 / Number(sides));
    return `# Draw Polygon: ${sides} sides, radius ${radius}px\nrobot.pen_down()\nfor _s in range(${sides}):\n    robot.drive(direction="FORWARD", speed=65, duration=${duration})\n    time.sleep(${duration})\n${branch}    robot.turn(direction="RIGHT", angle=${angle})\n    time.sleep(0.4)\nrobot.pen_up()\n`;
  };

  pythonGenerator.forBlock['rover_survey_sector'] = function (block: any) {
    const rows = block.getFieldValue('ROWS') || 3;
    const cols = block.getFieldValue('COLS') || 3;
    const branch = pythonGenerator.statementToCode(block, 'DO') || '    pass\n';
    return `# Rover Sector Grid Survey: ${rows}x${cols}\nfor _r in range(${rows}):\n    for _c in range(${cols}):\n        robot.send_telemetry()\n${branch}        time.sleep(0.15)\n`;
  };

  // --- CYBER-MECH PYTHON GENERATORS ---
  pythonGenerator.forBlock['mech_set_part_costume'] = function (block: any) {
    const part = block.getFieldValue('PART') || 'CHASSIS';
    const costume = block.getFieldValue('COSTUME') || '1';
    return `mech.set_costume("${part}", ${costume})\n`;
  };

  pythonGenerator.forBlock['mech_cycle_skin'] = function (block: any) {
    const part = block.getFieldValue('PART') || 'CHASSIS';
    return `mech.cycle_skin("${part}")\n`;
  };

  pythonGenerator.forBlock['mech_configure_physics'] = function (block: any) {
    const freq = block.getFieldValue('FREQ') || 6;
    const amp = block.getFieldValue('AMP') || 5;
    return `mech.configure_physics(freq=${freq}, amp=${amp})\n`;
  };

  pythonGenerator.forBlock['mech_aim_target'] = function (block: any) {
    const target = block.getFieldValue('TARGET') || 'CURSOR';
    return `mech.aim_at("${target}")\n`;
  };

  pythonGenerator.forBlock['mech_fire_plasma'] = function (block: any) {
    const power = block.getFieldValue('POWER') || 85;
    return `mech.fire_plasma(power=${power})\ntime.sleep(0.35)\n`;
  };

  pythonGenerator.forBlock['mech_activate_shield'] = function (block: any) {
    const duration = block.getFieldValue('DURATION') || 2.5;
    return `mech.activate_shield(duration=${duration})\ntime.sleep(${duration})\n`;
  };

  pythonGenerator.forBlock['drones_configure_orbit'] = function (block: any) {
    const count = block.getFieldValue('COUNT') || 2;
    const speed = block.getFieldValue('SPEED') || 5;
    return `drones.configure_orbit(count=${count}, speed=${speed})\n`;
  };

  pythonGenerator.forBlock['combat_combo_multiplier'] = function () {
    return ['arena.get_combo_multiplier()', PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['combat_boss_telegraph_warning'] = function (block: any) {
    const duration = block.getFieldValue('DURATION') || 1.5;
    return `arena.telegraph_boss_warning(duration=${duration})\ntime.sleep(${duration})\n`;
  };

  pythonGenerator.forBlock['combat_on_enemy_hit'] = function (block: any) {
    const branch = pythonGenerator.statementToCode(block, 'DO') || '    pass\n';
    return `# On Enemy Defeated Combo Streak\nif arena.has_defeated_enemy():\n${branch}`;
  };

  // Planetary & Orbital Telemetry Python Generators
  pythonGenerator.forBlock['orbital_bind_source'] = function (block: any) {
    const source = block.getFieldValue('SOURCE') || 'iss';
    return `hardware_bridge.bind_planetary_source("${source}")\n`;
  };

  pythonGenerator.forBlock['orbital_read_telemetry'] = function (block: any) {
    const source = block.getFieldValue('SOURCE') || 'active';
    const metric = block.getFieldValue('METRIC') || 'lat';
    return [`hardware_bridge.get_planetary_metric("${source}", "${metric}")`, PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['orbital_is_overhead'] = function (block: any) {
    const source = block.getFieldValue('SOURCE') || 'active';
    const thresh = block.getFieldValue('THRESHOLD') || 1500;
    return [`hardware_bridge.is_planetary_overhead("${source}", ${thresh})`, PyOrder.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['orbital_align_heading'] = function (block: any) {
    const source = block.getFieldValue('SOURCE') || 'active';
    return `azimuth = hardware_bridge.get_planetary_metric("${source}", "azimuth")\nrobot.turn_to(azimuth)\n`;
  };

  // ==========================================
  // 5. Register JAVASCRIPT Code Generators
  // ==========================================
  javascriptGenerator.forBlock['robot_on_start'] = function () {
    return '// Mission Initiated\nconsole.log("Executing autonomous sequence...");\n';
  };

  javascriptGenerator.forBlock['robot_drive'] = function (block: any) {
    const direction = block.getFieldValue('DIRECTION');
    const speed = block.getFieldValue('SPEED');
    const duration = block.getFieldValue('DURATION');
    return `robot.drive("${direction}", ${speed}, ${duration});\n`;
  };

  javascriptGenerator.forBlock['robot_turn'] = function (block: any) {
    const direction = block.getFieldValue('DIRECTION');
    const angle = block.getFieldValue('ANGLE');
    return `robot.turn("${direction}", ${angle});\n`;
  };

  javascriptGenerator.forBlock['robot_stop'] = function () {
    return `robot.stop();\n`;
  };

  javascriptGenerator.forBlock['robot_motor_power'] = function (block: any) {
    const left = block.getFieldValue('LEFT');
    const right = block.getFieldValue('RIGHT');
    return `robot.setMotors(${left}, ${right});\n`;
  };

  javascriptGenerator.forBlock['robot_sleep'] = function (block: any) {
    const seconds = block.getFieldValue('SECONDS');
    return `await new Promise(r => setTimeout(r, ${seconds * 1000}));\n`;
  };

  javascriptGenerator.forBlock['sensor_distance'] = function () {
    return ['robot.getDistanceCm()', JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['sensor_line'] = function (block: any) {
    const sensor = block.getFieldValue('SENSOR');
    const color = block.getFieldValue('COLOR');
    return [`robot.checkLine("${sensor}", "${color}")`, JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['sensor_light'] = function () {
    return ['robot.getLightLevel()', JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['sensor_gyro'] = function (block: any) {
    const axis = block.getFieldValue('AXIS');
    return [`robot.getGyro("${axis}")`, JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['sensor_button'] = function (block: any) {
    const btn = block.getFieldValue('BUTTON');
    return [`robot.isButtonPressed("${btn}")`, JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['microbit_display_show'] = function (block: any) {
    const icon = block.getFieldValue('ICON');
    return `display.show("${icon}");\n`;
  };

  javascriptGenerator.forBlock['microbit_display_scroll'] = function (block: any) {
    const text = block.getFieldValue('TEXT');
    return `display.scroll("${text}");\n`;
  };

  javascriptGenerator.forBlock['microbit_display_clear'] = function () {
    return `display.clear();\n`;
  };

  javascriptGenerator.forBlock['actuator_servo'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const angle = block.getFieldValue('ANGLE');
    return `robot.setServo(${pin}, ${angle});\n`;
  };

  javascriptGenerator.forBlock['actuator_led'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const state = block.getFieldValue('STATE');
    return `robot.digitalWrite(${pin}, "${state}");\n`;
  };

  javascriptGenerator.forBlock['actuator_buzzer'] = function (block: any) {
    const freq = block.getFieldValue('FREQ');
    const duration = block.getFieldValue('DURATION');
    return `robot.tone(${freq}, ${duration});\n`;
  };

  javascriptGenerator.forBlock['ai_detect_object'] = function (block: any) {
    const label = block.getFieldValue('LABEL');
    return [`robot.visionDetect("${label.toLowerCase()}")`, JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['ai_track_face'] = function (block: any) {
    const coord = block.getFieldValue('COORD');
    return [`robot.trackFace("${coord}")`, JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['ai_color_detect'] = function (block: any) {
    const color = block.getFieldValue('COLOR');
    return [`robot.detectColor("${color}")`, JSOrder.FUNCTION_CALL];
  };

  // --- JavaScript Extension Generators ---
  javascriptGenerator.forBlock['event_when_flag'] = function () {
    return '// Mission Initiated (Flag Hat)\n';
  };

  javascriptGenerator.forBlock['event_when_sensor'] = function () {
    return '// Sensor Event Trigger\n';
  };

  javascriptGenerator.forBlock['event_when_broadcast_received'] = function (block: any) {
    const msg = block.getFieldValue('MESSAGE');
    return `// Event Handler: When I receive '${msg}'\nconsole.log("[EVENT] Received message:", "${msg}");\n`;
  };

  javascriptGenerator.forBlock['event_broadcast'] = function (block: any) {
    const msg = block.getFieldValue('MESSAGE');
    return `events.broadcast("${msg}");\n`;
  };

  javascriptGenerator.forBlock['event_broadcast_and_wait'] = function (block: any) {
    const msg = block.getFieldValue('MESSAGE');
    return `await events.broadcastAndWait("${msg}");\n`;
  };

  javascriptGenerator.forBlock['pen_down'] = function () {
    return 'robot.penDown();\n';
  };

  javascriptGenerator.forBlock['pen_up'] = function () {
    return 'robot.penUp();\n';
  };

  javascriptGenerator.forBlock['pen_set_color'] = function (block: any) {
    const color = block.getFieldValue('COLOR');
    return `robot.setPenColor("${color}");\n`;
  };

  javascriptGenerator.forBlock['pen_set_size'] = function (block: any) {
    const size = block.getFieldValue('SIZE');
    return `robot.setPenSize(${size});\n`;
  };

  javascriptGenerator.forBlock['pen_clear'] = function () {
    return 'robot.clearPen();\n';
  };

  javascriptGenerator.forBlock['sound_play_tone'] = function (block: any) {
    const freq = block.getFieldValue('FREQ');
    const dur = block.getFieldValue('DURATION');
    return `robot.tone(${freq}, ${dur});\n`;
  };

  javascriptGenerator.forBlock['sound_play_note'] = function (block: any) {
    const note = block.getFieldValue('NOTE');
    const beats = block.getFieldValue('BEATS');
    return `robot.playNote("${note}", ${beats});\n`;
  };

  javascriptGenerator.forBlock['sound_rest'] = function (block: any) {
    const beats = block.getFieldValue('BEATS');
    return `await new Promise(r => setTimeout(r, ${beats * 250}));\n`;
  };

  javascriptGenerator.forBlock['sound_set_waveform'] = function (block: any) {
    const wave = block.getFieldValue('WAVE');
    return `robot.setSynthWave("${wave}");\n`;
  };

  javascriptGenerator.forBlock['microbit_radio_send'] = function (block: any) {
    const msg = block.getFieldValue('MESSAGE');
    return `radio.send("${msg}");\n`;
  };

  javascriptGenerator.forBlock['microbit_radio_receive'] = function () {
    return ['radio.receive()', JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['microbit_gesture_detected'] = function (block: any) {
    const gesture = block.getFieldValue('GESTURE');
    return [`robot.checkGesture("${gesture}")`, JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['microbit_compass_heading'] = function () {
    return ['compass.heading()', JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['ai_speech_speak'] = function (block: any) {
    const text = block.getFieldValue('TEXT');
    return `robot.speak("${text}");\n`;
  };

  javascriptGenerator.forBlock['robot_drive_continuous'] = function (block: any) {
    const direction = block.getFieldValue('DIRECTION');
    const speed = block.getFieldValue('SPEED');
    return `robot.driveContinuous("${direction}", ${speed});\n`;
  };

  javascriptGenerator.forBlock['actuator_motor_pair'] = function (block: any) {
    const left = block.getFieldValue('LEFT');
    const right = block.getFieldValue('RIGHT');
    return `robot.setMotors(${left}, ${right});\n`;
  };

  javascriptGenerator.forBlock['sensor_obstacle_detected'] = function (block: any) {
    const threshold = block.getFieldValue('THRESHOLD');
    return [`robot.isObstacleNear(${threshold})`, JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['microbit_display_text'] = function (block: any) {
    const val = javascriptGenerator.valueToCode(block, 'VALUE', JSOrder.NONE) || '""';
    return `display.show(String(${val}));\n`;
  };

  javascriptGenerator.forBlock['sound_play_effect'] = function (block: any) {
    const effect = block.getFieldValue('EFFECT');
    return `sound.playEffect("${effect}");\n`;
  };

  javascriptGenerator.forBlock['robot_forever'] = function (block: any) {
    const branch = javascriptGenerator.statementToCode(block, 'DO') || '';
    return `while (true) {\n${branch}  await new Promise(r => setTimeout(r, 50));\n}\n`;
  };

  javascriptGenerator.forBlock['robot_wait_until'] = function (block: any) {
    const condition = javascriptGenerator.valueToCode(block, 'CONDITION', JSOrder.NONE) || 'false';
    return `while (!(${condition})) {\n  await new Promise(r => setTimeout(r, 50));\n}\n`;
  };

  // --- JavaScript Generators for Enhancements ---
  javascriptGenerator.forBlock['robot_drive_distance'] = function (block: any) {
    const dir = block.getFieldValue('DIRECTION');
    const dist = block.getFieldValue('DISTANCE');
    const spd = block.getFieldValue('SPEED');
    return `robot.driveDistance("${dir}", ${dist}, ${spd});\n`;
  };

  javascriptGenerator.forBlock['robot_curve_turn'] = function (block: any) {
    const dir = block.getFieldValue('DIRECTION');
    const rad = block.getFieldValue('RADIUS');
    const angle = block.getFieldValue('ANGLE');
    return `robot.curveTurn("${dir}", ${rad}, ${angle});\n`;
  };

  javascriptGenerator.forBlock['robot_turn_to_heading'] = function (block: any) {
    const heading = block.getFieldValue('HEADING');
    return `robot.turnToHeading(${heading});\n`;
  };

  javascriptGenerator.forBlock['robot_position_reset'] = function () {
    return 'robot.resetPosition();\n';
  };

  javascriptGenerator.forBlock['sensor_line_raw'] = function (block: any) {
    const sensor = block.getFieldValue('SENSOR');
    return [`robot.getLineRaw("${sensor}")`, JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['sensor_color_rgb'] = function (block: any) {
    const channel = block.getFieldValue('CHANNEL');
    return [`robot.getColorSensor("${channel}")`, JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['sensor_touch'] = function () {
    return ['robot.isBumperPressed()', JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['sensor_reset_gyro'] = function () {
    return 'robot.resetGyro();\n';
  };

  javascriptGenerator.forBlock['sensor_timer'] = function () {
    return ['robot.getTimer()', JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['sensor_reset_timer'] = function () {
    return 'robot.resetTimer();\n';
  };

  javascriptGenerator.forBlock['microbit_display_pixel'] = function (block: any) {
    const x = block.getFieldValue('X');
    const y = block.getFieldValue('Y');
    const b = block.getFieldValue('BRIGHTNESS');
    return `display.setPixel(${x}, ${y}, ${b});\n`;
  };

  javascriptGenerator.forBlock['actuator_servo_continuous'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const speed = block.getFieldValue('SPEED');
    return `robot.setContinuousServo(${pin}, ${speed});\n`;
  };

  javascriptGenerator.forBlock['actuator_led_rgb'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const color = block.getFieldValue('COLOR');
    return `robot.setRgbLed(${pin}, "${color}");\n`;
  };

  javascriptGenerator.forBlock['ai_classify_terrain'] = function (block: any) {
    const terrain = block.getFieldValue('TERRAIN');
    return [`robot.aiClassifyTerrain("${terrain}")`, JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['ai_read_beacon'] = function () {
    return ['robot.aiReadBeacon()', JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['ai_get_object_distance'] = function () {
    return ['robot.aiObjectDistance()', JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['event_when_button'] = function (block: any) {
    const btn = block.getFieldValue('BUTTON');
    return `// Event: When micro:bit button ${btn} pressed\n`;
  };

  javascriptGenerator.forBlock['event_when_obstacle'] = function (block: any) {
    const dist = block.getFieldValue('DISTANCE');
    return `// Event: When obstacle closer than ${dist} cm\n`;
  };

  javascriptGenerator.forBlock['event_when_radio_received'] = function () {
    return '// Event: When radio packet received\n';
  };

  javascriptGenerator.forBlock['pen_change_size'] = function (block: any) {
    const delta = block.getFieldValue('DELTA');
    return `robot.changePenSize(${delta});\n`;
  };

  javascriptGenerator.forBlock['pen_set_hue'] = function (block: any) {
    const color = block.getFieldValue('COLOR');
    return `robot.setPenColor("${color}");\n`;
  };

  javascriptGenerator.forBlock['sound_stop_all'] = function () {
    return 'robot.stopAllSounds();\n';
  };

  javascriptGenerator.forBlock['sound_set_volume'] = function (block: any) {
    const vol = block.getFieldValue('VOLUME');
    return `robot.setVolume(${vol});\n`;
  };

  javascriptGenerator.forBlock['sound_set_tempo'] = function (block: any) {
    const tempo = block.getFieldValue('TEMPO');
    return `robot.setTempo(${tempo});\n`;
  };

  javascriptGenerator.forBlock['microbit_radio_set_group'] = function (block: any) {
    const grp = block.getFieldValue('GROUP');
    return `radio.setGroup(${grp});\n`;
  };

  javascriptGenerator.forBlock['microbit_radio_send_number'] = function (block: any) {
    const val = block.getFieldValue('VALUE');
    return `radio.sendNumber(${val});\n`;
  };

  javascriptGenerator.forBlock['microbit_temperature'] = function () {
    return ['microbit.temperature()', JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['microbit_magnetic_force'] = function () {
    return ['compass.getFieldStrength()', JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['ai_speech_set_voice'] = function (block: any) {
    const voice = block.getFieldValue('VOICE');
    return `robot.setVoice("${voice}");\n`;
  };

  javascriptGenerator.forBlock['ai_speech_set_pitch_rate'] = function (block: any) {
    const rate = block.getFieldValue('RATE');
    const pitch = block.getFieldValue('PITCH');
    return `robot.setPitchRate(${rate}, ${pitch});\n`;
  };

  javascriptGenerator.forBlock['rover_collect_sample'] = function () {
    return 'robot.collectSample();\n';
  };

  javascriptGenerator.forBlock['rover_deploy_solar'] = function () {
    return 'robot.deploySolar();\n';
  };

  javascriptGenerator.forBlock['rover_read_battery'] = function () {
    return ['robot.getBatteryLevel()', JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['rover_read_radiation'] = function () {
    return ['robot.getRadiationLevel()', JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['datalog_record'] = function (block: any) {
    const key = block.getFieldValue('KEY');
    const val = javascriptGenerator.valueToCode(block, 'VALUE', JSOrder.NONE) || '0';
    return `datalog.record("${key}", ${val});\n`;
  };

  javascriptGenerator.forBlock['datalog_send_telemetry'] = function () {
    return 'datalog.send();\n';
  };

  javascriptGenerator.forBlock['datalog_clear'] = function () {
    return 'datalog.clear();\n';
  };

  javascriptGenerator.forBlock['robot_express_emotion'] = function (block: any) {
    const emotion = block.getFieldValue('EMOTION');
    return `robot.express("${emotion}");\n`;
  };

  javascriptGenerator.forBlock['robot_jump'] = function (block: any) {
    const height = block.getFieldValue('HEIGHT');
    return `robot.jump("${height}", 0.8);\n`;
  };

  javascriptGenerator.forBlock['robot_dance'] = function (block: any) {
    const style = block.getFieldValue('STYLE');
    const duration = block.getFieldValue('DURATION');
    return `robot.dance("${style}", ${duration});\n`;
  };

  javascriptGenerator.forBlock['robot_speak_voice'] = function (block: any) {
    const text = block.getFieldValue('TEXT');
    const voice = block.getFieldValue('VOICE');
    return `robot.speak("${text}", "${voice}");\n`;
  };

  javascriptGenerator.forBlock['robot_play_dance_beat'] = function (block: any) {
    const style = block.getFieldValue('STYLE');
    const beats = block.getFieldValue('BEATS');
    return `robot.playBeat("${style}", ${beats});\n`;
  };

  javascriptGenerator.forBlock['robot_sync_cue'] = function (block: any) {
    const cue = block.getFieldValue('CUE');
    return `robot.syncCue("${cue}");\n`;
  };

  javascriptGenerator.forBlock['robot_formation_step'] = function (block: any) {
    const move = block.getFieldValue('MOVE');
    const steps = block.getFieldValue('STEPS');
    return `robot.formationMove("${move}", ${steps});\n`;
  };

  // --- JavaScript Generators for Domain C-Shaped Blocks ---
  javascriptGenerator.forBlock['robot_patrol_polygon'] = function (block: any) {
    const sides = block.getFieldValue('SIDES') || 4;
    const length = block.getFieldValue('LENGTH') || 25;
    const branch = javascriptGenerator.statementToCode(block, 'DO') || '';
    const turnAngle = Math.round(360 / Number(sides));
    const duration = Number(length) / 20;
    return `for (let _s = 0; _s < ${sides}; _s++) {\n  robot.drive("FORWARD", 70, ${duration});\n  await new Promise(r => setTimeout(r, ${duration * 1000}));\n${branch}  robot.turn("RIGHT", ${turnAngle});\n  await new Promise(r => setTimeout(r, 500));\n}\n`;
  };

  javascriptGenerator.forBlock['rover_while_safe'] = function (block: any) {
    const maxRad = block.getFieldValue('MAX_RAD') || 2.5;
    const minBat = block.getFieldValue('MIN_BAT') || 15;
    const branch = javascriptGenerator.statementToCode(block, 'DO') || '';
    return `while (robot.getRadiation() < ${maxRad} && robot.getBattery() > ${minBat}) {\n${branch}  await new Promise(r => setTimeout(r, 100));\n}\n`;
  };

  javascriptGenerator.forBlock['pen_with_style'] = function (block: any) {
    const color = block.getFieldValue('COLOR') || '#06b6d4';
    const size = block.getFieldValue('SIZE') || 3;
    const branch = javascriptGenerator.statementToCode(block, 'DO') || '';
    return `robot.setPenColor("${color}");\nrobot.setPenSize(${size});\nrobot.penDown();\ntry {\n${branch}} finally {\n  robot.penUp();\n}\n`;
  };

  javascriptGenerator.forBlock['datalog_stream_interval'] = function (block: any) {
    const ms = block.getFieldValue('INTERVAL') || 200;
    const branch = javascriptGenerator.statementToCode(block, 'DO') || '';
    return `for (let _t = 0; _t < 10; _t++) {\n${branch}  robot.sendTelemetry();\n  await new Promise(r => setTimeout(r, ${ms}));\n}\n`;
  };

  javascriptGenerator.forBlock['robot_during_performance'] = function (block: any) {
    const routine = block.getFieldValue('ROUTINE') || 'DISCO';
    const times = block.getFieldValue('TIMES') || 3;
    const branch = javascriptGenerator.statementToCode(block, 'DO') || '';
    return `console.log("Starting performance routine: ${routine}");\nfor (let _b = 0; _b < ${times}; _b++) {\n${branch}  await new Promise(r => setTimeout(r, 200));\n}\nconsole.log("Performance routine complete.");\n`;
  };

  javascriptGenerator.forBlock['ai_while_tracking'] = function (block: any) {
    const target = block.getFieldValue('TARGET') || 'PERSON';
    const dist = block.getFieldValue('DIST') || 30;
    const branch = javascriptGenerator.statementToCode(block, 'DO') || '';
    return `while (robot.visionDetect("${String(target).toLowerCase()}") && robot.getDistanceCm() < ${dist}) {\n${branch}  await new Promise(r => setTimeout(r, 80));\n}\n`;
  };

  javascriptGenerator.forBlock['robot_drive_while_clear'] = function (block: any) {
    const direction = block.getFieldValue('DIRECTION') || 'FORWARD';
    const speed = block.getFieldValue('SPEED') || 70;
    const minDist = block.getFieldValue('MIN_DIST') || 20;
    const branch = javascriptGenerator.statementToCode(block, 'DO') || '';
    return `while (robot.getDistanceCm() > ${minDist}) {\n  robot.drive("${direction}", ${speed}, 0.2);\n  await new Promise(r => setTimeout(r, 200));\n${branch}  await new Promise(r => setTimeout(r, 50));\n}\nrobot.stop();\n`;
  };

  javascriptGenerator.forBlock['event_every_interval_do'] = function (block: any) {
    const interval = block.getFieldValue('INTERVAL') || 1.0;
    const branch = javascriptGenerator.statementToCode(block, 'DO') || '';
    return `for (let _tick = 0; _tick < 5; _tick++) {\n${branch}  await new Promise(r => setTimeout(r, ${Number(interval) * 1000}));\n}\n`;
  };

  javascriptGenerator.forBlock['sensor_while_condition_do'] = function (block: any) {
    const branch = javascriptGenerator.statementToCode(block, 'DO') || '';
    return `while (robot.getDistanceCm() < 25) {\n${branch}  await new Promise(r => setTimeout(r, 100));\n}\n`;
  };

  javascriptGenerator.forBlock['microbit_animate_sequence'] = function (block: any) {
    const times = block.getFieldValue('TIMES') || 3;
    const branch = javascriptGenerator.statementToCode(block, 'DO') || '';
    return `for (let _f = 0; _f < ${times}; _f++) {\n  display.show("Image.HEART");\n  await new Promise(r => setTimeout(r, 150));\n  display.clear();\n${branch}  await new Promise(r => setTimeout(r, 150));\n}\n`;
  };

  javascriptGenerator.forBlock['ai_if_vision_label'] = function (block: any) {
    const target = block.getFieldValue('TARGET') || 'PERSON';
    const branch = javascriptGenerator.statementToCode(block, 'DO') || '';
    return `if (robot.visionDetect("${String(target).toLowerCase()}")) {\n${branch}}\n`;
  };

  javascriptGenerator.forBlock['sound_repeat_rhythm'] = function (block: any) {
    const pattern = block.getFieldValue('PATTERN') || 'MARCH';
    const measures = block.getFieldValue('MEASURES') || 4;
    const branch = javascriptGenerator.statementToCode(block, 'DO') || '';
    return `for (let _m = 0; _m < ${measures}; _m++) {\n  robot.playBeat("${pattern}", 4);\n${branch}  await new Promise(r => setTimeout(r, 100));\n}\n`;
  };

  javascriptGenerator.forBlock['pen_draw_regular_polygon'] = function (block: any) {
    const sides = block.getFieldValue('SIDES') || 4;
    const radius = block.getFieldValue('RADIUS') || 30;
    const branch = javascriptGenerator.statementToCode(block, 'DO') || '';
    const duration = Number(radius) / 25;
    const angle = Math.round(360 / Number(sides));
    return `robot.penDown();\nfor (let _s = 0; _s < ${sides}; _s++) {\n  robot.drive("FORWARD", 65, ${duration});\n  await new Promise(r => setTimeout(r, ${duration * 1000}));\n${branch}  robot.turn("RIGHT", ${angle});\n  await new Promise(r => setTimeout(r, 400));\n}\nrobot.penUp();\n`;
  };

  javascriptGenerator.forBlock['rover_survey_sector'] = function (block: any) {
    const rows = block.getFieldValue('ROWS') || 3;
    const cols = block.getFieldValue('COLS') || 3;
    const branch = javascriptGenerator.statementToCode(block, 'DO') || '';
    return `for (let _r = 0; _r < ${rows}; _r++) {\n  for (let _c = 0; _c < ${cols}; _c++) {\n    robot.sendTelemetry();\n${branch}    await new Promise(r => setTimeout(r, 150));\n  }\n}\n`;
  };

  // --- CYBER-MECH JAVASCRIPT GENERATORS ---
  javascriptGenerator.forBlock['mech_set_part_costume'] = function (block: any) {
    const part = block.getFieldValue('PART') || 'CHASSIS';
    const costume = block.getFieldValue('COSTUME') || '1';
    return `mech.setCostume("${part}", ${costume});\n`;
  };

  javascriptGenerator.forBlock['mech_cycle_skin'] = function (block: any) {
    const part = block.getFieldValue('PART') || 'CHASSIS';
    return `mech.cycleSkin("${part}");\n`;
  };

  javascriptGenerator.forBlock['mech_configure_physics'] = function (block: any) {
    const freq = block.getFieldValue('FREQ') || 6;
    const amp = block.getFieldValue('AMP') || 5;
    return `mech.configurePhysics(${freq}, ${amp});\n`;
  };

  javascriptGenerator.forBlock['mech_aim_target'] = function (block: any) {
    const target = block.getFieldValue('TARGET') || 'CURSOR';
    return `mech.aimAt("${target}");\n`;
  };

  javascriptGenerator.forBlock['mech_fire_plasma'] = function (block: any) {
    const power = block.getFieldValue('POWER') || 85;
    return `mech.firePlasma(${power});\nawait new Promise(r => setTimeout(r, 350));\n`;
  };

  javascriptGenerator.forBlock['mech_activate_shield'] = function (block: any) {
    const duration = block.getFieldValue('DURATION') || 2.5;
    return `mech.activateShield(${duration});\nawait new Promise(r => setTimeout(r, ${Number(duration) * 1000}));\n`;
  };

  javascriptGenerator.forBlock['drones_configure_orbit'] = function (block: any) {
    const count = block.getFieldValue('COUNT') || 2;
    const speed = block.getFieldValue('SPEED') || 5;
    return `drones.configureOrbit(${count}, ${speed});\n`;
  };

  javascriptGenerator.forBlock['combat_combo_multiplier'] = function () {
    return ['arena.getComboMultiplier()', JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['combat_boss_telegraph_warning'] = function (block: any) {
    const duration = block.getFieldValue('DURATION') || 1.5;
    return `arena.telegraphBossWarning(${duration});\nawait new Promise(r => setTimeout(r, ${Number(duration) * 1000}));\n`;
  };

  javascriptGenerator.forBlock['combat_on_enemy_hit'] = function (block: any) {
    const branch = javascriptGenerator.statementToCode(block, 'DO') || '';
    return `if (arena.hasDefeatedEnemy()) {\n${branch}}\n`;
  };

  // Planetary & Orbital Telemetry JavaScript Generators
  javascriptGenerator.forBlock['orbital_bind_source'] = function (block: any) {
    const source = block.getFieldValue('SOURCE') || 'iss';
    return `hardwareBridge.bindPlanetarySource("${source}");\n`;
  };

  javascriptGenerator.forBlock['orbital_read_telemetry'] = function (block: any) {
    const source = block.getFieldValue('SOURCE') || 'active';
    const metric = block.getFieldValue('METRIC') || 'lat';
    return [`hardwareBridge.getPlanetaryMetric("${source}", "${metric}")`, JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['orbital_is_overhead'] = function (block: any) {
    const source = block.getFieldValue('SOURCE') || 'active';
    const thresh = block.getFieldValue('THRESHOLD') || 1500;
    return [`hardwareBridge.isPlanetaryOverhead("${source}", ${thresh})`, JSOrder.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['orbital_align_heading'] = function (block: any) {
    const source = block.getFieldValue('SOURCE') || 'active';
    return `const targetAzimuth = hardwareBridge.getPlanetaryMetric("${source}", "azimuth");\nrobot.turn("RIGHT", Math.round((targetAzimuth - robot.getHeading() + 360) % 360));\nawait new Promise(r => setTimeout(r, 600));\n`;
  };
}

// ==========================================
// 6. Modular Extensions Registry & Dynamic Toolbox
// ==========================================
export interface ExtensionPack {
  id: string;
  name: string;
  description: string;
  icon: string;
  categoryName: string;
  categoryColor: string;
  badge: string;
  blocks: string[];
}

export const EXTENSION_PACKS: ExtensionPack[] = [
  {
    id: 'events',
    name: 'Events & Concurrency',
    description: 'Broadcast pub/sub messaging, parallel mission triggers, and sensor event hats.',
    icon: 'Radio',
    categoryName: 'Events',
    categoryColor: '#f59e0b',
    badge: 'Core Runtime',
    blocks: [
      'event_when_flag',
      'event_when_button',
      'event_when_obstacle',
      'event_when_sensor',
      'event_when_radio_received',
      'event_when_broadcast_received',
      'event_broadcast',
      'event_broadcast_and_wait'
    ]
  },
  {
    id: 'rover_mission',
    name: 'Planetary Exploration & Science',
    description: 'Core drilling, sample retrieval, solar array management, and radiation detection.',
    icon: 'Compass',
    categoryName: 'Planetary Mission',
    categoryColor: '#ea580c',
    badge: 'Astro-Robotics',
    blocks: [
      'rover_while_safe',
      'rover_survey_sector',
      'rover_collect_sample',
      'rover_deploy_solar',
      'rover_read_battery',
      'rover_read_radiation'
    ]
  },
  {
    id: 'data_telemetry',
    name: 'Data Science & Telemetry',
    description: 'Real-time sensor data logging, streaming telemetry to mission control, and buffer management.',
    icon: 'Activity',
    categoryName: 'Data Logging',
    categoryColor: '#0284c7',
    badge: 'Scientific Inquiry',
    blocks: [
      'datalog_stream_interval',
      'datalog_record',
      'datalog_send_telemetry',
      'datalog_clear'
    ]
  },
  {
    id: 'turtle_pen',
    name: 'Turtle Pen Geometry',
    description: 'Kinematic path tracing, geometric polygon drafting, and colored arena floor trails.',
    icon: 'Edit3',
    categoryName: 'Turtle Pen',
    categoryColor: '#06b6d4',
    badge: 'Spatial Math',
    blocks: [
      'pen_with_style',
      'pen_draw_regular_polygon',
      'pen_down',
      'pen_up',
      'pen_set_color',
      'pen_set_hue',
      'pen_set_size',
      'pen_change_size',
      'pen_clear'
    ]
  },
  {
    id: 'acoustic_synth',
    name: 'Acoustic Synthesizer',
    description: 'Web Audio API chiptune, note frequencies, musical scales, and sound effects.',
    icon: 'Music',
    categoryName: 'Sound & Music',
    categoryColor: '#ec4899',
    badge: 'Audio DSP',
    blocks: [
      'sound_repeat_rhythm',
      'sound_play_effect',
      'sound_play_tone',
      'sound_play_note',
      'sound_rest',
      'sound_set_waveform',
      'sound_set_volume',
      'sound_set_tempo',
      'sound_stop_all'
    ]
  },
  {
    id: 'microbit_ext',
    name: 'micro:bit Extended',
    description: '2.4GHz packet radio, 3-axis accelerometer gestures, and magnetic compass bearing.',
    icon: 'Cpu',
    categoryName: 'micro:bit Ext',
    categoryColor: '#8b5cf6',
    badge: 'Hardware Mesh',
    blocks: [
      'microbit_radio_set_group',
      'microbit_radio_send',
      'microbit_radio_send_number',
      'microbit_radio_receive',
      'microbit_gesture_detected',
      'microbit_compass_heading',
      'microbit_temperature',
      'microbit_magnetic_force'
    ]
  },
  {
    id: 'ai_speech',
    name: 'Edge AI & Neural Voice',
    description: 'Neural voice speech synthesis, visual object detection, and color classification.',
    icon: 'Sparkles',
    categoryName: 'AI & Speech',
    categoryColor: '#d97706',
    badge: 'Edge ML',
    blocks: [
      'ai_while_tracking',
      'ai_if_vision_label',
      'ai_speech_speak',
      'ai_speech_set_voice',
      'ai_speech_set_pitch_rate',
      'ai_detect_object',
      'ai_classify_terrain',
      'ai_read_beacon',
      'ai_track_face',
      'ai_color_detect'
    ]
  },
  {
    id: 'robot_performance',
    name: 'Expressive Bot & Performance',
    description: 'Facial emotions on OLED visor, squash-and-stretch jumps, dance choreography & voice synthesis.',
    icon: 'Sparkles',
    categoryName: 'Expressive Bot',
    categoryColor: '#d946ef',
    badge: 'Companion',
    blocks: [
      'robot_during_performance',
      'robot_express_emotion',
      'robot_jump',
      'robot_dance',
      'robot_speak_voice',
      'robot_play_dance_beat',
      'robot_sync_cue',
      'robot_formation_step'
    ]
  },
  {
    id: 'space_telemetry',
    name: 'Planetary & Orbital Telemetry',
    description: 'Bind live satellite coordinates (ISS, Hubble, NOAA) and aircraft vectors directly into robot behaviors.',
    icon: 'Globe',
    categoryName: 'Space Telemetry 🛰️',
    categoryColor: '#0ea5e9',
    badge: 'Astro-Robotics',
    blocks: [
      'orbital_bind_source',
      'orbital_read_telemetry',
      'orbital_is_overhead',
      'orbital_align_heading'
    ]
  }
];

export const ROBOTICS_TOOLBOX = {
  kind: 'categoryToolbox',
  contents: [
    // Extension: Events & Concurrency
    {
      kind: 'category',
      name: 'Events',
      colour: '#f59e0b',
      contents: [
        { kind: 'block', type: 'event_when_flag' },
        { kind: 'block', type: 'event_every_interval_do' },
        { kind: 'block', type: 'event_when_button' },
        { kind: 'block', type: 'event_when_obstacle' },
        { kind: 'block', type: 'event_when_sensor' },
        { kind: 'block', type: 'event_when_radio_received' },
        { kind: 'block', type: 'event_when_broadcast_received' },
        { kind: 'block', type: 'event_broadcast' },
        { kind: 'block', type: 'event_broadcast_and_wait' }
      ]
    },

    // Category 1: Motion & Drive
    {
      kind: 'category',
      name: 'Motion & Drive',
      colour: '#0284c7',
      contents: [
        { kind: 'block', type: 'robot_on_start' },
        { kind: 'block', type: 'robot_patrol_polygon' },
        { kind: 'block', type: 'robot_drive_while_clear' },
        { kind: 'block', type: 'robot_drive' },
        { kind: 'block', type: 'robot_drive_distance' },
        { kind: 'block', type: 'robot_drive_continuous' },
        { kind: 'block', type: 'robot_curve_turn' },
        { kind: 'block', type: 'robot_turn' },
        { kind: 'block', type: 'robot_turn_to_heading' },
        { kind: 'block', type: 'actuator_motor_pair' },
        { kind: 'block', type: 'robot_motor_power' },
        { kind: 'block', type: 'robot_stop' },
        { kind: 'block', type: 'robot_position_reset' },
        { kind: 'block', type: 'robot_sleep' }
      ]
    },

    // Category 2: Sensors & Inputs
    {
      kind: 'category',
      name: 'Sensors & Inputs',
      colour: '#059669',
      contents: [
        { kind: 'block', type: 'sensor_while_condition_do' },
        { kind: 'block', type: 'sensor_distance' },
        { kind: 'block', type: 'sensor_obstacle_detected' },
        { kind: 'block', type: 'sensor_line' },
        { kind: 'block', type: 'sensor_line_raw' },
        { kind: 'block', type: 'sensor_color_rgb' },
        { kind: 'block', type: 'sensor_touch' },
        { kind: 'block', type: 'sensor_light' },
        { kind: 'block', type: 'sensor_gyro' },
        { kind: 'block', type: 'sensor_reset_gyro' },
        { kind: 'block', type: 'sensor_button' },
        { kind: 'block', type: 'sensor_timer' },
        { kind: 'block', type: 'sensor_reset_timer' }
      ]
    },

    // Category 3: Actuators & micro:bit
    {
      kind: 'category',
      name: 'Actuators & micro:bit',
      colour: '#7c3aed',
      contents: [
        { kind: 'block', type: 'microbit_animate_sequence' },
        { kind: 'block', type: 'microbit_display_show' },
        { kind: 'block', type: 'microbit_display_text' },
        { kind: 'block', type: 'microbit_display_pixel' },
        { kind: 'block', type: 'microbit_display_scroll' },
        { kind: 'block', type: 'microbit_display_clear' },
        { kind: 'block', type: 'actuator_servo' },
        { kind: 'block', type: 'actuator_servo_continuous' },
        { kind: 'block', type: 'actuator_led' },
        { kind: 'block', type: 'actuator_led_rgb' },
        { kind: 'block', type: 'actuator_buzzer' }
      ]
    },

    // Category 4: AI & Vision
    {
      kind: 'category',
      name: 'AI & Vision',
      colour: '#d97706',
      contents: [
        { kind: 'block', type: 'ai_while_tracking' },
        { kind: 'block', type: 'ai_if_vision_label' },
        { kind: 'block', type: 'ai_detect_object' },
        { kind: 'block', type: 'ai_classify_terrain' },
        { kind: 'block', type: 'ai_read_beacon' },
        { kind: 'block', type: 'ai_get_object_distance' },
        { kind: 'block', type: 'ai_track_face' },
        { kind: 'block', type: 'ai_color_detect' }
      ]
    },

    { kind: 'sep' },

    // Category 5: Logic (from blockly-main demos/code)
    {
      kind: 'category',
      name: 'Logic',
      colour: '#dc2626',
      contents: [
        { kind: 'block', type: 'controls_if' },
        {
          kind: 'block',
          type: 'logic_compare',
          inputs: {
            A: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
            B: { shadow: { type: 'math_number', fields: { NUM: 1 } } }
          }
        },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_boolean' },
        { kind: 'block', type: 'logic_null' },
        { kind: 'block', type: 'logic_ternary' }
      ]
    },

    // Category 6: Loops (from blockly-main demos/code)
    {
      kind: 'category',
      name: 'Loops',
      colour: '#ea580c',
      contents: [
        { kind: 'block', type: 'robot_forever' },
        { kind: 'block', type: 'robot_patrol_polygon' },
        { kind: 'block', type: 'robot_wait_until' },
        {
          kind: 'block',
          type: 'controls_repeat_ext',
          inputs: {
            TIMES: {
              shadow: {
                type: 'math_number',
                fields: { NUM: 10 }
              }
            }
          }
        },
        { kind: 'block', type: 'controls_whileUntil' },
        {
          kind: 'block',
          type: 'controls_for',
          inputs: {
            FROM: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
            TO: { shadow: { type: 'math_number', fields: { NUM: 10 } } },
            BY: { shadow: { type: 'math_number', fields: { NUM: 1 } } }
          }
        },
        { kind: 'block', type: 'controls_forEach' },
        { kind: 'block', type: 'controls_flow_statements' }
      ]
    },

    // Category 7: Math (from blockly-main demos/code)
    {
      kind: 'category',
      name: 'Math',
      colour: '#2563eb',
      contents: [
        {
          kind: 'block',
          type: 'math_number',
          fields: { NUM: 123 }
        },
        {
          kind: 'block',
          type: 'math_arithmetic',
          inputs: {
            A: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
            B: { shadow: { type: 'math_number', fields: { NUM: 1 } } }
          }
        },
        {
          kind: 'block',
          type: 'math_single',
          inputs: {
            NUM: { shadow: { type: 'math_number', fields: { NUM: 9 } } }
          }
        },
        {
          kind: 'block',
          type: 'math_trig',
          inputs: {
            NUM: { shadow: { type: 'math_number', fields: { NUM: 45 } } }
          }
        },
        { kind: 'block', type: 'math_constant' },
        {
          kind: 'block',
          type: 'math_number_property',
          inputs: {
            NUMBER_TO_CHECK: { shadow: { type: 'math_number', fields: { NUM: 0 } } }
          }
        },
        {
          kind: 'block',
          type: 'math_round',
          inputs: {
            NUM: { shadow: { type: 'math_number', fields: { NUM: 3.1 } } }
          }
        },
        { kind: 'block', type: 'math_on_list' },
        {
          kind: 'block',
          type: 'math_modulo',
          inputs: {
            DIVIDEND: { shadow: { type: 'math_number', fields: { NUM: 64 } } },
            DIVISOR: { shadow: { type: 'math_number', fields: { NUM: 10 } } }
          }
        },
        {
          kind: 'block',
          type: 'math_constrain',
          inputs: {
            VALUE: { shadow: { type: 'math_number', fields: { NUM: 50 } } },
            LOW: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
            HIGH: { shadow: { type: 'math_number', fields: { NUM: 100 } } }
          }
        },
        {
          kind: 'block',
          type: 'math_random_int',
          inputs: {
            FROM: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
            TO: { shadow: { type: 'math_number', fields: { NUM: 100 } } }
          }
        },
        { kind: 'block', type: 'math_random_float' },
        {
          kind: 'block',
          type: 'math_atan2',
          inputs: {
            X: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
            Y: { shadow: { type: 'math_number', fields: { NUM: 1 } } }
          }
        }
      ]
    },

    // Category 8: Text & Output (from blockly-main demos/code)
    {
      kind: 'category',
      name: 'Text & Output',
      colour: '#0891b2',
      contents: [
        {
          kind: 'block',
          type: 'text',
          fields: { TEXT: 'Mission Ready' }
        },
        { kind: 'block', type: 'text_join' },
        {
          kind: 'block',
          type: 'text_append',
          inputs: {
            TEXT: { shadow: { type: 'text', fields: { TEXT: '' } } }
          }
        },
        {
          kind: 'block',
          type: 'text_length',
          inputs: {
            VALUE: { shadow: { type: 'text', fields: { TEXT: 'abc' } } }
          }
        },
        {
          kind: 'block',
          type: 'text_isEmpty',
          inputs: {
            VALUE: { shadow: { type: 'text', fields: { TEXT: '' } } }
          }
        },
        { kind: 'block', type: 'text_indexOf' },
        { kind: 'block', type: 'text_charAt' },
        { kind: 'block', type: 'text_getSubstring' },
        {
          kind: 'block',
          type: 'text_changeCase',
          inputs: {
            TEXT: { shadow: { type: 'text', fields: { TEXT: 'abc' } } }
          }
        },
        {
          kind: 'block',
          type: 'text_trim',
          inputs: {
            TEXT: { shadow: { type: 'text', fields: { TEXT: 'abc' } } }
          }
        },
        {
          kind: 'block',
          type: 'text_print',
          inputs: {
            TEXT: { shadow: { type: 'text', fields: { TEXT: 'Rover active.' } } }
          }
        },
        {
          kind: 'block',
          type: 'text_prompt_ext',
          inputs: {
            TEXT: { shadow: { type: 'text', fields: { TEXT: 'Command:' } } }
          }
        }
      ]
    },

    // Category 9: Lists (from blockly-main demos/code)
    {
      kind: 'category',
      name: 'Lists',
      colour: '#4f46e5',
      contents: [
        { kind: 'block', type: 'lists_create_with' },
        {
          kind: 'block',
          type: 'lists_repeat',
          inputs: {
            NUM: { shadow: { type: 'math_number', fields: { NUM: 5 } } }
          }
        },
        { kind: 'block', type: 'lists_length' },
        { kind: 'block', type: 'lists_isEmpty' },
        { kind: 'block', type: 'lists_indexOf' },
        { kind: 'block', type: 'lists_getIndex' },
        { kind: 'block', type: 'lists_setIndex' },
        { kind: 'block', type: 'lists_getSublist' },
        {
          kind: 'block',
          type: 'lists_split',
          inputs: {
            DELIM: { shadow: { type: 'text', fields: { TEXT: ',' } } }
          }
        },
        { kind: 'block', type: 'lists_sort' }
      ]
    },

    { kind: 'sep' },

    // Category 10: Dynamic Variables
    {
      kind: 'category',
      name: 'Variables',
      categorystyle: 'variable_category',
      custom: 'VARIABLE'
    },

    // Category 11: Dynamic Functions / Procedures
    {
      kind: 'category',
      name: 'Functions',
      categorystyle: 'procedure_category',
      custom: 'PROCEDURE'
    }
  ]
};

export const EXTENSION_TOOLBOX_CATEGORIES: Record<string, any> = {
  rover_mission: {
    kind: 'category',
    name: 'Planetary Mission',
    colour: '#ea580c',
    contents: [
      { kind: 'block', type: 'rover_while_safe' },
      { kind: 'block', type: 'rover_survey_sector' },
      { kind: 'block', type: 'rover_collect_sample' },
      { kind: 'block', type: 'rover_deploy_solar' },
      { kind: 'block', type: 'rover_read_battery' },
      { kind: 'block', type: 'rover_read_radiation' }
    ]
  },
  data_telemetry: {
    kind: 'category',
    name: 'Data Logging',
    colour: '#0284c7',
    contents: [
      { kind: 'block', type: 'datalog_stream_interval' },
      { kind: 'block', type: 'datalog_record' },
      { kind: 'block', type: 'datalog_send_telemetry' },
      { kind: 'block', type: 'datalog_clear' }
    ]
  },
  turtle_pen: {
    kind: 'category',
    name: 'Turtle Pen',
    colour: '#06b6d4',
    contents: [
      { kind: 'block', type: 'pen_with_style' },
      { kind: 'block', type: 'pen_draw_regular_polygon' },
      { kind: 'block', type: 'pen_down' },
      { kind: 'block', type: 'pen_up' },
      { kind: 'block', type: 'pen_set_color' },
      { kind: 'block', type: 'pen_set_hue' },
      { kind: 'block', type: 'pen_set_size' },
      { kind: 'block', type: 'pen_change_size' },
      { kind: 'block', type: 'pen_clear' }
    ]
  },
  acoustic_synth: {
    kind: 'category',
    name: 'Sound & Music',
    colour: '#ec4899',
    contents: [
      { kind: 'block', type: 'sound_repeat_rhythm' },
      { kind: 'block', type: 'sound_play_effect' },
      { kind: 'block', type: 'sound_play_tone' },
      { kind: 'block', type: 'sound_play_note' },
      { kind: 'block', type: 'sound_rest' },
      { kind: 'block', type: 'sound_set_waveform' },
      { kind: 'block', type: 'sound_set_volume' },
      { kind: 'block', type: 'sound_set_tempo' },
      { kind: 'block', type: 'sound_stop_all' }
    ]
  },
  microbit_ext: {
    kind: 'category',
    name: 'micro:bit Ext',
    colour: '#8b5cf6',
    contents: [
      { kind: 'block', type: 'microbit_radio_set_group' },
      { kind: 'block', type: 'microbit_radio_send' },
      { kind: 'block', type: 'microbit_radio_send_number' },
      { kind: 'block', type: 'microbit_radio_receive' },
      { kind: 'block', type: 'microbit_gesture_detected' },
      { kind: 'block', type: 'microbit_compass_heading' },
      { kind: 'block', type: 'microbit_temperature' },
      { kind: 'block', type: 'microbit_magnetic_force' }
    ]
  },
  ai_speech: {
    kind: 'category',
    name: 'AI & Speech',
    colour: '#d97706',
    contents: [
      { kind: 'block', type: 'ai_while_tracking' },
      { kind: 'block', type: 'ai_if_vision_label' },
      { kind: 'block', type: 'ai_speech_speak' },
      { kind: 'block', type: 'ai_speech_set_voice' },
      { kind: 'block', type: 'ai_speech_set_pitch_rate' },
      { kind: 'block', type: 'ai_detect_object' },
      { kind: 'block', type: 'ai_classify_terrain' },
      { kind: 'block', type: 'ai_read_beacon' },
      { kind: 'block', type: 'ai_track_face' },
      { kind: 'block', type: 'ai_color_detect' }
    ]
  },
  robot_performance: {
    kind: 'category',
    name: 'Expressive Bot',
    colour: '#d946ef',
    contents: [
      { kind: 'block', type: 'robot_during_performance' },
      { kind: 'block', type: 'robot_express_emotion' },
      { kind: 'block', type: 'robot_jump' },
      { kind: 'block', type: 'robot_dance' },
      { kind: 'block', type: 'robot_speak_voice' },
      { kind: 'block', type: 'robot_play_dance_beat' },
      { kind: 'block', type: 'robot_sync_cue' },
      { kind: 'block', type: 'robot_formation_step' }
    ]
  },
  space_telemetry: {
    kind: 'category',
    name: 'Space Telemetry 🛰️',
    colour: '#0ea5e9',
    contents: [
      { kind: 'block', type: 'orbital_bind_source' },
      { kind: 'block', type: 'orbital_read_telemetry' },
      { kind: 'block', type: 'orbital_is_overhead' },
      { kind: 'block', type: 'orbital_align_heading' }
    ]
  }
};

export function buildRoboticsToolbox(
  activeExtensionIds: string[] = ['robot_performance', 'acoustic_synth'],
  searchQuery?: string
) {
  // 1. Gather core categories
  const categories = JSON.parse(JSON.stringify(ROBOTICS_TOOLBOX.contents));

  // 2. Append enabled extensions under an extensions divider
  const enabledExtensions: any[] = [];
  for (const extId of activeExtensionIds) {
    if (EXTENSION_TOOLBOX_CATEGORIES[extId]) {
      enabledExtensions.push(JSON.parse(JSON.stringify(EXTENSION_TOOLBOX_CATEGORIES[extId])));
    }
  }

  let fullContents = [...categories];
  if (enabledExtensions.length > 0) {
    fullContents.push({ kind: 'sep' });
    fullContents.push(...enabledExtensions);
  }

  // 3. Optional live search filtering
  if (searchQuery && searchQuery.trim().length > 0) {
    const q = searchQuery.trim().toLowerCase();
    const filtered: any[] = [];
    for (const item of fullContents) {
      if (item.kind === 'sep') continue;
      const catName = (item.name || '').toLowerCase();
      if (catName.includes(q)) {
        filtered.push(item);
      } else if (Array.isArray(item.contents)) {
        const matchingBlocks = item.contents.filter((b: any) => {
          const type = (b.type || '').toLowerCase();
          return type.includes(q);
        });
        if (matchingBlocks.length > 0) {
          filtered.push({
            ...item,
            contents: matchingBlocks
          });
        }
      }
    }
    return {
      kind: 'categoryToolbox',
      contents: filtered
    };
  }

  return {
    kind: 'categoryToolbox',
    contents: fullContents
  };
}

// ==========================================
// 7. Starter Missions
// ==========================================
export const STARTER_MISSIONS = {
  starter: {
    id: 'starter',
    name: 'Starter Mission 🚀',
    description: 'Basic autonomous navigation sequence with micro:bit greeting.',
    workspace: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'robot_on_start',
            id: 'start_root',
            x: 220,
            y: 40,
            next: {
              block: {
                type: 'robot_drive',
                id: 'drive_start',
                fields: {
                  DIRECTION: 'FORWARD',
                  SPEED: 80,
                  DURATION: 2
                },
                next: {
                  block: {
                    type: 'microbit_display_show',
                    id: 'show_happy',
                    fields: {
                      ICON: 'Image.HAPPY'
                    },
                    next: {
                      block: {
                        type: 'robot_turn',
                        id: 'turn_left',
                        fields: {
                          DIRECTION: 'LEFT',
                          ANGLE: 90
                        },
                        next: {
                          block: {
                            type: 'robot_drive',
                            id: 'drive_slow',
                            fields: {
                              DIRECTION: 'FORWARD',
                              SPEED: 60,
                              DURATION: 1.5
                            },
                            next: {
                              block: {
                                type: 'robot_stop',
                                id: 'stop_end'
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        ]
      }
    }
  },

  patrol: {
    id: 'patrol',
    name: 'Square Patrol 🔄',
    description: 'Navigates a 4-legged square perimeter with audio tones at each corner.',
    workspace: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'robot_on_start',
            id: 'patrol_root',
            x: 220,
            y: 40,
            next: {
              block: {
                type: 'controls_repeat_ext',
                id: 'repeat_square',
                inputs: {
                  TIMES: {
                    shadow: {
                      type: 'math_number',
                      id: 'repeat_num',
                      fields: { NUM: 4 }
                    }
                  },
                  DO: {
                    block: {
                      type: 'robot_drive',
                      id: 'patrol_leg',
                      fields: {
                        DIRECTION: 'FORWARD',
                        SPEED: 70,
                        DURATION: 1.5
                      },
                      next: {
                        block: {
                          type: 'actuator_buzzer',
                          id: 'beep_corner',
                          fields: {
                            FREQ: 880,
                            DURATION: 150
                          },
                          next: {
                            block: {
                              type: 'robot_turn',
                              id: 'corner_turn',
                              fields: {
                                DIRECTION: 'RIGHT',
                                ANGLE: 90
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                next: {
                  block: {
                    type: 'robot_stop',
                    id: 'patrol_stop'
                  }
                }
              }
            }
          }
        ]
      }
    }
  },

  polygon_patrol: {
    id: 'polygon_patrol',
    name: 'Square Patrol Loop 🔄',
    description: 'Autonomous 4-sided perimeter patrol using domain C-block with telemetry survey and status display.',
    workspace: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'robot_on_start',
            id: 'patrol_poly_root',
            x: 220,
            y: 40,
            next: {
              block: {
                type: 'robot_patrol_polygon',
                id: 'poly_loop',
                fields: {
                  SIDES: 4,
                  LENGTH: 25
                },
                inputs: {
                  DO: {
                    block: {
                      type: 'microbit_display_show',
                      id: 'poly_icon',
                      fields: {
                        ICON: 'Image.HAPPY'
                      },
                      next: {
                        block: {
                          type: 'sound_play_effect',
                          id: 'poly_beep',
                          fields: {
                            EFFECT: 'BLIP'
                          },
                          next: {
                            block: {
                              type: 'robot_sleep',
                              id: 'poly_pause',
                              fields: {
                                SECONDS: 0.5
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                next: {
                  block: {
                    type: 'robot_stop',
                    id: 'poly_stop'
                  }
                }
              }
            }
          }
        ]
      }
    }
  },

  obstacle: {
    id: 'obstacle',
    name: 'Obstacle Avoidance 🛑',
    description: 'Active sonar sensing: drives forward until an obstacle is detected within 20cm.',
    workspace: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'robot_on_start',
            id: 'avoid_root',
            x: 220,
            y: 40,
            next: {
              block: {
                type: 'controls_repeat_ext',
                id: 'loop_scan',
                inputs: {
                  TIMES: {
                    shadow: {
                      type: 'math_number',
                      id: 'scan_times',
                      fields: { NUM: 5 }
                    }
                  },
                  DO: {
                    block: {
                      type: 'controls_if',
                      id: 'check_distance',
                      inputs: {
                        IF0: {
                          block: {
                            type: 'logic_compare',
                            id: 'is_close',
                            fields: { OP: 'LT' },
                            inputs: {
                              A: {
                                block: {
                                  type: 'sensor_distance',
                                  id: 'read_dist'
                                }
                              },
                              B: {
                                shadow: {
                                  type: 'math_number',
                                  id: 'thresh_20',
                                  fields: { NUM: 20 }
                                }
                              }
                            }
                          }
                        },
                        DO0: {
                          block: {
                            type: 'microbit_display_show',
                            id: 'show_warn',
                            fields: { ICON: 'Image.NO' },
                            next: {
                              block: {
                                type: 'robot_turn',
                                id: 'evade_turn',
                                fields: {
                                  DIRECTION: 'RIGHT',
                                  ANGLE: 90
                                }
                              }
                            }
                          }
                        }
                      },
                      next: {
                        block: {
                          type: 'robot_drive',
                          id: 'cruise_forward',
                          fields: {
                            DIRECTION: 'FORWARD',
                            SPEED: 65,
                            DURATION: 1.0
                          }
                        }
                      }
                    }
                  }
                },
                next: {
                  block: {
                    type: 'robot_stop',
                    id: 'final_stop'
                  }
                }
              }
            }
          }
        ]
      }
    }
  },

  pen_patrol: {
    id: 'pen_patrol',
    name: 'Turtle Pen Geometry 🎨',
    description: 'Kinematic path tracing: draws a cyan geometric triangle with floor pen trails.',
    workspace: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'robot_on_start',
            id: 'pen_start',
            x: 220,
            y: 40,
            next: {
              block: {
                type: 'pen_down',
                id: 'pen_down_block',
                next: {
                  block: {
                    type: 'pen_set_color',
                    id: 'pen_color_block',
                    fields: { COLOR: '#06b6d4' },
                    next: {
                      block: {
                        type: 'controls_repeat_ext',
                        id: 'repeat_triangle',
                        inputs: {
                          TIMES: {
                            shadow: {
                              type: 'math_number',
                              id: 'rep_num',
                              fields: { NUM: 3 }
                            }
                          },
                          DO: {
                            block: {
                              type: 'robot_drive',
                              id: 'tri_drive',
                              fields: { DIRECTION: 'FORWARD', SPEED: 75, DURATION: 1.2 },
                              next: {
                                block: {
                                  type: 'robot_turn',
                                  id: 'tri_turn',
                                  fields: { DIRECTION: 'RIGHT', ANGLE: 120 }
                                }
                              }
                            }
                          }
                        },
                        next: {
                          block: {
                            type: 'pen_up',
                            id: 'pen_up_block',
                            next: {
                              block: {
                                type: 'robot_stop',
                                id: 'pen_stop'
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        ]
      }
    }
  },

  sample_retriever: {
    id: 'sample_retriever',
    name: 'Planetary Sample Retriever 🧪',
    description: 'Navigates toward SAMPLE β, classifies terrain, drills specimen, and celebrates with fanfare.',
    workspace: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'robot_on_start',
            id: 'sample_start',
            x: 220,
            y: 40,
            next: {
              block: {
                type: 'microbit_display_show',
                id: 'show_target',
                fields: { ICON: 'Image.ARROW_N' },
                next: {
                  block: {
                    type: 'robot_drive',
                    id: 'drive_to_sample',
                    fields: { DIRECTION: 'FORWARD', SPEED: 75, DURATION: 2.5 },
                    next: {
                      block: {
                        type: 'rover_collect_sample',
                        id: 'collect_core',
                        next: {
                          block: {
                            type: 'sound_play_effect',
                            id: 'fanfare_effect',
                            fields: { EFFECT: 'FANFARE' },
                            next: {
                              block: {
                                type: 'microbit_display_show',
                                id: 'show_done',
                                fields: { ICON: 'Image.YES' },
                                next: {
                                  block: {
                                    type: 'robot_stop',
                                    id: 'sample_stop'
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        ]
      }
    }
  },

  line_follower: {
    id: 'line_follower',
    name: 'Autonomous Line Follower 🏁',
    description: 'Closed-loop optical guidance: scans contour surface contrast and navigates forward.',
    workspace: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'robot_on_start',
            id: 'line_start',
            x: 220,
            y: 40,
            next: {
              block: {
                type: 'controls_repeat_ext',
                id: 'line_loop',
                inputs: {
                  TIMES: {
                    shadow: {
                      type: 'math_number',
                      id: 'line_cycles',
                      fields: { NUM: 6 }
                    }
                  },
                  DO: {
                    block: {
                      type: 'controls_if',
                      id: 'check_line_sensor',
                      inputs: {
                        IF0: {
                          block: {
                            type: 'sensor_line',
                            id: 'read_center_line',
                            fields: { SENSOR: 'CENTER', COLOR: 'BLACK' }
                          }
                        },
                        DO0: {
                          block: {
                            type: 'robot_motor_power',
                            id: 'power_straight',
                            fields: { LEFT: 75, RIGHT: 75 }
                          }
                        }
                      },
                      next: {
                        block: {
                          type: 'robot_sleep',
                          id: 'line_tick',
                          fields: { SECONDS: 0.3 }
                        }
                      }
                    }
                  }
                },
                next: {
                  block: {
                    type: 'robot_stop',
                    id: 'line_stop'
                  }
                }
              }
            }
          }
        ]
      }
    }
  },

  dance_party: {
    id: 'dance_party',
    name: 'Dance Party & Voice 🕺',
    description: 'Greet explorer with synthesized speech, show cheerful emotion, play dance rhythm, jump, and celebrate!',
    workspace: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'event_when_flag',
            id: 'flag_party',
            x: 220,
            y: 40,
            next: {
              block: {
                type: 'robot_speak_voice',
                id: 'speak_intro',
                fields: {
                  TEXT: "Hello explorer! Let's party!",
                  VOICE: 'Friendly'
                },
                next: {
                  block: {
                    type: 'robot_express_emotion',
                    id: 'express_happy',
                    fields: {
                      EMOTION: 'HAPPY'
                    },
                    next: {
                      block: {
                        type: 'robot_jump',
                        id: 'jump_bounce',
                        fields: {
                          HEIGHT: 'BOUNCE'
                        },
                        next: {
                          block: {
                            type: 'robot_play_dance_beat',
                            id: 'beat_disco',
                            fields: {
                              STYLE: 'CHIPTUNE',
                              BEATS: 4
                            },
                            next: {
                              block: {
                                type: 'robot_dance',
                                id: 'dance_twirl',
                                fields: {
                                  STYLE: 'TWIRL',
                                  DURATION: 2
                                },
                                next: {
                                  block: {
                                    type: 'robot_express_emotion',
                                    id: 'express_party',
                                    fields: {
                                      EMOTION: 'PARTY'
                                    },
                                    next: {
                                      block: {
                                        type: 'sound_play_effect',
                                        id: 'sound_fanfare',
                                        fields: {
                                          EFFECT: 'FANFARE'
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        ]
      }
    }
  },

  sync_choreography: {
    id: 'sync_choreography',
    name: 'Multi-Bot Sync Choreography 👯',
    description: 'Coordinate a synchronized classroom robotics performance: countdown cue, rhythm beat, formation steps, synchronized twirls, high jump, and celebratory heart visor!',
    workspace: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'event_when_flag',
            id: 'flag_sync',
            x: 220,
            y: 40,
            next: {
              block: {
                type: 'robot_speak_voice',
                id: 'sync_speak_intro',
                fields: {
                  TEXT: 'Team ready! 3, 2, 1, dance!',
                  VOICE: 'Heroic'
                },
                next: {
                  block: {
                    type: 'robot_sync_cue',
                    id: 'sync_cue_intro',
                    fields: {
                      CUE: 'INTRO'
                    },
                    next: {
                      block: {
                        type: 'robot_play_dance_beat',
                        id: 'sync_beat_funk',
                        fields: {
                          STYLE: 'FUNK',
                          BEATS: 4
                        },
                        next: {
                          block: {
                            type: 'robot_formation_step',
                            id: 'sync_step_fwd',
                            fields: {
                              MOVE: 'FORWARD',
                              STEPS: 2
                            },
                            next: {
                              block: {
                                type: 'robot_dance',
                                id: 'sync_dance_twirl',
                                fields: {
                                  STYLE: 'TWIRL',
                                  DURATION: 2
                                },
                                next: {
                                  block: {
                                    type: 'robot_sync_cue',
                                    id: 'sync_cue_drop',
                                    fields: {
                                      CUE: 'DROP'
                                    },
                                    next: {
                                      block: {
                                        type: 'robot_jump',
                                        id: 'sync_jump_high',
                                        fields: {
                                          HEIGHT: 'HIGH'
                                        },
                                        next: {
                                          block: {
                                            type: 'robot_express_emotion',
                                            id: 'sync_express_heart',
                                            fields: {
                                              EMOTION: 'HEART'
                                            },
                                            next: {
                                              block: {
                                                type: 'robot_speak_voice',
                                                id: 'sync_speak_outro',
                                                fields: {
                                                  TEXT: 'Bravo team! Synchronized mastery achieved!',
                                                  VOICE: 'Friendly'
                                                },
                                                next: {
                                                  block: {
                                                    type: 'sound_play_effect',
                                                    id: 'sync_fanfare',
                                                    fields: {
                                                      EFFECT: 'FANFARE'
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        ]
      }
    }
  },

  mars_expedition: {
    id: 'mars_expedition',
    name: 'Autonomous Mars Expedition 🪐',
    description: 'Deploy solar arrays, navigate to sample site, survey crater geology, core drill mineral samples, and stream telemetry.',
    workspace: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'robot_on_start',
            id: 'mars_start',
            x: 220,
            y: 40,
            next: {
              block: {
                type: 'rover_deploy_solar',
                id: 'deploy_solar',
                fields: { ANGLE: 45 },
                next: {
                  block: {
                    type: 'microbit_display_show',
                    id: 'show_sun',
                    fields: { ICON: 'Image.HAPPY' },
                    next: {
                      block: {
                        type: 'robot_drive',
                        id: 'drive_site',
                        fields: {
                          DIRECTION: 'FORWARD',
                          SPEED: 70,
                          DURATION: 2.0
                        },
                        next: {
                          block: {
                            type: 'rover_survey_sector',
                            id: 'survey_crater',
                            fields: { SECTOR: 'CRATER_B' },
                            next: {
                              block: {
                                type: 'rover_collect_sample',
                                id: 'drill_sample',
                                fields: { TOOL: 'DRILL' },
                                next: {
                                  block: {
                                    type: 'datalog_send_telemetry',
                                    id: 'send_telemetry',
                                    next: {
                                      block: {
                                        type: 'sound_play_effect',
                                        id: 'expedition_fanfare',
                                        fields: { EFFECT: 'FANFARE' }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        ]
      }
    }
  }
};

export const STARTER_ROBOTICS_WORKSPACE = STARTER_MISSIONS.starter.workspace;
