
export type Ingredient = {
    index: number;
    name: string; // no duplicates
    quantity: {
        value: number;
        unit: string;
    }
    kjs?: number;
}

export type Substitution = {
    changes: SubstitutionPart[];
}

export type SubstitutionPart = {
    ingredientName: string;
    action: 'add' | 'remove'
    amount: number;
}

export type Recipie = {
    name: string;
    coverPhoto?: any;
    timeframe?: string;
    servings?: {
        value: number;
        unit: string;
    }
    ingredients: {
        list: Ingredient[],
        anchor?: string;
    }
    instructions?: string;
    substitutions?: Substitution[];
}

export type RecipieSet = {
    recipies: Recipie[];
}

export const dummyData: RecipieSet = {
    recipies: [
      {
        name: "toast",
        ingredients: {
          list: [
            {
              index: 0,
              name: "bread",
              quantity: {
                value: 1,
                unit: 'slice'
              }
            }
          ]
        }
      },
      {
        name: "Ham",
        ingredients: {
          list: []
        }
      },
      {
        name: "Bread",
        ingredients: {
          list: []
        }
      },
      {
        name: "Steak",
        ingredients: {
          list: []
        }
      },
      {
        name: "Lamb",
        ingredients: {
          list: []
        }
      },
      {
        name: "Hummus",
        ingredients: {
          list: []
        }
      },
      {
        name: "Gravy",
        ingredients: {
          list: []
        }
      },
    ]
  }