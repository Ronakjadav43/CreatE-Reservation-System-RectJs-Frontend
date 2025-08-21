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
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import SearchIcon from "@mui/icons-material/Search";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { isEmpty } from "lodash";
import { visuallyHidden } from "@mui/utils";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { CSVLink } from "react-csv";

import AddUser from "./Add";
import * as UserAction from "../../../Action/AdminDashboard";
import EditUser from "./Edit";
import DeletePopUp from "../../../CommonComponent/DeletePopUp";
import {
  ActionType,
  handlePermission,
  handleUpdatedBy,
  Modules,
} from "../../../utils/userAccess";
import "./style.scss";

let moment = require("moment-timezone");

const columns = [
  { field: "userName", headerName: "User Name", width: 233 },
  { field: "firstName", headerName: "First Name", width: 233 },
  { field: "lastName", headerName: "Last Name", width: 233 },
  { field: "UserGroup", headerName: "User Group", width: 233 },
  { field: "phone", headerName: "Phone Number", width: 233 },
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
  UserGroup,
  phone,
  email,
  isActive,
  CompanyPermission,
  updatedBy,
  updatedDate,
  roleId,
  createdBy,
  createdDate
) => {
  return {
    id,
    userName,
    firstName,
    lastName,
    UserGroup,
    phone,
    email,
    isActive,
    CompanyPermission,
    updatedBy,
    updatedDate,
    roleId,
    createdBy,
    createdDate,
  };
};

const UserList = (props) => {
  const [rows, setRows] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [roles, setRoles] = useState([]);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    users: state.hotelReducer.users,
    roles: state.hotelReducer.roles,
    permission: state.hotelReducer.permission,
  }));

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      props.actions.userAction.getUsers(hotelReducer.selectedOutlet.outlet.id);
      props.actions.userAction.getRoles(hotelReducer.selectedOutlet.outlet.id);
      setPage(0);
      setRowsPerPage(10);
    }
  }, [hotelReducer.selectedOutlet]);

  useEffect(() => {
    setRoles(hotelReducer.roles.filter((data) => data.isActive === true));
  }, [hotelReducer.roles]);

  const convertData = () => {
    const data = hotelReducer.users.map((user) => {
      return createData(
        user.id,
        user.userName,
        user.firstName,
        user.lastName,
        user.Role?.name,
        user.phone,
        user.email,
        user.isActive,
        user.CompanyPermission,
        user.updatedBy,
        user.updatedAt,
        user.Role?.id,
        user.createdBy,
        user.createdAt
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    convertData(hotelReducer.users);
  }, [hotelReducer.users]);

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
      const filteredData = convertData(hotelReducer.users).filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(value.toLowerCase());
      });
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.users);
    }
  };

  const handleOpenUser = () => {
    setOpen(true);
  };

  const handleCloseUser = () => {
    setOpen(false);
  };

  const handleCloseEditUser = () => {
    setEditOpen(false);
  };

  const handleCloseDeleteUser = () => {
    setDeleteOpen(false);
  };

  const handleOpenEditUser = (data) => {
    setSelectedUser(data);
    setEditOpen(true);
  };

  const handleOpenDeleteUser = (data) => {
    setSelectedUser(data);
    setDeleteOpen(true);
  };

  const handleSaveUser = (data) => {
    data = { ...data, outletId: hotelReducer.selectedOutlet?.outlet.id };
    props.actions.userAction.addUser(data);
  };

  const handleEditSaveUser = (data, userId) => {
    props.actions.userAction.updateUser(
      data,
      userId,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleDeleteUser = (data) => {
    const { id } = data;
    props.actions.userAction.deleteUser(
      id,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  return (
    <React.Fragment>
      {/** Add User */}
      {open && (
        <AddUser
          open={open}
          selectedOutlet={hotelReducer.selectedOutlet}
          handleCloseUser={handleCloseUser}
          handleSaveUser={handleSaveUser}
          roles={roles}
        />
      )}

      {/** Edit User */}
      {editOpen && (
        <EditUser
          open={editOpen}
          selectedUser={selectedUser}
          handleCloseEditUser={handleCloseEditUser}
          handleEditSaveUser={handleEditSaveUser}
          roles={roles}
        />
      )}

      {/** Delete User */}
      {deleteOpen && (
        <DeletePopUp
          open={deleteOpen}
          data={selectedUser}
          handleClose={handleCloseDeleteUser}
          handleDelete={handleDeleteUser}
          message="Confirm To Delete User"
        />
      )}

      <div className="user-groups">
        <h1 className="groups-header">User Access</h1>
        <h1 className="groups-header-2nd">User List</h1>

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
              <CSVLink data={rows} filename="UserList">
                <CloudDownloadOutlinedIcon /> EXPORT
              </CSVLink>
            </Button>
            <Button
              disabled={handlePermission(
                hotelReducer.permission.permission,
                Modules.USERLIST,
                ActionType.create,
                true
              )}
              variant="contained"
              onClick={handleOpenUser}
            >
              <AddOutlinedIcon />
              ADD
            </Button>
          </div>
        </Box>

        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: "calc(100vh - 304px)" }}>
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
                        <TableCell>
                          {row.UserGroup ? row.UserGroup : "N/A"}
                        </TableCell>
                        <TableCell> {row.phone ? row.phone : "N/A"}</TableCell>
                        <TableCell> {row.email ? row.email : "N/A"}</TableCell>
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
                          {moment(row.updatedDate).format("DD-MM-YYYY hh:mm A")}
                        </TableCell>
                        <TableCell className="commands-icons">
                          <BorderColorOutlinedIcon
                            style={{
                              cursor: handlePermission(
                                hotelReducer.permission.permission,
                                Modules.USERLIST,
                                ActionType.update
                              )
                                ? "pointer"
                                : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.USERLIST,
                                ActionType.update
                              ) && handleOpenEditUser({ ...row })
                            }
                          />
                          <DeleteOutlinedIcon
                            style={{
                              cursor: handlePermission(
                                hotelReducer.permission.permission,
                                Modules.USERLIST,
                                ActionType.delete
                              )
                                ? "pointer"
                                : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.USERLIST,
                                ActionType.delete
                              ) && handleOpenDeleteUser({ ...row })
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

export default connect(null, mapDispatchToProps)(UserList);
