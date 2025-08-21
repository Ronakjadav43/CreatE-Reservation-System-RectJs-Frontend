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
import { connect, useSelector } from "react-redux";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { CSVLink } from "react-csv";

import * as UserAction from "../../../Action/AdminDashboard";
import EditTag from "./Edit";
import DeletePopUp from "../../../CommonComponent/DeletePopUp";
import AddTag from "./Add";
import {
  ActionType,
  Modules,
  handlePermission,
  handleUpdatedBy,
} from "../../../utils/userAccess";

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
  updatedBy,
  tagCategory,
  TagCategory
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
    tagCategory,
    TagCategory,
  };
};

const Tags = (props) => {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    tags: state.hotelReducer.tags,
    tagCategories: state.hotelReducer.tagCategories,
    permission: state.hotelReducer.permission,
  }));

  const convertData = (tags) => {
    const data = tags.map((tag) => {
      return createData(
        tag.id,
        tag.name,
        tag.description,
        tag.outletId,
        tag.isActive,
        tag.createdAt,
        tag.updatedAt,
        tag.deletedAt,
        tag.createdBy,
        tag.updatedBy,
        tag?.TagCategory?.name,
        tag.TagCategory
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      props.actions.userAction.getTagCategory(
        hotelReducer.selectedOutlet.outlet.id
      );
    }
    setPage(0);
    setRowsPerPage(10);
  }, [hotelReducer.selectedOutlet]);

  useEffect(() => {
    if (hotelReducer.tagCategories.length > 0) {
      const activeTags = hotelReducer.tagCategories.filter(
        (data) => data.isActive === true
      );

      setCategory(activeTags);
      props.actions.userAction.getTagsByOutletCategory(
        hotelReducer.tagCategories[0].id,
        hotelReducer.selectedOutlet.outlet.id
      );
      setCategoryId(hotelReducer.tagCategories[0].id);
    }
  }, [hotelReducer.tagCategories]);

  useEffect(() => {
    if (hotelReducer.tags) {
      convertData(hotelReducer.tags);
    }
  }, [hotelReducer.tags]);

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
      const filteredData = convertData(hotelReducer.tags).filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(value.toLowerCase());
      });
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.tags);
    }
  };

  const handleOpenTag = () => {
    setOpen(true);
  };

  const handleCloseTag = () => {
    setOpen(false);
  };

  const handleSaveTag = (data) => {
    props.actions.userAction.AddTag(
      data,
      hotelReducer.selectedOutlet.outlet.id
    );
  };

  const handleOpenEditTag = (data) => {
    setSelectedTag(data);
    setEditOpen(true);
  };

  const handleCloseEditTag = () => {
    setEditOpen(false);
  };

  const handleSaveEditTag = (data, tagId) => {
    props.actions.userAction.updateTag(
      data,
      tagId,
      hotelReducer.selectedOutlet.outlet.id
    );
  };

  const handleOpenDeleteTag = (data) => {
    setSelectedTag(data);
    setDeleteOpen(true);
  };

  const handleCloseDeleteTag = () => {
    setDeleteOpen(false);
  };

  const handleDeleteTag = (data) => {
    const { id } = data;
    props.actions.userAction.deleteTag(
      id,
      hotelReducer.selectedOutlet.outlet.id
    );
  };

  const selectTagCategory = (event) => {
    setRows([]);
    props.actions.userAction.getTagsByOutletCategory(
      event.target.value,
      hotelReducer.selectedOutlet.outlet.id
    );
    setCategoryId(event.target.value);
  };

  return (
    <React.Fragment>
      {open && (
        <AddTag
          open={open}
          categoryId={categoryId}
          handleCloseTag={handleCloseTag}
          handleSaveTag={handleSaveTag}
        />
      )}
      {editOpen && (
        <EditTag
          open={editOpen}
          selectedTag={selectedTag}
          categoryId={categoryId}
          handleCloseEditTag={handleCloseEditTag}
          handleSaveEditTag={handleSaveEditTag}
        />
      )}

      {deleteOpen && (
        <DeletePopUp
          open={deleteOpen}
          data={selectedTag}
          handleClose={handleCloseDeleteTag}
          handleDelete={handleDeleteTag}
          message="Confirm To Delete Tag"
        />
      )}

      <div className="user-groups">
        <h1 className="groups-header">Tags Management</h1>
        <h1 className="groups-header-2nd">Tags</h1>
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
              <FormControl sx={{ width: "200px" }} size="small">
                <InputLabel id="category">Category</InputLabel>
                <Select
                  id="category"
                  label="category"
                  labelId="category"
                  value={categoryId}
                  name="outletId"
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  onChange={selectTagCategory}
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
              <CSVLink data={rows} filename="Tags">
                <CloudDownloadOutlinedIcon /> EXPORT
              </CSVLink>
            </Button>
            <Button
              disabled={handlePermission(
                hotelReducer.permission.permission,
                Modules.TAGS,
                ActionType.create,
                true
              )}
              variant="contained"
              onClick={handleOpenTag}
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
                                  Modules.TAGS,
                                  ActionType.update
                                ) && row.outletId
                                  ? "pointer"
                                  : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.TAGS,
                                ActionType.update
                              ) &&
                              row.outletId &&
                              handleOpenEditTag({ ...row })
                            }
                          />
                          <DeleteOutlinedIcon
                            style={{
                              cursor:
                                handlePermission(
                                  hotelReducer.permission.permission,
                                  Modules.TAGS,
                                  ActionType.delete
                                ) && row.outletId
                                  ? "pointer"
                                  : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.TAGS,
                                ActionType.delete
                              ) &&
                              row.outletId &&
                              handleOpenDeleteTag({ ...row })
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

export default connect(null, mapDispatchToProps)(Tags);
