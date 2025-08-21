/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableBody,
  TableSortLabel,
  Box,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { bindActionCreators } from "redux";
import { connect, useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import * as UserAction from "../../../Action/AdminDashboard";
import { RESET_INVOICE } from "../../../utils/AdminDashboard/Constant";

let moment = require("moment-timezone");

const createData = (
  id,
  bookingDate,
  bookingType,
  customer,
  mealType,
  Outlet,
  source,
  specialRequest,
  discountAmount,
  status,
  email,
  mobileNo,
  noOfPerson,
  updatedAt,
  timezone,
  createdAt,
  time,
  occasion,
  OutletTableBooking,
  seatingPreference,
  customerId,
  outletTableName
) => {
  return {
    id,
    bookingDate,
    bookingType,
    customer,
    mealType,
    Outlet,
    source,
    specialRequest,
    discountAmount,
    status,
    email,
    mobileNo,
    noOfPerson,
    updatedAt,
    timezone,
    createdAt,
    time,
    occasion,
    OutletTableBooking,
    seatingPreference,
    customerId,
    outletTableName,
  };
};

const DashboardListingView = (props) => {
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("bookingDate");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterColumn, setFilterColumn] = useState([]);
  const [mealTypes, setMealTypes] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [listingData, setListingData] = useState({
    date: props.date,
    mealType: "All",
  });

  const [columns, setColumns] = useState([
    {
      field: "time",
      headerName: "TIME",
      width: 233,
      isChecked: true,
      type: "time",
    },
    {
      field: "customer",
      headerName: "CUSTOMER",
      width: 233,
      isChecked: true,
      type: "string",
    },
    {
      field: "mobileNo",
      headerName: "MOBILE NUMBER",
      width: 233,
      isChecked: true,
      type: "number",
    },
    {
      field: "noOfPerson",
      headerName: "PAX",
      width: 233,
      isChecked: true,
      type: "string",
    },
    {
      field: "outletTableName",
      headerName: "TABLE",
      width: 233,
      isChecked: true,
      type: "string",
    },
    {
      field: "bookingType",
      headerName: "BOOKING TYPE",
      width: 233,
      isChecked: true,
      type: "string",
    },

    {
      field: "source",
      headerName: "SOURCE",
      width: 233,
      isChecked: true,
      type: "string",
    },
  ]);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    invoiceDetailsOfListingView: state.hotelReducer.invoiceDetailsOfListingView,
    mealTypes: state.hotelReducer.mealTypes,
  }));

  const convertData = (invoiceDetails) => {
    const data = invoiceDetails.map((invoice) => {
      let outletTableName = "";
      invoice.OutletTableBooking.map((sequenceTable, index) => {
        if (index === 0) outletTableName += sequenceTable.OutletTable.name;
        else outletTableName += "," + sequenceTable.OutletTable.name;
        return null;
      });

      if (!isEmpty(props.selectedRow) && props.selectedRow.id === invoice.id) {
        let selectedRowData = { ...props.selectedRow };
        selectedRowData.GroupPossibility = [...invoice.GroupPossibility];
        tableRowRender(selectedRowData);
      }

      return createData(
        invoice.id,
        invoice.bookingDate,
        invoice.bookingType,
        `${invoice?.Customer.name} ${invoice?.Customer.lastName}`,
        invoice.mealType,
        invoice.Outlet.name,
        invoice.source,
        invoice.specialRequest,
        invoice?.Coupon?.name,
        invoice.status,
        invoice.Customer.email,
        invoice.Customer.mobileNo,
        invoice.noOfPerson,
        invoice.updatedAt,
        invoice?.Outlet.timezone,
        invoice.createdAt,
        [invoice?.bookingStartTime, invoice?.bookingEndTime],
        invoice.occasion,
        invoice.OutletTableBooking,
        invoice.seatingPreference,
        invoice.customerId,
        outletTableName
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    if (hotelReducer.selectedOutlet && props.date) {
      let tempListingData = {
        ...listingData,
        date: props.date,
        mealType: "All",
      };
      setListingData(tempListingData);

      //Get Invoices
      props.actions.userAction.getAllInvoiceDetailsOfListingView(
        hotelReducer.selectedOutlet.outlet.id,
        tempListingData
      );

      // Get mealType
      props.actions.userAction.getMealTypes(
        hotelReducer.selectedOutlet.outlet.id
      );
      setPage(0);
      setRowsPerPage(10);
      return () => {
        dispatch({ type: RESET_INVOICE });
      };
    }
  }, [hotelReducer.selectedOutlet, props.date]);

  useEffect(() => {
    setMealTypes([...hotelReducer.mealTypes, { name: "All" }]);
  }, [hotelReducer.mealTypes]);

  useEffect(() => {
    if (hotelReducer.invoiceDetailsOfListingView)
      if (!isEmpty(searchText)) {
        const filteredData = convertData(
          hotelReducer.invoiceDetailsOfListingView
        ).filter((item) => {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(searchText.toLowerCase());
        });
        setRows([...filteredData]);
      } else {
        convertData(hotelReducer.invoiceDetailsOfListingView);
      }
  }, [hotelReducer.invoiceDetailsOfListingView]);

  useEffect(() => {
    const filterColumn = columns.filter((data) => data.isChecked === true);
    setFilterColumn(filterColumn);
  }, [columns]);

  useEffect(() => {
    if (rows.length > 0) {
      if (page * rowsPerPage >= rows.length) {
        setPage(page - 1);
      }
    }
  }, [rows]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const tableRowRender = (row, col, index) => {
    if (hotelReducer.selectedOutlet) {
      switch (col.type) {
        case "string":
          return (
            <TableCell key={index}>
              {row[col.field] ? row[col.field] : "N/A"}
            </TableCell>
          );

        case "number":
          return (
            <TableCell key={index}>
              {row[col.field] ? row[col.field] : "0"}
            </TableCell>
          );

        case "date":
          return (
            <TableCell key={index}>
              {row[col.field]
                ? moment(row[col.field])
                    .tz(hotelReducer.selectedOutlet.outlet.timezone)
                    .format("DD-MM-YYYY hh:mm A")
                : "N/A"}
            </TableCell>
          );

        case "time":
          return (
            <TableCell key={index}>
              {row.time[0] && row.time[1]
                ? `${moment(row.time[0])
                    .tz(hotelReducer.selectedOutlet.outlet.timezone)
                    .format("hh:mm A")} `
                : "N/A"}
            </TableCell>
          );

        default:
          return (
            <TableCell key={index}>
              {row[col.field] ? row[col.field] : "N/A"}
            </TableCell>
          );
      }
    }
  };

  const handleChange = (event) => {
    const data = {
      ...listingData,
      date: props.date,
      mealType: event.target.value,
    };
    props.actions.userAction.getAllInvoiceDetailsOfListingView(
      hotelReducer.selectedOutlet.outlet.id,
      data
    );
    setListingData(data);
  };

  return (
    <div className="user-groups" style={{ height: "calc(100vh - 280px)" }}>
      <Box className="user-groups-search">
        <div className="filter-data">
          <Box>
            <FormControl size="small" sx={{ width: "160px" }}>
              <InputLabel id="demo-simple-select-label">MealType</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={listingData.mealType}
                name="mealType"
                label="mealType"
                inputProps={{ "aria-label": "Without label" }}
                onChange={handleChange}
              >
                {mealTypes.map((mealType, index) => (
                  <MenuItem key={index} value={mealType.name}>
                    {mealType.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
      </Box>

      <Paper sx={{ width: "100%" }}>
        <TableContainer sx={{ maxHeight: "calc(100vh - 377px)" }}>
          <Table
            stickyHeader
            aria-label="sticky table"
            sx={{ minWidth: 750 }}
            size={"medium"}
          >
            <TableHead>
              <TableRow>
                {columns.map(
                  (headCell, index) =>
                    headCell.isChecked && (
                      <TableCell
                        key={headCell.field}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={
                          orderBy === headCell.field ? order : false
                        }
                      >
                        <TableSortLabel
                          active={orderBy === headCell.field}
                          direction={orderBy === headCell.field ? order : "asc"}
                          onClick={createSortHandler(headCell.field)}
                        >
                          {headCell.headerName}
                          {orderBy === headCell.field ? (
                            <Box component="span" sx={visuallyHidden}>
                              {order === "desc"
                                ? "sorted descending"
                                : "sorted ascending"}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                      </TableCell>
                    )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow key={index}>
                      {filterColumn.map((col, index) => {
                        return tableRowRender(row, col, index);
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(DashboardListingView);
