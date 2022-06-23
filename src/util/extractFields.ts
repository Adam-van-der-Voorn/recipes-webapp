export default function extractFields(obj: any, ...fields: string[]) {
    const copy = { ...obj };
    const extractedFields = []
    for (const field of fields) {
        extractedFields.push(copy[field]);
        delete copy[field];
    }
    
    return [copy, ...extractedFields];
}