/**
 * Hardware Telemetry & MicroPython Artifact Export Utility
 * Replaces heavy in-browser firmware flashing (esptool-js, dapjs)
 * with clean, reliable downloadable MicroPython / CircuitPython artifacts.
 */

export interface HardwareTelemetry {
  distanceCm: number;
  headingDeg: number;
  accelX: number;
  accelY: number;
  accelZ: number;
  lightLevel: number;
  buttonA: boolean;
  buttonB: boolean;
  rawLine?: string;
  planetaryVector?: { sourceName: string; azimuthDeg: number; elevationDeg?: number };
  timestamp: number;
}

export interface BridgeState {
  isConnected: boolean;
  portName: string;
  baudRate: number;
  fps: number;
  planetaryTrackingActive?: boolean;
  error?: string;
}

export type StateListener = (state: BridgeState) => void;
export type TelemetryListener = (telemetry: HardwareTelemetry) => void;

/**
 * Clean artifact export utility for physical microcontrollers
 */
export function exportMicroPythonArtifact(
  code: string,
  targetHardware: 'esp32' | 'microbit' = 'esp32'
): { filename: string; sizeBytes: number } {
  const filename = targetHardware === 'esp32' ? 'main.py' : 'code.py';
  const blob = new Blob([code], { type: 'text/x-python;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  return {
    filename,
    sizeBytes: blob.size
  };
}

export class HardwareTelemetryBridge {
  private isStreaming: boolean = false;
  private stateListeners: Set<StateListener> = new Set();
  private telemetryListeners: Set<TelemetryListener> = new Set();
  private simulatedInterval: any = null;

  public subscribeState(listener: StateListener): () => void {
    this.stateListeners.add(listener);
    listener(this.getState());
    return () => this.stateListeners.delete(listener);
  }

  public subscribeTelemetry(listener: TelemetryListener): () => void {
    this.telemetryListeners.add(listener);
    return () => this.telemetryListeners.delete(listener);
  }

  public getState(): BridgeState {
    return {
      isConnected: this.isStreaming,
      portName: this.isStreaming ? 'Simulated Hardware Bus' : 'Disconnected',
      baudRate: 115200,
      fps: this.isStreaming ? 20 : 0
    };
  }

  public startSimulationStream() {
    if (this.simulatedInterval) return;
    this.isStreaming = true;
    this.notifyState();

    this.simulatedInterval = setInterval(() => {
      const telemetry: HardwareTelemetry = {
        distanceCm: Math.round(20 + Math.random() * 80),
        headingDeg: Math.round(Math.random() * 360),
        accelX: Math.round((Math.random() - 0.5) * 20) / 10,
        accelY: Math.round((Math.random() - 0.5) * 20) / 10,
        accelZ: 9.8,
        lightLevel: Math.round(150 + Math.random() * 50),
        buttonA: false,
        buttonB: false,
        timestamp: Date.now()
      };
      this.notifyTelemetry(telemetry);
    }, 100);
  }

  public async connect(): Promise<void> {
    this.startSimulationStream();
  }

  public async disconnect(): Promise<void> {
    this.stopSimulationStream();
  }

  public onStateChange(listener: StateListener): () => void {
    return this.subscribeState(listener);
  }

  public onTelemetry(listener: TelemetryListener): () => void {
    return this.subscribeTelemetry(listener);
  }

  public onPlanetaryTelemetry(_listener: (vec: any) => void): () => void {
    return () => {};
  }

  public sendChoreographyCue(_cue: string): void {
    // Simulated robotic choreography cue
  }

  public sendSpeech(_text: string, _voice?: string): void {
    // Simulated robotic TTS speech
  }

  public getPlanetaryVector(): { sourceName: string; azimuthDeg: number; elevationDeg: number } {
    return { sourceName: 'ISS', azimuthDeg: 142, elevationDeg: 35 };
  }

  public sendEmotion(_emotion: string): void {
    // Simulated OLED expression
  }

  public sendMotion(_motion: string, _params?: Record<string, any>): void {
    // Simulated robotic actuator motion
  }

  public sendMatrix(_pattern: any): void {
    // Simulated 5x5 LED matrix
  }

  public stopSimulationStream() {
    if (this.simulatedInterval) {
      clearInterval(this.simulatedInterval);
      this.simulatedInterval = null;
    }
    this.isStreaming = false;
    this.notifyState();
  }

  private notifyState() {
    const s = this.getState();
    for (const listener of this.stateListeners) {
      try {
        listener(s);
      } catch {}
    }
  }

  private notifyTelemetry(telemetry: HardwareTelemetry) {
    for (const listener of this.telemetryListeners) {
      try {
        listener(telemetry);
      } catch {}
    }
  }
}

export const hardwareBridge = new HardwareTelemetryBridge();
