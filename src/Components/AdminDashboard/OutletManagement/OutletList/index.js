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
import { connect, useDispatch, useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import { isEmpty } from "lodash";

import * as UserAction from "../../../../Action/AdminDashboard";
import AddOutlet from "./Add";
import EditOutlet from "./Edit";
import DeletePopUp from "../../../../CommonComponent/DeletePopUp";
import {
  INPROGRESS,
  SET_OUTLET,
  SET_VISIBLE_SELECTION,
  SET_INVISIBLE_SELECTION,
  SET_INVISIBLE_MULTIPLE_COMPANY_SELECTION,
  SET_VISIBLE_MULTIPLE_COMPANY_SELECTION,
} from "../../../../utils/AdminDashboard/Constant";
import {
  ActionType,
  handlePermission,
  handleUpdatedBy,
  Modules,
} from "../../../../utils/userAccess";
import { useNavigate } from "react-router-dom";

let moment = require("moment-timezone");

const columns = [
  { field: "name", headerName: "Outlet Name", width: 233 },
  { field: "company", headerName: "Company Name", width: 233 },
  { field: "description", headerName: "Description", width: 233 },
  { field: "email", headerName: "Email", width: 233 },
  { field: "address1", headerName: "Address", width: 233 },
  { field: "timezone", headerName: "Timezone", width: 233 },
  { field: "isActive", headerName: "Status", width: 233 },
  { field: "updatedBy", headerName: "Updated By", width: 233 },
  { field: "updatedAt", headerName: "Updated Date", width: 233 },
  { field: "Commands", headerName: "Commands", width: 233 },
];

const createData = (
  id,
  name,
  description,
  email,
  address1,
  postcode,
  latitude,
  longitude,
  phone,
  googlePlaceId,
  gst,
  rebookingTableInterval,
  paxSpacing,
  ivrsPhoneNo,
  isActive,
  updatedBy,
  updatedAt,
  timezone,
  createdBy,
  createdAt,
  blockTime,
  company
) => {
  return {
    id,
    name,
    description,
    email,
    address1,
    postcode,
    latitude,
    longitude,
    phone,
    googlePlaceId,
    gst,
    rebookingTableInterval,
    paxSpacing,
    ivrsPhoneNo,
    isActive,
    updatedBy,
    updatedAt,
    timezone,
    createdBy,
    createdAt,
    blockTime,
    company,
  };
};

const OutletList = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState([]);
  const redirect = (url) => {
    navigate(url);
  };

  useEffect(() => {
    dispatch({
      type: SET_VISIBLE_MULTIPLE_COMPANY_SELECTION,
    });
    dispatch({
      type: SET_INVISIBLE_SELECTION,
    });

    return () => {
      dispatch({
        type: SET_INVISIBLE_MULTIPLE_COMPANY_SELECTION,
      });
      dispatch({
        type: SET_VISIBLE_SELECTION,
      });
    };
  }, []);

  const hotelReducer = useSelector((state) => ({
    companies: state.hotelReducer.companies,
    permission: state.hotelReducer.permission,
    multipleCompanies: state.hotelReducer.multipleCompanies,
    outletForDropDown: state.hotelReducer.outletForDropDown,
  }));

  const convertData = (outlets) => {
    const data = outlets.map((outlet) => {
      return createData(
        outlet.outlet.id,
        outlet.outlet.name,
        outlet.outlet.description,
        outlet.outlet.email,
        outlet.outlet.address1,
        outlet.outlet.postcode,
        outlet.outlet.latitude,
        outlet.outlet.longitude,
        outlet.outlet.phone,
        outlet.outlet.googlePlaceId,
        outlet.outlet.gst,
        outlet.outlet.rebookingTableInterval,
        outlet.outlet.paxSpacing,
        outlet.outlet.ivrsPhoneNo,
        outlet.outlet.isActive,
        outlet.outlet.updatedBy,
        outlet.outlet.updatedAt,
        outlet.outlet.timezone,
        outlet.outlet.createdBy,
        outlet.outlet.createdAt,
        outlet.outlet.blockTime,
        outlet.outlet?.Company.name
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    const hasPermission = handlePermission(
      hotelReducer.permission.permission,
      Modules.OUTLETMANAGEMENT,
      ActionType.read
    );
    if (!hasPermission) {
      redirect("/Admin");
    }
  }, [hotelReducer.permission]);

  useEffect(() => {
    setRows([]);
    if (
      hotelReducer.multipleCompanies &&
      hotelReducer.multipleCompanies.length > 0 &&
      hotelReducer.outletForDropDown &&
      hotelReducer.outletForDropDown.length > 0
    ) {
      const mappedCompany = hotelReducer.multipleCompanies.filter(
        (company) => company.isChecked === true && company.name !== "All"
      );

      const companyIds = mappedCompany.map((company) => company.id);
      const outletList = hotelReducer.outletForDropDown.filter((outlet) =>
        companyIds.includes(outlet.outlet.companyId)
      );

      if (outletList.length > 0) {
        convertData(outletList);
      }
    }
  }, [hotelReducer.multipleCompanies, hotelReducer.outletForDropDown]);

  useEffect(() => {
    if (hotelReducer.companies.length > 0) {
      setCompanies(hotelReducer.companies);
    }
  }, [hotelReducer.companies]);

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
      const filteredData = convertData(hotelReducer.outletForDropDown).filter(
        (item) => {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      );
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.outletForDropDown);
    }
  };

  const handleOpenOutlet = () => {
    setOpen(true);
  };

  const handleCloseOutlet = () => {
    setOpen(false);
  };

  const handleSaveOutlet = (data) => {
    props.actions.userAction.addOutlet(data);
  };

  const handleCloseEditOutlet = () => {
    setEditOpen(false);
  };

  const handleCloseDeleteOutlet = () => {
    setDeleteOpen(false);
  };

  const handleOpenDeleteOutlet = (data) => {
    setSelectedOutlet(data);
    setDeleteOpen(true);
  };

  const handleSaveEditOutlet = (data, outletId) => {
    props.actions.userAction.updateOutlet(data, outletId);
  };

  const handleDeleteOutlet = (data) => {
    const { id } = data;
    props.actions.userAction.deleteOutlet(id);
  };

  const tableSelectedOutlet = (data) => {
    setSelectedOutlet(data);
    dispatch({ type: INPROGRESS });
    const outletId = data.id;
    const findOutlet = hotelReducer.outletForDropDown.find(
      (outlet) => outlet.outlet.id === Number(outletId)
    );
    dispatch({
      type: SET_OUTLET,
      data: findOutlet,
    });
    redirect("/Admin/OutletManagement");
  };

  return (
    <React.Fragment>
      <div className="user-groups">
        <h1 className="groups-header">Accounts Management</h1>
        <h1 className="groups-header-2nd">Outlet Management</h1>
        {open && (
          <AddOutlet
            open={open}
            handleCloseOutlet={handleCloseOutlet}
            handleSaveOutlet={handleSaveOutlet}
            companies={companies}
          />
        )}

        {editOpen && (
          <EditOutlet
            open={editOpen}
            selectedOutlet={selectedOutlet}
            handleCloseEditOutlet={handleCloseEditOutlet}
            handleSaveEditOutlet={handleSaveEditOutlet}
          />
        )}

        {deleteOpen && (
          <DeletePopUp
            open={deleteOpen}
            data={selectedOutlet}
            handleClose={handleCloseDeleteOutlet}
            handleDelete={handleDeleteOutlet}
            message="Confirm To Delete Outlet"
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
            <Button variant="outlined">
              <CSVLink data={rows} filename="Outlet List">
                <CloudDownloadOutlinedIcon /> EXPORT
              </CSVLink>
            </Button>
            <Button
              disabled={handlePermission(
                hotelReducer.permission.permission,
                Modules.OUTLETMANAGEMENT,
                ActionType.create,
                true
              )}
              variant="contained"
              onClick={handleOpenOutlet}
            >
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
                        <TableCell> {row.name ? row.name : "N/A"}</TableCell>
                        <TableCell>
                          {row.company ? row.company : "N/A"}
                        </TableCell>
                        <TableCell>
                          {row.description ? row.description : "N/A"}
                        </TableCell>
                        <TableCell> {row.email ? row.email : "N/A"}</TableCell>
                        <TableCell>
                          {row.address1 ? row.address1 : "N/A"}
                        </TableCell>
                        <TableCell>
                          {row.timezone ? row.timezone : "N/A"}
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
                          {moment(row.updatedAt).format("DD-MM-YYYY hh:mm A")}
                        </TableCell>

                        <TableCell className="commands-icons">
                          <VisibilityIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => tableSelectedOutlet({ ...row })}
                          />

                          <DeleteOutlinedIcon
                            style={{
                              cursor: handlePermission(
                                hotelReducer.permission.permission,
                                Modules.OUTLETMANAGEMENT,
                                ActionType.delete
                              )
                                ? "pointer"
                                : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.OUTLETMANAGEMENT,
                                ActionType.delete
                              ) && handleOpenDeleteOutlet({ ...row })
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

export default connect(null, mapDispatchToProps)(OutletList);
