import { useContext } from 'react';
import RecipieCard from './RecipieCard';

import './RecipieCardContainer.css';
import { RecipiesContext } from '../../App';

function RecipieCardContainer() {

    const { recipies } = useContext(RecipiesContext);

    const cards: JSX.Element[] = Array.from(recipies).map(([id, recipie]) => {
        return <RecipieCard key={id} recipieId={id} recipieName={recipie.name} />;
    });

    return (
        <div className="RecipieCardContainer">
            {cards}
        </div>
    );
}

export default RecipieCardContainer;
