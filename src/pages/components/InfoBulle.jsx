import { useEffect, useState } from 'react';

export default function InfoBulle() {
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
                    className="font-principale absolute z-50 bg-gray-300 bg-opacity-40 border text-black text-xs px-3 py-2 shadow pointer-events-none"
                    style={{
                        top: position.y + 10,
                        left: position.x + 10,
                        position: "fixed", // pour suivre le curseur globalement
                    }}
                >
                    <p> 1 : Forte Probabilité </p>
                    <p> 2 : Moyenne Probabilité</p>
                    <p> 3 : Moyenne Probabilité en prenant en compte le changement climatique</p>
                    <p> 4 : Faible Probabilité</p>
                </div>
    )
}
        </div >
    )
}
