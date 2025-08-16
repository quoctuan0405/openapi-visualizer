// WARNING: This is not a drop in replacement solution and
// it might not work for some edge cases. Test your code!
export const isEmpty = (obj: any) => {
  if (obj?.length || obj?.size) return false;
  if (typeof obj !== 'object') return true;
  for (const key in obj) if (Object.hasOwn(obj, key)) return false;
  return true;
};
