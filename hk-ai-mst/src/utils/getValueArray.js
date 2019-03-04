export const getValueArray = (obj) => {
  const valueArray = [];
  for(let key in obj) {
    valueArray.push(obj[key]);
  }
  return valueArray;
};