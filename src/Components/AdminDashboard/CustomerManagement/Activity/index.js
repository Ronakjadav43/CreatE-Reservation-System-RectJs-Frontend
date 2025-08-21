/* eslint-disable react-hooks/exhaustive-deps */
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
import { connect, useSelector } from "react-redux";

import * as UserAction from "../../../../Action/AdminDashboard";
import { handleUpdatedBy } from "../../../../utils/userAccess";

let moment = require("moment-timezone");

const columns = [
  { field: "index", headerName: "Index", width: 233 },
  { field: "moduleName", headerName: "Page Title", width: 233 },
  { field: "date", headerName: "Date Change", width: 233 },
  { field: "action", headerName: "Action", width: 233 },
  { field: "UpdatedBy", headerName: "Updated By", width: 233 },
  { field: "contentChange", headerName: "Content Change", width: 233 },
];

const createData = (
  index,
  moduleName,
  date,
  action,
  UpdatedBy,
  contentChange
) => {
  return {
    index,
    moduleName,
    date,
    action,
    UpdatedBy,
    contentChange,
  };
};

const Activity = (props) => {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const customerReservationData = useSelector(
    (state) => state.hotelReducer.customerReservationData
  );

  useEffect(() => {
    if (props.customer.id) {
      props.actions.userAction.getCustomerReservation(
        { filter: "" },
        props.customer.Outlet.id,
        props.customer.id
      );
    }
  }, [props.customer.id]);

  useEffect(() => {
    if (customerReservationData?.Customer) {
      convertData(customerReservationData?.Customer);
    } else {
      setRows([]);
    }
  }, [customerReservationData?.Customer]);

  const convertData = (customerReservationData) => {
    const data = customerReservationData.CustomerLogs?.filter(
      (state) => state.logType === "ACIVITY"
    );

    if (data) {
      const smsData = data.map((reservation, index) => {
        return createData(
          index,
          reservation.moduleName,
          reservation.createdAt,
          reservation.action,
          reservation.updatedBy,
          reservation.contentChange
        );
      });
      setRows(smsData);
      return smsData;
    }
  };

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
    setOrderBy(event, property);
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
    <React.Fragment>
      {rows.length > 0 && (
        <Box className="user-groups card-shadow" style={{ gap: "100px" }}>
          <Paper sx={{ width: "100%" }}>
            <TableContainer sx={{ maxHeight: "calc(100vh - 460px)" }}>
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
                        key={(headCell.field, index)}
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
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.moduleName}</TableCell>
                          <TableCell>
                            {row.date
                              ? moment(row.date).format("DD-MM-YYYY hh:mm A")
                              : "N/A"}
                          </TableCell>
                          <TableCell>{row.action}</TableCell>
                          <TableCell>
                            {handleUpdatedBy(row.UpdatedBy)}
                          </TableCell>
                          <TableCell>
                            <table>
                              {row.contentChange &&
                                row.contentChange.length > 0 &&
                                row.contentChange.map((content) => (
                                  <tr>
                                    <td>{content.filedName}</td>
                                    <td>{content.oldValue}</td>
                                    <td>{content.newValue}</td>
                                  </tr>
                                ))}
                            </table>
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
        </Box>
      )}
    </React.Fragment>
  );
};
const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(Activity);
