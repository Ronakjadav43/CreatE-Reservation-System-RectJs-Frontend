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

import AddDiningOption from "./Add";
import EditDiningOption from "./Edit";
import DeletePopUp from "../../../../CommonComponent/DeletePopUp";
import * as UserAction from "../../../../Action/AdminDashboard";
import ENVIRONMENT_VARIABLES from "../../../../environment.config";
import {
  ActionType,
  Modules,
  handlePermission,
  handleUpdatedBy,
} from "../../../../utils/userAccess";

let moment = require("moment-timezone");

const columns = [
  { field: "image", headerName: "Image", width: 233 },
  { field: "name", headerName: "Item", width: 233 },
  { field: "description", headerName: "Description", width: 233 },
  { field: "originalPrice", headerName: "Unit Price", width: 233 },
  { field: "price", headerName: "Deposit Price", width: 233 },
  { field: "dailyMaxQty", headerName: "Day Max Quantity", width: 233 },
  { field: "bookingMaxQty", headerName: "Booking Max Quantity", width: 233 },
  { field: "isActive", headerName: "Status", width: 233 },
  { field: "updatedBy", headerName: "Updated By", width: 233 },
  { field: "updatedAt", headerName: "Updated Date", width: 233 },
  { field: "Commands", headerName: "Commands", width: 233 },
];

const createData = (
  id,
  name,
  description,
  price,
  originalPrice,

  dailyMaxQty,
  bookingMaxQty,
  isActive,
  updatedBy,
  updatedAt,
  createdBy,
  createdAt,
  image
) => {
  return {
    id,
    name,
    description,
    price,
    originalPrice,

    dailyMaxQty,
    bookingMaxQty,
    isActive,
    updatedBy,
    updatedAt,
    createdBy,
    createdAt,
    image,
  };
};

const DiningOption = (props) => {
  const [rows, setRows] = useState([]);
  const [selectedDiningOption, setSelectedDiningOption] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    diningOptions: state.hotelReducer.diningOptions,
    permission: state.hotelReducer.permission,
  }));

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      props.actions.userAction.getDiningOption(
        hotelReducer.selectedOutlet.outlet.id
      );
      setPage(0);
      setRowsPerPage(10);
    }
  }, [hotelReducer.selectedOutlet]);

  const convertData = (diningOptions) => {
    const data = diningOptions.map((diningOption) => {
      return createData(
        diningOption.id,
        diningOption.name,
        diningOption.description,
        diningOption.price,
        diningOption.originalPrice,
        diningOption.dailyMaxQty,
        diningOption.bookingMaxQty,
        diningOption.isActive,
        diningOption.updatedBy,
        diningOption.createdAt,
        diningOption.createdBy,
        diningOption.updatedAt,
        diningOption.image
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    convertData(hotelReducer.diningOptions);
  }, [hotelReducer.diningOptions]);

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
      const filteredData = convertData(hotelReducer.diningOptions).filter(
        (item) => {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      );
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.diningOptions);
    }
  };

  const handleOpenDiningOption = () => {
    setOpen(true);
  };

  const handleCloseDiningOption = () => {
    setOpen(false);
  };

  const handleSaveDiningOption = (data) => {
    props.actions.userAction.addDiningOption(
      data,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleOpenEditPreOrder = (data) => {
    setSelectedDiningOption(data);
    setEditOpen(true);
  };

  const handleClosEditDiningOption = () => {
    setEditOpen(false);
  };

  const handleEditSaveDiningOption = (data, diningOptionId) => {
    props.actions.userAction.updateDiningOption(
      data,
      diningOptionId,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleOpenDeleteDiningOption = (data) => {
    setSelectedDiningOption(data);
    setDeleteOpen(true);
  };

  const handleCloseDeleteDiningOption = () => {
    setDeleteOpen(false);
  };

  const handleDeleteDiningOption = (data) => {
    const { id } = data;
    props.actions.userAction.deleteDiningOption(
      id,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  return (
    <React.Fragment>
      {open && (
        <AddDiningOption
          open={open}
          handleCloseDiningOption={handleCloseDiningOption}
          handleSaveDiningOption={handleSaveDiningOption}
        />
      )}

      {editOpen && (
        <EditDiningOption
          open={editOpen}
          selectedDiningOption={selectedDiningOption}
          handleClosEditDiningOption={handleClosEditDiningOption}
          handleEditSaveDiningOption={handleEditSaveDiningOption}
          // diningOptions={[...diningOptions]}
        />
      )}

      {deleteOpen && (
        <DeletePopUp
          open={deleteOpen}
          data={selectedDiningOption}
          handleClose={handleCloseDeleteDiningOption}
          handleDelete={handleDeleteDiningOption}
          message="Confirm To Delete Dining Option"
        />
      )}

      <div className="user-groups" style={{ height: "calc(100vh - 275px)" }}>
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
              <CSVLink data={rows} filename="Dining Option">
                <CloudDownloadOutlinedIcon /> EXPORT
              </CSVLink>
            </Button>
            <Button
              disabled={handlePermission(
                hotelReducer.permission.permission,
                Modules.DINNINGOPTION,
                ActionType.create,
                true
              )}
              variant="contained"
              onClick={handleOpenDiningOption}
            >
              <AddOutlinedIcon />
              ADD
            </Button>
          </div>
        </Box>

        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: "calc(100vh - 377px)" }}>
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
                          <img
                            className="product-image"
                            src={`${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${row.image}`}
                            alt="dining Option"
                          ></img>
                        </TableCell>
                        <TableCell>{row.name ? row.name : "N/A"}</TableCell>
                        <TableCell>
                          {row.description ? row.description : "N/A"}
                        </TableCell>
                        <TableCell>
                          {row.originalPrice ? `$ ${row.originalPrice}` : "N/A"}
                        </TableCell>
                        <TableCell>
                          {row.price ? `$ ${row.price}` : "N/A"}
                        </TableCell>
                        <TableCell>
                          {row.dailyMaxQty ? row.dailyMaxQty : "N/A"}
                        </TableCell>
                        <TableCell>
                          {row.bookingMaxQty ? row.bookingMaxQty : "N/A"}
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
                        <TableCell> {handleUpdatedBy(row.updatedBy)}</TableCell>

                        <TableCell>
                          {moment(row.updatedAt).format("DD-MM-YYYY hh:mm A")}
                        </TableCell>
                        <TableCell className="commands-icons">
                          <BorderColorOutlinedIcon
                            style={{
                              cursor: handlePermission(
                                hotelReducer.permission.permission,
                                Modules.DINNINGOPTION,
                                ActionType.update
                              )
                                ? "pointer"
                                : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.DINNINGOPTION,
                                ActionType.update
                              ) && handleOpenEditPreOrder({ ...row })
                            }
                          />
                          <DeleteOutlinedIcon
                            style={{
                              cursor: handlePermission(
                                hotelReducer.permission.permission,
                                Modules.DINNINGOPTION,
                                ActionType.delete
                              )
                                ? "pointer"
                                : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.DINNINGOPTION,
                                ActionType.delete
                              ) && handleOpenDeleteDiningOption({ ...row })
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

export default connect(null, mapDispatchToProps)(DiningOption);
