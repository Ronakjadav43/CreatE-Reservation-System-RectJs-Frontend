/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
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
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { bindActionCreators } from "redux";
import { visuallyHidden } from "@mui/utils";
import { connect, useDispatch, useSelector } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { isEmpty } from "lodash";
import SearchIcon from "@mui/icons-material/Search";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import * as UserAction from "../../../../../Action/AdminDashboard";
import DeletePopUp from "../../../../../CommonComponent/DeletePopUp";
import AddPrivateRoom from "../AddPrivateRoom";
import EditPrivateRoom from "../EditPrivateRoom";
import View from "./View";
import {
  ActionType,
  Modules,
  handlePermission,
  handleUpdatedBy,
} from "../../../../../utils/userAccess";
import { RESET_OUTLETTABLES } from "../../../../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../../../../environment.config";

let moment = require("moment-timezone");

const columns = [
  { field: "image", headerName: "Image", width: 233 },
  { field: "name", headerName: "Name", width: 233 },
  { field: "tables", headerName: "Tables", width: 233 },
  { field: "minPax", headerName: "Min Pax", width: 233 },
  { field: "maxPax", headerName: "Max Pax", width: 233 },
  { field: "isActive", headerName: "Status", width: 233 },
  { field: "updatedBy", headerName: "Updated By", width: 233 },
  { field: "updatedAt", headerName: "Updated Date", width: 233 },
  { field: "Commands", headerName: "Commands", width: 233 },
];

const createData = (
  id,
  image,
  name,
  minPax,
  maxPax,
  isActive,
  createdAt,
  updatedAt,
  createdBy,
  updatedBy,
  outletTables,
  description,
  tables,
  originalPrice,
  price,
  blockTime
) => {
  return {
    id,
    image,
    name,
    minPax,
    maxPax,
    isActive,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    outletTables,
    description,
    tables,
    originalPrice,
    price,
    blockTime,
  };
};

