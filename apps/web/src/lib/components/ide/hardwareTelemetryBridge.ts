/**
 * Continuous Hardware Telemetry Streaming Bridge
 * Inspired by scratch-link peripheral connection architecture.
 * Directly communicates with BBC micro:bit and ESP32 over Web Serial & WebUSB APIs
 * at 20Hz without requiring third-party desktop bridging utilities.
 */

import { CURATED_SATELLITES, propagateSatellite } from '$lib/telemetry/planetary/satellites';
import { CURATED_EDUCATIONAL_FLIGHTS } from '$lib/telemetry/planetary/flights';

export interface PlanetaryTelemetryVector {
  sourceId: string;
  sourceName: string;
  category: 'satellite' | 'flight';
  lat: number;
  lon: number;
  altM: number;
  speedKmh: number;
  headingDeg: number;
  rangeKm: number; // Great-circle distance to classroom/arena datum
  azimuthDeg: number; // Compass bearing from datum to target
  isOverhead: boolean; // Range < 1500 km or direct line of sight
  timestamp: number;
}

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
  planetaryVector?: PlanetaryTelemetryVector;
}

export interface BridgeState {
  isConnected: boolean;
  portName: string;
  baudRate: number;
  fps: number;
  error?: string;
  activePlanetarySource?: string;
  planetaryTrackingActive?: boolean;
}

export type StateListener = (state: BridgeState) => void;
export type TelemetryListener = (telemetry: HardwareTelemetry) => void;
export type PlanetaryListener = (vector: PlanetaryTelemetryVector) => void;

export class HardwareTelemetryBridge {
  private port: any = null;
  private reader: any = null;
  private writer: any = null;
  private isStreaming: boolean = false;
  private stateListeners: Set<StateListener> = new Set();
  private telemetryListeners: Set<TelemetryListener> = new Set();
  private planetaryListeners: Set<PlanetaryListener> = new Set();

  private currentState: BridgeState = {
    isConnected: false,
    portName: 'Disconnected',
    baudRate: 115200,
    fps: 0,
    activePlanetarySource: 'iss',
    planetaryTrackingActive: false
  };

