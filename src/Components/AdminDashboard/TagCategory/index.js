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

import * as UserAction from "../../../Action/AdminDashboard";
import DeletePopUp from "../../../CommonComponent/DeletePopUp";
import AddTagCategory from "./Add";
import EditTagCategory from "./Edit";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import {
  ActionType,
  Modules,
  handlePermission,
  handleUpdatedBy,
} from "../../../utils/userAccess";

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
  isActive,
  outletId
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
    outletId,
  };
};

const TagCategory = (props) => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTagCategory, setSelectedTagCategory] = useState(null);

  const hotelReducer = useSelector((state) => ({
    tagCategories: state.hotelReducer.tagCategories,
    selectedOutlet: state.hotelReducer.selectedOutlet,
    permission: state.hotelReducer.permission,
  }));

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      props.actions.userAction.getTagCategory(
        hotelReducer.selectedOutlet.outlet.id
      );
      setPage(0);
      setRowsPerPage(10);
    }
  }, [hotelReducer.selectedOutlet]);

  const convertData = (tagCategories) => {
    const data = tagCategories.map((tagCategory) => {
      return createData(
        tagCategory.id,
        tagCategory.name,
        tagCategory.description,
        tagCategory.updatedBy,
        tagCategory.updatedAt,
        tagCategory.createdBy,
        tagCategory.createdAt,
        tagCategory.isActive,
        tagCategory.outletId
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    if (hotelReducer.tagCategories) {
      convertData(hotelReducer.tagCategories);
    }
  }, [hotelReducer.tagCategories]);

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
      const filteredData = convertData(hotelReducer.tagCategories).filter(
        (item) => {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      );
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.tagCategories);
    }
  };

  const handleOpenTagCategory = () => {
    setOpen(true);
  };

  const handleCloseTagCategory = () => {
    setOpen(false);
  };

  const handleSaveTagCategory = (data) => {
    props.actions.userAction.addTagCategory(
      data,
      hotelReducer.selectedOutlet.outlet.id
    );
  };

  const handleOpenEditTagCategory = (data) => {
    setEditOpen(true);
    setSelectedTagCategory(data);
  };

  const handleCloseEditTagCategory = () => {
    setEditOpen(false);
  };

  const handleSaveEditTagCategory = (data, selectedTagCategoryId) => {
    props.actions.userAction.editTagCategory(
      data,
      selectedTagCategoryId,
      hotelReducer.selectedOutlet.outlet.id
    );
  };

  const handleOpenDeleteTagCategory = (data) => {
    setSelectedTagCategory(data);
    setDeleteOpen(true);
  };

  const handleCloseDeleteTagCategory = () => {
    setDeleteOpen(false);
  };

  const handleDeleteTagCategory = (data) => {
    const { id } = data;
    if (id)
      props.actions.userAction.deleteTagCategory(
        id,
        hotelReducer.selectedOutlet.outlet.id
      );
  };

  return (
    <React.Fragment>
      {open && (
        <AddTagCategory
          open={open}
          handleCloseTagCategory={handleCloseTagCategory}
          handleSaveTagCategory={handleSaveTagCategory}
        />
      )}

      {editOpen && (
        <EditTagCategory
          open={editOpen}
          selectedTagCategory={selectedTagCategory}
          handleCloseEditTagCategory={handleCloseEditTagCategory}
          handleSaveEditTagCategory={handleSaveEditTagCategory}
        />
      )}

      {deleteOpen && (
        <DeletePopUp
          open={deleteOpen}
          data={{ ...selectedTagCategory }}
          handleClose={handleCloseDeleteTagCategory}
          handleDelete={handleDeleteTagCategory}
          message="Confirm To Delete Tag Category"
        />
      )}

      <div className="user-groups">
        <h1 className="groups-header">Tags Management</h1>
        <h1 className="groups-header-2nd">Tag Category</h1>
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
              <CSVLink data={rows} filename="Tag Category">
                <CloudDownloadOutlinedIcon /> EXPORT
              </CSVLink>
            </Button>
            <Button
              disabled={handlePermission(
                hotelReducer.permission.permission,
                Modules.TAGCATEGORY,
                ActionType.create,
                true
              )}
              variant="contained"
              onClick={handleOpenTagCategory}
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
                              cursor:
                                handlePermission(
                                  hotelReducer.permission.permission,
                                  Modules.TAGCATEGORY,
                                  ActionType.update
                                ) && row.outletId
                                  ? "pointer"
                                  : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.TAGCATEGORY,
                                ActionType.update
                              ) &&
                              row.outletId &&
                              handleOpenEditTagCategory({ ...row })
                            }
                          />
                          <DeleteOutlinedIcon
                            style={{
                              cursor:
                                handlePermission(
                                  hotelReducer.permission.permission,
                                  Modules.TAGCATEGORY,
                                  ActionType.delete
                                ) && row.outletId
                                  ? "pointer"
                                  : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.TAGCATEGORY,
                                ActionType.delete
                              ) &&
                              row.outletId &&
                              handleOpenDeleteTagCategory({ ...row })
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

export default connect(null, mapDispatchToProps)(TagCategory);
