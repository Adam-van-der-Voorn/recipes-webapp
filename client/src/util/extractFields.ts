/**
 * extracts fields from an object and returns the new object and the extracted fields
 * @param obj the subject object
 * @param fields the names of the fields to extract
 * @return an array in format [new object, extracted field 1, ... extracted field n]
 */
export default function extractFields(obj: { [index: string]: any }, ...fields: string[]) {
    const copy = { ...obj };
    const extractedFields = []
    for (const field of fields) {
        extractedFields.push(copy[field]);
        delete copy[field];
    }
    
    return [copy, ...extractedFields];
}