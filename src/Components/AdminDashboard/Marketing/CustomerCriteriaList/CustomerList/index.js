/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TextField,
  TableHead,
  TableContainer,
  TableSortLabel,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import { visuallyHidden } from "@mui/utils";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import { isEmpty } from "lodash";

import { SET_OUTLET } from "../../../../../utils/AdminDashboard/Constant";
import * as UserAction from "../../../../../Action/AdminDashboard";

const columns = [
  { field: "name", headerName: "Customer Name", width: 233 },
  { field: "tags", headerName: "Tags", width: 233 },
  { field: "mobileNo", headerName: "Mobile Number", width: 233 },
  { field: "email", headerName: "Email Address", width: 233 },
  { field: "Commands", headerName: "Commands", width: 233 },
];

const createData = (id, name, tags, mobileNo, email, outletId, Commands) => {
  return {
    id,
    name,
    tags,
    mobileNo,
    email,
    outletId,
    Commands,
  };
};

const CustomerList = (props) => {
  const navigate = useNavigate();
  const redirect = (url) => {
    navigate(url, 2);
  };
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useDispatch();

  const hotelReducer = useSelector((state) => ({
    customerList: state.hotelReducer.customerList,
    outlets: state.hotelReducer.outlets,
  }));

  useEffect(() => {
    if (props.selectedCustomerCriteria) {
      props.actions.userAction.getCustomerList(
        props.selectedCustomerCriteria.id
      );
    }
  }, []);

  const convertData = (customerList) => {
    const data = customerList.map((role) => {
      let sequenceTags = "";
      role.tags?.map((sequenceTag, index) => {
        if (index === 0) sequenceTags += sequenceTag.name;
        else sequenceTags += " , " + sequenceTag.name;
      });
      return createData(
        role.id,
        role.name,
        sequenceTags,
        role.mobileNo,
        role.email,
        role.outletId
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    if (hotelReducer.customerList) {
      convertData(hotelReducer.customerList);
    }
  }, [hotelReducer.customerList]);

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

  const searchItems = (value) => {
    if (!isEmpty(value)) {
      const filteredData = convertData(hotelReducer.customerList).filter(
        (item) => {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      );
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.customerList);
    }
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

  const redirectToUserProfile = (user) => {
    const findOutlet = hotelReducer.outlets.find(
      (outlet) => outlet.outlet.id === user.outletId
    );
    dispatch({
      type: SET_OUTLET,
      data: findOutlet,
    });

    redirect(`/Admin/CustomerManagement/${user.id}`);
  };

  return (
    <React.Fragment>
      <div className="user-groups" style={{ height: "calc(100vh - 275px)" }}>
        <Box className="user-groups-search">
          <TextField
            className="search-box"
            sx={{ width: "250px" }}
            placeholder="Search"
            size="small"
            onChange={(e) => searchItems(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <div className="primary-btn" style={{ justifyContent: "flex-end" }}>
            <Button variant="outlined">
              <CSVLink data={rows} filename="Customer List">
                <CloudDownloadOutlinedIcon /> EXPORT
              </CSVLink>
            </Button>
          </div>
        </Box>
        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: "calc(100vh - 330px)" }}>
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
                        <TableCell> {row.name}</TableCell>
                        <TableCell> {row.tags}</TableCell>
                        <TableCell> {row.mobileNo}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell className="commands-icons">
                          <VisibilityIcon
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => redirectToUserProfile(row)}
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
export default connect(null, mapDispatchToProps)(CustomerList);
