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

import EditMeal from "./Edit";
import AddMeal from "./Add";
import DeletePopUp from "../../../../CommonComponent/DeletePopUp";
import * as UserAction from "../../../../Action/AdminDashboard";
import {
  handlePermission,
  Modules,
  ActionType,
  handleUpdatedBy,
} from "../../../../utils/userAccess";

let moment = require("moment-timezone");

const columns = [
  { field: "name", headerName: "Name", width: 233 },
  { field: "description", headerName: "Description", width: 233 },
  { field: "isActive", headerName: "Status", width: 233 },
  { field: "updatedBy", headerName: "Updated By", width: 233 },
  { field: "updatedAt", headerName: "Updated Date", width: 233 },
  { field: "Commands", headerName: "Commands", width: 233 },
];

const createData = (
  id,
  name,
  description,
  outletId,
  isActive,
  createdAt,
  updatedAt,
  deletedAt,
  createdBy,
  updatedBy
) => {
  return {
    id,
    name,
    description,
    outletId,
    isActive,
    createdAt,
    updatedAt,
    deletedAt,
    createdBy,
    updatedBy,
  };
};

const MealType = (props) => {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [open, setOpen] = React.useState(false);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    mealTypes: state.hotelReducer.mealTypes,
    permission: state.hotelReducer.permission,
  }));

  const convertData = (mealTypes) => {
    const data = mealTypes.map((mealType) => {
      return createData(
        mealType.id,
        mealType.name,
        mealType.description,
        mealType.outletId,
        mealType.isActive,
        mealType.createdAt,
        mealType.updatedAt,
        mealType.deletedAt,
        mealType.createdBy,
        mealType.updatedBy
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
      setPage(0);
      setRowsPerPage(10);
    }
  }, [hotelReducer.selectedOutlet]);

  useEffect(() => {
    convertData(hotelReducer.mealTypes);
  }, [hotelReducer.mealTypes]);

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
      const filteredData = convertData(hotelReducer.mealTypes).filter(
        (item) => {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      );
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.mealTypes);
    }
  };

  const handleOpenEditMeal = (data) => {
    setSelectedMeal(data);
    setEditOpen(true);
  };

  const handleCloseEditMeal = () => {
    setEditOpen(false);
  };

  const handleOpenDeleteMeal = (data) => {
    setSelectedMeal(data);
    setDeleteOpen(true);
  };

  const handleCloseDeleteMeal = () => {
    setDeleteOpen(false);
  };

  const handleEditSaveMeal = (data, sectionID) => {
    props.actions.userAction.updateMeal(
      data,
      hotelReducer.selectedOutlet?.outlet.id,
      sectionID
    );
  };

  const handleDeleteMeal = (data) => {
    const { id } = data;
    props.actions.userAction.deleteMeal(
      id,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleOpenMeal = () => {
    setOpen(true);
  };

  const handleCloseMeal = () => {
    setOpen(false);
  };

  const handleSaveMeal = (data) => {
    props.actions.userAction.addMeal(
      data,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  return (
    <div className="user-groups" style={{ height: "calc(100vh - 275px)" }}>
      {/** Add Meal */}
      {open && (
        <AddMeal
          open={open}
          handleCloseMeal={handleCloseMeal}
          handleSaveMeal={handleSaveMeal}
        />
      )}

      {/** Edit Meal */}
      {editOpen && (
        <EditMeal
          open={editOpen}
          selectedmeal={selectedMeal}
          handleCloseEditMeal={handleCloseEditMeal}
          handleEditSaveMeal={handleEditSaveMeal}
        />
      )}

      {/** Delete Meal */}
      {deleteOpen && (
        <DeletePopUp
          open={deleteOpen}
          data={selectedMeal}
          handleClose={handleCloseDeleteMeal}
          handleDelete={handleDeleteMeal}
          message="Confirm To Delete Meal"
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
            <CSVLink data={rows} filename="Meal Type">
              <CloudDownloadOutlinedIcon /> EXPORT
            </CSVLink>
          </Button>
          <Button
            disabled={handlePermission(
              hotelReducer.permission.permission,
              Modules.MEALTYPE,
              ActionType.create,
              true
            )}
            variant="contained"
            onClick={handleOpenMeal}
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
                      <TableCell> {row.name}</TableCell>
                      <TableCell> {row.description}</TableCell>
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
                      <TableCell> {handleUpdatedBy(row.updatedBy)}</TableCell>
                      <TableCell>
                        {moment(row.updatedAt).format("DD-MM-YYYY hh:mm A")}
                      </TableCell>

                      <TableCell className="commands-icons">
                        <BorderColorOutlinedIcon
                          style={{
                            cursor:
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.MEALTYPE,
                                ActionType.update
                              ) && row.outletId
                                ? "pointer"
                                : "not-allowed",
                          }}
                          onClick={() =>
                            handlePermission(
                              hotelReducer.permission.permission,
                              Modules.MEALTYPE,
                              ActionType.update
                            ) &&
                            row.outletId &&
                            handleOpenEditMeal({ ...row })
                          }
                        />
                        <DeleteOutlinedIcon
                          style={{
                            cursor:
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.MEALTYPE,
                                ActionType.delete
                              ) && row.outletId
                                ? "pointer"
                                : "not-allowed",
                          }}
                          onClick={() =>
                            handlePermission(
                              hotelReducer.permission.permission,
                              Modules.MEALTYPE,
                              ActionType.delete
                            ) &&
                            row.outletId &&
                            handleOpenDeleteMeal({ ...row })
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

export default connect(null, mapDispatchToProps)(MealType);
