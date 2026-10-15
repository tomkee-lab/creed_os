/**
 * basemaps.ts — 100% Commercial Basemap & Terrain Providers for CREED OS
 * Commercial Compliance: Esri Master Agreement + Re:Earth CC BY 4.0 + Google BYOK
 */
import * as Cesium from 'cesium';

export interface BasemapConfig {
  googleMapsApiKey?: string;
  enableTerrain?: boolean;
}

/**
 * Configure 100% commercially permitted basemap layers.
 * Defaults to Esri World Imagery + Re:Earth Global Terrain.
 */
export async function setupCommercialBasemap(
  viewer: Cesium.Viewer,
  config: BasemapConfig = {}
): Promise<{ providerName: string; attribution: string }> {
  // If user supplies their own Google Maps Platform API key, enable Google 3D Tiles
  if (config.googleMapsApiKey && config.googleMapsApiKey.trim().length > 0) {
    try {
      Cesium.GoogleMaps.defaultApiKey = config.googleMapsApiKey.trim();
      const tileset = await Cesium.createGooglePhotorealistic3DTileset();
      viewer.scene.primitives.add(tileset);
      return {
        providerName: 'Google Photorealistic 3D',
        attribution: 'Google Maps Platform (BYOK)'
      };
    } catch (err) {
      console.warn('[Basemap] Google 3D Tiles initialization failed, falling back to Esri Satellite:', err);
    }
  }

  // Primary Keyless Commercial Standard: Esri World Imagery
  const esriProvider = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
    'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
    {
      enablePickFeatures: false
    }
  );

  viewer.imageryLayers.removeAll();
  viewer.imageryLayers.addImageryProvider(esriProvider);

  // Keyless Commercial Global Terrain: Re:Earth Mapterhorn (CC BY 4.0 / EGM2008 NGA)
  if (config.enableTerrain !== false) {
    try {
      const terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(
        'https://tiles.reearth.io/earth-tiles'
      );
      viewer.terrainProvider = terrainProvider;
    } catch (err) {
      console.warn('[Basemap] Global terrain unreachable, continuing with WGS84 ellipsoid:', err);
    }
  }

  return {
    providerName: 'Esri Satellite + Re:Earth Terrain',
    attribution: 'Esri, Maxar, Earthstar Geographics & Re:Earth (CC BY 4.0)'
  };
}
