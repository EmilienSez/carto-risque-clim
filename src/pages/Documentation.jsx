import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import documentationData from '../assets/data/documentation.json'

export default function Documentation() {
    const [docChoisi, setDocChoisi] = useState('Inondation');
    const [titreDocumentation, setTitreDocumentation] = useState(Object.entries(documentationData.inondation));
    console.log(titreDocumentation)
    console.log(titreDocumentation[0][1])

    useEffect(() => {
        console.log(docChoisi);
    }, [docChoisi]);

    console.log(documentationData.incendie)

    function choixInondation() {
        setDocChoisi('Inondation');
        changeDocumentation('inondation');
    };

    function choixIncendie() {
        setDocChoisi('Incendie');
        changeDocumentation('incendie');
    };

    function choixLittoral() {
        setDocChoisi('Littoral');
        changeDocumentation('littoral');
    };

    function choixCatastrophe() {
        setDocChoisi('Catastrophe');
        changeDocumentation('catastrophe');
    };

    function changeDocumentation(nameCol) {
        setTitreDocumentation(Object.entries(documentationData[nameCol]));
    }

    return (
        <div className="grid grid-cols-7 h-screen">
            <div className="flex flex-col items-center col-span-1 bg-[#ffde59]">
                <div className='p-4'>
                    <Link to="/carto-risque-clim/">
                        <button
                            // onClick={resetToRegions}
                            className="flex items-center space-x-6 border-2 border-[#c6b8ff] hover:bg-[#c6b8ff] text-black font-bold py-1 px-4 rounded-4xl duration-300">
                            <img src="/carto-risque-clim/media/images/retour.png" alt="Icône" className="w-8 h-8" />
                            <span className="font-principale text-xl">Retour Carte</span>
                        </button>
                    </Link>
                </div>
                <button onClick={choixInondation} className='w-full'>
                    <div className={`mt-16 ${docChoisi == "Inondation" ? "bg-[#ffcc00] font-principale-bold" : "bg-[#fffade] font-principale cursor-pointer"} text-lg w-full p-3 py-6 text-center`}>
                        <p>Documentation Inondations</p>
                    </div>
                </button>
                <button onClick={choixIncendie} className='w-full'>
                    <div className={`mt-8 ${docChoisi == "Incendie" ? "bg-[#ffcc00] font-principale-bold" : "bg-[#fffade] font-principale cursor-pointer"} text-lg w-full p-3 py-6 text-center`}>
                        <p>Documentation Incendies</p>
                    </div>
                </button>
                <button onClick={choixLittoral} className='w-full'>
                    <div className={`mt-8 ${docChoisi == "Littoral" ? "bg-[#ffcc00] font-principale-bold" : "bg-[#fffade] font-principale cursor-pointer"} text-lg w-full p-3 py-6 text-center`}>
                        <p>Documentation Littoral</p>
                    </div>
                </button>
                <button onClick={choixCatastrophe} className='w-full'>
                    <div className={`mt-8 ${docChoisi == "Catastrophe" ? "bg-[#ffcc00] font-principale-bold" : "bg-[#fffade] font-principale cursor-pointer"} text-lg w-full p-3 py-6 text-center`}>
                        <p>Documentation Catastrophe Naturelle</p>
                    </div>
                </button>
            </div>
            <div className="flex flex-col col-span-6 p-6 mx-6">
                <span className='text-4xl font-principale-bold underline'>{titreDocumentation[0][1]}</span>
                <span className='text-lg font-principale my-3'>{titreDocumentation[1][1]}</span>
                <span className='text-xl font-principale-bold my-3 underline'> Sommaire : </span>
                <span className='text-lg font-principale my-6'> {titreDocumentation[2][1]} </span>
                <span className='text-lg font-principale my-6'> {titreDocumentation[3][1]} </span>
                <span className='text-xl font-principale-bold my-3 underline'> Source : </span>
                <ul className="list-disc pl-4">
                    {titreDocumentation[4][1].map((texte, index) => (
                        <a href={texte}><li key={index} className="font-oswald-normal text-blue-400 underline text-md dark:text-white mb-1">
                            {texte}
                        </li></a>
                    ))}
                </ul>
            </div>
        </div>
    )
}
