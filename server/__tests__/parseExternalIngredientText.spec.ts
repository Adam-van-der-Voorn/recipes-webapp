import { parseExternalIngredientText } from "../../client/src/recipe-form/parse-external/parseExternalIngredientText.ts";
import { expect } from "@std/expect";

const copySpicyGinger = `    1 kg selfraising flour
    2 tsp table salt
    2 tsp baking soda (bicarb/bread soda)
    600 grams buttermilk
    2 eggs (large)
    330 grams white granulated sugar (caster or granulated)
    250 grams butter`;

const desiredSpicyGinger = [
  ["selfraising flour", "1 kg"],
  ["table salt", "2 tsp"],
  ["baking soda (bicarb/bread soda)", "2 tsp"],
  ["buttermilk", "600 grams"],
  ["eggs (large)", "2"],
  ["white granulated sugar (caster or granulated)", "330 grams"],
  ["butter", "250 grams"],
];

const copyNYT = `• 2¼ cups/530 milliliters lukewarm water (105 to 110 degrees)

• 2 tablespoons barley malt syrup, (available in health food stores and some well-stocked supermarkets; an equal volume of molasses is a passable substitute, but won’t impart the traditional malty flavor)

• 1 (¼-ounce) packet active dry yeast (about 2¼ teaspoons)

• 6½ cups/885 grams bread flour (or use 6 cups bread flour and ½ cup whole-wheat flour), plus more for kneading

Tip: For the crustiest, chewiest bagels, use bread flour. However, you can still achieve good results with all-purpose flour. Just try to use a brand with a relatively high protein content. Swapping in ½ cup of whole-wheat flour for ½ cup of the bread flour will make the bagels slightly less chewy but will also give them a boost of flavor.

• 2 tablespoons/17 grams Diamond Crystal kosher salt or 1 tablespoon/17 grams Morton kosher salt

Tip: When measured by volume, Morton salt packs more densely than Diamond, making it about twice as salty. For consistent measurements across brands, either weigh it with a scale, or use half the volume of Morton.

• Neutral oil, for greasing the baking sheets`;

const desiredNYT = [
  ["/530 milliliters lukewarm water (105 to 110 degrees)", "2 ¼ cups"],
  [
    "barley malt syrup, (available in health food stores and some well-stocked supermarkets; an equal volume of molasses is a passable substitute, but won’t impart the traditional malty flavor)",
    "2 tablespoons",
  ],
  ["1 (¼-ounce) packet active dry yeast (about )", "2 ¼ teaspoons"],
  [
    "/885 grams bread flour (or use 6 cups bread flour and ½ cup whole-wheat flour), plus more for kneading",
    "6 ½ cups",
  ],
  [
    "Tip: For the crustiest, chewiest bagels, use bread flour. However, you can still achieve good results with all-purpose flour. Just try to use a brand with a relatively high protein content. Swapping in of whole-wheat flour for of the bread flour will make the bagels slightly less chewy but will also give them a boost of flavor.",
    "½ cup",
  ],
  [
    "/17 grams Diamond Crystal kosher salt or 1 tablespoon/17 grams Morton kosher salt",
    "2 tablespoons",
  ],
  [
    "Tip: When measured by volume, Morton salt packs more densely than Diamond, making it about twice as salty. For consistent measurements across brands, either weigh it with a scale, or use half the volume of Morton.",
    null,
  ],
  ["Neutral oil, for greasing the baking sheets", null],
];

const copyRecipeTinEats =
  `    500 ml pure cream (Aus) / heavy cream (US) (Note 1)
    ▢ 1 vanilla pod OR 1 tsp vanilla bean paste (Note 2)
    ▢ 5 egg yolks (Note 3 for using leftover whites)
    ▢ 50 g caster sugar (superfine sugar)

Toffee Topping

    ▢ 40 g caster sugar (superfine sugar)`;

const desiredRecipeTinEats = [
  ["pure cream (Aus) / heavy cream (US) (Note 1)", "500 ml"],
  ["vanilla pod OR tsp vanilla bean paste (Note 2)", "1"],
  ["egg yolks (Note 3 for using leftover whites)", "5"],
  ["caster sugar (superfine sugar)", "50 g"],
  ["Toffee Topping", null],
  ["caster sugar (superfine sugar)", "40 g"],
];

const testCases: Array<[string, string, (string | null)[][]]> = [
  ["NYT", copyNYT, desiredNYT],
  ["Spicy Ginger", copySpicyGinger, desiredSpicyGinger],
  ["Recipe Tin Eats", copyRecipeTinEats, desiredRecipeTinEats],
];
for (const [name, copy, expected] of testCases) {
  Deno.test(`Directly coped from site: ${name}`, () => {
    const result = parseExternalIngredientText(copy);
    let i = 0;
    for (const row of result) {
      const [expectedIngredient, expectedQuantity] = expected[i];
      expect(row.quantity).toEqual(expectedQuantity);
      expect(row.ingredient).toEqual(expectedIngredient);
      i++;
    }
  });
}
