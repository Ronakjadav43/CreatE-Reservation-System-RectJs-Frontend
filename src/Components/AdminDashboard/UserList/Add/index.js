import * as React from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useEffect, useState } from "react";
import { visuallyHidden } from "@mui/utils";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import "./style.scss";

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

const AddUser = (props) => {
  const { open, handleCloseUser, handleSaveUser, roles } = props;
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");

  const [userData, setUserData] = useState({
    email: "",
    roleId: roles.length > 0 ? roles[0].id : 0,
    permission: [
      {
        moduleName: "IvrsConfiguration",
        isCreate: null,
        isRead: false,
        isUpdate: false,
        isDelete: null,
      },
      {
        moduleName: "Reports",
        isCreate: null,
        isRead: false,
        isUpdate: null,
        isDelete: null,
      },
    ],
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...userData };
    commonData[field] = event.target.value;
    return setUserData(commonData);
  };

  const handleAddRole = () => {
    const data = { ...userData };
    data.permission = rows;
    handleSaveUser(data);
    handleCloseUser();
  };

  useEffect(() => {
    if (userData.permission) {
      convertData(userData.permission);
    }
  }, [userData.permission]);

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

  const handleChangePermission = (row, permission) => {
    const tempData = [...rows];
    let data = tempData.find((temp) => temp.moduleName === row.moduleName);
    data[permission] = !data[permission];
    setRows([...tempData]);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={() => handleCloseUser(false)}
        className="hello"
      >
        <ValidatorForm
          onSubmit={() => handleAddRole()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Add New User</DialogTitle>
          </Box>
          <DialogContent sx={{ width: "850px" }} className="popup-body">
            <div className="popup-input-box w-100">
              <Typography>Email</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="email"
                name="email"
                value={userData.email}
                placeholder="Enter Email"
                sx={{ marginTop: 0 }}
                validators={["required"]}
                onChange={handleChange}
                errorMessages={["Email is required"]}
              />
            </div>

            <div className="popup-input-box w-100">
              <Typography>User Group</Typography>
              <FormControl fullWidth>
                <Select
                  size="small"
                  value={userData.roleId}
                  name="roleId"
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
            </div>
            <div className="popup-input-box w-100">
              <Typography sx={{ fontWeight: "bold" }}>
                Permission Of Brand : (
                {props.selectedOutlet.outlet.Company.name})
              </Typography>

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
                            padding={
                              headCell.disablePadding ? "none" : "normal"
                            }
                            sortDirection={
                              orderBy === headCell.field ? order : false
                            }
                          >
                            <TableSortLabel
                              active={orderBy === headCell.field}
                              direction={
                                orderBy === headCell.field ? order : "asc"
                              }
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
                      {stableSort(rows, getComparator(order, orderBy)).map(
                        (row, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell align="center">
                                {row.moduleName}
                              </TableCell>

                              <TableCell align="center">
                                {row.isCreate !== null && (
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        sx={{ padding: "0" }}
                                        checked={row.isCreate}
                                        onChange={() =>
                                          handleChangePermission(
                                            row,
                                            "isCreate"
                                          )
                                        }
                                        inputProps={{
                                          "aria-label": "controlled",
                                        }}
                                      />
                                    }
                                  />
                                )}
                              </TableCell>

                              <TableCell align="center">
                                {row.isRead !== null && (
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        sx={{ padding: "0" }}
                                        checked={row.isRead}
                                        onChange={() =>
                                          handleChangePermission(row, "isRead")
                                        }
                                        inputProps={{
                                          "aria-label": "controlled",
                                        }}
                                      />
                                    }
                                  />
                                )}
                              </TableCell>

                              <TableCell align="center">
                                {row.isUpdate !== null && (
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        sx={{ padding: "0" }}
                                        checked={row.isUpdate}
                                        onChange={() =>
                                          handleChangePermission(
                                            row,
                                            "isUpdate"
                                          )
                                        }
                                        inputProps={{
                                          "aria-label": "controlled",
                                        }}
                                      />
                                    }
                                  />
                                )}
                              </TableCell>

                              <TableCell align="center">
                                {row.isDelete !== null && (
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        sx={{ padding: "0" }}
                                        checked={row.isDelete}
                                        onChange={() =>
                                          handleChangePermission(
                                            row,
                                            "isDelete"
                                          )
                                        }
                                        inputProps={{
                                          "aria-label": "controlled",
                                        }}
                                      />
                                    }
                                  />
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={() => handleCloseUser(false)}>
              <CloseOutlinedIcon /> Close
            </Button>
            <Button type="submit" variant="contained">
              <AddOutlinedIcon /> Add
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </React.Fragment>
  );
};

export default AddUser;
