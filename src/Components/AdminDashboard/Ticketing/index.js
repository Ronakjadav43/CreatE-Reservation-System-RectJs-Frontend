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
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { visuallyHidden } from "@mui/utils";
import { bindActionCreators } from "redux";
import { connect, useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";

import * as UserAction from "../../../Action/AdminDashboard";
import DeletePopUp from "../../../CommonComponent/DeletePopUp";
import AddTicket from "./Add";
import EditTicket from "./Edit";
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
  { field: "noOfPerson", headerName: "Pax", width: 233 },
  {
    field: "ticketMaxQuantity",
    headerName: "Ticketing Max Quantity",
    width: 233,
  },
  { field: "startDate", headerName: "Start Date", width: 233 },
  { field: "endDate", headerName: "End Date", width: 233 },
  { field: "startTime", headerName: "Start Time", width: 233 },
  { field: "closingTime", headerName: "End Time", width: 233 },
  { field: "amount", headerName: "Amount", width: 233 },
  { field: "isActive", headerName: "Status", width: 233 },
  { field: "updatedBy", headerName: "Updated By", width: 233 },
  { field: "updatedAt", headerName: "Updated Date", width: 233 },
  { field: "Commands", headerName: "Commands", width: 233 },
];

const createData = (
  id,
  name,
  description,
  noOfPerson,
  ticketMaxQuantity,
  isActive,
  updatedBy,
  updatedAt,
  startDate,
  endDate,
  openingTime,
  closingTime,
  amount,
  createdBy,
  createdAt,
  timeSlotInterval,
  blockTable,
  blockSchedule,
  prePayment,
  image
) => {
  return {
    id,
    name,
    description,
    noOfPerson,
    ticketMaxQuantity,
    isActive,
    updatedBy,
    updatedAt,
    startDate,
    endDate,
    openingTime,
    closingTime,
    amount,
    createdBy,
    createdAt,
    timeSlotInterval,
    blockTable,
    blockSchedule,
    prePayment,
    image,
  };
};