const PrivateRoom = (props) => {
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [openAddPrivateRoom, setOpenAddPrivateRoom] = useState(false);
  const [openEditPrivateRoom, setOpenEditPrivateRoom] = useState(false);
  const [selectedPrivateRoom, setSelectedPrivateRoom] = useState(null);
  const [openDeletePrivateRoom, setOpenDeletePrivateRoom] = useState(false);
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [tableList, setTableList] = useState([]);

  const hotelReducer = useSelector((state) => ({
    tables: state.hotelReducer.tables,
    outletTablesByGroup: state.hotelReducer.outletTablesByGroup,
    outletSeatingInfo: state.hotelReducer.outletSeatingInfo,
  }));

  useEffect(() => {
    if (props.selectedOutlet) {
      props.actions.userAction.getTable(props.selectedOutlet.outlet.id);
      props.actions.userAction.getOutletTablesBySection(
        props.selectedOutlet.outlet.id
      );
      props.actions.userAction.getOutletSeatingInfo(
        props.selectedOutlet.outlet.id
      );
    }
    return () => {
      dispatch({ type: RESET_OUTLETTABLES });
    };
  }, []);

  useEffect(() => {
    if (hotelReducer.outletTablesBySeatType) {
      const mappedTables = hotelReducer.outletTablesBySeatType.map((data) => {
        return { ...data, isChecked: false };
      });
      setTableList(mappedTables);
    }
  }, [hotelReducer.outletTablesBySeatType]);

  useEffect(() => {
    if (hotelReducer.outletTablesByGroup) {
      convertData(hotelReducer.outletTablesByGroup);
    }
  }, [hotelReducer.outletTablesByGroup]);

  useEffect(() => {
    if (rows.length > 0) {
      if (page * rowsPerPage >= rows.length) {
        setPage(page - 1);
      }
    }
  }, [rows]);

  const convertData = (outletTablesByGroup) => {
    const data = outletTablesByGroup.map((table) => {
      let sequenceTables = "";
      table.OutletTableSection.map((sequenceTable, index) => {
        if (index === 0) sequenceTables += sequenceTable.OutletTable.name;
        else sequenceTables += "," + sequenceTable.OutletTable.name;
      });

      return createData(
        table.id,
        table.image,
        table.name,
        table.minPax,
        table.maxPax,
        table.isActive,
        table.createdAt,
        table.updatedAt,
        table.createdBy,
        table.updatedBy,
        table.outletTables,
        table.description,
        sequenceTables,
        table.originalPrice,
        table.price,
        table.blockTime
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

  const searchItems = (value) => {
    if (!isEmpty(value)) {
      const filteredData = convertData(hotelReducer.outletTablesByGroup).filter(
        (item) => {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      );
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.outletTables);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAddPrivateRoom = () => {
    setOpenAddPrivateRoom(true);
  };

  const handleCloseAddPrivateRoom = () => {
    setOpenAddPrivateRoom(false);
  };

  const handleOpenEditPrivateRoom = (data) => {
    setSelectedPrivateRoom(data);
    setOpenEditPrivateRoom(true);
  };

  const handleCloseEditPrivateRoom = () => {
    setOpenEditPrivateRoom(false);
  };

  const handleOpenDeletePrivateRoom = (data) => {
    setSelectedPrivateRoom(data);
    setOpenDeletePrivateRoom(true);
  };
  const handleCloseDeletePrivateRoom = () => {
    setOpenDeletePrivateRoom(false);
  };

  const handleSaveEditPrivateRoom = (data) => {
    props.actions.userAction.updataTableInfoByGroup(
      data,
      selectedPrivateRoom.id,
      props.outletSeatingType.id
    );
  };

  const handleDeletePrivateRoom = (data) => {
    const { id } = data;
    props.actions.userAction.deleteOutletTableByGroup(id);
  };

  const handleOpenImageInfo = (data) => {
    setSelectedPrivateRoom(data);
    setEditOpen(true);
  };

  const handleCloseImageInfo = () => {
    setEditOpen(false);
  };

  return (
    <div>
      {rows && (
        <div className="user-groups" style={{ height: "calc(100vh - 275px)" }}>
          {openAddPrivateRoom && (
            <AddPrivateRoom
              open={openAddPrivateRoom}
              handleClose={handleCloseAddPrivateRoom}
              outletSeatingType={{ ...props.outletSeatingType }}
            />
          )}

          {openEditPrivateRoom && (
            <EditPrivateRoom
              open={openEditPrivateRoom}
              selectedPrivateRoom={{ ...selectedPrivateRoom }}
              table={[...tableList]}
              handleCloseEditPrivateRoom={handleCloseEditPrivateRoom}
              handleSaveEditPrivateRoom={handleSaveEditPrivateRoom}
            />
          )}
          {editOpen && (
            <View
              open={editOpen}
              selectedPrivateRoom={{ ...selectedPrivateRoom }}
              handleCloseImageInfo={handleCloseImageInfo}
            />
          )}
          {openDeletePrivateRoom && (
            <DeletePopUp
              open={openDeletePrivateRoom}
              data={{ ...selectedPrivateRoom }}
              handleClose={handleCloseDeletePrivateRoom}
              handleDelete={handleDeletePrivateRoom}
              message="Please Confirm To delete the data!"
            />
          )}
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
                variant="contained"
                disabled={handlePermission(
                  props.permission.permission,
                  Modules.SEATPLANS,
                  ActionType.create,
                  true
                )}
                onClick={handleOpenAddPrivateRoom}
              >
                <AddOutlinedIcon /> ADD
              </Button>
            </div>
          </Box>

          <Paper sx={{ width: "100%" }}>
            <TableContainer sx={{ maxHeight: 585 }}>
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
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={
                          orderBy === headCell.field ? order : false
                        }
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
                              alt="private room"
                            ></img>
                          </TableCell>
                          <TableCell>{row.name ? row.name : "N/A"}</TableCell>
                          <TableCell>
                            {row.tables ? row.tables : "N/A"}
                          </TableCell>
                          <TableCell>
                            {row.minPax ? row.minPax : "N/A"}
                          </TableCell>
                          <TableCell>
                            {row.maxPax ? row.maxPax : "N/A"}
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
                            {moment(row.updatedAt).format("DD-MM-YYYY hh:mm A")}
                          </TableCell>
                          <TableCell className="commands-icons">
                            <BorderColorOutlinedIcon
                              style={{
                                cursor: handlePermission(
                                  props.permission.permission,
                                  Modules.SEATPLANS,
                                  ActionType.update
                                )
                                  ? "pointer"
                                  : "not-allowed",
                              }}
                              onClick={() =>
                                handlePermission(
                                  props.permission.permission,
                                  Modules.SEATPLANS,
                                  ActionType.update
                                ) && handleOpenEditPrivateRoom({ ...row })
                              }
                            />
                            <DeleteOutlinedIcon
                              style={{
                                cursor: handlePermission(
                                  props.permission.permission,
                                  Modules.SEATPLANS,
                                  ActionType.delete
                                )
                                  ? "pointer"
                                  : "not-allowed",
                              }}
                              onClick={() =>
                                handlePermission(
                                  props.permission.permission,
                                  Modules.SEATPLANS,
                                  ActionType.delete
                                ) && handleOpenDeletePrivateRoom({ ...row })
                              }
                            />
                            <VisibilityIcon
                              onClick={() => handleOpenImageInfo({ ...row })}
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
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(PrivateRoom);
