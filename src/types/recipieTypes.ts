
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

export type SubstitutionPart = {
    ingredientName: string;
    quantity: UnitVal;
};

export type Substitution = {
    additions: SubstitutionPart[],
    removals: SubstitutionPart[],
};

export type IngredientsList = {
    lists: IngredientsSubList[];
    anchor?: number;
};

export type IngredientsSubList = {
    name: string,
    ingredients: Ingredient[],
};

export type Recipie = {
    name: string;
    timeframe?: string;
    servings?: UnitVal;
    notes?: string;
    ingredients?: IngredientsList;
    instructions?: string[];
    substitutions?: Substitution[];
};