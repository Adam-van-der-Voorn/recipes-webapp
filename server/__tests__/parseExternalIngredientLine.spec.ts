import { parseExternalIngredientLine } from '../../shared/parse-external-recipe/parseExternalIngredientLine.ts'
import { expect } from "@std/expect"

const fractionalTestCases = [
    ["¼ tsp saffron strands", "¼ tsp", "saffron strands"],
    ["3 ⅙ cups of flour", "3 ⅙ cups", "of flour"],
    ["salt - 5⅞ kg", "5 ⅞ kg", "salt -"],
    ["salt5⅞ kg", "5 ⅞ kg", "salt"],
    ["salt 5⅞kg", "5 ⅞ kg", "salt"],
    ["salt 5⅞ kg", "5 ⅞ kg", "salt"],
    ["5⅞ kg salt ", "5 ⅞ kg", "salt"],
    ["Juice of ½ lemon", "½", "Juice of lemon"],
    ["3/4 tbsp violet olives (see step 6)", "3/4 tbsp", "violet olives (see step 6)"],
    ["45/213123 tsp stuff", "45/213123 tsp", "stuff"],
    ["45/12321.1232", "45/12321", ".1232"],
    ["violet olives 3/4 Tbsp (see step 6)", "3/4 Tbsp", "violet olives (see step 6)"],
]
for (const [input, quantity, ingredient] of fractionalTestCases) {
    Deno.test(`fractional case: "${input}"`, () => {
        const res = parseExternalIngredientLine(input)
        expect(res?.quantity).toEqual(quantity)
        expect(res?.ingredient).toEqual(ingredient)
    });
}

const decimalTestCases = [
    ["2.5 small preserved lemons", "2.5", "small preserved lemons"],
    ["2.5g small preserved lemons", "2.5 g", "small preserved lemons"],
    ["123123.123213 tsp of stuff", "123123.123213 tsp", "of stuff"],
    ["0.5 tsplinter", "0.5", "tsplinter"],
    [".25 liters", ".25", "liters"],
    ["salt 5.85 kg", "5.85 kg", "salt"],
]
for (const [input, quantity, ingredient] of decimalTestCases) {
    Deno.test(`decimal case: "${input}"`, () => {
        const res = parseExternalIngredientLine(input)
        expect(res?.quantity).toEqual(quantity)
        expect(res?.ingredient).toEqual(ingredient)
    });
}

const integerTestCases = [
    ["2 red onions", "2", "red onions"],
    ["3 garlic cloves, mashed with a teaspoon of salt", "3", "garlic cloves, mashed with a teaspoon of salt"],
    ["2 tbsp chopped flat-leaf parsley", "2 tbsp", "chopped flat-leaf parsley"],
    ["1 small bunch fresh coriander", "1", "small bunch fresh coriander"],
    ["6 bone-in chicken thighs (see step 3)", "6", "bone-in chicken thighs (see step 3)"],
    ["olive oil 3 tbsp", "3 tbsp", "olive oil"],
    ["2 cubic centimeters ground ginger", "2 cubic centimeters", "ground ginger"],
    ["1 tsp cinnamon", "1 tsp", "cinnamon"],
    ["small bunch of fresh coriander 1", "1", "small bunch of fresh coriander"],
    ["bone-in chicken thighs 6 (see step 3)", "6", "bone-in chicken thighs (see step 3)"],
    ["3 tbsp olive oil", "3 tbsp", "olive oil"],
    ["3 tbsp 1 time sauce", "3 tbsp", "1 time sauce"],
    ["salt 5 kg", "5 kg", "salt"],
    ["2 pinches of salt", "2 pinches", "of salt"],
    ["1 packet active dry yeast", "1 packet", "active dry yeast"]
]
for (const [input, quantity, ingredient] of integerTestCases) {
    Deno.test(`integer case: "${input}"`, () => {
        const res = parseExternalIngredientLine(input)
        expect(res?.quantity).toEqual(quantity)
        expect(res?.ingredient).toEqual(ingredient)
    });
}

const nullTestCases = [
    ["Salt", null, "Salt"],   
    ["A heaping pinch of salt", null, "A heaping pinch of salt"],   
    ["a sentence. with punctuation", null, "a sentence. with punctuation"],
]
for (const [input, quantity, ingredient] of nullTestCases) {
    Deno.test(`null case: "${input}"`, () => {
        const res = parseExternalIngredientLine(input as any)
        expect(res?.quantity).toEqual(quantity)
        expect(res?.ingredient).toEqual(ingredient)
    });
}

const multiTestCases = [
    // prioritise fraction over int
    ["7g active dry yeast (about 2¼ teaspoons)", "2 ¼ teaspoons", "7g active dry yeast (about )"],
]
for (const [input, quantity, ingredient] of multiTestCases) {
    Deno.test(`multi case: "${input}"`, () => {
        const res = parseExternalIngredientLine(input)
        expect(res?.quantity).toEqual(quantity)
        expect(res?.ingredient).toEqual(ingredient)
    });
}