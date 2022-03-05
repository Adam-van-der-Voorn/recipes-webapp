import React from 'react';
import { RecipieSet } from '../../types/recipieTypes';
import RecipieCard from './RecipieCard';

import './RecipieCardContainer.css';


type Props = {
    recipieData: RecipieSet;
}

function RecipieCardContainer({ recipieData }: Props) {

    const cards: JSX.Element[] = recipieData.recipies.map(recipie => {
        return <RecipieCard recipieName={recipie.name} />
    })

    return (
        <div className="RecipieCardContainer">
            {cards}
        </div>
    );
}

export default RecipieCardContainer;
