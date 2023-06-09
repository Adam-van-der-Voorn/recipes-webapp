import { splitIngredientLine } from '../recipie-import/keywords'

describe('parsing ingredient lines', () => {
    it.each([
        ["2 red onions", "2", "red onions"],
        ["3 garlic cloves, mashed with a teaspoon of salt", "3", "garlic cloves, mashed with a teaspoon of salt"],
        ["Salt", null, "Salt"],
        ["½ tsp saffron strands", "½ tsp", "saffron strands"],
        ["2.5 small preserved lemons", "2.5", "small preserved lemons"],
        ["2 tbsp chopped flat-leaf parsley", "2 tbsp", "chopped flat-leaf parsley"],
        ["1 small bunch fresh coriander", "1", "small bunch fresh coriander"],
        ["6 bone-in chicken thighs (see step 3)", "6", "bone-in chicken thighs (see step 3)"],
        ["olive oil 3 tbsp", "3 tbsp", "olive oil"],
        ["1 time sauce 3 tbsp", "3 tbsp", "1 time sauce"],
        ["2 cubic centimeters ground ginger", "2 cubic centimeters", "ground ginger"],
        ["1 tsp cinnamon", "1 tsp", "cinnamon"],
        ["Juice of ½ lemon", "½", "Juice of lemon"],
        ["3/4 tbsp violet olives (see step 6)", "3/4 tbsp", "violet olives (see step 6)"],
        ["45/213123 tsp stuff", "45/213123 tsp", "stuff"],
        ["123123.123213 tsp of stuff", "123123.123213 tsp", "of stuff"],
        ["45/12321.1232", "45/12321", ".1232"], 
        ["0.5 tsplinter", "0.5", "tsplinter"],
        ["a sentence. with punctuation", null, "a sentence. with punctuation"]
    ])('"%s"', (input, quantity, ingredient) => {
        const res = splitIngredientLine(input)
        expect(res.quantity).toEqual(quantity)
        expect(res.ingredient).toEqual(ingredient)
    });
});