export const filterAnd = (components: unknown[]): unknown => {
  const filtered = components.filter((item) => item && typeof item === 'object' && Object.keys(item).length);
  return !filtered.length ? undefined : filtered.length > 1 ? { $and: filtered } : filtered[0];
};
