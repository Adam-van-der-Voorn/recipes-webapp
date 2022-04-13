
export type UnitVal = {
    value: number;
    unit: string;
};

export type Ingredient = {
    name: string; // no duplicates
    quantity: UnitVal;
    kjs?: number;
};

export type SubstitutionPart = {
    ingredientName: string;
    action: '+' | '-';
    amount: number;
};

export type Substitution = {
    changes: SubstitutionPart[];
};

export type IngredientsList = {
    lists: IngredientsSubList[];
    anchor?: string;
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
                    name: "Main",
                    ingredients: [
                        {
                            name: "bread",
                            quantity: {
                                value: 1,
                                unit: 'slice'
                            }
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

