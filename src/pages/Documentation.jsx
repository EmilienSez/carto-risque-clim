import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import paramsData from '../assets/data/params.json'

export default function Documentation() {
    const [docChoisi, setDocChoisi] = useState('Inondation');
    const [titreDocumentation, setTitreDocumentation] = useState('');

    useEffect(() => {
            console.log(docChoisi);
    }, [docChoisi]);


    function choixInondation() {
        setDocChoisi('Inondation');
    };

    function choixIncendie() {
        setDocChoisi('Incendie');
    };

    function choixLittoral() {
        setDocChoisi('Littoral');
    };
    
    function choixCatastrophe() {
        setDocChoisi('Catastrophe');
    };

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
            <div className="flex flex-col items-center col-span-6 p-6">

            </div>
        </div>
    )
}
