export type RecipeInput = {
    name: string,
    timeframe: string,
    notes: string,
    ingredients: IngredientListsInput,
    servings: string,
    makes: string,
    instructions: InstructionInput[],
    substitutions: SubstitutionInput[],
};

export type IngredientInput = {
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
    name: string;
    ingredients: IngredientInput[];
};

export type InstructionInput = {
    val: string;
};

export type SubstitutionInput = {
    additions: SubstitutionPartInput[],
    removals: SubstitutionPartInput[];
};

export type SubstitutionPartInput = {
    quantity: string;
    ingredientName: string;
}