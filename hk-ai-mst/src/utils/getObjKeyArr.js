export const getObjKeyArr = (arr, key) => {
  const objArr = [];
  arr.map((item) => {
    objArr.push(item[key]);
    return true;
  });
  return objArr;
};