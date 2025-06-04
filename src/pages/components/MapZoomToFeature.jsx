import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import * as L from 'leaflet';

function MapZoomToFeature({ feature }) {
  const map = useMap();

  useEffect(() => {
    if (!feature) return;

    const geojsonLayer = L.geoJSON(feature);
    const bounds = geojsonLayer.getBounds();
    map.fitBounds(bounds, { padding: [20, 20] });

  }, [feature, map]);

  return null; // Ce composant n'affiche rien, il agit seulement sur la carte
}

export default MapZoomToFeature;
