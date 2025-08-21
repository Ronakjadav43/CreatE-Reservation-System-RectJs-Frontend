/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import {
  InputAdornment,
  Paper,
  TextField,
  Button,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableBody,
  TableSortLabel,
  Box,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import { visuallyHidden } from "@mui/utils";
import { bindActionCreators } from "redux";
import { connect, useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { CSVLink } from "react-csv";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  SET_INVISIBLE_SELECTION,
  SET_VISIBLE_SELECTION,
} from "../../../../utils/AdminDashboard/Constant";
import * as UserAction from "../../../../Action/AdminDashboard";
import "./style.scss";

const ApiLogs = (props) => {
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("bookingDate");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState(null);

  let moment = require("moment-timezone");

  const columns = [
    { field: "id", headerName: "Index", width: 233 },
    { field: "name", headerName: "Api", width: 233 },
    { field: "createdAt", headerName: "Request Date", width: 233 },
    { field: "requestData", headerName: "Request Data", width: 233 },
    { field: "responseData", headerName: "Response Data", width: 233 },
    { field: "status", headerName: "Status", width: 233 },
  ];

  const createData = (name, createdAt, requestData, responseData, status) => {
    return { name, createdAt, requestData, responseData, status };
  };

  const [listingData, setListingData] = useState({
    fromDate: new Date(),
    toDate: new Date(),
  });

  const hotelReducer = useSelector((state) => ({
    apiLogs: state.hotelReducer.apiLogs,
    permission: state.hotelReducer.permission,
  }));

  useEffect(() => {
    dispatch({
      type: SET_INVISIBLE_SELECTION,
    });
    return () => {
      dispatch({
        type: SET_VISIBLE_SELECTION,
      });
    };
  }, []);

  useEffect(() => {
    if (hotelReducer.permission) {
      const data = {
        ...listingData,
        fromDate: moment(listingData.fromDate).format("DD-MM-YYYY"),
        toDate: moment(listingData.toDate).format("DD-MM-YYYY"),
      };
      props.actions.userAction.getAllApiLogs(data);
    }
    // const hasPermission = handlePermission(
    //   hotelReducer.permission.permission,
    //   Modules.SUPERUSER,
    //   ActionType.read
    // );
    // if (!hasPermission) {
    //   redirect("/Admin");
    // } else {

    //   setPage(0);
    //   setRowsPerPage(10);
    // }
  }, [hotelReducer.permission]);

  const convertData = (apiLogs) => {
    const data = apiLogs.map((category) => {
      return createData(
        `${category?.action} ${category?.module}`,
        category.createdAt,
        JSON.stringify(category.requestData, null, 3),
        JSON.stringify(category.responseData, null, 3),
        category.status
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    if (hotelReducer.apiLogs) {
      convertData(hotelReducer.apiLogs);
    }
  }, [hotelReducer.apiLogs]);

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

  useEffect(() => {
    if (hotelReducer.apiLogs)
      if (!isEmpty(searchText)) {
        const filteredData = convertData(hotelReducer.apiLogs).filter(
          (item) => {
            return Object.values(item)
              .join("")
              .toLowerCase()
              .includes(searchText.toLowerCase());
          }
        );
        setRows([...filteredData]);
      } else {
        convertData(hotelReducer.apiLogs);
      }
  }, [hotelReducer.apiLogs]);

  useEffect(() => {
    if (rows.length > 0) {
      if (page * rowsPerPage >= rows.length) {
        setPage(page - 1);
      }
    }
  }, [rows]);

  const handleChangeFromDate = (fromDate) => {
    const data = {
      ...listingData,
      fromDate,
    };
    props.actions.userAction.getAllApiLogs(data);

    setListingData({
      ...data,
    });
  };

  const handleChangeToDate = (toDate) => {
    const data = {
      ...listingData,
      toDate,
    };
    props.actions.userAction.getAllApiLogs(data);

    setListingData({
      ...data,
    });
  };

  return (
    <div className="user-groups" style={{ height: "calc(100vh - 280px)" }}>
      <div className="user-groups">
        <h1 className="groups-header">System Settings</h1>
        <h1 className="groups-header-2nd">Api Logs</h1>

        <Box className="user-groups-search">
          <div className="filter-data">
            <TextField
              size="small"
              className="search-box"
              sx={{ width: "250px" }}
              placeholder="Search"
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <div className="date-picker">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack sx={{ width: "160px" }}>
                  <DesktopDatePicker
                    disableFuture
                    className="date-pic"
                    value={listingData.fromDate}
                    onChange={(newValue) => {
                      handleChangeFromDate(new Date(newValue));
                    }}
                    inputFormat="DD-MM-YYYY"
                    renderInput={(params) => <TextField {...params} />}
                    label="fromDate"
                  />
                </Stack>
              </LocalizationProvider>
            </div>
            <div className="date-picker">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack sx={{ width: "160px" }}>
                  <DesktopDatePicker
                    disablePast
                    className="date-pic"
                    value={listingData.toDate}
                    onChange={(newValue) => {
                      handleChangeToDate(new Date(newValue));
                    }}
                    inputFormat="DD-MM-YYYY"
                    renderInput={(params) => <TextField {...params} />}
                    label="To Date"
                  />
                </Stack>
              </LocalizationProvider>
            </div>
          </div>

          <div className="primary-btn">
            <Button variant="outlined">
              <CSVLink data={rows} filename="Listing View">
                <CloudDownloadOutlinedIcon /> EXPORT
              </CSVLink>
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
                        <TableCell> {index + 1}</TableCell>
                        <TableCell> {row.name}</TableCell>
                        <TableCell>
                          {moment(row.createdAt).format("DD-MM-YYYY hh:mm A")}
                        </TableCell>
                        <TableCell>
                          <div className="api-col">
                            <span className="api-log">{row.requestData}</span>
                            <span className="tooltip">{row.requestData}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="api-col">
                            <span className="api-log"> {row.responseData}</span>
                            <span className="tooltip">{row.responseData}</span>
                          </div>
                        </TableCell>
                        <TableCell> {row.status}</TableCell>
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
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(ApiLogs);