  private lastPacketTime: number = 0;
  private packetCount: number = 0;
  private fpsInterval: any = null;
  private planetaryInterval: any = null;
  private activePlanetarySource: string = 'iss';
  private isTrackingHeading: boolean = false;
  private localDatum = { lat: 28.6139, lon: 77.2090 }; // Classroom ground station (Delhi)

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
    this.stopPlanetaryStream();
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
    const clean = emotion.replace('Image.', '').trim().toUpperCase().replace(/[\r\n\x00-\x1f]/g, '');
    return this.sendRaw(`EMOTION:${clean}`);
  }

  /**
   * Stream physical motion command (jump, dance, drive, turn)
   */
  public async sendMotion(action: 'jump' | 'dance' | 'drive' | 'turn', params: any = {}): Promise<boolean> {
    const cleanAction = action.replace(/[^A-Za-z0-9_-]/g, '').toUpperCase();
    const cleanParams = JSON.stringify(params).replace(/[\r\n\x00-\x1f]/g, '');
    return this.sendRaw(`MOTION:${cleanAction}:${cleanParams}`);
  }

  /**
   * Stream spoken dialogue or speech text
   */
  public async sendSpeech(text: string, voice: string = 'ROBOT'): Promise<boolean> {
    const cleanVoice = voice.replace(/[^A-Za-z0-9_-]/g, '').toUpperCase();
    const cleanText = text.replace(/[\r\n\x00-\x1f]/g, ' ').trim();
    return this.sendRaw(`SPEECH:${cleanVoice}:${cleanText}`);
  }

  /**
   * Broadcast synchronized choreography cue to multi-robot group
   */
  public async sendChoreographyCue(cue: string): Promise<boolean> {
    const cleanCue = cue.replace(/[^A-Za-z0-9_-]/g, '').toUpperCase();
    return this.sendRaw(`CUE:${cleanCue}`);
  }

  /**
   * Stream 5x5 LED pixel bitmap downstream to physical micro:bit display
   */
  public async send5x5Bitmap(grid: number[][]): Promise<boolean> {
    const flat = grid.map((r) => r.join('')).join('').replace(/[^0-9]/g, '');
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

  // ==========================================
  // Planetary & Orbital Telemetry Observables
  // ==========================================

  public onPlanetaryTelemetry(listener: PlanetaryListener): () => void {
    this.planetaryListeners.add(listener);
    const initial = this.getPlanetaryVector();
    listener(initial);
    if (!this.planetaryInterval && typeof window !== 'undefined') {
      this.startPlanetaryStream(1000);
    }
    return () => {
      this.planetaryListeners.delete(listener);
      if (this.planetaryListeners.size === 0 && !this.isTrackingHeading) {
        this.stopPlanetaryStream();
      }
    };
  }

  public bindPlanetarySource(sourceId: string): PlanetaryTelemetryVector {
    this.activePlanetarySource = sourceId;
    const vector = this.getPlanetaryVector(sourceId);
    this.notifyState({ activePlanetarySource: sourceId });
    this.notifyPlanetary(vector);
    return vector;
  }

  public getActivePlanetarySource(): string {
    return this.activePlanetarySource;
  }

  public setLocalDatum(lat: number, lon: number): void {
    this.localDatum = { lat, lon };
  }

  public setRobotHeadingBinding(enabled: boolean): void {
    this.isTrackingHeading = enabled;
    this.notifyState({ planetaryTrackingActive: enabled });
    if (enabled && !this.planetaryInterval && typeof window !== 'undefined') {
      this.startPlanetaryStream(1000);
    }
  }

  public getPlanetaryVector(sourceId?: string): PlanetaryTelemetryVector {
    const id = sourceId || this.activePlanetarySource || 'iss';
    const now = new Date();

    // 1. Check orbital satellites (SGP4 propagation via satellite.js)
    const sat = CURATED_SATELLITES.find((s) => s.id === id);
    if (sat) {
      const entity = propagateSatellite(sat, now);
      const lat = entity ? entity.lat : 0;
      const lon = entity ? entity.lon : 0;
      const altM = entity && typeof entity.altM === 'number' ? entity.altM : 420000;
      const speedKmh = entity && typeof entity.speedKmh === 'number' ? entity.speedKmh : 27600;
      const rangeKm = computeDistanceKm(this.localDatum.lat, this.localDatum.lon, lat, lon);
      const azimuthDeg = computeBearingDeg(this.localDatum.lat, this.localDatum.lon, lat, lon);

      return {
        sourceId: sat.id,
        sourceName: sat.name,
        category: 'satellite',
        lat: Number(lat.toFixed(4)),
        lon: Number(lon.toFixed(4)),
        altM,
        speedKmh,
        headingDeg: azimuthDeg,
        rangeKm,
        azimuthDeg,
        isOverhead: rangeKm < 1500,
        timestamp: now.getTime()
      };
    }

    // 2. Check commercial aircraft (ODbL 1.0 transponders)
    const flight = CURATED_EDUCATIONAL_FLIGHTS.find((f) => f.id === id);
    if (flight) {
      const rangeKm = computeDistanceKm(this.localDatum.lat, this.localDatum.lon, flight.lat, flight.lon);
      const azimuthDeg = computeBearingDeg(this.localDatum.lat, this.localDatum.lon, flight.lat, flight.lon);

      return {
        sourceId: flight.id,
        sourceName: flight.name,
        category: 'flight',
        lat: flight.lat,
        lon: flight.lon,
        altM: typeof flight.altM === 'number' ? flight.altM : 10668,
        speedKmh: typeof flight.speedKmh === 'number' ? flight.speedKmh : 850,
        headingDeg: flight.headingDeg || azimuthDeg,
        rangeKm,
        azimuthDeg,
        isOverhead: rangeKm < 500,
        timestamp: now.getTime()
      };
    }

    // 3. Fallback to ISS orbital state
    return {
      sourceId: 'iss',
      sourceName: 'International Space Station (ISS)',
      category: 'satellite',
      lat: 51.64,
      lon: 0,
      altM: 420000,
      speedKmh: 27600,
      headingDeg: 90,
      rangeKm: 2500,
      azimuthDeg: 90,
      isOverhead: false,
      timestamp: now.getTime()
    };
  }

  public isPlanetaryOverhead(sourceId?: string, thresholdKm: number = 1500): boolean {
    const vec = this.getPlanetaryVector(sourceId);
    return vec.rangeKm <= thresholdKm;
  }

  public getPlanetaryMetric(sourceId: string, metric: string): number {
    const vec = this.getPlanetaryVector(sourceId);
    switch (metric.toLowerCase()) {
      case 'latitude':
      case 'lat':
        return vec.lat;
      case 'longitude':
      case 'lon':
        return vec.lon;
      case 'altitude':
      case 'alt':
        return Math.round(vec.altM / 1000); // return in km
      case 'velocity':
      case 'speed':
        return vec.speedKmh;
      case 'heading':
      case 'bearing':
      case 'azimuth':
        return vec.headingDeg;
      case 'range':
      case 'distance':
        return vec.rangeKm;
      default:
        return 0;
    }
  }

  public startPlanetaryStream(intervalMs: number = 1000) {
    if (this.planetaryInterval) return;
    this.planetaryInterval = setInterval(() => {
      const vector = this.getPlanetaryVector();
      this.notifyPlanetary(vector);

      if (this.isTrackingHeading) {
        if (this.currentState.isConnected) {
          this.sendRaw(`HEADING_ALIGN:${vector.azimuthDeg}`);
        }
        this.notifyTelemetry({
          distanceCm: Math.min(100, Math.max(10, Math.round(vector.rangeKm / 50))),
          headingDeg: vector.azimuthDeg,
          accelX: 0,
          accelY: 0,
          accelZ: 9.8,
          lightLevel: 80,
          buttonA: false,
          buttonB: false,
          timestamp: Date.now(),
          planetaryVector: vector
        });
      }
    }, intervalMs);
  }

  public stopPlanetaryStream() {
    if (this.planetaryInterval) {
      clearInterval(this.planetaryInterval);
      this.planetaryInterval = null;
    }
  }

  private notifyPlanetary(vector: PlanetaryTelemetryVector) {
    for (const listener of this.planetaryListeners) {
      try {
        listener(vector);
      } catch {}
    }
  }
}

// Great-circle Haversine distance in km
function computeDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Initial bearing from datum to target in degrees (0–359)
function computeBearingDeg(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return Math.round(((θ * 180) / Math.PI + 360) % 360);
}

export const hardwareBridge = new HardwareTelemetryBridge();
