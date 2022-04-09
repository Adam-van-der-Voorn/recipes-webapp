
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
    action: 'add' | 'remove';
    amount: number;
};

export type Substitution = {
    changes: SubstitutionPart[];
};

export type Ingredients = {
    lists: { name: string, ingredients: Ingredient[]; }[];
    anchor?: string;
};

export type Recipie = {
    name: string;
    timeframe?: string;
    servings?: UnitVal;
    notes?: string;
    ingredients: Ingredients;
    instructions?: string[];
    substitutions?: Substitution[];
};

export const dummyData: Recipie[] = [
    {
        name: "Toast",
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

        }
    }
];

