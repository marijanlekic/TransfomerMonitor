// /**
//  * Deep merge of objects. Different than shallow copy because it does not override the whole nested structures
//  * @param target
//  * @param source
//  */
// export function deepMerge<T extends object, U extends object>(target: T, source: U): T & U {
//   const result = {...target} as any;
//
//   for (const key in source) {
//     if (
//       Object.prototype.hasOwnProperty.call(source, key) &&
//       isPlainObject(source[key]) &&
//       isPlainObject((target as any)[key])
//     ) {
//       result[key] = deepMerge((target as any)[key], source[key]);
//     } else {
//       result[key] = source[key];
//     }
//   }
//
//   return result;
// }

/**
 * Remove empty values from query params
 * @param obj
 */
export function removeEmptyValuesFromObject(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (
      value !== null &&
      value !== undefined &&
      !(typeof value === "string" && value.trim() === "") &&
      !(Array.isArray(value) && value.length === 0) &&
      !(typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0)
    ) {
      result[key] = value;
    }
  }

  return result;
}
