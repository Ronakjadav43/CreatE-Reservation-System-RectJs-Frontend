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

const columns = [
  { field: "name", headerName: "Name", width: 233 },
  { field: "duration", headerName: "Duration(second)", width: 233 },
  { field: "identifier", headerName: "Customer Number", width: 233 },
  { field: "createdAt", headerName: "Date", width: 233 },
  { field: "action", headerName: "Status", width: 233 },
];

const createData = (
  type,
  name,
  duration,
  identifier,
  createdAt,
  action,
  module,
  status,
  updatedBy,
  updatedAt
) => {
  return {
    type,
    name,
    duration,
    identifier,
    createdAt,
    action,
    module,
    status,
    updatedBy,
    updatedAt,
  };
};

const Ivrs = () => {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("type");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const hotelReducer = useSelector((state) => ({
    systemLogs: state.hotelReducer.systemLogs,
  }));

  useEffect(() => {
    if (hotelReducer.systemLogs) {
      const systemLogs = hotelReducer.systemLogs.filter(
        (systemLog) => systemLog.type === "IVRS"
      );
      convertData(systemLogs);
      setPage(0);
      setRowsPerPage(5);
    }
  }, [hotelReducer.systemLogs]);

  const convertData = (systemLogs) => {
    const data = systemLogs.map((log) => {
      return createData(
        log.type,
        log.name,
        log.duration,
        log.identifier,
        log.createdAt,
        log.action,
        log.module,
        log.status,
        log.updatedBy,
        log.updatedAt
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
                    <TableCell>{row.duration ? row.duration : "N/A"}</TableCell>
                    <TableCell>
                      {row.identifier ? row.identifier : "N/A"}
                    </TableCell>
                    <TableCell>
                      {row.createdAt
                        ? moment(row.createdAt).format("DD-MM-YYYY hh:mm A")
                        : "N/A"}
                    </TableCell>
                    <TableCell> {row.action ? row.action : "N/A"}</TableCell>
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
export default Ivrs;
