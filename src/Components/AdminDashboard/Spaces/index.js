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

import * as UserAction from "../../../Action/AdminDashboard";
import AddSeatingType from "./Add";
import DeletePopUp from "../../../CommonComponent/DeletePopUp";
import EditSeatingType from "./Edit";
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
  { field: "updatedDate", headerName: "Updated Date", width: 233 },
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

const Spaces = (props) => {
  const [rows, setRows] = useState([]);
  const [selectedSeatingType, setSelectedSeatingType] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    seatingType: state.hotelReducer.seatingType,
    permission: state.hotelReducer.permission,
  }));

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      props.actions.userAction.getSeatingType(
        hotelReducer.selectedOutlet.outlet.id
      );
    }
  }, [hotelReducer.selectedOutlet]);

  const convertData = () => {
    const data = hotelReducer.seatingType.map((seating) => {
      return createData(
        seating.id,
        seating.name,
        seating.description,
        seating.isActive,
        seating.updatedBy,
        seating.updatedAt,
        seating.createdBy,
        seating.createdAt,
        seating.outletId
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    convertData(hotelReducer.seatingType);
  }, [hotelReducer.seatingType]);

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
      const filteredData = convertData(hotelReducer.seatingType).filter(
        (item) => {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      );
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.seatingType);
    }
  };

  const handleOpenSeatingType = () => {
    setOpen(true);
  };

  const handleCloseSeatingType = () => {
    setOpen(false);
  };

  const handleCloseEditSeatingType = () => {
    setEditOpen(false);
  };

  const handleCloseDeleteSeatingType = () => {
    setDeleteOpen(false);
  };

  const handleOpenEditSeatingType = (data) => {
    setSelectedSeatingType(data);
    setEditOpen(true);
  };

  const handleOpenDeleteSeatingType = (data) => {
    setSelectedSeatingType(data);
    setDeleteOpen(true);
  };

  const handleSaveSeatingType = (data) => {
    props.actions.userAction.addSeatingType(
      data,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleEditSaveSeatingType = (data, seatingId) => {
    props.actions.userAction.updateSeatingType(
      data,
      seatingId,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleDeleteSeatingType = (data) => {
    const { id } = data;
    props.actions.userAction.deleteSeatingType(
      id,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  return (
    <React.Fragment>
      {open && (
        <AddSeatingType
          open={open}
          handleCloseSeatingType={handleCloseSeatingType}
          handleSaveSeatingType={handleSaveSeatingType}
        />
      )}

      {/** Edit Seating type */}
      {editOpen && (
        <EditSeatingType
          open={editOpen}
          selectedSeatingType={selectedSeatingType}
          handleCloseEditSeatingType={handleCloseEditSeatingType}
          handleEditSaveSeatingType={handleEditSaveSeatingType}
        />
      )}

      {/** Delete Seating Type */}
      {deleteOpen && (
        <DeletePopUp
          open={deleteOpen}
          data={selectedSeatingType}
          handleClose={handleCloseDeleteSeatingType}
          handleDelete={handleDeleteSeatingType}
          message="Confirm To Delete Space"
        />
      )}

      <div className="user-groups">
        <h1 className="groups-header">Seat Management</h1>
        <h1 className="groups-header-2nd">Spaces</h1>

        <Box className="user-groups-search">
          <TextField
            className="search-box"
            size="small"
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
          <div className="primary-btn">
            <Button variant="outlined">
              <CSVLink data={rows} filename="Spaces">
                <CloudDownloadOutlinedIcon /> EXPORT
              </CSVLink>
            </Button>
            <Button
              disabled={handlePermission(
                hotelReducer.permission.permission,
                Modules.SPACES,
                ActionType.create,
                true
              )}
              className="add-btn"
              variant="contained"
              onClick={handleOpenSeatingType}
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
                                  Modules.SPACES,
                                  ActionType.update
                                ) && row.outletId
                                  ? "pointer"
                                  : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.SPACES,
                                ActionType.update
                              ) &&
                              row.outletId &&
                              handleOpenEditSeatingType({ ...row })
                            }
                          />
                          <DeleteOutlinedIcon
                            style={{
                              cursor:
                                handlePermission(
                                  hotelReducer.permission.permission,
                                  Modules.SPACES,
                                  ActionType.delete
                                ) && row.outletId
                                  ? "pointer"
                                  : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.SPACES,
                                ActionType.delete
                              ) &&
                              row.outletId &&
                              handleOpenDeleteSeatingType({ ...row })
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

export default connect(null, mapDispatchToProps)(Spaces);
