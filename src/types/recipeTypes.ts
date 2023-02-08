
export type UnitVal = {
    value: number;
    unit: string;
};

export type Ingredient = {
    name: string;
    quantity: UnitVal;
    optional: boolean;
    kjs?: number;
};

export type SubstitutionAddition = {
    ingredientName: string;
    proportion: number;
};

export type Substitution = {
    additions: SubstitutionAddition[],
    removals: string[],
};

export type IngredientsList = {
    lists: IngredientsSubList[];
    anchor?: number;
};

export type IngredientsSubList = {
    name: string,
    ingredients: Ingredient[],
};

export type Recipe = {
    name: string;
    timeframe?: string;
    servings?: number;
    makes?: UnitVal;
    notes?: string;
    ingredients?: IngredientsList;
    instructions?: string;
    substitutions?: Substitution[];
};