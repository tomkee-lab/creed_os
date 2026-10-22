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
  private isRealHardware: boolean = false;
  private serialPort: any = null;
  private serialReader: any = null;
  private readableClosed: Promise<void> | null = null;
  private stateListeners: Set<StateListener> = new Set();
  private telemetryListeners: Set<TelemetryListener> = new Set();
  private planetaryListeners: Set<(vec: any) => void> = new Set();
  private simulatedInterval: any = null;
  private activePlanetarySource: string = 'iss';

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
      isConnected: this.isStreaming || this.isRealHardware,
      portName: this.isRealHardware
        ? 'USB Serial Microcontroller'
        : (this.isStreaming ? 'Simulated Hardware Bus' : 'Disconnected'),
      baudRate: 115200,
      fps: (this.isStreaming || this.isRealHardware) ? 20 : 0
    };
  }

  public startSimulationStream() {
    if (this.simulatedInterval) return;
    this.isStreaming = true;
    this.isRealHardware = false;
    this.notifyState();

    this.simulatedInterval = setInterval(() => {
      const vec = this.getPlanetaryVector();
      const telemetry: HardwareTelemetry = {
        distanceCm: Math.round(20 + Math.random() * 80),
        headingDeg: Math.round(Math.random() * 360),
        accelX: Math.round((Math.random() - 0.5) * 20) / 10,
        accelY: Math.round((Math.random() - 0.5) * 20) / 10,
        accelZ: 9.8,
        lightLevel: Math.round(150 + Math.random() * 50),
        buttonA: false,
        buttonB: false,
        planetaryVector: vec,
        timestamp: Date.now()
      };
      this.notifyTelemetry(telemetry);
      this.notifyPlanetaryTelemetry(vec);
    }, 100);
  }

  public async connect(): Promise<void> {
    // Attempt standard W3C Web Serial connection if supported by the browser
    if (typeof navigator !== 'undefined' && 'serial' in navigator) {
      try {
        const serial = (navigator as any).serial;
        const port = await serial.requestPort();
        await port.open({ baudRate: 115200 });
        this.serialPort = port;
        this.isRealHardware = true;
        this.notifyState();
        this.startSerialReader();
        return;
      } catch (err: any) {
        // User dismissed the hardware picker or device is unavailable; fall back to simulation
        console.info('[HardwareTelemetryBridge] Web Serial not selected, falling back to simulated stream:', err?.message);
      }
    }
    this.startSimulationStream();
  }

  private async startSerialReader(): Promise<void> {
    if (!this.serialPort?.readable) return;
    const textDecoder = new TextDecoderStream();
    this.readableClosed = this.serialPort.readable.pipeTo(textDecoder.writable).catch(() => {});
    this.serialReader = textDecoder.readable.getReader();

    let buffer = '';
    try {
      while (this.isRealHardware) {
        const { value, done } = await this.serialReader.read();
        if (done) break;
        buffer += value;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const parsed = JSON.parse(trimmed);
            const hasDist = parsed.dist !== undefined || parsed.distance !== undefined;
            const hasAz = parsed.az !== undefined;
            const hasLight = parsed.light !== undefined;

            const telemetry: HardwareTelemetry = {
              distanceCm: hasDist ? Number(parsed.dist ?? parsed.distance) : 0,
              headingDeg: Number(parsed.heading ?? 0),
              accelX: Number(parsed.ax ?? 0),
              accelY: Number(parsed.ay ?? 0),
              accelZ: hasAz ? Number(parsed.az) : 0,
              lightLevel: hasLight ? Number(parsed.light) : 0,
              buttonA: Boolean(parsed.btnA),
              buttonB: Boolean(parsed.btnB),
              planetaryVector: this.getPlanetaryVector(),
              timestamp: Date.now()
            };
            this.notifyTelemetry(telemetry);
          } catch {
            // Non-JSON raw telemetry frame
          }
        }
      }
    } catch {
      // Stream disconnected
    } finally {
      this.disconnect();
    }
  }

  public async disconnect(): Promise<void> {
    this.isRealHardware = false;
    if (this.serialReader) {
      try {
        await this.serialReader.cancel();
      } catch {}
      this.serialReader = null;
    }
    if (this.readableClosed) {
      try {
        await this.readableClosed;
      } catch {}
      this.readableClosed = null;
    }
    if (this.serialPort) {
      try {
        await this.serialPort.close();
      } catch {}
      this.serialPort = null;
    }
    this.stopSimulationStream();
  }

  public onStateChange(listener: StateListener): () => void {
    return this.subscribeState(listener);
  }

  public onTelemetry(listener: TelemetryListener): () => void {
    return this.subscribeTelemetry(listener);
  }

  public onPlanetaryTelemetry(listener: (vec: any) => void): () => void {
    this.planetaryListeners.add(listener);
    listener(this.getPlanetaryVector());
    return () => this.planetaryListeners.delete(listener);
  }

  public sendChoreographyCue(_cue: string): void {
    // Simulated robotic choreography cue
  }

  public sendSpeech(_text: string, _voice?: string): void {
    // Simulated robotic TTS speech
  }

  public bindPlanetarySource(sourceId: string): { sourceName: string; azimuthDeg: number; elevationDeg: number } {
    this.activePlanetarySource = sourceId;
    return this.getPlanetaryVector(sourceId);
  }

  public getPlanetaryMetric(source?: string, metric: string = 'azimuth'): number {
    const vec = this.getPlanetaryVector(source);
    switch ((metric || '').toLowerCase()) {
      case 'azimuth':
      case 'az':
        return vec.azimuthDeg;
      case 'elevation':
      case 'el':
        return vec.elevationDeg;
      case 'lat':
        return 28.61;
      case 'lon':
        return 77.20;
      case 'dist':
      case 'distance':
        return 418;
      default:
        return vec.azimuthDeg;
    }
  }

  public isPlanetaryOverhead(source?: string, thresholdKm: number = 1500): boolean {
    const metric = this.getPlanetaryMetric(source, 'distance');
    return metric <= thresholdKm;
  }

  public getPlanetaryVector(sourceName: string = this.activePlanetarySource): { sourceName: string; azimuthDeg: number; elevationDeg: number } {
    const cleanSource = sourceName ? sourceName.toUpperCase() : 'ISS';
    return { sourceName: cleanSource, azimuthDeg: 142, elevationDeg: 35 };
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

  private notifyPlanetaryTelemetry(vec: any) {
    for (const listener of this.planetaryListeners) {
      try {
        listener(vec);
      } catch {}
    }
  }
}

export const hardwareBridge = new HardwareTelemetryBridge();
