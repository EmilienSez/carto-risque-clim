import '../App.css'
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import MapZoomToFeature from './components/MapZoomToFeature';
import MapResetter from './components/MapResetter';
import FixMapResize from './components/FixMapResize';
import MapPointer from './components/MapPointer';

function Carte() {
  const [regionsData, setRegionsData] = useState(null);
  const [departementsData, setDepartementsData] = useState(null);
  const [selectedRegionCode, setSelectedRegionCode] = useState(null);
  const [selectedDepartementCode, setSelectedDepartementCode] = useState(null);
  const [mapResetTrigger, setMapResetTrigger] = useState(false);
  const [inondationData, setInondationData] = useState(null);
  const [adresseSaisie, setAdresseSaisie] = useState('');
  const [positionData, setPositionData] = useState([51.505, -0.09]);
  const [adresseInformation, setAdresseInformation] = useState('A pretty CSS3 popup.');

  const url = "https://nominatim.openstreetmap.org/search?q=";
  const regex = /\b\d{5}\b/; // \b pour les bornes de mots, \d{5} pour 5 chiffres
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

  // Fonction pour lancer un Call OpenStreetMap : 
  function rechercheAdresse() {
    console.log(adresseSaisie);
    getInfoAdresse(adresseSaisie, url)
  };

  // Adresse de test : 180, route de Vannes
  async function getInfoAdresse(adresse, url) {
    let urlGet = `${url}${adresse}&format=jsonv2`;
    // console.log(urlGet)
    try {
      const requete = await fetch(urlGet, {
        method: 'GET',
        headers: { 'User-Agent': "experimentationGitHub/1.0 (emilien.sezestre@gmail.com)" },
      });

      if (!requete.ok) {
        alert('Un problème est survenu, veuillez réessayer plus tard');
      } else {
        let donnees = await requete.json();
        console.log(donnees[0]);
        setPositionData([donnees[0]["lat"], donnees[0]["lon"]])
        setAdresseInformation(donnees[0]["display_name"])
        const resultat = donnees[0]["display_name"].match(regex); // Cherche les correspondances

        if (resultat[0].substr(0, 2) == "20") {  // Si l'adresse est en Corse
          if (Number(resultat[0].substr(0, 3)) > 201) {
            setSelectedDepartementCode("2A") // Corse du Sud : Code Postal 200 - 201
          } else {
            setSelectedDepartementCode("2B") // Haute Corse : Code Postal 202 - 206
          }
        } else if (Number(resultat[0].substr(0, 2)) > 95) {
          setSelectedDepartementCode(resultat[0].substr(0, 3))
        } else {
          setSelectedDepartementCode(resultat[0].substr(0, 2))
        }
      }
    } catch (error) {
      console.error(`Erreur lors de la requête pour : ${error.message}`);
    }
  }

  return (
    <>
      <div className="grid grid-cols-4 h-screen">
        <div className="flex flex-col items-center h-full col-span-1 bg-[#F2F2F2] overflow-auto">
          <span className="text-3xl text-center font-principale-bold underline mb-4">Cartographie des Risques Climatique</span>
          <button
            onClick={resetToRegions}
            className="flex items-center space-x-6 border-2 border-[#ffde59] hover:bg-[#ffde59] text-black font-bold py-1 px-4 rounded-4xl duration-300">
            <img src="/carto-risque-clim/media/images/retour.png" alt="Icône" className="w-8 h-8" />
            <span className="font-principale text-xl">Retour Carte</span>
          </button>
          <span className='mt-2 mb-4 text-xl underline font-principale-bold'> Recherche via une adresse : </span>
          <div className='flex justify-center'>
            <input type="text" className='border-2 rounded-full font-principale-bold bg-gray-200 w-90 text-center mr-4' placeholder='Veuillez saisir une adresse...'
              value={adresseSaisie}
              onChange={e => setAdresseSaisie(e.target.value)}
            />
            <button onClick={rechercheAdresse} className='border-2 border-[#ffde59] hover:bg-[#ffde59] rounded-full w-13 h-13 duration-300'>
              <img src="/carto-risque-clim/media/images/ico-loupe.png" alt="" className='ml-4 w-6 h-8' />
            </button>
          </div>
          <span className='mt-2 mb-4 text-xl underline font-principale-bold'> Choix du risque Climatique : </span>
          <div id='type-risque'>
            <button className='border-2 rounded-full w-16 h-16 hover:bg-black hover:text-white duration-300 mr-4 ml-4' id="inond">
             <img src="/carto-risque-clim/media/images/vague.png" alt="" className='ml-3 w-10 h-10'/>
             </button>
            <button className='border-2 rounded-full w-16 h-16 hover:bg-black hover:text-white duration-300 mr-4 ml-4' id="incendi">logo</button>
            <button className='border-2 rounded-full w-16 h-16 hover:bg-black hover:text-white duration-300 mr-4 ml-4' id="littoral">logo</button>
            <button className='border-2 rounded-full w-16 h-16 hover:bg-black hover:text-white duration-300 mr-4 ml-4' id="tempete">logo</button>
          </div>
          <span className='mt-2 text-xl underline font-principale-bold'> Inondations : </span>
          <span className='mt-2 text-xl font-principale'> Choix du Niveau de Probabilité : </span>
          <div id="niv-prob-inond-container" className='mt-4'>
            <button className='border-2 rounded-full w-13 h-13 text-3xl font-principale-bold hover:bg-black hover:text-white duration-300 mr-4 ml-4' id="prob-For">1</button>
            <button className='border-2 rounded-full w-13 h-13 text-3xl font-principale-bold hover:bg-black hover:text-white duration-300 mr-4 ml-4' id="prob-Moy">2</button>
            <button className='border-2 rounded-full w-13 h-13 text-3xl font-principale-bold hover:bg-black hover:text-white duration-300 mr-4 ml-4' id="prob-Mcc">3</button>
            <button className='border-2 rounded-full w-13 h-13 text-3xl font-principale-bold hover:bg-black hover:text-white duration-300 mr-4 ml-4' id="prob-Fai">4</button>
          </div>

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

            {positionData && adresseInformation && (<Marker position={positionData}>
              <Popup>
                {adresseInformation}
              </Popup>
            </Marker>
            )}

            {/* <MapPointer position={position}/> */}

          </MapContainer>
        </div>
      </div>
    </>
  );
}

export default Carte;

