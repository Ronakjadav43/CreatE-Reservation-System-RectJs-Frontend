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
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { visuallyHidden } from "@mui/utils";
import { bindActionCreators } from "redux";
import { connect, useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";

import AddCompany from "./Add";
import EditCompany from "./Edit";
import * as UserAction from "../../../Action/AdminDashboard";
import DeletePopUp from "../../../CommonComponent/DeletePopUp";
import {
  SET_INVISIBLE_SELECTION,
  SET_VISIBLE_SELECTION,
} from "../../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../../environment.config";
import {
  ActionType,
  Modules,
  handlePermission,
  handleUpdatedBy,
} from "../../../utils/userAccess";

const moment = require("moment-timezone");

const columns = [
  { field: "image", headerName: "Image", width: 233 },
  { field: "name", headerName: "Name", width: 233 },
  { field: "description", headerName: "Description", width: 233 },
  { field: "contentLanguage", headerName: "Content Language", width: 233 },
  { field: "isActive", headerName: "Status", width: 233 },
  { field: "updatedBy", headerName: "Updated By", width: 233 },
  { field: "updatedDate", headerName: "Updated Date", width: 233 },
  { field: "Commands", headerName: "Commands", width: 233 },
];

const createData = (
  id,
  name,
  description,
  contentLanguage,
  paymentTC,
  noPaymentTC,
  updatedBy,
  updatedDate,
  createdBy,
  createdDate,
  isActive,
  phone,
  image
) => {
  return {
    id,
    name,
    description,
    contentLanguage,
    paymentTC,
    noPaymentTC,
    updatedBy,
    updatedDate,
    createdBy,
    createdDate,
    isActive,
    phone,
    image,
  };
};

const Company = (props) => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCompany, setSelectedCompany] = useState([]);
  const content = [
    { id: "ENGLISH", value: "English" },
    { id: "MALAY", value: "Malay" },
    { id: "FRENCH", value: "French" },
    { id: "RUSSIAN", value: "Russian" },
    { id: "CHINESE", value: "chinese" },
    { id: "SPANISH", value: "Spanish" },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hotelReducer = useSelector((state) => ({
    allCompanies: state.hotelReducer.allCompanies,
    permission: state.hotelReducer.permission,
  }));

  const redirect = (url) => {
    navigate(url);
  };

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
    const hasPermission = handlePermission(
      hotelReducer.permission.permission,
      Modules.SUPERUSER,
      ActionType.read
    );
    if (!hasPermission) {
      redirect("/Admin");
    } else {
      props.actions.userAction.getCompany();
      setPage(0);
      setRowsPerPage(10);
    }
  }, [hotelReducer.permission]);

  const convertData = (companies) => {
    const data = companies.map((company) => {
      return createData(
        company.id,
        company.name,
        company.description,
        company.contentLanguage,
        company.paymentTC,
        company.noPaymentTC,
        company.updatedBy,
        company.updatedAt,
        company.createdBy,
        company.createdAt,
        company.isActive,
        company.phone,
        company.image
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    if (hotelReducer.allCompanies) {
      convertData(hotelReducer.allCompanies);
    }
  }, [hotelReducer.allCompanies]);

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
      const filteredData = convertData(hotelReducer.allCompanies).filter(
        (item) => {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      );
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.allCompanies);
    }
  };

  const handleOpenCompany = () => {
    setOpen(true);
  };

  const handleCloseCompany = () => {
    setOpen(false);
  };

  const handleSaveCompany = (data) => {
    props.actions.userAction.addCompany(data);
  };

  const handleOpenEditCompany = (data) => {
    setEditOpen(true);
    setSelectedCompany(data);
  };

  const handleCloseEditCompany = () => {
    setEditOpen(false);
  };

  const handleSaveEditCompany = (data, adminId) => {
    props.actions.userAction.editCompany(data, adminId);
  };

  const handleOpenDeleteCompany = (data) => {
    setSelectedCompany(data);
    setDeleteOpen(true);
  };

  const handleCloseDeleteCompany = () => {
    setDeleteOpen(false);
  };

  const handleDeleteCompany = (data) => {
    const { id } = data;
    props.actions.userAction.deleteCompany(id);
  };

  return (
    <React.Fragment>
      {/* Add Company  */}
      {open && (
        <AddCompany
          open={open}
          content={[...content]}
          handleCloseCompany={handleCloseCompany}
          handleSaveCompany={handleSaveCompany}
        />
      )}

      {/** Edit Company */}
      {editOpen && (
        <EditCompany
          open={editOpen}
          content={[...content]}
          selectedCompany={selectedCompany}
          handleCloseEditCompany={handleCloseEditCompany}
          handleSaveEditCompany={handleSaveEditCompany}
        />
      )}

      {/** Delete Company */}
      {deleteOpen && (
        <DeletePopUp
          open={deleteOpen}
          data={selectedCompany}
          handleClose={handleCloseDeleteCompany}
          handleDelete={handleDeleteCompany}
          message="Confirm To Delete Brand"
        />
      )}

      <div className="user-groups">
        <h1 className="groups-header">Accounts Management</h1>
        <h1 className="groups-header-2nd">Brand Management</h1>

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
            <Button variant="contained" onClick={handleOpenCompany}>
              <AddOutlinedIcon /> ADD
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
                        <TableCell>
                          <img
                            className="product-image"
                            src={`${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${row.image}`}
                            alt="pre Order"
                          ></img>
                        </TableCell>
                        <TableCell>{row.name ? row.name : "N/A"}</TableCell>
                        <TableCell> {row.description}</TableCell>
                        <TableCell>
                          {row.contentLanguage ? row.contentLanguage : "N/A"}
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
                          {row.updatedDate
                            ? moment(row.updatedDate).format(
                                "DD-MM-YYYY hh:mm A"
                              )
                            : "N/A"}
                        </TableCell>
                        <TableCell className="commands-icons">
                          <BorderColorOutlinedIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => handleOpenEditCompany({ ...row })}
                          />
                          <DeleteOutlinedIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => handleOpenDeleteCompany({ ...row })}
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

export default connect(null, mapDispatchToProps)(Company);
