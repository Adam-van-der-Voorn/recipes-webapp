
export type UnitVal = {
    value: number;
    unit: string;
};

export type IngredientQuantity = UnitVal | number | string

export type Ingredient = {
    name: string;
    quantity: IngredientQuantity;
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
    servings?: string; // (in ui: serves)
    makes?: string; // (in ui: yields)
    notes?: string;
    ingredients?: IngredientsList;
    instructions?: string;
    substitutions?: Substitution[];
};