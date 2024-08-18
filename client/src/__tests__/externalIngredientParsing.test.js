import { parseExternalIngredientLine } from '../recipe-form/parse-external/parseExternalIngredientLine'
import { parseExternalIngredientText } from '../recipe-form/parse-external/parseExternalIngredientText';

describe('parsing ingredient lines', () => {
    it.each([
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
    ])('fractional case: "%s"', (input, quantity, ingredient) => {
        const res = parseExternalIngredientLine(input)
        expect(res.quantity).toEqual(quantity)
        expect(res.ingredient).toEqual(ingredient)
    });
    
    it.each([
        ["2.5 small preserved lemons", "2.5", "small preserved lemons"],
        ["2.5g small preserved lemons", "2.5 g", "small preserved lemons"],
        ["123123.123213 tsp of stuff", "123123.123213 tsp", "of stuff"],
        ["0.5 tsplinter", "0.5", "tsplinter"],
        [".25 liters", ".25", "liters"],
        ["salt 5.85 kg", "5.85 kg", "salt"],
    ])('decimal case: "%s"', (input, quantity, ingredient) => {
        const res = parseExternalIngredientLine(input)
        expect(res.quantity).toEqual(quantity)
        expect(res.ingredient).toEqual(ingredient)
    });
    
    it.each([
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
    ])('integer case: "%s"', (input, quantity, ingredient) => {
        const res = parseExternalIngredientLine(input)
        expect(res.quantity).toEqual(quantity)
        expect(res.ingredient).toEqual(ingredient)
    });

    it.each([
        ["Salt", null, "Salt"],   
        ["A heaping pinch of salt", null, "A heaping pinch of salt"],   
        ["a sentence. with punctuation", null, "a sentence. with punctuation"],
    ])('null case: "%s"', (input, quantity, ingredient) => {
        const res = parseExternalIngredientLine(input)
        expect(res.quantity).toEqual(quantity)
        expect(res.ingredient).toEqual(ingredient)
    });

    it.each([
        // prioritise fraction over int
        ["7g active dry yeast (about 2¼ teaspoons)", "2 ¼ teaspoons", "7g active dry yeast (about )"],
    ])('multi case: "%s"', (input, quantity, ingredient) => {
        const res = parseExternalIngredientLine(input)
        expect(res.quantity).toEqual(quantity)
        expect(res.ingredient).toEqual(ingredient)
    });
});

const noQuantity = '<no-quantity>' 

const copySpicyGinger = 
`    1 kg selfraising flour
    2 tsp table salt
    2 tsp baking soda (bicarb/bread soda)
    600 grams buttermilk
    2 eggs (large)
    330 grams white granulated sugar (caster or granulated)
    250 grams butter`;

const desiredSpicyGinger = [
    ['selfraising flour', '1 kg'],
    ['table salt','2 tsp'],
    ['baking soda (bicarb/bread soda)', '2 tsp'],
    ['buttermilk', '600 grams'],
    ['eggs (large)', '2'],
    ['white granulated sugar (caster or granulated)', '330 grams'],
    ['butter', '250 grams'],
]

const copyNYT =
`• 2¼ cups/530 milliliters lukewarm water (105 to 110 degrees)

• 2 tablespoons barley malt syrup, (available in health food stores and some well-stocked supermarkets; an equal volume of molasses is a passable substitute, but won’t impart the traditional malty flavor)

• 1 (¼-ounce) packet active dry yeast (about 2¼ teaspoons)

• 6½ cups/885 grams bread flour (or use 6 cups bread flour and ½ cup whole-wheat flour), plus more for kneading

Tip: For the crustiest, chewiest bagels, use bread flour. However, you can still achieve good results with all-purpose flour. Just try to use a brand with a relatively high protein content. Swapping in ½ cup of whole-wheat flour for ½ cup of the bread flour will make the bagels slightly less chewy but will also give them a boost of flavor.

• 2 tablespoons/17 grams Diamond Crystal kosher salt or 1 tablespoon/17 grams Morton kosher salt

Tip: When measured by volume, Morton salt packs more densely than Diamond, making it about twice as salty. For consistent measurements across brands, either weigh it with a scale, or use half the volume of Morton.

• Neutral oil, for greasing the baking sheets`;

const desiredNYT = [
    ['/530 milliliters lukewarm water (105 to 110 degrees)','2 ¼ cups'],
    ['barley malt syrup, (available in health food stores and some well-stocked supermarkets; an equal volume of molasses is a passable substitute, but won’t impart the traditional malty flavor)','2 tablespoons'],
    ['1 (¼-ounce) packet active dry yeast (about )','2 ¼ teaspoons'],
    ['/885 grams bread flour (or use 6 cups bread flour and ½ cup whole-wheat flour), plus more for kneading','6 ½ cups'],
    ['Tip: For the crustiest, chewiest bagels, use bread flour. However, you can still achieve good results with all-purpose flour. Just try to use a brand with a relatively high protein content. Swapping in of whole-wheat flour for of the bread flour will make the bagels slightly less chewy but will also give them a boost of flavor.', '½ cup'],
    ['/17 grams Diamond Crystal kosher salt or 1 tablespoon/17 grams Morton kosher salt','2 tablespoons'],
    ['Tip: When measured by volume, Morton salt packs more densely than Diamond, making it about twice as salty. For consistent measurements across brands, either weigh it with a scale, or use half the volume of Morton.', null],
    ['Neutral oil, for greasing the baking sheets', null],
]

const copyRecipeTinEats =
`    500 ml pure cream (Aus) / heavy cream (US) (Note 1)
    ▢ 1 vanilla pod OR 1 tsp vanilla bean paste (Note 2)
    ▢ 5 egg yolks (Note 3 for using leftover whites)
    ▢ 50 g caster sugar (superfine sugar)

Toffee Topping

    ▢ 40 g caster sugar (superfine sugar)`

const desiredRecipeTinEats = [
    ['pure cream (Aus) / heavy cream (US) (Note 1)', '500 ml'],
    ['vanilla pod OR tsp vanilla bean paste (Note 2)', '1'],
    ['egg yolks (Note 3 for using leftover whites)', '5'],
    ['caster sugar (superfine sugar)', '50 g'],
    ['Toffee Topping', null],
    ['caster sugar (superfine sugar)', '40 g'],
]

describe('directly copied from site', () => {
    it.each([
        ["NYT", copyNYT, desiredNYT],
        ["Spicy Ginger", copySpicyGinger, desiredSpicyGinger],
        ["Recipe Tin Eats", copyRecipeTinEats, desiredRecipeTinEats]
    ])('copied from: "%s"', (_name, copy, expected) => {
        const result = parseExternalIngredientText(copy)
        let i = 0;
        for (const row of result) {
            const [expectedIngredient, expectedQuantity] = expected[i]
            console.log(`${i}:`, expectedIngredient, expectedQuantity)
            expect(row.quantity).toEqual(expectedQuantity)
            expect(row.ingredient).toEqual(expectedIngredient)
            i++;
        }
    })
})

