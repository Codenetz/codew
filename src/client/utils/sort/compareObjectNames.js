
export const compare = (a, b) => {

  const filterA = a.name.toUpperCase();
  const filterB = b.name.toUpperCase();

  let comparison = 0;
  if (filterA > filterB) {
    comparison = 1;
  } else if (filterA < filterB) {
    comparison = -1;
  }
  return comparison;
};

