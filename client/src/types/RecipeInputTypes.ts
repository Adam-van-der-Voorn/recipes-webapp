export type RecipeInput = {
    name: string,
    timeframe: string,
    notes: string,
    ingredients: IngredientListsInput,
    servings: string,
    makes: string,
    instructions: string,
    substitutions: SubstitutionInput[],
};

export type IngredientInput = {
    id: string;
    name: string,
    quantity: string,
    optional: boolean,
    percentage: string,
};

export type IngredientListsInput = {
    lists: IngredientSublistInput[]
    anchor: number,
};

export type IngredientSublistInput = {
    id: string;
    name: string;
    ingredients: IngredientInput[];
};

export type SubstitutionInput = {
    additions: string[],
    removals: string[];
    notes: string
};