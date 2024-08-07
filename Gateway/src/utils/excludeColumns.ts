export function excludeColumns<T>(entity: T, exclude: (keyof T)[]): T {
  const result = { ...entity };
  for (const key of exclude) {
    delete result[key];
  }
  return result;
}
