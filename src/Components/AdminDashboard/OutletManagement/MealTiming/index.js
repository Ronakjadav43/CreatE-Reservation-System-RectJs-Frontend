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
import AddMealTime from "./Add";
import EditMealTime from "./Edit";
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
  { field: "isActive", headerName: "Status", width: 233 },
  { field: "openingTime", headerName: "Meal Timing", width: 233 },
  { field: "updatedBy", headerName: "Updated By", width: 233 },
  { field: "updatedAt", headerName: "Updated Date", width: 233 },
  { field: "Commands", headerName: "Commands", width: 233 },
];
const createData = (
  id,
  name,
  dayOfWeekName,
  isActive,
  openingTime,
  closingTime,
  updatedBy,
  updatedAt,
  createdAt,
  createdBy,
  sectionId,
  dayofweek
) => {
  return {
    id,
    name,
    dayOfWeekName,
    isActive,
    openingTime,
    closingTime,
    updatedBy,
    updatedAt,
    createdAt,
    createdBy,
    sectionId,
    dayofweek,
  };
};
const MealTiming = (props) => {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("dayofweek");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedMealTime, setSelectedMealTime] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [mealTypes, setMealTypes] = useState([]);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    mealTypes: state.hotelReducer.mealTypes,
    mealTimings: state.hotelReducer.mealTimings,
    permission: state.hotelReducer.permission,
  }));

  const convertData = (mealTimings) => {
    const data = mealTimings.map((mealTiming) => {
      return createData(
        mealTiming.id,
        mealTiming.Section?.name,
        mealTiming.dayOfWeekName,
        mealTiming.isActive,
        mealTiming.openingTime,
        mealTiming.closingTime,
        mealTiming.updatedBy,
        mealTiming.updatedAt,
        mealTiming.createdAt,
        mealTiming.createdBy,
        mealTiming.sectionId,
        mealTiming.dayofweek
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
      props.actions.userAction.getMealTimings(
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
    convertData(hotelReducer.mealTimings);
  }, [hotelReducer.mealTimings]);

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
      const filteredData = convertData(hotelReducer.mealTimings).filter(
        (item) => {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      );
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.mealTimings);
    }
  };

  const handleOpenMealTime = () => {
    setOpen(true);
  };

  const handleOpenEditMealTime = (data) => {
    setSelectedMealTime(data);
    setEditOpen(true);
  };

  const handleCloseMealTime = () => {
    setOpen(false);
  };

  const handleCloseEditMealTime = () => {
    setEditOpen(false);
  };

  const handleEditSaveMealTime = (data, timeSlotId) => {
    data = {
      ...data,
      openingTime: moment(data.openingTime).format("HH:mm"),
      closingTime: moment(data.closingTime).format("HH:mm"),
    };
    props.actions.userAction.updateMealTime(
      data,
      timeSlotId,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleSaveMealTime = (data) => {
    data = {
      ...data,
      openingTime: moment(data.openingTime).format("HH:mm"),
      closingTime: moment(data.closingTime).format("HH:mm"),
    };
    props.actions.userAction.addMealTime(
      data,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleOpenDeleteMealTime = (data) => {
    setSelectedMealTime(data);
    setDeleteOpen(true);
  };

  const handleCloseDeleteMealTime = () => {
    setDeleteOpen(false);
  };

  const handleDeleteMealTime = (data) => {
    const { id } = data;
    props.actions.userAction.deleteMealTime(
      id,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  return (
    <div className="user-groups" style={{ height: "calc(100vh - 275px)" }}>
      {open && (
        <AddMealTime
          open={open}
          mealTypes={mealTypes}
          handleCloseMealTime={handleCloseMealTime}
          handleSaveMealTime={handleSaveMealTime}
          timezone={hotelReducer.selectedOutlet.outlet.timezone}
        />
      )}

      {editOpen && (
        <EditMealTime
          open={editOpen}
          selectedMealTime={selectedMealTime}
          mealTypes={mealTypes}
          handleCloseEditMealTime={handleCloseEditMealTime}
          handleEditSaveMealTime={handleEditSaveMealTime}
          timezone={hotelReducer.selectedOutlet.outlet.timezone}
        />
      )}

      {deleteOpen && (
        <DeletePopUp
          open={deleteOpen}
          data={selectedMealTime}
          handleClose={handleCloseDeleteMealTime}
          handleDelete={handleDeleteMealTime}
          message="Confirm To Delete Meal Time"
        />
      )}

      <Box className="user-groups-search">
        <TextField
          className="search-box"
          sx={{ width: "250px" }}
          size="small"
          placeholder="Search"
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
            <CSVLink data={rows} filename="Meal Timing">
              <CloudDownloadOutlinedIcon /> EXPORT
            </CSVLink>
          </Button>
          <Button
            disabled={handlePermission(
              hotelReducer.permission.permission,
              Modules.MEALTIMING,
              ActionType.create,
              true
            )}
            variant="contained"
            onClick={handleOpenMealTime}
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
                    <TableRow key={index}>
                      <TableCell> {row.dayOfWeekName}</TableCell>
                      <TableCell> {row.name}</TableCell>
                      <TableCell>
                        {row.isActive ? (
                          <Button variant="contained" className="status-btn">
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
                        {row.openingTime}-{row.closingTime}
                      </TableCell>
                      <TableCell> {handleUpdatedBy(row.updatedBy)}</TableCell>
                      <TableCell>
                        {row.updatedAt
                          ? moment(row.updatedAt).format("DD-MM-YYYY hh:mm A")
                          : "N/A"}
                      </TableCell>
                      <TableCell className="commands-icons">
                        <BorderColorOutlinedIcon
                          style={{
                            cursor: handlePermission(
                              hotelReducer.permission.permission,
                              Modules.MEALTIMING,
                              ActionType.update
                            )
                              ? "pointer"
                              : "not-allowed",
                          }}
                          onClick={() =>
                            handlePermission(
                              hotelReducer.permission.permission,
                              Modules.MEALTIMING,
                              ActionType.update
                            ) && handleOpenEditMealTime({ ...row })
                          }
                        />
                        <DeleteOutlinedIcon
                          style={{
                            cursor: handlePermission(
                              hotelReducer.permission.permission,
                              Modules.MEALTIMING,
                              ActionType.delete
                            )
                              ? "pointer"
                              : "not-allowed",
                          }}
                          onClick={() =>
                            handlePermission(
                              hotelReducer.permission.permission,
                              Modules.MEALTIMING,
                              ActionType.delete
                            ) && handleOpenDeleteMealTime({ ...row })
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
  );
};
const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(MealTiming);
