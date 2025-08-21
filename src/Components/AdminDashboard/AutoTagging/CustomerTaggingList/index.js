/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import { visuallyHidden } from "@mui/utils";
import { bindActionCreators } from "redux";
import { connect, useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import { isEmpty } from "lodash";

import * as UserAction from "../../../../Action/AdminDashboard";
import { RESET_CUSTOMER_LIST_TAGGING } from "../../../../utils/AdminDashboard/Constant";

const columns = [
  { field: "name", headerName: "Customer Name", width: 233 },
  { field: "mobileNo", headerName: "Mobile Number", width: 233 },
  { field: "email", headerName: "Email Address", width: 233 },
  { field: "Commands", headerName: "Commands", width: 233 },
];

const createData = (id, name, mobileNo, email, Commands) => {
  return {
    id,
    name,
    mobileNo,
    email,
    Commands,
  };
};

const CustomerTaggingList = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const redirect = (url) => {
    navigate(url, 2);
  };
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const hotelReducer = useSelector((state) => ({
    customerListTagging: state.hotelReducer.customerListTagging,
  }));

  useEffect(() => {
    if (props.selectedAutoTagging) {
      props.actions.userAction.getCustomerListTagging(
        props.selectedAutoTagging.id
      );
      return () => {
        dispatch({ type: RESET_CUSTOMER_LIST_TAGGING });
      };
    }
  }, []);

  const convertData = (customerListTagging) => {
    const data = customerListTagging.map((role) => {
      return createData(role.id, role.name, role.mobileNo, role.email);
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    if (hotelReducer.customerListTagging) {
      convertData(hotelReducer.customerListTagging);
    }
  }, [hotelReducer.customerListTagging]);

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
      const filteredData = convertData(hotelReducer.customerListTagging).filter(
        (item) => {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      );
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.customerListTagging);
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
              <CSVLink data={rows} filename="Customer Tagging List">
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
                        <TableCell> {row.mobileNo}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell className="commands-icons">
                          <VisibilityIcon
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              redirect(`/Admin/CustomerManagement/${row.id}`)
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
export default connect(null, mapDispatchToProps)(CustomerTaggingList);