const Ticketing = (props) => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTicketing, setSelectedTicketing] = useState([]);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    outlets: state.hotelReducer.outlets,
    tickets: state.hotelReducer.tickets,
    permission: state.hotelReducer.permission,
  }));

  const redirect = (url) => {
    navigate(url);
  };

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      props.actions.userAction.getAllTicket(
        hotelReducer.selectedOutlet.outlet.id
      );
    }
  }, [hotelReducer.selectedOutlet]);

  useEffect(() => {
    const hasPermission = handlePermission(
      hotelReducer.permission.permission,
      Modules.TICKETING,
      ActionType.read
    );
    if (!hasPermission) {
      redirect("/Admin");
    }
  }, [hotelReducer.permission]);

  const convertData = (tickets) => {
    const data = tickets.map((ticket) => {
      return createData(
        ticket.id,
        ticket.name,
        ticket.description,
        ticket.noOfPerson,
        ticket.ticketMaxQuantity,
        ticket.isActive,
        ticket.updatedBy,
        ticket.updatedAt,
        ticket.startDate,
        ticket.endDate,
        ticket.openingTime,
        ticket.closingTime,
        ticket.amount,
        ticket.createdBy,
        ticket.createdAt,
        ticket.timeSlotInterval,
        ticket.blockTable,
        ticket.blockSchedule,
        ticket.prePayment,
        ticket.image
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    convertData(hotelReducer.tickets);
    setPage(0);
    setRowsPerPage(10);
  }, [hotelReducer.tickets]);

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
      const filteredData = convertData(hotelReducer.tickets).filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(value.toLowerCase());
      });
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.tickets);
    }
  };

  const handleOpenTicket = () => {
    setOpen(true);
  };

  const handleCloseTicket = () => {
    setOpen(false);
  };

  const handleSaveTicket = (data) => {
    data = {
      ...data,
      startDate: moment(data.startDate).format("DD-MM-YYYY"),
      endDate: moment(data.endDate).format("DD-MM-YYYY"),
      openingTime: moment(data.openingTime).format("HH:mm"),
      closingTime: moment(data.closingTime).format("HH:mm"),
    };
    props.actions.userAction.addTicket(
      data,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleSaveEditTicket = (data, ticketId) => {
    data = {
      ...data,
      startDate: moment(data.startDate)
        .tz(hotelReducer.selectedOutlet.outlet.timezone)
        .format("DD-MM-YYYY"),
      endDate: moment(data.endDate)
        .tz(hotelReducer.selectedOutlet.outlet.timezone)
        .format("DD-MM-YYYY"),
      openingTime: moment(data.openingTime).format("HH:mm"),
      closingTime: moment(data.closingTime).format("HH:mm"),
    };
    props.actions.userAction.updateTicket(
      data,
      ticketId,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleDeleteTicket = (data) => {
    const { id } = data;
    props.actions.userAction.deleteTicket(
      id,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleOpenEditTicket = (data) => {
    setSelectedTicketing(data);
    setEditOpen(true);
  };

  const handleCloseEditTicket = () => {
    setEditOpen(false);
  };

  const handleCloseDeleteTicket = () => {
    setDeleteOpen(false);
  };

  const handleOpenDeleteTicket = (data) => {
    setSelectedTicketing(data);
    setDeleteOpen(true);
  };

  return (
    <React.Fragment>
      {hotelReducer.selectedOutlet && (
        <div className="user-groups">
          <h1 className="groups-header">Reservation Management</h1>
          <h1 className="groups-header-2nd"> Ticketing Set-up</h1>
          {open && (
            <AddTicket
              open={open}
              handleCloseTicket={handleCloseTicket}
              handleSaveTicket={handleSaveTicket}
              timezone={hotelReducer.selectedOutlet.outlet.timezone}
            />
          )}

          {editOpen && (
            <EditTicket
              open={editOpen}
              selectedTicketing={selectedTicketing}
              handleCloseEditTicket={handleCloseEditTicket}
              handleSaveEditTicket={handleSaveEditTicket}
              timezone={hotelReducer.selectedOutlet.outlet.timezone}
              permission={hotelReducer.permission.permission}
            />
          )}

          {deleteOpen && (
            <DeletePopUp
              open={deleteOpen}
              data={selectedTicketing}
              handleClose={handleCloseDeleteTicket}
              handleDelete={handleDeleteTicket}
              message="Confirm To Delete Ticket"
            />
          )}

          {!editOpen && (
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
                  <CSVLink data={rows} filename="Ticketing">
                    <CloudDownloadOutlinedIcon /> EXPORT
                  </CSVLink>
                </Button>

                <Button
                  disabled={handlePermission(
                    hotelReducer.permission.permission,
                    Modules.TICKETING,
                    ActionType.create,
                    true
                  )}
                  variant="contained"
                  onClick={handleOpenTicket}
                >
                  <AddOutlinedIcon /> ADD
                </Button>
              </div>
            </Box>
          )}

          {!editOpen && (
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
                    {stableSort(rows, getComparator(order, orderBy))
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>{row.name ? row.name : "N/A"}</TableCell>
                            <TableCell>
                              {row.description ? row.description : "N/A"}
                            </TableCell>
                            <TableCell>
                              {row.noOfPerson ? row.noOfPerson : "N/A"}
                            </TableCell>
                            <TableCell>
                              {row.ticketMaxQuantity
                                ? row.ticketMaxQuantity
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {row.startDate
                                ? moment(row.startDate)
                                    .tz(
                                      hotelReducer.selectedOutlet.outlet
                                        .timezone
                                    )
                                    .format("DD-MM-YYYY")
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {row.endDate
                                ? moment(row.endDate)
                                    .tz(
                                      hotelReducer.selectedOutlet.outlet
                                        .timezone
                                    )
                                    .format("DD-MM-YYYY")
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {row.openingTime ? row.openingTime : "N/A"}
                            </TableCell>
                            <TableCell>
                              {row.closingTime ? row.closingTime : "N/A"}
                            </TableCell>
                            <TableCell>
                              {row.amount ? row.amount : "N/A"}
                            </TableCell>
                            <TableCell>
                              {row.isActive ? (
                                <Button
                                  variant="contained"
                                  className="status-btn"
                                >
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
                            <TableCell>
                              {handleUpdatedBy(row.updatedBy)}
                            </TableCell>
                            <TableCell>
                              {moment(row.updatedAt).format(
                                "DD-MM-YYYY hh:mm A"
                              )}
                            </TableCell>

                            <TableCell className="commands-icons">
                              <VisibilityIcon
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => handleOpenEditTicket({ ...row })}
                              />

                              <DeleteOutlinedIcon
                                style={{
                                  cursor: handlePermission(
                                    hotelReducer.permission.permission,
                                    Modules.TICKETING,
                                    ActionType.delete
                                  )
                                    ? "pointer"
                                    : "not-allowed",
                                }}
                                onClick={() =>
                                  handlePermission(
                                    hotelReducer.permission.permission,
                                    Modules.TICKETING,
                                    ActionType.delete
                                  ) && handleOpenDeleteTicket({ ...row })
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
          )}
        </div>
      )}
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(Ticketing);
