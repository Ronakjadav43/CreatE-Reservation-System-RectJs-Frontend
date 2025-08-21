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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { visuallyHidden } from "@mui/utils";
import { bindActionCreators } from "redux";
import { isEmpty } from "lodash";
import { connect, useDispatch, useSelector } from "react-redux";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { CSVLink } from "react-csv";

import * as UserAction from "../../../../../Action/AdminDashboard";
import DeletePopUp from "../../../../../CommonComponent/DeletePopUp";
import Add from "./Add/index";
import Edit from "./Edit";
import {
  ActionType,
  handlePermission,
  handleUpdatedBy,
  Modules,
} from "../../../../../utils/userAccess";
import {
  RESET_ALL_SUBCATEGORY,
  RESET_CATEGORY,
} from "../../../../../utils/AdminDashboard/Constant";

let moment = require("moment-timezone");

const columns = [
  { field: "name", headerName: "Name", width: 233 },
  { field: "description", headerName: "Description", width: 233 },
  { field: "tagCategory", headerName: "Category", width: 233 },
  { field: "isActive", headerName: "Status", width: 233 },
  { field: "updatedBy", headerName: "Updated By", width: 233 },
  { field: "updatedAt", headerName: "Updated Date", width: 233 },
  { field: "Commands", headerName: "Commands", width: 233 },
];

const createData = (
  id,
  name,
  description,
  isActive,
  createdAt,
  updatedAt,
  deletedAt,
  createdBy,
  updatedBy,
  Category,
  CategoryId
) => {
  return {
    id,
    name,
    description,
    isActive,
    createdAt,
    updatedAt,
    deletedAt,
    createdBy,
    updatedBy,
    Category,
    CategoryId,
  };
};

