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
import { visuallyHidden } from "@mui/utils";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import { isEmpty } from "lodash";

import DeletePopUp from "../../../CommonComponent/DeletePopUp";
import * as UserAction from "../../../Action/AdminDashboard";
import AddRole from "./Add";
import EditRole from "./Edit";
import {
  ActionType,
  Modules,
  handlePermission,
  handleUpdatedBy,
} from "../../../utils/userAccess";

const moment = require("moment-timezone");

const columns = [
  { field: "name", headerName: "Group Name", width: 233 },
  { field: "description", headerName: "Description", width: 233 },
  { field: "isActive", headerName: "Status", width: 233 },
  { field: "UpdatedBy", headerName: "Updated By", width: 233 },
  { field: "UpdatedDate", headerName: "Updated Date", width: 233 },
  { field: "Commands", headerName: "Commands", width: 233 },
];

const createData = (
  id,
  name,
  description,
  isActive,
  UpdatedBy,
  UpdatedDate,
  CreatedBy,
  CreatedDate,
  outletId
) => {
  return {
    id,
    name,
    description,
    isActive,
    UpdatedBy,
    UpdatedDate,
    CreatedBy,
    CreatedDate,
    outletId,
  };
};
const UserGroup = (props) => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRole, setSelectedRole] = useState([]);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    roles: state.hotelReducer.roles,
    permission: state.hotelReducer.permission,
  }));

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      props.actions.userAction.getRoles(hotelReducer.selectedOutlet.outlet.id);
      setPage(0);
      setRowsPerPage(10);
    }
  }, [hotelReducer.selectedOutlet]);

  const convertData = (roles) => {
    const data = roles.map((role) => {
      return createData(
        role.id,
        role.name,
        role.description,
        role.isActive,
        role.updatedBy,
        role.updatedAt,
        role.createdBy,
        role.createdAt,
        role.outletId
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    convertData(hotelReducer.roles);
  }, [hotelReducer.roles]);

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
      const filteredData = convertData(hotelReducer.roles).filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(value.toLowerCase());
      });
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.roles);
    }
  };

  const handleOpenRole = () => {
    setOpen(true);
  };

  const handleCloseRole = () => {
    setOpen(false);
  };

  const handleOpenEditRole = (data) => {
    setSelectedRole(data);
    setEditOpen(true);
  };

  const handleClosEditRole = () => {
    setEditOpen(false);
  };

  const handleOpenDeleteRole = (data) => {
    setSelectedRole(data);
    setDeleteOpen(true);
  };

  const handleCloseDeleteRole = () => {
    setDeleteOpen(false);
  };

  const handleSaveRole = (data) => {
    props.actions.userAction.addRole(
      data,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleEditSaveRole = (data, roleId) => {
    props.actions.userAction.updateRole(
      data,
      roleId,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleDeleteRole = (data) => {
    const { id } = data;
    props.actions.userAction.deleteRole(
      id,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  return (
    <React.Fragment>
      {/** Add Role */}
      {open && (
        <AddRole
          open={open}
          handleCloseRole={handleCloseRole}
          handleSaveRole={handleSaveRole}
        />
      )}

      {/** Edit Role */}
      {editOpen && (
        <EditRole
          open={editOpen}
          selectedRole={selectedRole}
          handleClosEditRole={handleClosEditRole}
          handleEditSaveRole={handleEditSaveRole}
        />
      )}

      {/** Delete Role */}
      {deleteOpen && (
        <DeletePopUp
          open={deleteOpen}
          data={selectedRole}
          handleClose={handleCloseDeleteRole}
          handleDelete={handleDeleteRole}
          message="Confirm To Delete Role"
        />
      )}

      <div className="user-groups">
        <h1 className="groups-header">User Access</h1>
        <h1 className="groups-header-2nd">User Group</h1>

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
              <CSVLink data={rows} filename="User Group">
                <CloudDownloadOutlinedIcon /> EXPORT
              </CSVLink>
            </Button>
            <Button
              disabled={handlePermission(
                hotelReducer.permission.permission,
                Modules.USERGROUP,
                ActionType.create,
                true
              )}
              variant="contained"
              onClick={handleOpenRole}
            >
              <AddOutlinedIcon /> ADD
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
                        <TableCell> {handleUpdatedBy(row.UpdatedBy)}</TableCell>
                        <TableCell>
                          {row.UpdatedDate
                            ? moment(row.UpdatedDate).format(
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
                                  Modules.USERGROUP,
                                  ActionType.update,
                                  false,
                                  row.outletId
                                )
                                  ? "pointer"
                                  : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.USERGROUP,
                                ActionType.update
                              ) &&
                              row.outletId &&
                              handleOpenEditRole({ ...row })
                            }
                          />
                          <DeleteOutlinedIcon
                            style={{
                              cursor:
                                row.outletId &&
                                handlePermission(
                                  hotelReducer.permission.permission,
                                  Modules.USERGROUP,
                                  ActionType.delete
                                )
                                  ? "pointer"
                                  : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.USERGROUP,
                                ActionType.delete
                              ) &&
                              row.outletId &&
                              handleOpenDeleteRole({ ...row })
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

export default connect(null, mapDispatchToProps)(UserGroup);
