// import '../App.css'
import '../output.css'
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import MapZoomToFeature from './components/MapZoomToFeature';
import MapResetter from './components/MapResetter';
import FixMapResize from './components/FixMapResize';
import BoutonType from './components/BoutonType';
import InfoBulle from './components/InfoBulle';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import paramsData from '../assets/data/params.json'
import { Link } from 'react-router-dom';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41], // dimensions officielles de l'icône
  iconAnchor: [12, 41], // point d'ancrage (base de l'icône)
  popupAnchor: [1, -34], // point où apparaît le popup
  shadowSize: [41, 41] // taille de l'ombre
});

L.Marker.prototype.options.icon = DefaultIcon;
// import MapPointer from './components/MapPointer';

function Carte() {
  const [regionsData, setRegionsData] = useState(null);
  const [departementsData, setDepartementsData] = useState(null);
  const [selectedRegionCode, setSelectedRegionCode] = useState(null);
  const [selectedDepartementCode, setSelectedDepartementCode] = useState(null);
  const [mapResetTrigger, setMapResetTrigger] = useState(false);
  const [adresseSaisie, setAdresseSaisie] = useState('');
  const [positionData, setPositionData] = useState([]);
  const [adresseInformation, setAdresseInformation] = useState('');
  const [transcoDepReg, setTranscoDepReg] = useState({});

  const [boutonScenarioInondation1, setboutonScenarioInondation1] = useState(false);
  const [boutonScenarioInondation2, setboutonScenarioInondation2] = useState(false);
  const [boutonScenarioInondation3, setboutonScenarioInondation3] = useState(false);
  const [boutonScenarioInondation4, setboutonScenarioInondation4] = useState(false);
  const [scenario, setScenario] = useState([]);

  const [boutonTypeInondation1, setboutonTypeInondation1] = useState(false);
  const [boutonTypeInondation2, setboutonTypeInondation2] = useState(false);
  const [boutonTypeInondation3, setboutonTypeInondation3] = useState(false);
  const [boutonTypeInondation4, setboutonTypeInondation4] = useState(false);
  const [typeInondation, setTypeInondation] = useState([]);

  const [boutonTypeLittoral1, setboutonTypeLittoral1] = useState(false);
  const [boutonTypeLittoral2, setboutonTypeLittoral2] = useState(false);
  const [boutonTypeLittoral3, setboutonTypeLittoral3] = useState(false);
  const [boutonTypeLittoral4, setboutonTypeLittoral4] = useState(false);
  const [boutonTypeLittoral5, setboutonTypeLittoral5] = useState(false);
  const [typeLittoral, setTypeLittoral] = useState([]);

  const url = "https://nominatim.openstreetmap.org/search?q=";
  const regex = /\b\d{5}\b/; // \b pour les bornes de mots, \d{5} pour 5 chiffres

  // Variables liées aux evenements climatiques : 
  const [inondationData, setInondationData] = useState(null);
  const [boutonInondation, setboutonInondation] = useState(false);
  const [selectedInondation, setSelectedInondation] = useState(false);

  const [littoralData, setLittoralData] = useState(null);
  const [boutonLittoral, setboutonLittoral] = useState(false);
  const [selectedLittoral, setSelectedLittoral] = useState(false);

  const [boutonIncendie, setboutonIncendie] = useState(false);
  const [boutonTempete, setboutonTempete] = useState(false);

  let icoSize = 16;
  let bulleSize = 10
  let marginBulle = 3;
  let marginLRSize = 2;

  // // Chargement initial des régions via gzip
  // useEffect(() => {
  //   axios
  //     .get('/carto-risque-clim/data/regions.geojson.gz', {
  //       responseType: 'arraybuffer', // <-- important
  //     })
  //     .then((res) => {
  //       // Étape 1 : on décompresse avec Pako
  //       const uint8Array = new Uint8Array(res.data);
  //       const decompressed = pako.ungzip(uint8Array, { to: 'string' });

  //       // Étape 2 : on parse le texte en JSON
  //       const geojson = JSON.parse(decompressed);

  //       // Étape 3 : on met à jour le state
  //       setRegionsData(geojson);
  //     })
  //     .catch((err) => {
  //       console.error("Erreur lors du chargement du fichier GeoJSON.gz :", err);
  //     });
  // }, []);

  // Chargement initial des régions
  useEffect(() => {
    axios.get('/carto-risque-clim/data/regions.geojson').then((res) => {
      setRegionsData(res.data);
    });
  }, []);


  useEffect(() => {
    const fetchTransco = async () => {
      try {
        const response = await axios.get('/carto-risque-clim/data/transco_dep_reg.json');
        setTranscoDepReg(response.data); // on stocke juste les données
      } catch (error) {
        console.error('Erreur lors du chargement de la transco :', error);
      }
    };

    fetchTransco();
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
  // Reset de la carte

  useEffect(() => {
    // console.log(typeInondation)
    // console.log(typeLittoral)
  }, [typeInondation, typeLittoral]);

  // // Affichage des inondations avec GZIP : 
  // useEffect(() => {
  //   setInondationData(null);
  //   if (selectedInondation && selectedDepartementCode && scenario.length > 0) {
  //     console.log("Chargement des données avec scenario :", scenario);
  //     axios
  //       .get(`/carto-risque-clim/data/inondations/scenario-${selectedDepartementCode}.geojson.gz`)
  //       .then((res) => {
  //         const filtered = {
  //           ...res.data,
  //           features: res.data.features.filter(
  //             (f) =>
  //               f.properties.departement === selectedDepartementCode &&
  //               scenario.includes(f.properties.scenario)
  //           ),
  //         };
  //         console.log("Mise à jour des données inondation :", filtered);
  //         setInondationData(filtered);
  //       });
  //   } else {
  //     setInondationData(null);
  //   }
  // }, [selectedInondation, selectedDepartementCode, scenario]);

  // Gestion des inondations (avec prise en compte gros fichier) : 
  useEffect(() => {
    setInondationData(null);

    const loadData = async () => {
      if (selectedInondation && selectedDepartementCode && scenario.length > 0 && typeInondation.length > 0) {
        try {
          const pathRes = await axios.get("/carto-risque-clim/data/path.json");
          const filePaths = pathRes.data[selectedDepartementCode];
          // console.log(pathRes, filePaths);
          if (!filePaths || filePaths.length === 0) {
            console.log("Aucun chemin trouvé pour ce département");
            return;
          }

          const partPromises = filePaths.map((path) => axios.get(path));
          // console.log(partPromises);
          const allParts = await Promise.all(partPromises);
          // console.log(allParts);
          const combinedFeatures = allParts.flatMap((res) => res.data.features);
          // console.log(combinedFeatures);
          const merged = {
            ...allParts[0].data,
            features: combinedFeatures.filter(
              (f) =>
                f.properties.departement === selectedDepartementCode &&
                scenario.includes(f.properties.scenario) &&
                typeInondation.includes(f.properties.typ_inond)
            ),
          };
          console.log(merged)
          setInondationData(merged);
        } catch (err) {
          console.error("Erreur lors du chargement des données :", err);
        }
      } else {
        setInondationData(null);
      }
    };

    loadData();
  }, [selectedInondation, selectedDepartementCode, scenario, typeInondation]);


  // Gestion du littoral : 
  useEffect(() => {
    setLittoralData(null);
    if (selectedLittoral && selectedDepartementCode && typeLittoral.length > 0) {
      axios
        .get(`/carto-risque-clim/data/littoral/littoral-${selectedDepartementCode}.geojson`)
        .then((res) => {
          const filtered = {
            ...res.data,
            features: res.data.features.filter(
              (f) =>
                f.properties.departement === selectedDepartementCode &&
                typeLittoral.includes(f.properties["Loi-litt"])
            ),
          };
          console.log("Mise à jour des données littoral :", filtered);
          setLittoralData(filtered);
        });
    } else {
      setLittoralData(null);
    }
  }, [selectedLittoral, selectedDepartementCode, typeLittoral]);

  // Changement de positionData : 
  useEffect(() => {
    // console.log("Les données ont changé " + positionData)
  }, [positionData]);


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
        // console.log("Clic sur la zone inondable");
      },
      mouseover: (e) => {
        const layer = e.target;
        layer.bindTooltip(
          `<strong>Scenario : ${paramsData.transco.probabilite[feature.properties.scenario]}</strong>
          <br/>Type d'inondation : ${paramsData.transco.type_inondation[feature.properties.typ_inond]}
          <br/>TRI : ${feature.properties.id_tri}
          <br/>Cours d'eau : ${feature.properties.cours_deau}`, {
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

  const onEachZoneLittoral = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.bindTooltip(
          `<strong>Surface : ${feature.properties.surf}</strong>
          <br/>Zone : ${feature.properties['Loi-litt']}`, {
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
    setLittoralData(null);
    setMapResetTrigger(true); // 🧭 active le recentrage
  };

  // Fonction pour lancer un Call OpenStreetMap : 
  function rechercheAdresse() {
    resetToRegions();
    getInfoAdresse(adresseSaisie, url)
  };

  function handleClickboutonScenarioInondation1() {
    setboutonScenarioInondation1(prev => {
      const newValue = !prev;

      setScenario(prevScenario => {
        if (newValue) {
          // Ajoute "01Fai" uniquement si ce n'est pas déjà dans le tableau
          return prevScenario.includes("01For")
            ? prevScenario
            : [...prevScenario, "01For"];
        } else {
          return prevScenario = prevScenario.filter(val => val !== "01For");;
        }
      });

      return newValue;
    });
  };

  function handleClickboutonScenarioInondation2() {
    setboutonScenarioInondation2(prev => {
      const newValue = !prev;

      setScenario(prevScenario => {
        if (newValue) {
          // Ajoute "01Fai" uniquement si ce n'est pas déjà dans le tableau
          return prevScenario.includes("02Moy")
            ? prevScenario
            : [...prevScenario, "02Moy"];
        } else {
          return prevScenario = prevScenario.filter(val => val !== "02Moy");;
        }
      });

      return newValue;
    });
  };

  function handleClickboutonScenarioInondation3() {
    setboutonScenarioInondation3(prev => {
      const newValue = !prev;

      setScenario(prevScenario => {
        if (newValue) {
          // Ajoute "01Fai" uniquement si ce n'est pas déjà dans le tableau
          return prevScenario.includes("03Mcc")
            ? prevScenario
            : [...prevScenario, "03Mcc"];
        } else {
          return prevScenario = prevScenario.filter(val => val !== "03Mcc");;
        }
      });

      return newValue;
    });
  };

  function handleClickboutonScenarioInondation4() {
    setboutonScenarioInondation4(prev => {
      const newValue = !prev;

      setScenario(prevScenario => {
        if (newValue) {
          // Ajoute "01Fai" uniquement si ce n'est pas déjà dans le tableau
          return prevScenario.includes("04Fai")
            ? prevScenario
            : [...prevScenario, "04Fai"];
        } else {
          return prevScenario = prevScenario.filter(val => val !== "04Fai");;
        }
      });

      return newValue;
    });
  };

  function handleClickboutonTypeInondation1() {
    setboutonTypeInondation1(prev => {
      const newValue = !prev;

      setTypeInondation(prevtypeInond => {
        if (newValue) {
          return prevtypeInond.includes("01")
            ? prevtypeInond
            : [...prevtypeInond, "01"];
        } else {
          return prevtypeInond = prevtypeInond.filter(val => val !== "01");;
        }
      });

      return newValue;
    });
  }

  function handleClickboutonTypeInondation2() {
    setboutonTypeInondation2(prev => {
      const newValue = !prev;

      setTypeInondation(prevtypeInond => {
        if (newValue) {
          return prevtypeInond.includes("02")
            ? prevtypeInond
            : [...prevtypeInond, "02"];
        } else {
          return prevtypeInond = prevtypeInond.filter(val => val !== "02");;
        }
      });

      return newValue;
    });
  };

  function handleClickboutonTypeInondation3() {
    setboutonTypeInondation3(prev => {
      const newValue = !prev;

      setTypeInondation(prevtypeInond => {
        if (newValue) {
          return prevtypeInond.includes("03")
            ? prevtypeInond
            : [...prevtypeInond, "03"];
        } else {
          return prevtypeInond = prevtypeInond.filter(val => val !== "03");;
        }
      });

      return newValue;
    });
  };

  function handleClickboutonTypeInondation4() {
    setboutonTypeInondation4(prev => {
      const newValue = !prev;

      setTypeInondation(prevtypeInond => {
        if (newValue) {
          return prevtypeInond.includes("04")
            ? prevtypeInond
            : [...prevtypeInond, "04"];
        } else {
          return prevtypeInond = prevtypeInond.filter(val => val !== "04");;
        }
      });

      return newValue;
    });
  };

  function handleClickboutonTypeLittoral1() {
    setboutonTypeLittoral1(prev => {
      const newValue = !prev;

      setTypeLittoral(prevtypeLitto => {
        if (newValue) {
          return prevtypeLitto.includes("Mer")
            ? prevtypeLitto
            : [...prevtypeLitto, "Mer"];
        } else {
          return prevtypeLitto = prevtypeLitto.filter(val => val !== "Mer");;
        }
      });

      return newValue;
    });
  };

  function handleClickboutonTypeLittoral2() {
    setboutonTypeLittoral2(prev => {
      const newValue = !prev;

      setTypeLittoral(prevtypeLitto => {
        if (newValue) {
          return prevtypeLitto.includes("Non")
            ? prevtypeLitto
            : [...prevtypeLitto, "Non"];
        } else {
          return prevtypeLitto = prevtypeLitto.filter(val => val !== "Non");;
        }
      });

      return newValue;
    });
  };

    function handleClickboutonTypeLittoral3() {
    setboutonTypeLittoral3(prev => {
      const newValue = !prev;

      setTypeLittoral(prevtypeLitto => {
        if (newValue) {
          return prevtypeLitto.includes("Estuaire")
            ? prevtypeLitto
            : [...prevtypeLitto, "Estuaire"];
        } else {
          return prevtypeLitto = prevtypeLitto.filter(val => val !== "Estuaire");;
        }
      });

      return newValue;
    });
  };

  function handleClickboutonTypeLittoral4() {
    setboutonTypeLittoral4(prev => {
      const newValue = !prev;

      setTypeLittoral(prevtypeLitto => {
        if (newValue) {
          return prevtypeLitto.includes("Mer / Lac")
            ? prevtypeLitto
            : [...prevtypeLitto, "Mer / Lac"];
        } else {
          return prevtypeLitto = prevtypeLitto.filter(val => val !== "Mer / Lac");;
        }
      });

      return newValue;
    });
  };

  function handleClickboutonTypeLittoral5() {
    setboutonTypeLittoral5(prev => {
      const newValue = !prev;

      setTypeLittoral(prevtypeLitto => {
        if (newValue) {
          return prevtypeLitto.includes("Mer / Estuaire")
            ? prevtypeLitto
            : [...prevtypeLitto, "Mer / Estuaire"];
        } else {
          return prevtypeLitto = prevtypeLitto.filter(val => val !== "Mer / Estuaire");;
        }
      });

      return newValue;
    });
  };

  function handleClickboutonInnondation() {
    setboutonInondation(prev => {
      const newValue = !prev;
      setSelectedInondation(newValue); // ici on utilise directement la bonne valeur
      // console.log(newValue)
      return newValue;
    });
  }

  function handleClickboutonIncendie() {
    boutonNonFonctionnelle("incendies")
    // setboutonIncendie(prev => !prev);
  }

  function handleClickboutonLittoral() {
    setboutonLittoral(prev => {
      const newValue = !prev;
      setSelectedLittoral(newValue); // ici on utilise directement la bonne valeur
      return newValue;
    });
  }
  function handleClickboutonTempete() {
    boutonNonFonctionnelle("tempete")
    // setboutonTempete(prev => !prev);
  }

  function boutonNonFonctionnelle(type) {
    alert(`Le bouton pour les ${type} n'est pas encore fonctionnel`);
  }

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
        // console.log(donnees[0]);
        setPositionData([donnees[0]["lat"], donnees[0]["lon"]])
        setAdresseInformation(donnees[0]["display_name"])
        const resultat = donnees[0]["display_name"].match(regex); // Cherche les correspondances

        if (resultat[0].substr(0, 2) == "20") {  // Si l'adresse est en Corse
          if (Number(resultat[0].substr(0, 3)) > 201) {
            setSelectedRegionCode(transcoDepReg["2A"]);
            setSelectedDepartementCode("2A") // Corse du Sud : Code Postal 200 - 201
          } else {
            setSelectedRegionCode(transcoDepReg["2B"]);
            setSelectedDepartementCode("2B") // Haute Corse : Code Postal 202 - 206
          }
        } else if (Number(resultat[0].substr(0, 2)) > 95) {
          setSelectedRegionCode(transcoDepReg[resultat[0].substr(0, 3)]);
          setSelectedDepartementCode(resultat[0].substr(0, 3))
        } else {
          setSelectedRegionCode(transcoDepReg[resultat[0].substr(0, 2)]);
          setSelectedDepartementCode(resultat[0].substr(0, 2))
        }
      }
    } catch (error) {
      console.error(`Erreur lors de la requête pour : ${error.message}`);
    }
  }

  const elementHtmlNiveauProbaInondation = <div><p> 1 : Forte Probabilité </p><p> 2 : Moyenne Probabilité</p><p> 3 : Moyenne Probabilité en prenant en compte le changement climatique</p><p> 4 : Faible Probabilité</p></div>;
  const elementHtmlTypeInondation = <div><p> 1 : Débordement de cours d'eau </p><p> 2 : Ruissellement</p><p> 3 : Submersion marine</p><p> 4 : Débordement des nappes phréatiques</p></div>;
  const elementHtmlTypeLittoral = <div><p> 1 : Mer </p><p> 2 : Non</p><p> 3 : Estuaire</p><p> 4 : Mer / Lac</p> <p> 5 : Mer / Estuaire </p></div>;

  return (
    <>
      <div className="grid grid-cols-4 h-screen">
        <div className="flex flex-col items-center h-full col-span-1 bg-[#fffade] overflow-auto z-10">
          <span className="text-3xl text-center font-principale-bold underline mb-4">Cartographie des Risques Climatique</span>
          <button
            onClick={resetToRegions}
            className="flex items-center space-x-6 border-2 border-[#ffde59] hover:bg-[#ffde59] text-black font-bold py-1 px-4 rounded-4xl duration-300">
            <img src="/carto-risque-clim/media/images/retour.png" alt="Icône" className="w-8 h-8" />
            <span className="font-principale text-xl">Retour Carte</span>
          </button>
          <span className='mt-2 mb-4 text-xl underline font-principale-bold'> Recherche via une adresse : </span>
          <div className='flex justify-center w-full'>
            <input type="text" className='border-2 rounded-full font-principale-bold bg-gray-200 w-[80%] text-center mr-4' placeholder='Veuillez saisir une adresse...'
              value={adresseSaisie}
              onChange={e => setAdresseSaisie(e.target.value)}
            />
            <button onClick={rechercheAdresse} className='border-2 border-[#ffde59] hover:bg-[#ffde59] rounded-full w-13 h-13 duration-300'>
              <img src="/carto-risque-clim/media/images/ico-loupe.png" alt="" className='ml-4 w-6 h-8' />
            </button>
          </div>
          <span className='mt-2 mb-4 text-xl underline font-principale-bold'> Choix du risque Climatique : </span>
          <div id='type-risque' className="flex border-2 rounded-full items-center p-2 bg-[#ffde59] border-[#ffde59] ">
            <button onClick={handleClickboutonInnondation}
              className={`${boutonInondation == true ? 'bg-[#ffde59]' : 'bg-[#fffade]'} border-2 rounded-full w-${icoSize} h-${icoSize} hover:bg-[#ffde59] hover:text-white duration-300 mr-${marginLRSize} ml-${marginLRSize} border-[#fffade]`}
              id="inond">
              <img src="/carto-risque-clim/media/images/vague.png" alt="" className={`ml-${marginBulle} w-${bulleSize} h-${bulleSize}`} />
            </button>
            <button onClick={handleClickboutonIncendie}
              className={`${boutonIncendie == true ? 'bg-[#ffde59]' : 'bg-[#fffade]'} border-2 rounded-full w-${icoSize} h-${icoSize} hover:text-white duration-300 mr-${marginLRSize} ml-${marginLRSize} border-[#fffade] cursor-not-allowed`}
              id="incendi"
              disabled>
              <img src="/carto-risque-clim/media/images/feu.png" alt="" className={`ml-${marginBulle} w-${bulleSize} h-${bulleSize}`} />
            </button>
            <button onClick={handleClickboutonLittoral} className={`${boutonLittoral == true ? 'bg-[#ffde59]' : 'bg-[#fffade]'} border-2 rounded-full w-${icoSize} h-${icoSize} hover:bg-[#ffde59] hover:text-white duration-300 mr-${marginLRSize} ml-${marginLRSize} border-[#fffade]`}
              id="littoral">
              <img src="/carto-risque-clim/media/images/littoral.png" alt="" className={`ml-${marginBulle} w-${bulleSize} h-${bulleSize}`} />
            </button>
            <button onClick={handleClickboutonTempete} className={`${boutonTempete == true ? 'bg-[#ffde59]' : 'bg-[#fffade]'} border-2 rounded-full w-${icoSize} h-${icoSize} hover:text-white duration-300 mr-${marginLRSize} ml-${marginLRSize} border-[#fffade] cursor-not-allowed`}
              id="tempete" disabled>
              <img src="/carto-risque-clim/media/images/tornade.png" alt="" className={`ml-${marginBulle} w-${bulleSize} h-${bulleSize}`} />
            </button>
          </div>

          {/* <br />
          <div id='type-risque' className="flex border-2 rounded-full items-center p-2 bg-[#ffde59] border-[#ffde59] ">
          {databoutonType.map(([key, value]) => (
            <BoutonType
              key={key}
              ico={value.icone}
              actif={value.activated}
            />
          ))}
          </div> */}

          <span className='mt-2 text-xl underline font-principale-bold'> Inondations : </span>
          <span className='flex mt-2 text-xl font-principale justify-center'> Choix du Niveau de Probabilité
            <InfoBulle
              elementhtml={elementHtmlNiveauProbaInondation}
            /> :
          </span>
          <div id="niv-prob-inond-container" className="flex border-2 rounded-full items-center p-2 bg-[#ffde59] border-[#ffde59] mt-2">
            <button onClick={handleClickboutonScenarioInondation1} className={`${boutonScenarioInondation1 == true ? 'bg-[#ffde59] text-[#fffade]' : 'bg-[#fffade]'} border-2 border-[#fffade] rounded-full w-13 h-13 text-3xl font-principale-bold hover:bg-[#ffde59] hover:text-white duration-300 mr-2 ml-2`} id="prob-For">1</button>
            <button onClick={handleClickboutonScenarioInondation2} className={`${boutonScenarioInondation2 == true ? 'bg-[#ffde59] text-[#fffade]' : 'bg-[#fffade]'} border-2 border-[#fffade] rounded-full w-13 h-13 text-3xl font-principale-bold hover:bg-[#ffde59] hover:text-white duration-300 mr-2 ml-2`} id="prob-Moy">2</button>
            <button onClick={handleClickboutonScenarioInondation3} className={`${boutonScenarioInondation3 == true ? 'bg-[#ffde59] text-[#fffade]' : 'bg-[#fffade]'} border-2 border-[#fffade] rounded-full w-13 h-13 text-3xl font-principale-bold hover:bg-[#ffde59] hover:text-white duration-300 mr-2 ml-2`} id="prob-Mcc">3</button>
            <button onClick={handleClickboutonScenarioInondation4} className={`${boutonScenarioInondation4 == true ? 'bg-[#ffde59] text-[#fffade]' : 'bg-[#fffade]'} border-2 border-[#fffade] rounded-full w-13 h-13 text-3xl font-principale-bold hover:bg-[#ffde59] hover:text-white duration-300 mr-2 ml-2`} id="prob-Fai">4</button>
          </div>
          <span className='flex mt-2 text-xl font-principale justify-center'> Choix du type d'inondation
            <InfoBulle
              elementhtml={elementHtmlTypeInondation}
            /> :
          </span>
          <div id="niv-prob-inond-container" className="flex border-2 rounded-full items-center p-2 bg-[#ffde59] border-[#ffde59] mt-2">
            <button onClick={handleClickboutonTypeInondation1} className={`${boutonTypeInondation1 == true ? 'bg-[#ffde59] text-[#fffade]' : 'bg-[#fffade]'} border-2 border-[#fffade] rounded-full w-13 h-13 text-3xl font-principale-bold hover:bg-[#ffde59] hover:text-white duration-300 mr-2 ml-2`}>1</button>
            <button onClick={handleClickboutonTypeInondation2} className={`${boutonTypeInondation2 == true ? 'bg-[#ffde59] text-[#fffade]' : 'bg-[#fffade]'} border-2 border-[#fffade] rounded-full w-13 h-13 text-3xl font-principale-bold hover:bg-[#ffde59] hover:text-white duration-300 mr-2 ml-2`}>2</button>
            <button onClick={handleClickboutonTypeInondation3} className={`${boutonTypeInondation3 == true ? 'bg-[#ffde59] text-[#fffade]' : 'bg-[#fffade]'} border-2 border-[#fffade] rounded-full w-13 h-13 text-3xl font-principale-bold hover:bg-[#ffde59] hover:text-white duration-300 mr-2 ml-2`}>3</button>
            <button onClick={handleClickboutonTypeInondation4} className={`${boutonTypeInondation4 == true ? 'bg-[#ffde59] text-[#fffade]' : 'bg-[#fffade]'} border-2 border-[#fffade] rounded-full w-13 h-13 text-3xl font-principale-bold hover:bg-[#ffde59] hover:text-white duration-300 mr-2 ml-2`}>4</button>
          </div>

          <span className='mt-4 text-xl underline font-principale-bold'> Littoral : </span>
          <span className='flex mt-2 text-xl font-principale justify-center'> Choix du type de données
            <InfoBulle 
            elementhtml={elementHtmlTypeLittoral}/> :
          </span>
          <div id="niv-prob-inond-container" className="flex border-2 rounded-full items-center p-2 bg-[#ffde59] border-[#ffde59] mt-2">
            <button onClick={handleClickboutonTypeLittoral1} className={`${boutonTypeLittoral1 == true ? 'bg-[#ffde59] text-[#fffade]' : 'bg-[#fffade]'} border-2 border-[#fffade] rounded-full w-13 h-13 text-3xl font-principale-bold hover:bg-[#ffde59] hover:text-white duration-300 mr-2 ml-2`}>1</button>
            <button onClick={handleClickboutonTypeLittoral2} className={`${boutonTypeLittoral2 == true ? 'bg-[#ffde59] text-[#fffade]' : 'bg-[#fffade]'} border-2 border-[#fffade] rounded-full w-13 h-13 text-3xl font-principale-bold hover:bg-[#ffde59] hover:text-white duration-300 mr-2 ml-2`}>2</button>
            <button onClick={handleClickboutonTypeLittoral3} className={`${boutonTypeLittoral3 == true ? 'bg-[#ffde59] text-[#fffade]' : 'bg-[#fffade]'} border-2 border-[#fffade] rounded-full w-13 h-13 text-3xl font-principale-bold hover:bg-[#ffde59] hover:text-white duration-300 mr-2 ml-2`}>3</button>
            <button onClick={handleClickboutonTypeLittoral4} className={`${boutonTypeLittoral4 == true ? 'bg-[#ffde59] text-[#fffade]' : 'bg-[#fffade]'} border-2 border-[#fffade] rounded-full w-13 h-13 text-3xl font-principale-bold hover:bg-[#ffde59] hover:text-white duration-300 mr-2 ml-2`}>4</button>
            <button onClick={handleClickboutonTypeLittoral5} className={`${boutonTypeLittoral5 == true ? 'bg-[#ffde59] text-[#fffade]' : 'bg-[#fffade]'} border-2 border-[#fffade] rounded-full w-13 h-13 text-3xl font-principale-bold hover:bg-[#ffde59] hover:text-white duration-300 mr-2 ml-2`}>5</button>
          </div>
          <div className='flex items-center absolute bottom-0 p-4'>
            <Link to="/carto-risque-clim/documentation">
              <button
                // onClick={resetToRegions}
                className="flex items-center space-x-6 border-2 border-[#c6b8ff] hover:bg-[#c6b8ff] text-black font-bold py-1 px-4 rounded-4xl duration-300">
                <img src="/carto-risque-clim/media/images/retour.png" alt="Icône" className="w-8 h-8" />
                <span className="font-principale text-xl">Documentation</span>
              </button>
            </Link>
          </div>
        </div>

        <div className=" col-span-3 h-full w-full z-0">
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
                  const zoneBBPL = feature.properties.zone_bbpl;
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

            {littoralData && (
              <GeoJSON
                data={littoralData}
                style={{ color: 'navy' }}
                onEachFeature={onEachZoneLittoral}
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

          </MapContainer>
        </div>
      </div>
    </>
  );
}

export default Carte;

