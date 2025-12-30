import convert, { Measure, Unit } from "convert-units";

export function isSameMeasure(a: string, b: string) {
  if (isConvertableUnit(a) && isConvertableUnit(b)) {
    return convert()
      .from(a as Unit)
      .possibilities()
      .includes(b as Unit);
  } else {
    return a === b;
  }
}

export function isConvertableUnit(unit: string) {
  const allUnits = convert().possibilities();
  return allUnits.includes(unit as Unit);
}

export function isValidIngredientUnit(unit: string) {
  return ingredientUnits.includes(unit);
}

export const ingredientUnits = [
  ...validInMeasure("length"),
  ...validInMeasure("area"),
  ...validInMeasure("volume"),
  ...validInMeasure("mass"),
];

export function validInMeasure(s: Measure) {
  return convert().list(s).flatMap((e: any) => [e.abbr, e.singular, e.plural]);
}
