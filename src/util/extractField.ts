export default function extractField(obj: any, field: string) {
    const copy = { ...obj };
    const extractedField = copy[field];
    delete copy[field];
    return [copy, extractedField];
}