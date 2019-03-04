export const parseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return undefined;
  }
};