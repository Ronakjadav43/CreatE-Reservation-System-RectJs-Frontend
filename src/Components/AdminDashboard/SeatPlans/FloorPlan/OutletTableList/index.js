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
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import {
  ActionType,
  handlePermission,
  handleUpdatedBy,
  Modules,
} from "../../../../../utils/userAccess";

let moment = require("moment-timezone");

const columns = [
  { field: "name", headerName: "Table Name", width: 233 },
  { field: "tableType", headerName: "Table Type", width: 233 },
  { field: "noOfPax", headerName: "No Of Pax", width: 233 },
  { field: "seatType", headerName: "Seat Type", width: 233 },
  { field: "updatedBy", headerName: "Updated By", width: 233 },
  { field: "updatedAt", headerName: "Updated Date", width: 233 },
  { field: "Commands", headerName: "Commands", width: 233 },
];

const createData = (
  id,
  name,
  tableType,
  noOfPax,
  seatType,
  updatedBy,
  updatedAt,
  createdBy,
  createdAt
) => {
  return {
    id,
    name,
    tableType,
    noOfPax,
    seatType,
    updatedBy,
    updatedAt,
    createdBy,
    createdAt,
  };
};

const OutletTableList = (props) => {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { handleEditSelectedTable, handleDeleteSelectedTable } = props;

  useEffect(() => {
    if (props.outletTables.length >= 0) convertData(props.outletTables);
  }, [props.outletTables]);

  useEffect(() => {
    if (rows.length > 0) {
      if (page * rowsPerPage >= rows.length) {
        setPage(page - 1);
      }
    }
  }, [rows]);

  const convertData = (outletTables) => {
    const data = outletTables.map((outletTable) => {
      return createData(
        outletTable.id,
        outletTable.name,
        outletTable?.Table.name,
        outletTable?.Table.noOfPerson,
        outletTable?.OutletSeatType?.SeatType?.name,
        outletTable.updatedBy,
        outletTable.updatedAt,
        outletTable.createdBy,
        outletTable.createdAt
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

  const selectedTableRow = (row) => {
    props.selectedTableRow({
      ...row,
      check: 1,
      GroupSequenceTable: [{ outletTableId: row.id }],
    });
  };

  return (
    <React.Fragment>
      {props.outletTables && (
        <div>
          <h1>Table List</h1>
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
                    {columns.map((headCell) => (
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
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow
                          className={
                            props.selectedRow &&
                            props.selectedRow.check === 1 &&
                            row.id === props.selectedRow.id
                              ? "active"
                              : ""
                          }
                          key={index}
                          onClick={() => selectedTableRow(row)}
                        >
                          <TableCell>{row.name ? row.name : "N/A"}</TableCell>
                          <TableCell>
                            {row.tableType ? row.tableType : "N/A"}
                          </TableCell>
                          <TableCell>
                            {row.noOfPax ? row.noOfPax : "N/A"}
                          </TableCell>
                          <TableCell>
                            {row.seatType ? row.seatType : "N/A"}
                          </TableCell>
                          <TableCell>
                            {handleUpdatedBy(row.updatedBy)}
                          </TableCell>
                          <TableCell>
                            {moment(row.updatedAt).format("DD-MM-YYYY hh:mm A")}
                          </TableCell>
                          <TableCell className="commands-icons">
                            <BorderColorOutlinedIcon
                              style={{
                                cursor: handlePermission(
                                  props.permission.permission,
                                  Modules.SEATPLANS,
                                  ActionType.update
                                )
                                  ? "pointer"
                                  : "not-allowed",
                              }}
                              onClick={() =>
                                handlePermission(
                                  props.permission.permission,
                                  Modules.SEATPLANS,
                                  ActionType.update
                                ) && handleEditSelectedTable({ ...row })
                              }
                            />
                            <DeleteOutlinedIcon
                              style={{
                                cursor: handlePermission(
                                  props.permission.permission,
                                  Modules.SEATPLANS,
                                  ActionType.delete
                                )
                                  ? "pointer"
                                  : "not-allowed",
                              }}
                              onClick={() =>
                                handlePermission(
                                  props.permission.permission,
                                  Modules.SEATPLANS,
                                  ActionType.delete
                                ) && handleDeleteSelectedTable({ ...row })
                              }
                            />
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
        </div>
      )}
    </React.Fragment>
  );
};
export default OutletTableList;
