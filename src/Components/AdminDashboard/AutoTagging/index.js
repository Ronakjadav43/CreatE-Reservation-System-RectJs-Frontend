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
import { isEmpty } from "lodash";
import { CSVLink } from "react-csv";

import ENVIRONMENT_VARIABLES from "../../../environment.config";
import * as UserAction from "../../../Action/AdminDashboard";
import DeletePopUp from "../../../CommonComponent/DeletePopUp";
import {
  ActionType,
  handlePermission,
  Modules,
} from "../../../utils/userAccess";
import AddTagging from "./Add";
import AutoTaggingMenu from "./AutoTggingMenu";

const columns = [
  { field: "tags", headerName: "Tags", width: 233 },
  { field: "Commands", headerName: "Commands", width: 233 },
];

const createData = (id, name, description, tags, criteria, tagId) => {
  return {
    id,
    name,
    description,
    tags,
    criteria,
    tagId,
  };
};

const AutoTagging = (props) => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tags, setTags] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [tabMenu, setTabMenu] = useState(false);
  const [outletOccasion, setOutletOccasion] = useState([]);
  const [diningOptions, setDiningOptions] = useState([]);
  const [dietaryRestriction, setDietaryRestriction] = useState([]);
  const [preorders, setPreorders] = useState([]);
  const [selectedAutoTagging, setSelectedAutoTagging] = useState([]);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    outlets: state.hotelReducer.outlets,
    autoTagging: state.hotelReducer.autoTagging,
    tags: state.hotelReducer.tags,
    permission: state.hotelReducer.permission,
    mealTypes: state.hotelReducer.mealTypes,
    outletOccasion: state.hotelReducer.outletOccasion,
    preorders: state.hotelReducer.preorders,
    diningOptions: state.hotelReducer.diningOptions,
    outletDietaryRestriction: state.hotelReducer.outletDietaryRestriction,
  }));

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      props.actions.userAction.getAllAutoTagging(
        hotelReducer.selectedOutlet.outlet.id
      );
      props.actions.userAction.getTagsByOutletCategory(
        ENVIRONMENT_VARIABLES.Base_PROFILE_TAGS,
        hotelReducer.selectedOutlet.outlet.id
      );
      if (hotelReducer.mealTypes.length === 0) {
        props.actions.userAction.getMealTypes(
          hotelReducer.selectedOutlet.outlet.id
        );
      }
      props.actions.userAction.getOccasionByOutletCategory(
        ENVIRONMENT_VARIABLES.Base_OCCASION,
        hotelReducer.selectedOutlet.outlet.id
      );
      props.actions.userAction.getDeitaryRestrictionByOutlet(
        ENVIRONMENT_VARIABLES.Base_DIETARY_RESTRICTION,
        hotelReducer.selectedOutlet.outlet.id
      );
      props.actions.userAction.getDiningOption(
        hotelReducer.selectedOutlet.outlet.id
      );

      props.actions.userAction.getPreOrders(
        hotelReducer.selectedOutlet.outlet.id
      );
    }
  }, [hotelReducer.selectedOutlet]);

  const convertData = (autoTagging) => {
    const data = autoTagging.map((ticket) => {
      return createData(
        ticket.id,
        ticket.name,
        ticket.description,
        ticket.Tag.name,
        ticket.criteria,
        ticket.tagId
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    convertData(hotelReducer.autoTagging);
    setPage(0);
    setRowsPerPage(10);
  }, [hotelReducer.autoTagging]);

  useEffect(() => {
    if (hotelReducer.tags.length > 0) {
      const activeCategories = hotelReducer.tags.filter(
        (data) => data.isActive === true
      );
      setTags(activeCategories);
    }
  }, [hotelReducer.tags]);

  useEffect(() => {
    if (hotelReducer.outletOccasion) {
      const outletOccasion = hotelReducer.outletOccasion.filter(
        (data) => data.isActive === true
      );
      if (outletOccasion.length > 0) {
        setOutletOccasion(outletOccasion);
      }
    }
  }, [hotelReducer.outletOccasion]);

  useEffect(() => {
    if (hotelReducer.diningOptions) {
      const diningOptions = hotelReducer.diningOptions.filter(
        (data) => data.isActive === true
      );
      if (diningOptions.length > 0) {
        setDiningOptions(diningOptions);
      }
    }
  }, [hotelReducer.diningOptions]);

  useEffect(() => {
    if (hotelReducer.outletDietaryRestriction) {
      const outletDietaryRestriction =
        hotelReducer.outletDietaryRestriction.filter(
          (data) => data.isActive === true
        );
      if (outletDietaryRestriction.length > 0) {
        setDietaryRestriction(outletDietaryRestriction);
      }
    }
  }, [hotelReducer.outletDietaryRestriction]);

  useEffect(() => {
    if (hotelReducer.preorders) {
      const preorders = hotelReducer.preorders.filter(
        (data) => data.isActive === true
      );
      if (preorders.length > 0) {
        setPreorders(preorders);
      }
    }
  }, [hotelReducer.preorders]);

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

  const handleSelectedAutoTagging = (data) => {
    setTabMenu(true);
    setSelectedAutoTagging(data);
  };

  const handleCloseSelectedAutoTagging = () => {
    setTabMenu(false);
  };

  const searchItems = (value) => {
    if (!isEmpty(value)) {
      const filteredData = convertData(hotelReducer.autoTagging).filter(
        (item) => {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      );
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.autoTagging);
    }
  };

  const handleOpenTicket = () => {
    setOpen(true);
  };

  const handleCloseAutoTagging = () => {
    setOpen(false);
  };

  const handleSaveAutoTagging = (data) => {
    props.actions.userAction.addAutoTagging(
      data,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleDeleteAutoTagging = (data) => {
    const { id } = data;
    props.actions.userAction.deleteAutoTagging(
      id,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleCloseDeleteAutoTagging = () => {
    setDeleteOpen(false);
  };

  const handleOpenDeleteAutoTagging = (data) => {
    setSelectedAutoTagging(data);
    setDeleteOpen(true);
  };

  return (
    <React.Fragment>
      {open && (
        <AddTagging
          open={open}
          handleCloseAutoTagging={handleCloseAutoTagging}
          tags={[...tags]}
          outletOccasion={[...outletOccasion]}
          preorders={[...preorders]}
          diningOptions={[...diningOptions]}
          dietaryRestriction={[...dietaryRestriction]}
          mealTypes={[...hotelReducer.mealTypes]}
          handleSaveAutoTagging={handleSaveAutoTagging}
        />
      )}

      {deleteOpen && (
        <DeletePopUp
          open={deleteOpen}
          data={selectedAutoTagging}
          handleClose={handleCloseDeleteAutoTagging}
          handleDelete={handleDeleteAutoTagging}
          message="Confirm To Delete Auto Tagging"
        />
      )}

      {!tabMenu && !open && (
        <div className="user-groups">
          <h1 className="groups-header">Tags Management</h1>
          <h1 className="groups-header-2nd"> Auto Tagging</h1>

          {!open && (
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
                  <CSVLink data={rows} filename="Auto Tagging">
                    <CloudDownloadOutlinedIcon /> EXPORT
                  </CSVLink>
                </Button>
                <Button
                  disabled={handlePermission(
                    hotelReducer.permission.permission,
                    Modules.AUTOTAGGING,
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

          {!open && (
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
                            <TableCell>{row.tags ? row.tags : "N/A"}</TableCell>

                            <TableCell className="commands-icons">
                              <VisibilityIcon
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleSelectedAutoTagging({ ...row })
                                }
                              />

                              <DeleteOutlinedIcon
                                style={{
                                  cursor: handlePermission(
                                    hotelReducer.permission.permission,
                                    Modules.AUTOTAGGING,
                                    ActionType.delete
                                  )
                                    ? "pointer"
                                    : "not-allowed",
                                }}
                                onClick={() =>
                                  handlePermission(
                                    hotelReducer.permission.permission,
                                    Modules.AUTOTAGGING,
                                    ActionType.delete
                                  ) && handleOpenDeleteAutoTagging({ ...row })
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
      {tabMenu && (
        <AutoTaggingMenu
          selectedAutoTagging={{ ...selectedAutoTagging }}
          handleCloseSelectedAutoTagging={handleCloseSelectedAutoTagging}
          tags={[...tags]}
        />
      )}
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(AutoTagging);
