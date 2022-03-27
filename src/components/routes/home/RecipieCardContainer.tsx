import { useContext } from 'react';
import RecipieCard from './RecipieCard';

import './RecipieCardContainer.css';
import { RecipiesContext } from '../../App';

function RecipieCardContainer() {

    const {recipies, setRecipies} = useContext(RecipiesContext);

    const cards: JSX.Element[] = recipies.map(recipie => {
        return <RecipieCard key={recipie.name} recipieName={recipie.name} />
    })

    return (
        <div className="RecipieCardContainer">
            {cards}
        </div>
    );
}

export default RecipieCardContainer;
