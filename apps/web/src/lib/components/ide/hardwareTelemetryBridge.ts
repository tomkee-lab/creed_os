/**
 * Continuous Hardware Telemetry Streaming Bridge
 * Inspired by scratch-link peripheral connection architecture.
 * Directly communicates with BBC micro:bit and ESP32 over Web Serial & WebUSB APIs
 * at 20Hz without requiring third-party desktop bridging utilities.
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
  timestamp: number;
}

export interface BridgeState {
  isConnected: boolean;
  portName: string;
  baudRate: number;
  fps: number;
  error?: string;
}

export type StateListener = (state: BridgeState) => void;
export type TelemetryListener = (telemetry: HardwareTelemetry) => void;

export class HardwareTelemetryBridge {
  private port: any = null;
  private reader: any = null;
  private writer: any = null;
  private isStreaming: boolean = false;
  private stateListeners: Set<StateListener> = new Set();
  private telemetryListeners: Set<TelemetryListener> = new Set();

  private currentState: BridgeState = {
    isConnected: false,
    portName: 'Disconnected',
    baudRate: 115200,
    fps: 0
  };

  private lastPacketTime: number = 0;
  private packetCount: number = 0;
  private fpsInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'serial' in navigator) {
      (navigator as any).serial?.addEventListener('disconnect', () => {
        this.disconnect();
      });
    }
  }

  public onStateChange(listener: StateListener): () => void {
    this.stateListeners.add(listener);
    listener(this.currentState);
    return () => this.stateListeners.delete(listener);
  }

  public onTelemetry(listener: TelemetryListener): () => void {
    this.telemetryListeners.add(listener);
    return () => this.telemetryListeners.delete(listener);
  }

  private notifyState(patch: Partial<BridgeState>) {
    this.currentState = { ...this.currentState, ...patch };
    for (const listener of this.stateListeners) {
      try {
        listener(this.currentState);
      } catch {}
    }
  }

  private notifyTelemetry(data: HardwareTelemetry) {
    for (const listener of this.telemetryListeners) {
      try {
        listener(data);
      } catch {}
    }
  }

  public async connect(): Promise<boolean> {
    if (typeof window === 'undefined' || !('serial' in navigator)) {
      this.notifyState({ error: 'Web Serial API is not supported in this browser.' });
      return false;
    }

    try {
      this.port = await (navigator as any).serial.requestPort();
      await this.port.open({ baudRate: 115200 });

      // Initialize outbound transmission pipeline
      if (this.port.writable) {
        const textEncoder = new TextEncoderStream();
        textEncoder.readable.pipeTo(this.port.writable).catch(() => {});
        this.writer = textEncoder.writable.getWriter();
      }

      this.isStreaming = true;
      this.notifyState({
        isConnected: true,
        portName: 'Hardware USB Port',
        baudRate: 115200,
        error: undefined
      });

      this.startFpsCounter();
      this.readStreamLoop();
      return true;
    } catch (err: any) {
      this.notifyState({
        isConnected: false,
        portName: 'Disconnected',
        error: err?.message || 'Connection cancelled.'
      });
      return false;
    }
  }

  public async disconnect() {
    this.isStreaming = false;
    if (this.fpsInterval) clearInterval(this.fpsInterval);

    try {
      if (this.writer) {
        await this.writer.close().catch(() => {});
        this.writer = null;
      }
      if (this.reader) {
        await this.reader.cancel().catch(() => {});
        this.reader = null;
      }
      if (this.port) {
        await this.port.close().catch(() => {});
        this.port = null;
      }
    } catch {}

    this.notifyState({
      isConnected: false,
      portName: 'Disconnected',
      fps: 0,
      error: undefined
    });
  }

  /**
   * Send raw string downstream over Web Serial to BBC micro:bit or ESP32
   */
  public async sendRaw(text: string): Promise<boolean> {
    if (!this.writer) return false;
    try {
      const payload = text.endsWith('\n') ? text : text + '\n';
      await this.writer.write(payload);
      return true;
    } catch (err) {
      console.warn('Hardware serial write error:', err);
      return false;
    }
  }

  /**
   * Stream active OLED visor emotion byte packet to micro:bit V2 / ESP32
   */
  public async sendEmotion(emotion: string): Promise<boolean> {
    const clean = emotion.replace('Image.', '').trim().toUpperCase();
    return this.sendRaw(`EMOTION:${clean}`);
  }

  /**
   * Stream physical motion command (jump, dance, drive, turn)
   */
  public async sendMotion(action: 'jump' | 'dance' | 'drive' | 'turn', params: any = {}): Promise<boolean> {
    return this.sendRaw(`MOTION:${action.toUpperCase()}:${JSON.stringify(params)}`);
  }

  /**
   * Stream spoken dialogue or speech text
   */
  public async sendSpeech(text: string, voice: string = 'ROBOT'): Promise<boolean> {
    return this.sendRaw(`SPEECH:${voice.toUpperCase()}:${text}`);
  }

  /**
   * Broadcast synchronized choreography cue to multi-robot group
   */
  public async sendChoreographyCue(cue: string): Promise<boolean> {
    return this.sendRaw(`CUE:${cue.toUpperCase()}`);
  }

  /**
   * Stream 5x5 LED pixel bitmap downstream to physical micro:bit display
   */
  public async send5x5Bitmap(grid: number[][]): Promise<boolean> {
    const flat = grid.map((r) => r.join('')).join('');
    return this.sendRaw(`BITMAP:${flat}`);
  }

  private startFpsCounter() {
    this.fpsInterval = setInterval(() => {
      this.notifyState({ fps: this.packetCount });
      this.packetCount = 0;
    }, 1000);
  }

  private async readStreamLoop() {
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
    this.reader = textDecoder.readable.getReader();

    let buffer = '';

    try {
      while (this.isStreaming) {
        const { value, done } = await this.reader.read();
        if (done) break;
        if (value) {
          buffer += value;
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.length > 0) {
              this.parseTelemetryLine(trimmed);
            }
          }
        }
      }
    } catch (err) {
      if (this.isStreaming) {
        console.warn('Hardware stream read error:', err);
      }
    } finally {
      try {
        await readableStreamClosed.catch(() => {});
      } catch {}
    }
  }

  private parseTelemetryLine(line: string) {
    this.packetCount++;
    let telemetry: HardwareTelemetry = {
      distanceCm: 38,
      headingDeg: 0,
      accelX: 0,
      accelY: 0,
      accelZ: 9.8,
      lightLevel: 70,
      buttonA: false,
      buttonB: false,
      rawLine: line,
      timestamp: Date.now()
    };

    try {
      if (line.startsWith('{') && line.endsWith('}')) {
        const parsed = JSON.parse(line);
        telemetry.distanceCm = parsed.d ?? parsed.distance ?? 38;
        telemetry.headingDeg = parsed.h ?? parsed.heading ?? 0;
        telemetry.accelX = parsed.ax ?? parsed.x ?? 0;
        telemetry.accelY = parsed.ay ?? parsed.y ?? 0;
        telemetry.accelZ = parsed.az ?? parsed.z ?? 9.8;
        telemetry.lightLevel = parsed.l ?? parsed.light ?? 70;
        telemetry.buttonA = Boolean(parsed.a ?? parsed.btnA);
        telemetry.buttonB = Boolean(parsed.b ?? parsed.btnB);
      } else {
        // Match standard micro:bit telemetry strings e.g. "D:25.4 H:180 L:65"
        const distMatch = line.match(/D(?:IST)?:?\s*([\d.]+)/i);
        const headMatch = line.match(/H(?:EAD)?:?\s*([\d.]+)/i);
        const lightMatch = line.match(/L(?:IGHT)?:?\s*([\d.]+)/i);

        if (distMatch) telemetry.distanceCm = parseFloat(distMatch[1]);
        if (headMatch) telemetry.headingDeg = parseFloat(headMatch[1]);
        if (lightMatch) telemetry.lightLevel = parseFloat(lightMatch[1]);
      }
    } catch {}

    this.notifyTelemetry(telemetry);
  }
}

export const hardwareBridge = new HardwareTelemetryBridge();
