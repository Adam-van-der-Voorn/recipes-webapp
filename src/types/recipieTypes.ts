
export type UnitVal = {
    value: number;
    unit: string;
};

export type Ingredient = {
    name: string; // no duplicates
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

export const dummyData: Recipie[] = [
    {
        name: "Toast",
        notes: "Some notes :) \nnew line of notes!",
        servings: {
            unit: 'person',
            value: 1,
        },
        timeframe: "6 minutes",
        ingredients: {
            lists: [
                {
                    name: "",
                    ingredients: [
                        {
                            name: "bread",
                            quantity: {
                                value: 1,
                                unit: 'slice'
                            },
                            optional: false
                        }
                    ]
                }
            ]
        },
        instructions: [
            "put the bread in",
            "pull the lever",
            "don't burn it"
        ]
    }
];

