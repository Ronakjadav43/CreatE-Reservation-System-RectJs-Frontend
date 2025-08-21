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
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SearchIcon from "@mui/icons-material/Search";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { visuallyHidden } from "@mui/utils";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { CSVLink } from "react-csv";

import * as UserAction from "../../../../../Action/AdminDashboard";
import DeletePopUp from "../../../../../CommonComponent/DeletePopUp";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import AddCategory from "./Add/index";
import EditCategory from "./Edit/index";
import {
  ActionType,
  handlePermission,
  handleUpdatedBy,
  Modules,
} from "../../../../../utils/userAccess";

const moment = require("moment-timezone");

const columns = [
  { field: "name", headerName: "Name", width: 233 },
  { field: "description", headerName: "Description", width: 233 },
  { field: "isActive", headerName: "Status", width: 233 },
  { field: "updatedBy", headerName: "Updated By", width: 233 },
  { field: "updatedDate", headerName: "Updated Date", width: 233 },
  { field: "Commands", headerName: "Commands", width: 233 },
];

const createData = (
  id,
  name,
  description,
  updatedBy,
  updatedDate,
  createdBy,
  createdDate,
  isActive
) => {
  return {
    id,
    name,
    description,
    updatedBy,
    updatedDate,
    createdBy,
    createdDate,
    isActive,
  };
};

const Category = (props) => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    categories: state.hotelReducer.categories,
    permission: state.hotelReducer.permission,
  }));

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      props.actions.userAction.getCategory(
        hotelReducer.selectedOutlet.outlet.id
      );
      setPage(0);
      setRowsPerPage(10);
    }
  }, [hotelReducer.selectedOutlet]);

  const convertData = (categories) => {
    const data = categories.map((Category) => {
      return createData(
        Category.id,
        Category.name,
        Category.description,
        Category.updatedBy,
        Category.updatedAt,
        Category.createdBy,
        Category.createdAt,
        Category.isActive
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    if (hotelReducer.categories) {
      convertData(hotelReducer.categories);
    }
  }, [hotelReducer.categories]);

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
      const filteredData = convertData(hotelReducer.categories).filter(
        (item) => {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      );
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.categories);
    }
  };

  const handleOpenCategory = () => {
    setOpen(true);
  };

  const handleCloseCategory = () => {
    setOpen(false);
  };

  const handleSaveCategory = (data) => {
    props.actions.userAction.addCategory(
      data,
      hotelReducer.selectedOutlet.outlet.id
    );
  };

  const handleOpenEditCategory = (data) => {
    setEditOpen(true);
    setSelectedCategory(data);
  };

  const handleCloseEditCategory = () => {
    setEditOpen(false);
  };

  const handleSaveEditCategory = (data, selectedCategoryId) => {
    props.actions.userAction.editCategory(
      data,
      selectedCategoryId,
      hotelReducer.selectedOutlet.outlet.id
    );
  };

  const handleOpenDeleteCategory = (data) => {
    setSelectedCategory(data);
    setDeleteOpen(true);
  };

  const handleCloseDeleteCategory = () => {
    setDeleteOpen(false);
  };

  const handleDeleteCategory = (data) => {
    const { id } = data;
    if (id) props.actions.userAction.deleteCategory(id);
  };

  return (
    <React.Fragment>
      {open && (
        <AddCategory
          open={open}
          handleCloseCategory={handleCloseCategory}
          handleSaveCategory={handleSaveCategory}
        />
      )}

      {editOpen && (
        <EditCategory
          open={editOpen}
          selectedCategory={selectedCategory}
          handleCloseEditCategory={handleCloseEditCategory}
          handleSaveEditCategory={handleSaveEditCategory}
        />
      )}

      {deleteOpen && (
        <DeletePopUp
          open={deleteOpen}
          data={{ ...selectedCategory }}
          handleClose={handleCloseDeleteCategory}
          handleDelete={handleDeleteCategory}
          message="Confirm To Delete Tag Category"
        />
      )}

      <div className="user-groups">
        <h1 className="groups-header">Material Settings</h1>
        <h1 className="groups-header-2nd">Category</h1>
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
              <CSVLink data={rows} filename="Category">
                <CloudDownloadOutlinedIcon /> EXPORT
              </CSVLink>
            </Button>
            <Button
              disabled={handlePermission(
                hotelReducer.permission.permission,
                Modules.MATERIALCATEGORY,
                ActionType.create,
                true
              )}
              variant="contained"
              onClick={handleOpenCategory}
            >
              <AddOutlinedIcon /> ADD
            </Button>
          </div>
        </Box>

        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: "calc(100vh - 285px)" }}>
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
                        <TableCell>{row.name ? row.name : "N/A"}</TableCell>
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
                        <TableCell>{handleUpdatedBy(row.updatedBy)}</TableCell>
                        <TableCell>
                          {row.updatedDate
                            ? moment(row.updatedDate).format(
                                "DD-MM-YYYY hh:mm A"
                              )
                            : "N/A"}
                        </TableCell>
                        <TableCell className="commands-icons">
                          <BorderColorOutlinedIcon
                            style={{
                              cursor: handlePermission(
                                hotelReducer.permission.permission,
                                Modules.MATERIALCATEGORY,
                                ActionType.update
                              )
                                ? "pointer"
                                : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.MATERIALCATEGORY,
                                ActionType.update
                              ) && handleOpenEditCategory({ ...row })
                            }
                          />
                          <DeleteOutlinedIcon
                            style={{
                              cursor: handlePermission(
                                hotelReducer.permission.permission,
                                Modules.MATERIALCATEGORY,
                                ActionType.delete
                              )
                                ? "pointer"
                                : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.MATERIALCATEGORY,
                                ActionType.delete
                              ) && handleOpenDeleteCategory({ ...row })
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
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(Category);
