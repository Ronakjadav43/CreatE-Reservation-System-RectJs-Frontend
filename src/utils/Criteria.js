export const numberFilter = [
  {
    display: "is equals to",
    value: "=",
  },
  {
    display: "is greater than",
    value: ">",
  },
  {
    display: "is less than",
    value: "<",
  },
  {
    display: "is greater than or equal to",
    value: ">=",
  },
  {
    display: "is less than or equal to",
    value: "<=",
  },
  {
    display: "Between",
    value: "BETWEEN",
  },
];

export const monthFilter = [
  {
    display: "is equals to",
    value: "=",
  },
  {
    display: "Between",
    value: "BETWEEN",
  },
];

export const dateFilter = [
  {
    display: "is equals to",
    value: "=",
  },
  {
    display: "is greater than",
    value: ">",
  },
  {
    display: "is less than",
    value: "<",
  },
  {
    display: "is greater than or equal to",
    value: ">=",
  },
  {
    display: "is less than or equal to",
    value: "<=",
  },
];

export const genderFilter = [
  {
    display: "is",
    value: "=",
  },
];

export const likeFilter = [
  {
    display: "is",
    value: "LIKE",
  },
];

export const getCriteriaFilter = (filterType) => {
  if (filterType === "gender") {
    return genderFilter;
  } else if (filterType === "monthFilter") {
    return monthFilter;
  } else if (filterType === "text") {
    return genderFilter;
  } else if (filterType === "dinningOptions") {
    return likeFilter;
  } else if (filterType === "dietaryRestriction") {
    return likeFilter;
  } else if (filterType === "privateBooking") {
    return genderFilter;
  } else if (filterType === "preOrderItems") {
    return likeFilter;
  } else if (filterType === "occasion") {
    return genderFilter;
  } else if (filterType === "outlet") {
    return genderFilter;
  } else if (filterType === "brand") {
    return genderFilter;
  } else if (filterType === "salutation") {
    return genderFilter;
  } else if (filterType === "mealType") {
    return genderFilter;
  } else if (filterType === "bookingType") {
    return genderFilter;
  } else if (filterType === "status") {
    return genderFilter;
  } else if (filterType === "number") {
    return dateFilter;
  } else {
    return numberFilter;
  }
};
