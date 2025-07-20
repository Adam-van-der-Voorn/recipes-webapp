import { parseUnitVal } from "../../client/src/recipe-form/parseUnitValInputs.ts";
import { expect } from '@std/expect';
const validInputQuantityCases = [
    ['1g', { value: 1, unit: 'g' }],
    ['1 g', { value: 1, unit: 'g' }],
    ['1    g', { value: 1, unit: 'g' }],
    ['1  g  ', { value: 1, unit: 'g' }],
    ['1.0g', { value: 1, unit: 'g' }],
    ['12g', { value: 12, unit: 'g' }],
    ['12 g ', { value: 12, unit: 'g' }],
    ['12.01 g', { value: 12.01, unit: 'g' }],
    ['100long unit', { value: 100, unit: 'long unit' }],
    ['45.000 long unit MULTI word', { value: 45, unit: 'long unit MULTI word' }],
]
for (const [input, expected] of validInputQuantityCases) {
    Deno.test(`valid input quantity: ${input}`, () => {
        const actual = parseUnitVal(input)
        expect(actual).toEqual(expected)
    })
}

const invalidInputQuantityCases = [
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
]
for (const input of invalidInputQuantityCases) {
    const output = parseUnitVal(input)
    expect(output).toEqual(undefined)    
}