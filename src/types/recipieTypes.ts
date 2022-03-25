
export type UnitVal = {
  value: number;
  unit: string;
}

export type Ingredient = {
  index: number;
  name: string; // no duplicates
  quantity: UnitVal;
  kjs?: number;
}

export type SubstitutionPart = {
  ingredientName: string;
  action: 'add' | 'remove'
  amount: number;
}

export type Substitution = {
  changes: SubstitutionPart[];
}

export type Ingredients = {
  list: Ingredient[],
  anchor?: string;
}

export type Recipie = {
  name: string;
  timeframe?: string;
  servings?: UnitVal;
  ingredients: Ingredients;
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