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
import { useNavigate } from "react-router-dom";

import DeletePopUp from "../../../CommonComponent/DeletePopUp";
import * as UserAction from "../../../Action/AdminDashboard";
import AddSeatType from "./Add";
import EditSeatType from "./Edit";
import {
  ActionType,
  handlePermission,
  handleUpdatedBy,
  Modules,
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
  isActive,
  updatedBy,
  updatedDate,
  createdBy,
  createdDate,
  outletId
) => {
  return {
    id,
    name,
    description,
    isActive,
    updatedBy,
    updatedDate,
    createdBy,
    createdDate,
    outletId,
  };
};

const SeatType = (props) => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [selectedSeatType, setSelectedSeatType] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    seatType: state.hotelReducer.seatType,
    permission: state.hotelReducer.permission,
  }));

  const redirect = (url) => {
    navigate(url);
  };

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      props.actions.userAction.getSeatType(
        hotelReducer.selectedOutlet.outlet.id
      );
      setPage(0);
      setRowsPerPage(10);
    }
  }, [hotelReducer.selectedOutlet]);

  useEffect(() => {
    const hasPermission = handlePermission(
      hotelReducer.permission.permission,
      Modules.SEATTYPE,
      ActionType.read
    );
    if (!hasPermission) {
      redirect("/Admin");
    }
  }, [hotelReducer.permission]);

  const convertData = (seatType) => {
    const data = seatType.map((data) => {
      return createData(
        data.id,
        data.name,
        data.description,
        data.isActive,
        data.updatedBy,
        data.updatedAt,
        data.createdBy,
        data.createdAt,
        data.outletId,
        data.Commands
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    convertData(hotelReducer.seatType);
  }, [hotelReducer.seatType]);

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
      const filteredData = convertData(hotelReducer.seatType).filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(value.toLowerCase());
      });
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.seatType);
    }
  };

  const handleOpenSeatType = () => {
    setOpen(true);
  };

  const handleCloseSeatType = () => {
    setOpen(false);
  };

  const handleSaveSeatType = (data) => {
    props.actions.userAction.addSeatType(
      data,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleOpenEditSeatType = (data) => {
    setSelectedSeatType(data);
    setEditOpen(true);
  };

  const handleClosEditSeatType = () => {
    setEditOpen(false);
  };

  const handleEditSaveSeatType = (data, seatTypeId) => {
    props.actions.userAction.updateSeatType(
      data,
      seatTypeId,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleOpenDeleteSeatType = (data) => {
    setSelectedSeatType(data);
    setDeleteOpen(true);
  };

  const handleCloseDeleteSeatType = () => {
    setDeleteOpen(false);
  };

  const handleDeleteSeatType = (data) => {
    const { id } = data;
    props.actions.userAction.deleteSeatType(
      id,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };
  return (
    <React.Fragment>
      {open && (
        <AddSeatType
          open={open}
          handleCloseSeatType={handleCloseSeatType}
          handleSaveSeatType={handleSaveSeatType}
        />
      )}

      {editOpen && (
        <EditSeatType
          open={editOpen}
          selectedSeatType={selectedSeatType}
          handleClosEditSeatType={handleClosEditSeatType}
          handleEditSaveSeatType={handleEditSaveSeatType}
        />
      )}
      {deleteOpen && (
        <DeletePopUp
          open={deleteOpen}
          data={selectedSeatType}
          handleClose={handleCloseDeleteSeatType}
          handleDelete={handleDeleteSeatType}
          message="Confirm To Delete SeatType"
        />
      )}
      <div className="user-groups">
        <h1 className="groups-header">Seat Management</h1>
        <h1 className="groups-header-2nd">Seat Type</h1>
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
              <CSVLink data={rows} filename="Seat Type">
                <CloudDownloadOutlinedIcon /> EXPORT
              </CSVLink>
            </Button>
            <Button
              disabled={handlePermission(
                hotelReducer.permission.permission,
                Modules.SEATTYPE,
                ActionType.create,
                true
              )}
              className="add-btn"
              variant="contained"
              onClick={handleOpenSeatType}
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
                        <TableCell>{row.name ? row.name : "N/A"}</TableCell>

                        <TableCell>
                          {row.description ? row.description : "N/A"}
                        </TableCell>
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
                              cursor:
                                handlePermission(
                                  hotelReducer.permission.permission,
                                  Modules.SEATTYPE,
                                  ActionType.update
                                ) && row.outletId
                                  ? "pointer"
                                  : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.SEATTYPE,
                                ActionType.update
                              ) &&
                              row.outletId &&
                              handleOpenEditSeatType({ ...row })
                            }
                          />
                          <DeleteOutlinedIcon
                            style={{
                              cursor:
                                handlePermission(
                                  hotelReducer.permission.permission,
                                  Modules.SEATTYPE,
                                  ActionType.delete
                                ) && row.outletId
                                  ? "pointer"
                                  : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.SEATTYPE,
                                ActionType.delete
                              ) &&
                              row.outletId &&
                              handleOpenDeleteSeatType({ ...row })
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

export default connect(null, mapDispatchToProps)(SeatType);
