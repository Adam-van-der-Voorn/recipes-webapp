import { useNavigate } from 'react-router-dom';
import './RecipieCard.css';

type Props = {
    recipieId: string;
    recipieName: string;
};

function RecipieCard({ recipieId, recipieName }: Props) {
    const navigate = useNavigate();

    return (
        <div className="RecipieCard" onClick={() => navigate(`/${recipieId}`)}>
            {recipieName}
        </div>
    );
}

export default RecipieCard;
