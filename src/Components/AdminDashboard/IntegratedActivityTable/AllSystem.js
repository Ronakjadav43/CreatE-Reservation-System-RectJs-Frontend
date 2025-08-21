/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useSelector } from "react-redux";
import { visuallyHidden } from "@mui/utils";
import { Box, TableSortLabel } from "@mui/material";
import moment from "moment-timezone";
import { handleUpdatedBy } from "../../../utils/userAccess";

const columns = [
  { field: "name", headerName: "Name of Customer", width: 233 },
  { field: "identifier", headerName: "Email", width: 233 },
  { field: "noOfPerson", headerName: "Pax", width: 233 },
  { field: "bookingDate", headerName: "Date", width: 233 },
  { field: "bookingStartTime", headerName: "Time", width: 233 },
  { field: "bookingType", headerName: "Booking Type", width: 233 },
  { field: "updatedBy", headerName: "User", width: 233 },
  { field: "status", headerName: "Status", width: 233 },
];

const createData = (
  name,
  identifier,
  noOfPerson,
  bookingDate,
  bookingStartTime,
  bookingType,
  updatedBy,
  emailStatus,
  invoice
) => {
  return {
    name,
    identifier,
    noOfPerson,
    bookingDate,
    bookingStartTime,
    bookingType,
    updatedBy,
    emailStatus,
    invoice,
  };
};

const AllSystem = () => {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("type");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const hotelReducer = useSelector((state) => ({
    systemLogs: state.hotelReducer.systemLogs,
  }));

  useEffect(() => {
    convertData(hotelReducer.systemLogs);
    setPage(0);
    setRowsPerPage(5);
  }, [hotelReducer.systemLogs]);

  const convertData = (systemLogs) => {
    const data = hotelReducer.systemLogs
      .filter((logs) => logs.type === "NEW_RESERVATION")
      .map((log) => {
        return createData(
          `${log.OutletInvoice.Customer.name} ${log.OutletInvoice.Customer.lastName}`,
          log.OutletInvoice.Customer.email,
          log.OutletInvoice.noOfPerson,
          log.OutletInvoice.bookingDate,
          log.OutletInvoice.bookingStartTime,
          log.OutletInvoice.bookingType,
          log.OutletInvoice.updatedBy === " ,"
            ? log.OutletInvoice?.Customer?.name
            : log.OutletInvoice.updatedBy,
          log.status,
          { ...log.OutletInvoice }
        );
      });
    setRows(data);
    return data;
  };

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

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{ minWidth: 750 }}
          size={"medium"}
        >
          <TableHead>
            <TableRow>
              {columns.map((headCell, index) => (
                <TableCell
                  key={headCell.field}
                  align={headCell.numeric ? "right" : "left"}
                  padding={headCell.disablePadding ? "none" : "normal"}
                  sortDirection={orderBy === headCell.field ? order : false}
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
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow
                    key={index}
                    className={row.status === "FAIL" ? "active" : ""}
                  >
                    <TableCell> {row.name ? row.name : "N/A"}</TableCell>
                    <TableCell>
                      {row.identifier ? row.identifier : "N/A"}
                    </TableCell>
                    <TableCell>
                      {row.noOfPerson ? row.noOfPerson : "N/A"}
                    </TableCell>
                    <TableCell>
                      {row.bookingDate
                        ? moment(row.bookingDate).format("DD-MM-YYYY")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {row.bookingStartTime
                        ? moment(row.bookingStartTime).format(" hh:mm A")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {row.bookingType ? row.bookingType : "N/A"}
                    </TableCell>
                    <TableCell>{handleUpdatedBy(row.updatedBy)} </TableCell>
                    <TableCell>
                      {row.emailStatus ? row.emailStatus : "N/A"}
                    </TableCell>
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
  );
};
export default AllSystem;
