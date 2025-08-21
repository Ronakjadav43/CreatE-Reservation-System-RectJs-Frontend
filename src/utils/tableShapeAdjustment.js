export const tableShapeAdjustment = {
  circle_1: {
    borderColor: "#EAEBF0",
    height: "40px",
    width: "40px",
    svgUrl: `/assets/images/table-image/circle_2.svg`,
  },
  circle_2: {
    borderColor: "#EAEBF0",
    height: "40px",
    width: "40px",
    svgUrl: `/assets/images/table-image/circle_2.svg`,
  },
  circle_3: {
    borderColor: "#EAEBF0",
    height: "60px",
    width: "60px",
    svgUrl: `/assets/images/table-image/circle_4.svg`,
  },
  circle_4: {
    borderColor: "#EAEBF0",
    height: "60px",
    width: "60px",
    svgUrl: `/assets/images/table-image/circle_4.svg`,
  },
  circle_5: {
    borderColor: "#EAEBF0",
    height: "80px",
    width: "80px",
    svgUrl: `/assets/images/table-image/circle_6.svg`,
  },
  circle_6: {
    borderColor: "#EAEBF0",
    height: "80px",
    width: "80px",
    svgUrl: `/assets/images/table-image/circle_6.svg`,
  },
  circle_7: {
    borderColor: "#EAEBF0",
    height: "100px",
    width: "100px",
    svgUrl: `/assets/images/table-image/circle_8.svg`,
  },
  circle_8: {
    borderColor: "#EAEBF0",
    height: "100px",
    width: "100px",
    svgUrl: `/assets/images/table-image/circle_8.svg`,
  },
  circle_9: {
    borderColor: "#EAEBF0",
    height: "100px",
    width: "100px",
    svgUrl: `/assets/images/table-image/circle_10.svg`,
  },
  circle_10: {
    borderColor: "#EAEBF0",
    height: "100px",
    width: "100px",
    svgUrl: `/assets/images/table-image/circle_10.svg`,
  },
  circle_11: {
    borderColor: "#EAEBF0",
    height: "100px",
    width: "100px",
    svgUrl: `/assets/images/table-image/circle_12.svg`,
  },
  circle_12: {
    borderColor: "#EAEBF0",
    height: "100px",
    width: "100px",
    svgUrl: `/assets/images/table-image/circle_12.svg`,
  },
  square_1: {
    borderColor: "green",
    height: "100px",
    width: "100px",
  },
  square_2: {
    borderColor: "green",
    height: "105px",
    width: "105px",
  },
  square_3: {
    borderColor: "green",
    height: "110px",
    width: "110px",
  },
  square_4: {
    borderColor: "green",
    height: "110px",
    width: "110px",
  },
  square_5: {
    borderColor: "green",
    height: "115px",
    width: "115px",
  },
  square_6: {
    borderColor: "green",
    height: "115px",
    width: "115px",
  },
  square_7: {
    borderColor: "green",
    height: "120px",
    width: "120px",
  },
  square_8: {
    borderColor: "green",
    height: "120px",
    width: "120px",
  },
  square_9: {
    borderColor: "green",
    height: "125px",
    width: "125px",
  },
  square_10: {
    borderColor: "green",
    height: "130px",
    width: "130px",
  },
  rectangle_1: {
    borderColor: "#EAEBF0",
    height: "50px",
    width: "40px",
    svgUrl: `/assets/images/table-image/rectangle_2.svg`,
  },
  rectangle_2: {
    borderColor: "#EAEBF0",
    height: "50px",
    width: "40px",
    svgUrl: `/assets/images/table-image/rectangle_2.svg`,
  },
  rectangle_3: {
    borderColor: "#EAEBF0",
    height: "80px",
    width: "60px",
    svgUrl: `/assets/images/table-image/rectangle_4.svg`,
  },
  rectangle_4: {
    borderColor: "#EAEBF0",
    height: "80px",
    width: "60px",
    svgUrl: `/assets/images/table-image/rectangle_4.svg`,
  },
  rectangle_5: {
    borderColor: "#EAEBF0",
    height: "100px",
    width: "60px",
    svgUrl: `/assets/images/table-image/rectangle_6.svg`,
  },
  rectangle_6: {
    borderColor: "#EAEBF0",
    height: "100px",
    width: "60px",
    svgUrl: `/assets/images/table-image/rectangle_6.svg`,
  },
  rectangle_7: {
    borderColor: "#EAEBF0",
    height: "120px",
    width: "60px",
    svgUrl: `/assets/images/table-image/rectangle_8.svg`,
  },
  rectangle_8: {
    borderColor: "#EAEBF0",
    height: "120px",
    width: "60px",
    svgUrl: `/assets/images/table-image/rectangle_8.svg`,
  },
  rectangle_9: {
    borderColor: "#EAEBF0",
    height: "120px",
    width: "60px",
    svgUrl: `/assets/images/table-image/rectangle_8.svg`,
  },
  rectangle_10: {
    borderColor: "#EAEBF0",
    height: "120px",
    width: "60px",
    svgUrl: `/assets/images/table-image/rectangle_8.svg`,
  },
  rectangle_11: {
    borderColor: "#EAEBF0",
    height: "120px",
    width: "60px",
    svgUrl: `/assets/images/table-image/rectangle_8.svg`,
  },
  rectangle_12: {
    borderColor: "#EAEBF0",
    height: "120px",
    width: "60px",
    svgUrl: `/assets/images/table-image/rectangle_8.svg`,
  },
};