const SubCategory = (props) => {
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    categories: state.hotelReducer.categories,
    subCategories: state.hotelReducer.subCategories,
    permission: state.hotelReducer.permission,
  }));

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      setCategory([]);
      setCategoryId(null);
      setRows([]);
      props.actions.userAction.getCategory(
        hotelReducer.selectedOutlet.outlet.id
      );
      setPage(0);
      setRowsPerPage(10);
      return () => {
        dispatch({ type: RESET_CATEGORY });
      };
    }
  }, [hotelReducer.selectedOutlet]);

  useEffect(() => {
    if (hotelReducer.categories.length > 0) {
      const activeTags = hotelReducer.categories.filter(
        (data) => data.isActive === true
      );
      setCategory(activeTags);
      props.actions.userAction.getSubCategoryByCategory(
        hotelReducer.categories[0].id,
        hotelReducer.selectedOutlet.outlet.id
      );
      setCategoryId(activeTags[0].id);
      return () => {
        dispatch({ type: RESET_ALL_SUBCATEGORY });
      };
    }
  }, [hotelReducer.categories]);

  const convertData = (subCategories) => {
    const data = subCategories.map((category) => {
      return createData(
        category.id,
        category.name,
        category.description,
        category.isActive,
        category.createdAt,
        category.updatedAt,
        category.deletedAt,
        category.createdBy,
        category.updatedBy,
        category?.Category?.name,
        category?.Category?.id
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    if (hotelReducer.subCategories) {
      convertData(hotelReducer.subCategories);
    }
  }, [hotelReducer.subCategories]);

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
      const filteredData = convertData(hotelReducer.subCategories).filter(
        (item) => {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      );
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.subCategories);
    }
  };

  const handleOpenSubCategory = () => {
    setOpen(true);
  };

  const handleCloseSubCategory = () => {
    setOpen(false);
  };

  const handleSaveSubCategory = (data) => {
    props.actions.userAction.AddSubCategory(
      data,
      hotelReducer.selectedOutlet.outlet.id
    );
  };

  const handleOpenEditSubCategory = (data) => {
    setSelectedSubCategory(data);
    setEditOpen(true);
  };

  const handleCloseEditSubCategory = () => {
    setEditOpen(false);
  };

  const handleSaveEditSubCategory = (data, tagId) => {
    props.actions.userAction.updateSubCategory(
      data,
      tagId,
      hotelReducer.selectedOutlet.outlet.id
    );
  };

  const handleOpenDeleteSubCategory = (data) => {
    setSelectedSubCategory(data);
    setDeleteOpen(true);
  };

  const handleCloseDeleteSubCategory = () => {
    setDeleteOpen(false);
  };

  const handleDeleteSubCategory = (data) => {
    const { id } = data;
    props.actions.userAction.deleteSubCategory(id);
  };

  const selectCategory = (event) => {
    setRows([]);
    props.actions.userAction.getSubCategoryByCategory(
      event.target.value,
      hotelReducer.selectedOutlet.outlet.id
    );
    setCategoryId(event.target.value);
  };

  return (
    <React.Fragment>
      {open && (
        <Add
          open={open}
          categoryId={categoryId}
          handleCloseSubCategory={handleCloseSubCategory}
          handleSaveSubCategory={handleSaveSubCategory}
        />
      )}
      {editOpen && (
        <Edit
          open={editOpen}
          selectedSubCategory={selectedSubCategory}
          categoryId={categoryId}
          handleCloseEditSubCategory={handleCloseEditSubCategory}
          handleSaveEditSubCategory={handleSaveEditSubCategory}
        />
      )}

      {deleteOpen && (
        <DeletePopUp
          open={deleteOpen}
          data={selectedSubCategory}
          handleClose={handleCloseDeleteSubCategory}
          handleDelete={handleDeleteSubCategory}
          message="Confirm To Delete Tag"
        />
      )}

      <div className="user-groups">
        <h1 className="groups-header">Material Settings</h1>
        <h1 className="groups-header-2nd">Sub Category</h1>
        <Box className="user-groups-search">
          <div className="search-inner">
            <TextField
              size="small"
              className="search-box"
              sx={{ width: "250px" }}
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
            {category.length > 0 && (
              <FormControl sx={{ width: "160px" }} size="small">
                <InputLabel id="category">Category</InputLabel>
                <Select
                  id="category"
                  label="category"
                  labelId="category"
                  value={categoryId}
                  name="outletId"
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  onChange={selectCategory}
                >
                  {category.map((tagCategory, index) => (
                    <MenuItem key={index} value={tagCategory.id}>
                      {tagCategory.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>
          <div className="primary-btn">
            <Button variant="outlined">
              <CSVLink data={rows} filename="Sub Category">
                <CloudDownloadOutlinedIcon /> EXPORT
              </CSVLink>
            </Button>
            <Button
              disabled={handlePermission(
                hotelReducer.permission.permission,
                Modules.MATERIALSUBCATEGORY,
                ActionType.create,
                true
              )}
              variant="contained"
              onClick={handleOpenSubCategory}
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
                        <TableCell> {row.name}</TableCell>
                        <TableCell> {row.description}</TableCell>
                        <TableCell> {row.Category}</TableCell>
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
                          {moment(row.updatedAt).format("DD-MM-YYYY hh:mm A")}
                        </TableCell>

                        <TableCell className="commands-icons">
                          <BorderColorOutlinedIcon
                            style={{
                              cursor: handlePermission(
                                hotelReducer.permission.permission,
                                Modules.MATERIALSUBCATEGORY,
                                ActionType.update
                              )
                                ? "pointer"
                                : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.MATERIALSUBCATEGORY,
                                ActionType.update
                              ) && handleOpenEditSubCategory({ ...row })
                            }
                          />
                          <DeleteOutlinedIcon
                            style={{
                              cursor: handlePermission(
                                hotelReducer.permission.permission,
                                Modules.MATERIALSUBCATEGORY,
                                ActionType.delete
                              )
                                ? "pointer"
                                : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.MATERIALSUBCATEGORY,
                                ActionType.delete
                              ) && handleOpenDeleteSubCategory({ ...row })
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

export default connect(null, mapDispatchToProps)(SubCategory);
