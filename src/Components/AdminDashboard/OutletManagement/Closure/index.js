/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Button,
  InputAdornment,
  Paper,
  TextField,
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
import SearchIcon from "@mui/icons-material/Search";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { visuallyHidden } from "@mui/utils";
import { bindActionCreators } from "redux";
import { isEmpty } from "lodash";
import { connect, useSelector } from "react-redux";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { CSVLink } from "react-csv";

import DeletePopUp from "../../../../CommonComponent/DeletePopUp";
import * as UserAction from "../../../../Action/AdminDashboard";
import AddClosure from "./Add";
import EditClosure from "./Edit";
import {
  ActionType,
  Modules,
  handlePermission,
  handleUpdatedBy,
} from "../../../../utils/userAccess";

let moment = require("moment-timezone");

const columns = [
  { field: "dayOfWeekName", headerName: "Day Of Week", width: 233 },
  { field: "name", headerName: "Meal Type", width: 233 },
  { field: "effectiveFrom", headerName: "Start Date", width: 233 },
  { field: "effectiveTo", headerName: "End Date", width: 233 },
  { field: "openingTime", headerName: "Operating Hour", width: 233 },
  { field: "outletStatus", headerName: "Outlet Status", width: 233 },
  { field: "reason", headerName: "Reason", width: 233 },
  { field: "isActive", headerName: "Status", width: 233 },
  { field: "updatedBy", headerName: "Updated By", width: 233 },
  { field: "updatedAt", headerName: "Updated Date", width: 233 },
  { field: "Commands", headerName: "Commands", width: 233 },
];
const createData = (
  id,
  name,
  dayOfWeekName,
  effectiveFrom,
  effectiveTo,
  openingTime,
  closingTime,
  outletStatus,
  reason,
  updatedBy,
  updatedAt,
  createdAt,
  createdBy,
  isActive,
  sectionId,
  dayofweek
) => {
  return {
    id,
    name,
    dayOfWeekName,
    effectiveFrom,
    effectiveTo,
    openingTime,
    closingTime,
    outletStatus,
    reason,
    updatedBy,
    updatedAt,
    createdAt,
    createdBy,
    isActive,
    sectionId,
    dayofweek,
  };
};
const Closure = (props) => {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedclosure, setSelectedClosure] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [mealTypes, setMealTypes] = useState([]);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    mealTypes: state.hotelReducer.mealTypes,
    closures: state.hotelReducer.closures,
    permission: state.hotelReducer.permission,
  }));

  const convertData = (closures) => {
    const data = closures.map((closure) => {
      return createData(
        closure.id,
        closure.Section?.name,
        closure.dayOfWeekName,
        closure.effectiveFrom,
        closure.effectiveTo,
        closure.openingTime,
        closure.closingTime,
        closure.outletStatus,
        closure.reason,
        closure.updatedBy,
        closure.updatedAt,
        closure.createdAt,
        closure.createdBy,
        closure.isActive,
        closure.sectionId,
        closure.dayofweek
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      props.actions.userAction.getMealTypes(
        hotelReducer.selectedOutlet.outlet.id
      );
      props.actions.userAction.getClosures(
        hotelReducer.selectedOutlet.outlet.id
      );

      setPage(0);
      setRowsPerPage(10);
    }
  }, [hotelReducer.selectedOutlet]);

  useEffect(() => {
    setMealTypes(
      hotelReducer.mealTypes.filter((data) => data.isActive === true)
    );
  }, [hotelReducer.mealTypes]);

  useEffect(() => {
    convertData(hotelReducer.closures);
  }, [hotelReducer.closures]);

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

  const searchItems = (value) => {
    if (!isEmpty(value)) {
      const filteredData = convertData(hotelReducer.closures).filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(value.toLowerCase());
      });
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.closures);
    }
  };

  const handleOpenClosure = () => {
    setOpen(true);
  };

  const handleOpenEditClosure = (data) => {
    setSelectedClosure(data);
    setEditOpen(true);
  };

  const handleCloseClosure = () => {
    setOpen(false);
  };

  const handleCloseEditClosure = () => {
    setEditOpen(false);
  };

  const handleEditSaveClosure = (data, closureId) => {
    data = {
      ...data,
      openingTime: moment(data.openingTime).format("HH:mm"),
      closingTime: moment(data.closingTime).format("HH:mm"),
      effectiveFrom: moment(data.effectiveFrom)
        .tz(hotelReducer.selectedOutlet.outlet.timezone)
        .format("DD-MM-YYYY"),
      effectiveTo: moment(data.effectiveTo)
        .tz(hotelReducer.selectedOutlet.outlet.timezone)
        .format("DD-MM-YYYY"),
    };
    props.actions.userAction.updateClosure(
      data,
      closureId,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleSaveClosure = (data) => {
    data = {
      ...data,
      openingTime: moment(data.openingTime).format("HH:mm"),
      closingTime: moment(data.closingTime).format("HH:mm"),
      effectiveFrom: moment(data.effectiveFrom).format("DD-MM-YYYY"),
      effectiveTo: moment(data.effectiveTo).format("DD-MM-YYYY"),
    };
    props.actions.userAction.addClosure(
      data,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleOpenDeleteClosure = (data) => {
    setSelectedClosure(data);
    setDeleteOpen(true);
  };

  const handleCloseDeleteClosure = () => {
    setDeleteOpen(false);
  };

  const handleDeleteMealTime = (data) => {
    const { id } = data;
    props.actions.userAction.deleteClosure(
      id,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  return (
    hotelReducer.selectedOutlet && (
      <React.Fragment>
        <div className="user-groups" style={{ height: "calc(100vh - 275px)" }}>
          {open && (
            <AddClosure
              open={open}
              mealTypes={mealTypes}
              handleCloseClosure={handleCloseClosure}
              handleSaveClosure={handleSaveClosure}
              timezone={hotelReducer.selectedOutlet.outlet.timezone}
            />
          )}

          {editOpen && (
            <EditClosure
              open={editOpen}
              selectedclosure={selectedclosure}
              mealTypes={mealTypes}
              handleCloseEditClosure={handleCloseEditClosure}
              handleEditSaveClosure={handleEditSaveClosure}
              timezone={hotelReducer.selectedOutlet.outlet.timezone}
            />
          )}

          {deleteOpen && (
            <DeletePopUp
              open={deleteOpen}
              data={selectedclosure}
              handleClose={handleCloseDeleteClosure}
              handleDelete={handleDeleteMealTime}
              message="Confirm To Delete Closure"
            />
          )}

          <Box className="user-groups-search">
            <TextField
              className="search-box"
              sx={{ width: "250px" }}
              placeholder="Search"
              size="small"
              onChange={(e) => searchItems(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <div className="primary-btn">
              <Button variant="outlined">
                <CSVLink data={rows} filename="Closure">
                  <CloudDownloadOutlinedIcon /> EXPORT
                </CSVLink>
              </Button>
              <Button
                disabled={handlePermission(
                  hotelReducer.permission.permission,
                  Modules.CLOSURE,
                  ActionType.create,
                  true
                )}
                variant="contained"
                onClick={handleOpenClosure}
              >
                <AddOutlinedIcon /> ADD
              </Button>
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
                    {columns.map((headCell, index) => (
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
                        <TableRow key={index}>
                          <TableCell> {row.dayOfWeekName}</TableCell>
                          <TableCell> {row.name}</TableCell>
                          <TableCell>
                            {row.effectiveFrom
                              ? moment(row.effectiveFrom)
                                  .tz(
                                    hotelReducer.selectedOutlet.outlet.timezone
                                  )
                                  .format("DD-MM-YYYY")
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {row.effectiveTo
                              ? moment(row.effectiveTo)
                                  .tz(
                                    hotelReducer.selectedOutlet.outlet.timezone
                                  )
                                  .format("DD-MM-YYYY")
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {row.openingTime} - {row.closingTime}
                          </TableCell>
                          <TableCell>
                            {row.outletStatus ? (
                              <Button
                                variant="contained"
                                className="status-btn"
                              >
                                active
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                className="status-btn inactive"
                              >
                                inactive
                              </Button>
                            )}
                          </TableCell>
                          <TableCell> {row.reason} </TableCell>
                          <TableCell>
                            {row.isActive ? (
                              <Button
                                variant="contained"
                                className="status-btn"
                              >
                                active
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                className="status-btn inactive"
                              >
                                inactive
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>
                            {handleUpdatedBy(row.updatedBy)}
                          </TableCell>
                          <TableCell>
                            {row.updatedAt
                              ? moment(row.updatedAt).format(
                                  "DD-MM-YYYY hh:mm A"
                                )
                              : "N/A"}
                          </TableCell>
                          <TableCell className="commands-icons">
                            <BorderColorOutlinedIcon
                              style={{
                                cursor: handlePermission(
                                  hotelReducer.permission.permission,
                                  Modules.CLOSURE,
                                  ActionType.update
                                )
                                  ? "pointer"
                                  : "not-allowed",
                              }}
                              onClick={() =>
                                handlePermission(
                                  hotelReducer.permission.permission,
                                  Modules.CLOSURE,
                                  ActionType.update
                                ) && handleOpenEditClosure({ ...row })
                              }
                            />
                            <DeleteOutlinedIcon
                              style={{
                                cursor: handlePermission(
                                  hotelReducer.permission.permission,
                                  Modules.CLOSURE,
                                  ActionType.delete
                                )
                                  ? "pointer"
                                  : "not-allowed",
                              }}
                              onClick={() =>
                                handlePermission(
                                  hotelReducer.permission.permission,
                                  Modules.CLOSURE,
                                  ActionType.delete
                                ) && handleOpenDeleteClosure({ ...row })
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
      </React.Fragment>
    )
  );
};
const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(Closure);
