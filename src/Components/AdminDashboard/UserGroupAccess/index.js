/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import {
  Button,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableBody,
  TableSortLabel,
  Box,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as UserAction from "../../../Action/AdminDashboard";
import {
  ActionType,
  handlePermission,
  Modules,
} from "../../../utils/userAccess";

const columns = [
  { field: "moduleName", headerName: "Module Name", width: 233 },
  { field: "create", headerName: "Create", width: 233 },
  { field: "read", headerName: "Read", width: 233 },
  { field: "update", headerName: "Update", width: 233 },
  { field: "Delete", headerName: "Delete", width: 233 },
];

const createData = (moduleName, isCreate, isRead, isUpdate, isDelete) => {
  return {
    moduleName,
    isCreate,
    isRead,
    isUpdate,
    isDelete,
  };
};

const UserGroupAccess = (props) => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [roles, setRoles] = useState([]);
  const [roleId, setRoleId] = useState(null);
  const [columData, setColumData] = useState(false);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    permission: state.hotelReducer.permission,
    roles: state.hotelReducer.roles,
    modulePermissions: state.hotelReducer.modulePermissions,
  }));

  const redirect = (url) => {
    navigate(url);
  };

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      props.actions.userAction.getRoles(hotelReducer.selectedOutlet.outlet.id);
    }
  }, [hotelReducer.selectedOutlet]);

  useEffect(() => {
    const hasPermission = handlePermission(
      hotelReducer.permission.permission,
      Modules.USERGROUPACCESS,
      ActionType.read
    );
    if (!hasPermission) {
      redirect("/Admin");
    }
  }, [hotelReducer.permission]);

  useEffect(() => {
    if (hotelReducer.roles) {
      const activeRoles = hotelReducer.roles.filter(
        (data) => data.isActive === true
      );
      if (activeRoles.length > 0) {
        props.actions.userAction.getPermission(
          hotelReducer.selectedOutlet.outlet.id,
          activeRoles[0].id
        );
        setRoles(activeRoles);
        setRoleId(activeRoles[0].id);
      }
    }
  }, [hotelReducer.roles]);

  useEffect(() => {
    if (hotelReducer.modulePermissions) {
      convertData(hotelReducer.modulePermissions.permission);
    }
  }, [hotelReducer.modulePermissions]);

  const convertData = (permission) => {
    const data = permission.map((module) => {
      return createData(
        module.moduleName,
        module.isCreate,
        module.isRead,
        module.isUpdate,
        module.isDelete
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    let selectAll = true;
    rows.map((module) => {
      if (
        module.isRead === false ||
        module.isCreate === false ||
        module.isUpdate === false ||
        module.isDelete === false
      ) {
        selectAll = false;
      }
    });
    setColumData(selectAll);
  }, [rows]);

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
    if (rows.length > 0) {
      setRowsPerPage(parseInt(event.target.value));
      setPage(0);
    }
  };

  const handleEditSaveRole = () => {
    const data = {
      permission: rows,
    };
    props.actions.userAction.updatePermission(
      data,
      hotelReducer.modulePermissions.id,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleChange = (event) => {
    setRows([]);
    props.actions.userAction.getPermission(
      hotelReducer.selectedOutlet.outlet.id,
      event.target.value
    );
    setRoleId(event.target.value);
  };

  const handleChangePermission = (row, permission) => {
    const tempData = [...rows];
    let data = tempData.find((temp) => temp.moduleName === row.moduleName);
    data[permission] = !data[permission];
    setRows([...tempData]);
  };

  const handleChangeFilter = (columData) => {
    const tempData = [...rows];

    let tempFilterData = tempData.map((data) => {
      if (columData) {
        return {
          ...data,
          isCreate: true,
          isRead: true,
          isUpdate: true,
          isDelete: true,
        };
      } else {
        return {
          ...data,
          isCreate: false,
          isRead: false,
          isUpdate: false,
          isDelete: false,
        };
      }
    });
    setRows([...tempFilterData]);
    setColumData(columData);
  };

  const returnCheckbox = (row, data) => {
    if (row[data] !== null) {
      return (
        <FormControlLabel
          control={
            <Checkbox
              disabled={handlePermission(
                hotelReducer.permission.permission,
                Modules.USERGROUPACCESS,
                ActionType.update,
                true,
                hotelReducer.modulePermissions.outletId
              )}
              sx={{ padding: "0" }}
              checked={row[data]}
              onChange={() => handleChangePermission(row, data)}
              inputProps={{ "aria-label": "controlled" }}
            />
          }
        />
      );
    }
  };

  return (
    <React.Fragment>
      <div className="user-groups">
        <h1 className="groups-header">User Access</h1>
        <h1 className="groups-header-2nd">User Group Access</h1>
        <Box className="user-groups-search">
          <div className="search-inner" style={{ gap: "20px" }}>
            {roles.length > 0 && (
              <FormControl
                sx={{ width: "200px", marginTop: "10px" }}
                size="small"
              >
                <InputLabel id="UserGroup">UserGroup </InputLabel>
                <Select
                  id="UserGroup"
                  label="UserGroup"
                  labelId="UserGroup"
                  value={roleId}
                  name="roles"
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  onChange={handleChange}
                >
                  {roles.map((role, index) => (
                    <MenuItem key={index} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <FormControlLabel
              sx={{
                width: "100%",
                display: "flex",
              }}
              control={<Checkbox />}
              label="Select All"
              name="allSelect"
              checked={columData}
              onChange={() => handleChangeFilter(!columData)}
            />
          </div>

          {rows.length > 0 && (
            <div className="primary-btn">
              <Button
                disabled={handlePermission(
                  hotelReducer.permission.permission,
                  Modules.USERGROUPACCESS,
                  ActionType.update,
                  true,
                  hotelReducer.modulePermissions.outletId
                )}
                variant="contained"
                onClick={handleEditSaveRole}
              >
                UPDATE
              </Button>
            </div>
          )}
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
                  {columns.map((headCell) => (
                    <TableCell
                      key={headCell.field}
                      align="center"
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
                        <TableCell align="center"> {row.moduleName}</TableCell>

                        <TableCell align="center">
                          {returnCheckbox(row, "isCreate")}
                        </TableCell>

                        <TableCell align="center">
                          {returnCheckbox(row, "isRead")}
                        </TableCell>

                        <TableCell align="center">
                          {returnCheckbox(row, "isUpdate")}
                        </TableCell>

                        <TableCell align="center">
                          {returnCheckbox(row, "isDelete")}
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

export default connect(null, mapDispatchToProps)(UserGroupAccess);
