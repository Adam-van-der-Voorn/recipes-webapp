import { error } from "console";
import { getFullSchema } from "../recipe-form/recipeInputSchema";
import { describe, expect, it } from '@jest/globals';

describe('invalid schema', () => {
    it('fails with no data', () => {
        const testdata = {}
        const schema = getFullSchema()
        try {
            schema.validateSync(testdata, {abortEarly: true})
        }
        catch (e) {
            return; // pass
        }
        throw new Error("Should have failed to validate")
    });
    it('passes when valid', () => {
        const testdata = {
            name: "short" // only name is required
        }
        const schema = getFullSchema()
        const res = schema.validateSync(testdata, {abortEarly: true})
    });
    it('name to long', () => {
        const testdata = {
            name: "name is too long" + ("g".repeat(200))
        }
        const schema = getFullSchema()
        try {
            schema.validateSync(testdata, {abortEarly: true})
        }
        catch (e) {
            return; // pass
        }
        throw new Error("Should have failed to validate")
    });
    it('percentange 1', () => {
        const testdata = {
            name: "Percentage",
            ingredients: {
                lists: [
                    {
                        id: "test",
                        name: "test",
                        ingredients: [
                            {
                                id: "1",
                                name: "stuff",
                                quantity: "1",
                                optional: "false",
                                percentage: "",
                            }   
                        ]
                    }
                ],
                anchor: "0"
            }
        }
        const schema = getFullSchema()
        schema.validateSync(testdata, {abortEarly: true})
    });
        it('percentange 2', () => {
        const testdata = {
            name: "Percentage",
            ingredients: {
                lists: [
                    {
                        id: "test",
                        name: "test",
                        ingredients: [
                            {
                                id: "1",
                                name: "stuff",
                                quantity: "1",
                                optional: "false",
                                percentage: "50",
                            }   
                        ]
                    }
                ],
                anchor: "0"
            }
        }
        const schema = getFullSchema()
        schema.validateSync(testdata, {abortEarly: true})
    });
});

export default {}