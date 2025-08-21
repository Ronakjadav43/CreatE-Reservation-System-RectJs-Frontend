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
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { visuallyHidden } from "@mui/utils";
import { bindActionCreators } from "redux";
import { connect, useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import { isEmpty } from "lodash";

import * as UserAction from "../../../Action/AdminDashboard";
import AddAdmin from "./Add";
import EditAdmin from "./Edit";
import { useNavigate } from "react-router-dom";
import {
  SET_INVISIBLE_SELECTION,
  SET_VISIBLE_SELECTION,
} from "../../../utils/AdminDashboard/Constant";
import DeletePopUp from "../../../CommonComponent/DeletePopUp";
import {
  ActionType,
  Modules,
  handlePermission,
  handleUpdatedBy,
} from "../../../utils/userAccess";
import "./style.scss";

const moment = require("moment-timezone");

const columns = [
  { field: "userName", headerName: "Username", width: 233 },
  { field: "firstName", headerName: "First Name", width: 233 },
  { field: "lastName", headerName: "Last Name", width: 233 },
  { field: "email", headerName: "Email", width: 233 },
  { field: "isActive", headerName: "Status", width: 233 },
  { field: "updatedBy", headerName: "Updated By", width: 233 },
  { field: "updatedDate", headerName: "Updated Date", width: 233 },
  { field: "Commands", headerName: "Commands", width: 233 },
];

const createData = (
  id,
  userName,
  firstName,
  lastName,
  email,
  updatedBy,
  updatedDate,
  createdBy,
  createdDate,
  isActive,
  phone
) => {
  return {
    id,
    userName,
    firstName,
    lastName,
    email,
    updatedBy,
    updatedDate,
    createdBy,
    createdDate,
    isActive,
    phone,
  };
};

const SuperUsers = (props) => {
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedAdmin, setSelectedAdmin] = useState([]);
  const navigate = useNavigate();

  const hotelReducer = useSelector((state) => ({
    superUsers: state.hotelReducer.superUsers,
    permission: state.hotelReducer.permission,
  }));

  const redirect = (url) => {
    navigate(url);
  };

  useEffect(() => {
    dispatch({
      type: SET_INVISIBLE_SELECTION,
    });
    return () => {
      dispatch({
        type: SET_VISIBLE_SELECTION,
      });
    };
  }, []);

  useEffect(() => {
    const hasPermission = handlePermission(
      hotelReducer.permission.permission,
      Modules.SUPERUSER,
      ActionType.read
    );
    if (!hasPermission) {
      redirect("/Admin");
    } else {
      props.actions.userAction.getSuperUsers();
      setPage(0);
      setRowsPerPage(10);
    }
  }, [hotelReducer.permission]);

  const convertData = (superUsers) => {
    const data = superUsers.map((superUser) => {
      return createData(
        superUser.id,
        superUser.userName,
        superUser.firstName,
        superUser.lastName,
        superUser.email,
        superUser.updatedBy,
        superUser.updatedAt,
        superUser.createdBy,
        superUser.createdAt,
        superUser.isActive,
        superUser.phone
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    convertData(hotelReducer.superUsers);
  }, [hotelReducer.superUsers]);

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
      const filteredData = convertData(hotelReducer.superUsers).filter(
        (item) => {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      );
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.superUsers);
    }
  };

  const handleOpenAdmin = () => {
    setOpen(true);
  };

  const handleCloseAdmin = () => {
    setOpen(false);
  };

  const handleOpenEditAdmin = (data) => {
    setEditOpen(true);
    setSelectedAdmin(data);
  };

  const handleCloseEditAdmin = () => {
    setEditOpen(false);
  };

  const handleOpenDeleteAdmin = (data) => {
    setSelectedAdmin(data);
    setDeleteOpen(true);
  };

  const handleCloseDeleteAdmin = () => {
    setDeleteOpen(false);
  };

  const handleSaveAdmin = (data) => {
    props.actions.userAction.addAdmin(data);
  };

  const handleSaveEditAdmin = (data, adminId) => {
    props.actions.userAction.editAdmin(data, adminId);
  };

  const handleDeleteAdmin = (data) => {
    const { id } = data;
    props.actions.userAction.deleteAdmin(id);
  };

  return (
    <React.Fragment>
      {/** Add Admin */}
      {open && (
        <AddAdmin
          open={open}
          handleCloseAdmin={handleCloseAdmin}
          handleSaveAdmin={handleSaveAdmin}
        />
      )}

      {/** Edit Admin */}
      {editOpen && (
        <EditAdmin
          open={editOpen}
          selectedAdmin={selectedAdmin}
          handleCloseEditAdmin={handleCloseEditAdmin}
          handleSaveEditAdmin={handleSaveEditAdmin}
        />
      )}

      {/** Delete Admin */}
      {deleteOpen && (
        <DeletePopUp
          open={deleteOpen}
          data={selectedAdmin}
          handleClose={handleCloseDeleteAdmin}
          handleDelete={handleDeleteAdmin}
          message="Confirm To Delete Admin"
        />
      )}

      <div className="user-groups">
        <h1 className="groups-header">Super Access</h1>
        <h1 className="groups-header-2nd">Super Users</h1>

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
              <CSVLink data={rows} filename="Super Users">
                <CloudDownloadOutlinedIcon /> EXPORT
              </CSVLink>
            </Button>
            <Button variant="contained" onClick={handleOpenAdmin}>
              <AddOutlinedIcon /> ADD
            </Button>
          </div>
        </Box>

        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: "calc(100vh - 310px)" }}>
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
                        <TableCell>
                          {row.userName ? row.userName : "N/A"}
                        </TableCell>
                        <TableCell>
                          {row.firstName ? row.firstName : "N/A"}
                        </TableCell>
                        <TableCell>
                          {row.lastName ? row.lastName : "N/A"}
                        </TableCell>
                        <TableCell> {row.email}</TableCell>
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
                            style={{ cursor: "pointer" }}
                            onClick={() => handleOpenEditAdmin({ ...row })}
                          />
                          <DeleteOutlinedIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => handleOpenDeleteAdmin({ ...row })}
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

export default connect(null, mapDispatchToProps)(SuperUsers);