export const getTableShape = (shape, noOfPersons) => {
  if (noOfPersons >= 12) {
    return tableShapeAdjustment[`${shape}_12`];
  }
  return tableShapeAdjustment[`${shape}_${noOfPersons}`];
};

export const getGlobalStyle = (seatingTable, selectedTable) => {
  const borderColor =
    seatingTable?.OutletTableBooking?.length > 0
      ? seatingTable?.OutletTableBooking[0]?.status === "SEATED"
        ? "red"
        : "yellow"
      : getTableShape(seatingTable.Table.shape, seatingTable.Table.noOfPerson)
          .borderColor;

  return {
    ...getTableShape(seatingTable.Table.shape, seatingTable.Table.noOfPerson),
    borderColor:
      selectedTable && seatingTable.id === selectedTable.id
        ? "cornflowerblue"
        : borderColor,
  };
};

export const getReservationStyle = (
  seatingTable,
  tableListForMerge,
  isActiveSections,
  sectionTables
) => {
  let borderColor =
    seatingTable?.OutletTableBooking?.length > 0
      ? seatingTable?.OutletTableBooking[0]?.status === "SEATED"
        ? "red"
        : "yellow"
      : getTableShape(seatingTable.Table.shape, seatingTable.Table.noOfPerson)
          .borderColor;

  if (isActiveSections) {
    const findTable = sectionTables.find(
      (outletTableSection) =>
        outletTableSection.outletTableId === seatingTable.id
    );
    if (findTable) {
      borderColor = findTable.color;
    }
  }
  if (
    tableListForMerge.length > 0 &&
    Number(tableListForMerge.indexOf(seatingTable)) !== -1
  )
    borderColor = "cornflowerblue";

  return borderColor;
};

export const getSVGColour = (
  isActiveSections,
  tableListForMerge,
  selectedRow,
  outletTableSection,
  table
) => {
  let tableColour = getTableShape(
    table.Table.shape,
    table.Table.noOfPerson
  ).borderColor;

  //Set sections colors
  if (isActiveSections) {
    const findTable = outletTableSection.find(
      (outletTableSection) => outletTableSection.outletTableId === table.id
    );
    if (findTable) {
      tableColour = findTable.color;
    }
  }

  //Set Selected row colors
  if (selectedRow) {
    if (
      Number(tableListForMerge.indexOf(table)) !== -1 ||
      (selectedRow &&
        selectedRow.GroupSequenceTable.find(
          (data) => data.outletTableId === table.id
        ))
    )
      return `cornflowerblue`;
  } //Set Selected Table color for merge
  else if (Number(tableListForMerge.indexOf(table)) !== -1)
    return `cornflowerblue`;

  return tableColour;
};
