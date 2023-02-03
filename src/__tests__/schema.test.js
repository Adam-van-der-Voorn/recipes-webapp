import { yupQuantitySchema } from "../recipe-form/recipeInputSchema";

describe('valid input quantity', () => {
    it.each([
        '1g',
        '1 g',
        '1    g',
        '1  g  ',
        '1.0g',
        '12g',
        '12 g ',
        '12.01 g',
        '100long unit',
        '45.000 long unit MULTI word'

    ])('"%s"', (input) => {
        return yupQuantitySchema.isValid(input).then(result => expect(result).toBe(true));
    });
});

describe('invalid input quantity', () => {
    it.each([
        '1',
        '123',
        '10.3',
        'words',
        'words words',
        '12 #%^%',
        '^%*& grams',
        ' 1 ',
        '1 ',
        '1 ^&'

    ])('"%s"', (input) => {
        return yupQuantitySchema.isValid(input).then(result => expect(result).toBe(false));
    });
});