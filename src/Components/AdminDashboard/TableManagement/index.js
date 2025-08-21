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
import { ReactSVG } from "react-svg";
import { useNavigate } from "react-router-dom";

import DeletePopUp from "../../../CommonComponent/DeletePopUp";
import * as UserAction from "../../../Action/AdminDashboard";
import AddTable from "./Add";
import EditTable from "./Edit";
import { getTableShape } from "../../../utils/tableShapeAdjustment";
import {
  ActionType,
  handlePermission,
  handleUpdatedBy,
  Modules,
} from "../../../utils/userAccess";

let moment = require("moment-timezone");

const columns = [
  { field: "shape", headerName: "Shape", width: 233 },
  { field: "name", headerName: "Table Name", width: 233 },
  { field: "noOfPerson", headerName: "Number Of Person", width: 233 },
  { field: "description", headerName: "Description", width: 233 },
  { field: "isActive", headerName: "Status", width: 233 },
  { field: "updatedBy", headerName: "Updated By", width: 233 },
  { field: "updatedAt", headerName: "Updated Date", width: 233 },
  { field: "Commands", headerName: "Commands", width: 233 },
];

const createData = (
  id,
  name,
  noOfPerson,
  description,
  isActive,
  updatedAt,
  deletedAt,
  createdBy,
  updatedBy,
  shape,
  outletId
) => {
  return {
    id,
    name,
    noOfPerson,
    description,
    isActive,
    updatedAt,
    deletedAt,
    createdBy,
    updatedBy,
    shape,
    outletId,
  };
};

const TableManagement = (props) => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [selectedTable, setSelectedTable] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    tables: state.hotelReducer.tables,
    permission: state.hotelReducer.permission,
  }));

  const redirect = (url) => {
    navigate(url);
  };

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      props.actions.userAction.getTable(hotelReducer.selectedOutlet.outlet.id);
      setPage(0);
      setRowsPerPage(10);
    }
  }, [hotelReducer.selectedOutlet]);

  useEffect(() => {
    const hasPermission = handlePermission(
      hotelReducer.permission.permission,
      Modules.TABLEMANAGEMENT,
      ActionType.read
    );
    if (!hasPermission) {
      redirect("/Admin");
    }
  }, [hotelReducer.permission]);

  const convertData = (tables) => {
    const data = tables.map((table) => {
      return createData(
        table.id,
        table.name,
        table.noOfPerson,
        table.description,
        table.isActive,
        table.createdAt,
        table.updatedAt,
        table.createdBy,
        table.updatedBy,
        table.shape,
        table.outletId
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    convertData(hotelReducer.tables);
  }, [hotelReducer.tables]);

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
      const filteredData = convertData(hotelReducer.tables).filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(value.toLowerCase());
      });
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.tables);
    }
  };

  const handleOpenTable = () => {
    setOpen(true);
  };

  const handleCloseTable = () => {
    setOpen(false);
  };

  const handleSaveTable = (data) => {
    props.actions.userAction.addTable(
      data,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleOpenEditTable = (data) => {
    setSelectedTable(data);
    setEditOpen(true);
  };

  const handleClosEditTable = () => {
    setEditOpen(false);
  };

  const handleEditSaveTable = (data, tableId) => {
    props.actions.userAction.updateTable(
      data,
      tableId,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleOpenDeleteTable = (data) => {
    setSelectedTable(data);
    setDeleteOpen(true);
  };

  const handleCloseDeleteTable = () => {
    setDeleteOpen(false);
  };

  const handleDeleteTable = (data) => {
    const { id } = data;
    props.actions.userAction.deleteTable(
      id,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  return (
    <React.Fragment>
      {open && (
        <AddTable
          open={open}
          handleCloseTable={handleCloseTable}
          handleSaveTable={handleSaveTable}
        />
      )}
      {editOpen && (
        <EditTable
          open={editOpen}
          selectedTable={selectedTable}
          handleClosEditTable={handleClosEditTable}
          handleEditSaveTable={handleEditSaveTable}
        />
      )}
      {deleteOpen && (
        <DeletePopUp
          open={deleteOpen}
          data={selectedTable}
          handleClose={handleCloseDeleteTable}
          handleDelete={handleDeleteTable}
          message="Confirm To Delete Table"
        />
      )}
      <div className="user-groups">
        <h1 className="groups-header">Seat Management</h1>
        <h1 className="groups-header-2nd">Table Management</h1>
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
            <Button
              variant="outlined"
            >
              <CSVLink data={rows} filename="Table Management">
                <CloudDownloadOutlinedIcon /> EXPORT
              </CSVLink>
            </Button>
            <Button
              disabled={handlePermission(
                hotelReducer.permission.permission,
                Modules.TABLEMANAGEMENT,
                ActionType.create,
                true
              )}
              variant="contained"
              onClick={handleOpenTable}
            >
              <AddOutlinedIcon />
              ADD
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
                        <TableCell>
                          <div
                            className={`${row.shape}`}
                            style={getTableShape(row.shape, row.noOfPerson)}
                          >
                            <ReactSVG
                              style={{
                                fill: getTableShape(row.shape, row.noOfPerson)
                                  .borderColor,
                                width: "100%",
                                height: "100%",
                              }}
                              src={
                                getTableShape(row.shape, row.noOfPerson).svgUrl
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell>{row.name ? row.name : "N/A"}</TableCell>
                        <TableCell>
                          {row.noOfPerson ? row.noOfPerson : "N/A"}
                        </TableCell>
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
                                  Modules.TABLEMANAGEMENT,
                                  ActionType.update
                                ) && row.outletId
                                  ? "pointer"
                                  : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.TABLEMANAGEMENT,
                                ActionType.update
                              ) &&
                              row.outletId &&
                              handleOpenEditTable({ ...row })
                            }
                          />
                          <DeleteOutlinedIcon
                            style={{
                              cursor:
                                handlePermission(
                                  hotelReducer.permission.permission,
                                  Modules.TABLEMANAGEMENT,
                                  ActionType.delete
                                ) && row.outletId
                                  ? "pointer"
                                  : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.TABLEMANAGEMENT,
                                ActionType.delete
                              ) &&
                              row.outletId &&
                              handleOpenDeleteTable({ ...row })
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
export default connect(null, mapDispatchToProps)(TableManagement);
