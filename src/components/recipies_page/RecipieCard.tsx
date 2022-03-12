import './RecipieCard.css'

type Props = {
    key: string;
    recipieName: string;
}

function RecipieCard({recipieName}: Props) {
    return (
      <div className="RecipieCard">
        {recipieName}
      </div>
    );
  }
  
export default RecipieCard;
  