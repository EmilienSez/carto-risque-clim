import { useEffect, useState } from 'react';

export default function BoutonType({ico, actif}) {
    const [bouton, setBouton] = useState(false);

    // function handleClick() {
    //     setBouton(prev => {
    //         const newValue = !prev;
    //         // setSelectedInondation(newValue); // ici on utilise directement la bonne valeur
    //         return newValue;
    //     });
    // }

    const setBoutonInverse = (e) => {
        e.preventDefault();
        setBouton(prev => !prev);  // Utiliser la fonction de mise à jour ancienne pour éviter les problèmes d'ancienne valeur
        console.log(bouton)
    };

    if (actif == true) {
        return (
        <button
            onClick={actif ? setBoutonInverse : null}  // Appelle setBoutonInverse seulement si actif est vrai
            className={`${actif ? (bouton ? 'bg-[#ffde59]' : '') : 'cursor-not-allowed'} border-2 rounded-full w-16 h-16 hover:bg-[#ffde59] hover:text-white duration-300 mr-4 ml-4 bg-[#fffade] border-[#fffade] ${!actif ? 'cursor-not-allowed' : ''}`}
            disabled={!actif} // Désactiver le bouton si actif est faux
        >
            <img src={ico} alt="" className='ml-3 w-10 h-10' />
        </button>
        )
    }
}
{/* <button onClick={handleClickboutonIncendie} 
className={`${boutonIncendie == true ? 'bg-black' : ''} border-2 rounded-full w-16 h-16 duration-300 mr-4 ml-4 cursor-not-allowed`} 
id="incendi" 
disabled>
  <img src="/carto-risque-clim/media/images/feu.png" alt="" className='ml-3 w-10 h-10' />
</button> */}