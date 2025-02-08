type Props = {
    servings?: string;
    makes?: string;
    timeframe?: string;
};

export function MetaDataSection({ servings, makes, timeframe }: Props) {
    return <ul className="recipeViewMeta" aria-details="recipe metadata">
        {servings && <li>Serves: {servings}</li>}
        {makes && <li>Yields: {makes}</li>}
        {timeframe && <li>Timeframe: {timeframe}</li>}
    </ul>;
}