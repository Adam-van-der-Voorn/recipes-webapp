import { useNavigate } from 'react-router-dom';
import './RecipieCard.css'

type Props = {
    recipieName: string;
}

function RecipieCard({recipieName}: Props) {
    const navigate = useNavigate();

    return (
      <div className="RecipieCard" onClick={() => navigate(`/${recipieName}`)}>
        {recipieName}
      </div>
    );
  }
  
export default RecipieCard;
  