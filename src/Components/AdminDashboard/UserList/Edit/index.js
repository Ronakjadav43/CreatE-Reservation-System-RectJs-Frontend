import * as React from "react";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Switch,
  Typography,
  DialogContentText,
} from "@mui/material";
import {
  Button,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableSortLabel,
  Box,
  FormControlLabel,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import moment from "moment-timezone";
import PhoneInput from "react-phone-input-2";

import { handleUpdatedBy } from "../../../../utils/userAccess";
import { visuallyHidden } from "@mui/utils";
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

const EditUser = (props) => {
  const { open, handleCloseEditUser, handleEditSaveUser, roles } = props;

  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");

  const [userData, setUserData] = useState({
    firstName: props.selectedUser.firstName,
    lastName: props.selectedUser.lastName,
    email: props.selectedUser.email,
    phone: props.selectedUser.phone,
    roleId: props.selectedUser.roleId,
    isActive: props.selectedUser.isActive,
    companyPermission: props.selectedUser.CompanyPermission,
    globalPermission: props.selectedUser.globalPermission,
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...userData };
    commonData[field] = event.target.value;
    return setUserData(commonData);
  };

  const handleEditUser = () => {
    const data = { ...userData };
    data.companyPermission = {
      id: userData.companyPermission.id,
      permission: rows,
    };
    handleEditSaveUser(data, props.selectedUser.id);
    handleCloseEditUser();
  };

  useEffect(() => {
    if (props.selectedUser.CompanyPermission) {
      convertData(props.selectedUser.CompanyPermission.permission);
    }
  }, [props.selectedUser.CompanyPermission]);

  const convertData = (CompanyPermission) => {
    const data = CompanyPermission.map((module) => {
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
      <Dialog open={open} onClose={handleCloseEditUser} className="hello">
        <ValidatorForm
          onSubmit={() => handleEditUser()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Update User</DialogTitle>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Status</Typography>
              <Switch
                name="status"
                className="switch-status"
                checked={userData.isActive}
                onClick={() =>
                  setUserData({ ...userData, isActive: !userData.isActive })
                }
              />
            </Stack>
          </Box>

          <DialogContent sx={{ width: "850px" }} className="popup-body">
            <div className="popup-input-box w-100">
              <Typography>Email</Typography>
              <TextValidator
                sx={{ width: "100%", marginTop: 0 }}
                size="small"
                margin="normal"
                name="email"
                value={userData.email}
                placeholder="Enter Email"
                onChange={handleChange}
                validators={["required", "isEmail"]}
                errorMessages={["Email is required", "email is not valid"]}
              />
            </div>
            <div className="popup-input-box w-50">
              <Typography>First Name</Typography>
              <TextValidator
                sx={{ width: "100%", marginTop: 0 }}
                size="small"
                margin="normal"
                type="text"
                name="firstName"
                value={userData.firstName}
                placeholder="Enter First Name"
                validators={["required"]}
                onChange={handleChange}
                errorMessages={["First Name is required"]}
              />
            </div>
            <div className="popup-input-box w-50">
              <Typography>Last Name</Typography>
              <TextValidator
                sx={{ width: "100%", marginTop: 0 }}
                size="small"
                margin="normal"
                type="text"
                name="lastName"
                value={userData.lastName}
                placeholder="Enter Last Name"
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["Last Name is required"]}
              />
            </div>
            {props.selectedUser.phone ? (
              <div className="popup-input-box w-50">
                <Typography>Phone Number</Typography>
                <TextValidator
                  sx={{ width: "100%", marginTop: 0 }}
                  size="small"
                  margin="normal"
                  type="text"
                  name="phone"
                  placeholder="Enter Phone Number"
                  maxLength="10"
                  value={userData.phone}
                  multiline
                  onChange={handleChange}
                  validators={["required"]}
                  errorMessages={["Phone Number is required"]}
                />
              </div>
            ) : (
              <div className="popup-input-boxs w-50">
                <Typography>Phone Number</Typography>
                <PhoneInput
                  className="w-100"
                  country={"sg"}
                  inputProps={{
                    name: "phone",
                    required: true,
                  }}
                  onChange={(phone) =>
                    handleChange({
                      target: { name: "phone", value: `+${phone}` },
                    })
                  }
                />
              </div>
            )}
            <div className="popup-input-box w-50">
              <Typography>User Group</Typography>
              <FormControl sx={{ width: "100%", marginTop: 0 }}>
                <Select
                  size="small"
                  value={userData.roleId}
                  name="roleId"
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
                {props.selectedUser.CompanyPermission.Company.name})
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
            <div className="popup-input-box w-100 info">
              <DialogContentText>
                Created by :{props.selectedUser.createdBy}
              </DialogContentText>
              <DialogContentText>
                Created date :
                {props.selectedUser.createdDate
                  ? moment(props.selectedUser.createdDate).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
              <DialogContentText>
                Updated by: {handleUpdatedBy(props.selectedUser.updatedBy)}
              </DialogContentText>
              <DialogContentText>
                Updated date :
                {props.selectedUser.updatedDate
                  ? moment(props.selectedUser.updatedDate).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
            </div>
          </DialogContent>

          <DialogActions className="primary-btn">
            <Button variant="outlined" onClick={handleCloseEditUser}>
              <CloseOutlinedIcon /> Close
            </Button>
            <Button type="submit" variant="contained">
              <SaveOutlinedIcon /> SAVE
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </React.Fragment>
  );
};
export default EditUser;
