/* eslint-disable react-hooks/exhaustive-deps */
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
  Typography,
  TextField,
  InputAdornment,
  Stack,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { bindActionCreators } from "redux";
import { connect, useDispatch, useSelector } from "react-redux";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { isEmpty } from "lodash";
import SearchIcon from "@mui/icons-material/Search";

import * as UserAction from "../../../../Action/AdminDashboard";
import { RESET_IVRS } from "../../../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../../../environment.config";
import ConfirmationPopUp from "../../../../CommonComponent/ConfirmationPopUp";
import EditIvrs from "../EditIvrs";
import {
  ActionType,
  handlePermission,
  Modules,
} from "../../../../utils/userAccess";
import "./style.scss";

let moment = require("moment-timezone");

const columns = [
  { field: "callerId", headerName: "Caller Id", width: 233 },
  { field: "callstart", headerName: "Call Start", width: 233 },
  { field: "name", headerName: "Name", width: 233 },
  { field: "from", headerName: "From", width: 233 },
  { field: "to", headerName: "To", width: 233 },
  { field: "duration", headerName: "Duration(second)", width: 233 },
  { field: "tags", headerName: "Call Comments", width: 233 },
  { field: "pressedDigit", headerName: "Pressed Digit", width: 233 },
  { field: "isDone", headerName: "Done", width: 233 },
  { field: "notes", headerName: "Notes", width: 233 },
  { field: "updatedAt", headerName: "Updated Date", width: 233 },
  { field: "Commands", headerName: "Commands", width: 233 },
];

const createData = (
  id,
  callerId,
  callstart,
  outlet,
  name,
  from,
  to,
  duration,
  email,
  IvrsVoiceCall,
  tags,
  pressedDigit,
  isDone,
  notes,
  logs,
  Outlet,
  Customer,
  updatedBy,
  updatedAt,
  createdBy,
  createdAt
) => {
  return {
    id,
    callerId,
    callstart,
    outlet,
    name,
    from,
    to,
    duration,
    email,
    IvrsVoiceCall,
    tags,
    pressedDigit,
    isDone,
    notes,
    logs,
    Outlet,
    Customer,
    updatedBy,
    updatedAt,
    createdBy,
    createdAt,
  };
};

