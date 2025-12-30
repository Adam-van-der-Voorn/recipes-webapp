type obj = {
  [index: string]: any;
};

export default function objShallowEqual(obj1: obj, obj2: obj) {
  return Object.keys(obj1).length === Object.keys(obj2).length &&
    Object.keys(obj1).every((key) =>
      obj2.hasOwnProperty(key) && obj1[key] === obj2[key]
    );
}
