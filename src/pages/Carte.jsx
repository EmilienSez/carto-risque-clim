import '../App.css'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import MapZoomToFeature from './components/MapZoomToFeature';
import MapResetter from './components/MapResetter';
import FixMapResize from './components/MapResize';

function Carte() {
  const [regionsData, setRegionsData] = useState(null);
  const [departementsData, setDepartementsData] = useState(null);
  const [selectedRegionCode, setSelectedRegionCode] = useState(null);
  const [selectedDepartementCode, setSelectedDepartementCode] = useState(null);
  const [mapResetTrigger, setMapResetTrigger] = useState(false);
  const [inondationData, setInondationData] = useState(null);
  // Chargement initial des régions
  useEffect(() => {
    axios.get('/carto-risque-clim/data/regions.geojson').then((res) => {
      setRegionsData(res.data);
    });
  }, []);

  // Chargement des départements filtrés si une région est sélectionnée
  useEffect(() => {
    if (selectedRegionCode) {
      axios.get('/carto-risque-clim/data/departements.geojson').then((res) => {
        const filtered = {
          ...res.data,
          features: res.data.features.filter(
            (f) => f.properties.region === selectedRegionCode
          ),
        };
        setDepartementsData(filtered);
      });
    } else {
      setDepartementsData(null); // Reset départements
    }
  }, [selectedRegionCode]);

  // Reset de la carte
  useEffect(() => {
    if (mapResetTrigger) {
      setMapResetTrigger(false);
    }
  }, [mapResetTrigger]);

  // Chargement des zones inondables du département filtrées si un département est sélectionnée
  useEffect(() => {
    if (selectedDepartementCode) {
      axios.get(`/carto-risque-clim/data/inondations/scenario-${selectedDepartementCode}.geojson`).then((res) => {
        const filtered = {
          ...res.data,
          features: res.data.features.filter(
            (f) => f.properties.departement === selectedDepartementCode
          ),
        };
        setInondationData(filtered);
      });
    } else {
      setInondationData(null); // Reset départements
    }
  }, [selectedDepartementCode]);

  // Gestion des clics sur les régions
  const onEachRegion = (feature, layer) => {
    layer.on({
      click: () => {
        setSelectedRegionCode(feature.properties.code);
      },
      mouseover: (e) => {
        const layer = e.target;
        layer.bindTooltip(feature.properties.nom, {
          sticky: true,
          direction: 'top',
          opacity: 0.9,
        }).openTooltip();
      },
      mouseout: (e) => {
        e.target.closeTooltip();
      },
    });
    layer.bindPopup(feature.properties.nom);
  };

  const onEachDepartement = (feature, layer) => {
    layer.on({
      click: () => {
        setSelectedDepartementCode(feature.properties.code);
      },
      mouseover: (e) => {
        const layer = e.target;
        layer.bindTooltip(feature.properties.nom, {
          sticky: true,
          direction: 'top',
          opacity: 0.9,
        }).openTooltip();
      },
      mouseout: (e) => {
        e.target.closeTooltip();
      },
    });
  };

    const onEachZoneInondable = (feature, layer) => {
    layer.on({
      click: () => {
        console.log("Clic sur la zone inondable");
      },
      mouseover: (e) => {
        const layer = e.target;
        layer.bindTooltip(
          `<strong>Scenario : ${feature.properties.scenario}</strong>
          <br/>Zone : ${feature.properties.id_tri}`, {
          sticky: true,
          direction: 'top',
          opacity: 0.9,
        }).openTooltip();
      },
      mouseout: (e) => {
        e.target.closeTooltip();
      },
    });
  };

  // Fonction pour revenir en arrière (optionnel)
  const resetToRegions = () => {
    setSelectedRegionCode(null);
    setSelectedDepartementCode(null);
    setInondationData(null);
    setMapResetTrigger(true); // 🧭 active le recentrage
  };

  return (
    <>
        <div className="grid grid-cols-4 h-screen">
          <div className="flex flex-col items-center h-full col-span-1 bg-[#F2F2F2] overflow-auto">
            <span className="text-3xl text-center font-principale-bold underline mb-4">Cartographie des Risques Climatique</span>
            <button
              onClick={resetToRegions}
              className="flex items-center space-x-6 border-3 border-[#ffde59] hover:bg-[#ffde59] text-black font-bold py-1 px-4 rounded-4xl duration-300">
              <img src="/carto-risque-clim/media/images/retour.png" alt="Icône" className="w-8 h-8" />
              <span className="font-principale text-xl">Retour Carte</span>
            </button>
          </div>

          <div className=" col-span-3 h-full w-full">
            <MapContainer
              center={[46.5, 2.5]}
              zoom={6}
              style={{ height: '100vh', width: '100%' }}
            >
              <FixMapResize />
              <TileLayer
                url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              {selectedRegionCode === null && regionsData && (
                <GeoJSON
                  data={regionsData}
                  onEachFeature={onEachRegion}
                  style={(feature) => {
                    const zoneBBPL = feature.properties.Zone_BBPL;
                    let color = 'blue'; // valeur par défaut

                    switch (zoneBBPL) {
                      case true:
                        color = 'red';
                        break;
                      case false:
                        color = 'blue';
                        break;
                    }
                    return { color };
                  }} />
              )}

              {departementsData && selectedDepartementCode === null && (
                <GeoJSON
                  data={departementsData}
                  style={{ color: 'blue' }}
                  onEachFeature={onEachDepartement}
                />
              )}


              {selectedRegionCode && regionsData && (
                <MapZoomToFeature
                  feature={
                    regionsData.features.find(
                      (f) => f.properties.code === selectedRegionCode
                    )
                  }
                />
              )}

              {selectedDepartementCode && departementsData && (
                <MapZoomToFeature
                  feature={
                    departementsData.features.find(
                      (f) => f.properties.code === selectedDepartementCode
                    )
                  }
                />
              )}

              {inondationData && (
                <GeoJSON
                  data={inondationData}
                  style={{ color: 'blue' }}
                  onEachFeature={onEachZoneInondable}
                />
              )}
              <MapResetter
                trigger={mapResetTrigger}
                center={[46.5, 2.5]}
                zoom={6}
              />

            </MapContainer>
          </div>
        </div>
    </>
  );
}

export default Carte;

