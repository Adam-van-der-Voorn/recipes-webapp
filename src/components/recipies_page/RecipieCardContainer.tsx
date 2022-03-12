import { useQuery } from 'react-query';
import { RecipieSet } from '../../types/recipieTypes';
import ErrorState from '../common/Error';
import LoadingState from '../common/Loading';
import RecipieCard from './RecipieCard';
import { API } from 'aws-amplify';

import './RecipieCardContainer.css';

function RecipieCardContainer() {
    const { isLoading, error, data } = useQuery<RecipieSet, unknown>('recipieSet', () => {
        return API.get('recipiesAPI', '/recipies', {})
            .then(response => {
                console.log('RES', response);
                return response;
            })
            .catch(err => {
                console.log('ERR', err);
            });
    });

    if (isLoading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState />;
    }

    const cards: JSX.Element[] = data!.recipies.map(recipie => {
        return <RecipieCard key={recipie.name} recipieName={recipie.name} />;
    });
    return <div className='RecipieCardContainer'>{cards}</div>;
}

export default RecipieCardContainer;
