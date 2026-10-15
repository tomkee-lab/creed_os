/**
 * hazards.ts — Public Domain Seismic & Thermal Anomalies Provider
 * Data: USGS Earthquakes & NASA FIRMS (U.S. Federal Government Public Domain)
 */
import type { TelemetryEntity } from './types';

export const CURATED_HAZARDS: TelemetryEntity[] = [
  {
    id: 'quake-indo-71',
    name: 'M 6.4 — Banda Sea, Indonesia',
    type: 'hazard',
    lat: -6.82,
    lon: 129.84,
    altM: -140000, // 140 km focal depth
    description: 'Subduction Zone Thrust · Depth: 140 km · USGS Verified',
    evidence: {
      source: 'USGS Earthquake Hazards Program',
      license: 'U.S. Public Domain',
      rawPayload: { mag: 6.4, depthKm: 140, mmi: 5.2 }
    }
  },
  {
    id: 'firms-cal-active',
    name: 'Wildfire Thermal Cluster — Sierra Foothills',
    type: 'hazard',
    lat: 38.45,
    lon: -120.75,
    altM: 850,
    description: 'FRP: 184 MW · VIIRS 375m I-Band Detection · NASA FIRMS',
    evidence: {
      source: 'NASA FIRMS (EOSDIS)',
      license: 'U.S. Public Domain',
      rawPayload: { frpMw: 184.2, confidence: 'nominal', satellite: 'SNPP' }
    }
  }
];

/**
 * Fetch live earthquakes (last 24 hours, M4.5+) from USGS public domain API.
 */
export async function fetchLiveEarthquakes(): Promise<TelemetryEntity[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson',
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.features || !Array.isArray(data.features)) return CURATED_HAZARDS;

    return data.features.slice(0, 30).map((f: any): TelemetryEntity => {
      const coords = f.geometry?.coordinates || [0, 0, 0];
      const mag = f.properties?.mag || 5.0;
      return {
        id: `usgs-${f.id}`,
        name: `M ${mag.toFixed(1)} — ${f.properties?.place || 'Seismic Event'}`,
        type: 'hazard',
        lat: coords[1],
        lon: coords[0],
        altM: -(coords[2] * 1000), // depth below surface
        description: `Focal Depth: ${coords[2]} km · Mag: ${mag} · Time: ${new Date(f.properties?.time).toUTCString()}`,
        evidence: {
          source: 'USGS Earthquake Hazards Program',
          license: 'U.S. Public Domain',
          rawPayload: f.properties
        }
      };
    });
  } catch {
    return CURATED_HAZARDS;
  }
}
