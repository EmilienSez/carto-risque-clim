import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

const MapResetter = ({ trigger, center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (trigger) {
      map.setView(center, zoom);
    }
  }, [trigger]);

  return null;
};

export default MapResetter;