const BasicInformation = (props) => {
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedIvrsDetails, setSelectedIvrsDetails] = useState([]);
  const [ivrsData, setIvrsData] = useState({
    fromDate: new Date(),
    toDate: new Date(),
  });
  const [tags, setTags] = useState([]);
  const [openUpdateStatus, setOpenUpdateStatus] = useState(false);

  const hotelReducer = useSelector((state) => ({
    ivrs: state.hotelReducer.ivrs,
    tags: state.hotelReducer.tags,
    selectedOutlet: state.hotelReducer.selectedOutlet,
    permission: state.hotelReducer.permission,
  }));

  useEffect(() => {
    setRows([]);
    if (hotelReducer.selectedOutlet) {
      const data = {
        ...ivrsData,
        fromDate: moment(ivrsData.fromDate).format("DD-MM-YYYY"),
        toDate: moment(ivrsData.toDate).format("DD-MM-YYYY"),
      };
      props.actions.userAction.getIvrs(
        data,
        hotelReducer.selectedOutlet.outlet.id
      );
      props.actions.userAction.getTagsByOutletCategory(
        ENVIRONMENT_VARIABLES.Base_CALL_TAGS,
        hotelReducer.selectedOutlet.outlet.id
      );
      return () => {
        dispatch({ type: RESET_IVRS });
        setRows([]);
      };
    }
  }, [hotelReducer.selectedOutlet]);

  useEffect(() => {
    if (hotelReducer.tags) {
      setTags(hotelReducer.tags);
    }
  }, [hotelReducer.tags]);

  const convertData = (ivrs) => {
    const data = ivrs.map((ivrsData) => {
      return createData(
        ivrsData.id,
        ivrsData?.callerId,
        ivrsData.callstart,
        ivrsData.Outlet?.name,
        ivrsData.Customer?.name,
        ivrsData.from,
        ivrsData.to,
        ivrsData.duration,
        ivrsData.IvrsDetails?.Customer?.email,
        ivrsData.IvrsVoiceCall?.path,
        ivrsData.tags && ivrsData.tags.length > 0 ? ivrsData.tags[0] : null,
        ivrsData.pressedDigit,
        ivrsData.isDone,
        ivrsData.notes ? ivrsData.notes : "",
        ivrsData.logs,
        ivrsData.Outlet,
        ivrsData.Customer,
        ivrsData.updatedBy,
        ivrsData.updatedAt,
        ivrsData.createdBy,
        ivrsData.createdAt
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    if (hotelReducer.ivrs) {
      convertData(hotelReducer.ivrs);
      setPage(0);
      setRowsPerPage(10);
    }
  }, [hotelReducer.ivrs]);

  useEffect(() => {
    if (rows.length > 0) {
      if (page * rowsPerPage >= rows.length) {
        setPage(page - 1);
      }
    }
  }, [rows]);

  const searchItems = (value) => {
    if (!isEmpty(value)) {
      const filteredData = convertData(hotelReducer.ivrs).filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(value.toLowerCase());
      });
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.ivrs);
    }
  };

  const handleSubmit = () => {
    const data = {
      ...ivrsData,
      fromDate: moment(ivrsData.fromDate).format("DD-MM-YYYY"),
      toDate: moment(ivrsData.toDate).format("DD-MM-YYYY"),
    };
    props.actions.userAction.getIvrs(
      data,
      hotelReducer.selectedOutlet.outlet.id
    );
    setIvrsData(ivrsData);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (event, row) => {
    const selectedIvrs = rows.find((ivrsDetail) => ivrsDetail.id === row.id);

    if (selectedIvrs) {
      const selectedTag = tags.find((tag) => tag.id === event.target.value);

      setSelectedRow({
        ...selectedIvrs,
        tags: { id: selectedTag.id, name: selectedTag.name },
      });
    }
    setOpenUpdateStatus(true);
  };

  const handeChangeStatus = (data) => {
    const selectedIvrs = rows.find((ivrsDetail) => ivrsDetail.id === data.id);
    if (selectedIvrs) {
      setSelectedRow({ ...selectedIvrs, isDone: !selectedIvrs.isDone });
    }
    setOpenUpdateStatus(true);
  };

  const handleCloseUpdateStatus = () => {
    setOpenUpdateStatus(false);
  };

  const handleIvrsDetailsChange = (data) => {
    const payloadData = { ...data };

    let updatedTag = [];
    if (payloadData.tags) {
      updatedTag.push({
        id: payloadData.tags.id,
        name: payloadData.tags.name,
      });
    }
    const newUpdateData = {
      isDone: payloadData.isDone,
      tags: updatedTag.length > 0 ? updatedTag : [],
    };
    props.actions.userAction.updateIvrsDetail(newUpdateData, payloadData.id);
  };

  const handleOpenIvrsData = (data) => {
    props.actions.userAction.getIvrsInfo(data.id);
    setSelectedIvrsDetails(data);
    setEditOpen(true);
  };

  const handleCloseIvrsDetails = () => {
    setEditOpen(false);
  };

  return (
    <div className="user-groups" style={{ height: "calc(100vh - 275px)" }}>
      {openUpdateStatus && (
        <ConfirmationPopUp
          open={openUpdateStatus}
          handleClose={handleCloseUpdateStatus}
          message="Confirm To Update IvrsDetails"
          data={{ ...selectedRow }}
          handleUpdate={handleIvrsDetailsChange}
        />
      )}

      {editOpen && (
        <EditIvrs
          open={editOpen}
          selectedIvrsDetails={selectedIvrsDetails}
          handleCloseIvrsDetails={handleCloseIvrsDetails}
        />
      )}

      {!editOpen && (
        <Paper sx={{ width: "100%" }}>
          <Box
            className="user-groups-search"
            style={{ width: "40%", gap: "10px" }}
          >
            <div className="popup-input-box w-50">
              <TextField
                size="small"
                className="search-box"
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
            </div>
            <div className="popup-input-box date-picker">
              <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
                <Stack sx={{ width: "160px" }}>
                  <DesktopDatePicker
                    value={ivrsData.fromDate}
                    onChange={(newValue) => {
                      setIvrsData({
                        ...ivrsData,
                        fromDate: new Date(newValue),
                      });
                    }}
                    inputFormat="DD-MM-YYYY"
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            </div>
            <Typography className="search-bar-to">To</Typography>
            <div className="popup-input-box date-picker">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack sx={{ width: "160px" }}>
                  <DesktopDatePicker
                    value={ivrsData.toDate}
                    onChange={(newValue) => {
                      setIvrsData({
                        ...ivrsData,
                        toDate: new Date(newValue),
                      });
                    }}
                    inputFormat="DD-MM-YYYY"
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            </div>
            <div className="primary-btn">
              <Button variant="contained" onClick={handleSubmit}>
                SEARCH
              </Button>
            </div>
          </Box>
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
                          {row.callerId ? row.callerId.substr(-8) : "N/A"}
                        </TableCell>
                        <TableCell>
                          {moment(row.callstart).format("DD-MM-YYYY hh:mm A")}
                        </TableCell>
                        <TableCell> {row.name ? row.name : ""}</TableCell>
                        <TableCell>{row.from ? row.from : "N/A"}</TableCell>
                        <TableCell> {row.to ? row.to : "N/A"}</TableCell>
                        <TableCell>
                          {row.duration ? row.duration : "N/A"}
                        </TableCell>                       
                        <TableCell>
                          <Box>
                            <FormControl
                              fullWidth
                              size="small"
                              sx={{ width: "130px" }}
                            >
                              <Select
                                value={row.tags && row.tags.id}
                                name="status"
                                onChange={(event) => {
                                  handlePermission(
                                    hotelReducer.permission.permission,
                                    Modules.CALLMANAGEMENT,
                                    ActionType.update
                                  ) && handleChange(event, row);
                                }}
                              >
                                {tags.map((data, index) => (
                                  <MenuItem key={index} value={data.id}>
                                    {data.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <table>
                            {row.pressedDigit &&
                              row.pressedDigit.map((content) => (
                                <tr style={{ marginBottom: "10px" }}>
                                  <td>{content}</td>
                                </tr>
                              ))}
                          </table>
                        </TableCell>

                        <TableCell>
                          <FormControlLabel
                            control={
                              <Checkbox
                                sx={{ padding: "0" }}
                                checked={row.isDone}
                                onClick={() =>
                                  handlePermission(
                                    hotelReducer.permission.permission,
                                    Modules.CALLMANAGEMENT,
                                    ActionType.update
                                  ) && handeChangeStatus(row)
                                }
                                inputProps={{ "aria-label": "controlled" }}
                              />
                            }
                          />
                        </TableCell>
                        <TableCell>{row.notes ? row.notes : ""}</TableCell>

                        <TableCell>
                          {moment(row.updatedAt).format("DD-MM-YYYY hh:mm A")}
                        </TableCell>

                        <TableCell className="commands-icons">
                          <VisibilityIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => handleOpenIvrsData({ ...row })}
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
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(BasicInformation);
