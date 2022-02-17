const arrayEqual = <T>(firstArr: T[], secondArr: T[]): boolean => {
  if (firstArr.length !== secondArr.length) return false;
  for (let i = 0; i < firstArr.length; i++) {
    if (firstArr[i] !== secondArr[i]) {
      return false;
    }
  }
  return true;
};

const arrayIncludes = <T>(array: T[], arrayOfArrays: T[][]): boolean => {
  return (
    arrayOfArrays.filter((innerArray) => arrayEqual(innerArray, array)).length >
    0
  );
};

export { arrayIncludes };
export default arrayEqual;
