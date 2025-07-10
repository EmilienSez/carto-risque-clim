import { useEffect, useState } from 'react';

export default function InfoBulle({elementhtml}) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);

    const handleMouseMove = (e) => {
        setPosition({ x: e.clientX, y: e.clientY });
    };

    return (
        <div
            className="cursor-pointer"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            onMouseMove={handleMouseMove}
        >
            <img src="/carto-risque-clim/media/images/retour.png" alt="Icône" className="w-6 h-6 ml-2 mr-2" />
            {visible && (
                <div
                    className="font-principale absolute z-50 bg-gray-300 opacite-infobulle border text-black text-xs px-3 py-2 shadow pointer-events-none rounded-lg"
                    style={{
                        top: position.y + 10,
                        left: position.x + 10,
                        position: "fixed", // pour suivre le curseur globalement
                    }}
                >
                    {elementhtml}
                    {/* <p> 1 : Forte Probabilité </p>
                    <p> 2 : Moyenne Probabilité</p>
                    <p> 3 : Moyenne Probabilité en prenant en compte le changement climatique</p>
                    <p> 4 : Faible Probabilité</p> */}
                </div>
    )
}
        </div >
    )
}
