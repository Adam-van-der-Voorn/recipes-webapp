import { ingredientUnits } from "../util/units";
const hardcoded = ["salt","sugar","flour","eggs","milk","butter","oil","yeast","baking powder","baking soda","vanilla extract","cinnamon","garlic","onion","tomatoes","potatoes","carrots","celery","lemons","limes","oranges","apples","bananas","strawberries","blueberries","raspberries","blackberries","avocado","spinach","kale","lettuce","cabbage","broccoli","cauliflower","peppers","mushrooms","parsley","cilantro","thyme","rosemary","basil","oregano","sage","paprika","cumin","coriander","turmeric","chili powder","black pepper","white pepper","cayenne pepper","mustard seeds","mayonnaise","ketchup","mustard","honey","maple syrup","soy sauce","worcestershire sauce","vinegar","molasses","cornstarch","cornmeal","rice","pasta","bread","cheese","yogurt","sour cream","cream cheese","heavy cream","whipped cream","ice cream","chocolate","nuts","seeds","dried fruits","fresh herbs","spices","beef","pork","chicken","turkey","fish","shrimp","salmon","tuna","lamb","bacon","ham","sausage","chorizo","curry powder","garam masala","five spice powder","cajun seasoning","creole seasoning","za'atar","fennel seeds","cardamom","nutmeg","cloves","allspice","juniper berries","star anise","bay leaves","dill","marjoram","tarragon"]

const keywords = [
    // ...(ingredientUnits.flatMap(s => [">" + s, s + "<", " " + s, s + " "])),
    ...hardcoded
];

export default keywords;