import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

function FixMapResize() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200); // petit délai pour laisser le layout s’installer
  }, [map]);

  return null;
}

export default FixMapResize;