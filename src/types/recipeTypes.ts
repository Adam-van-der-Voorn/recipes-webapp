
export type UnitVal = {
    value: number;
    unit: string;
};

export type Ingredient = {
    name: string;
    quantity: UnitVal | number;
    optional: boolean;
    kjs?: number;
};

export type Substitution = {
    additions: string[],
    removals: string[],
    notes: string;
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
    makes?: UnitVal | number;
    notes?: string;
    ingredients?: IngredientsList;
    instructions?: string;
    substitutions?: Substitution[];
};