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
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import SearchIcon from "@mui/icons-material/Search";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { visuallyHidden } from "@mui/utils";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { useDispatch } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";

import {
  SET_INVISIBLE_SELECTION,
  SET_VISIBLE_SELECTION,
} from "../../../../utils/AdminDashboard/Constant";
import * as UserAction from "../../../../Action/AdminDashboard";
import DeletePopUp from "../../../../CommonComponent/DeletePopUp";
import AddMarketingCriteria from "./AddMarketingCriteria";
import ENVIRONMENT_VARIABLES from "../../../../environment.config";
import CustomerCriteriaMenu from "./CustomerCriteriaMenu";
import {
  ActionType,
  Modules,
  handlePermission,
  handleUpdatedBy,
} from "../../../../utils/userAccess";
import "./style.scss";

const moment = require("moment-timezone");

const columns = [
  { field: "name", headerName: "Group Name", width: 233 },
  { field: "description", headerName: "Description", width: 233 },
  { field: "mailchimpListId", headerName: "Mailchimp List Id", width: 233 },
  { field: "isActive", headerName: "Status", width: 233 },
  { field: "UpdatedBy", headerName: "Updated By", width: 233 },
  { field: "UpdatedDate", headerName: "Updated Date", width: 233 },
  { field: "Commands", headerName: "Commands", width: 233 },
];

const createData = (
  id,
  name,
  description,
  mailchimpListId,
  criteria,
  tags,
  isActive,
  UpdatedBy,
  UpdatedDate,
  CreatedBy,
  CreatedDate,
  outletId
) => {
  return {
    id,
    name,
    description,
    mailchimpListId,
    criteria,
    tags,
    isActive,
    UpdatedBy,
    UpdatedDate,
    CreatedBy,
    CreatedDate,
    outletId,
  };
};

const CustomerCriteriaList = (props) => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCustomerCriteria, setSelectedCustomerCriteria] =
    useState(null);
  const [tags, setTags] = useState([]);
  const [companyOccasion, setCompanyOccasion] = useState([]);
  const [dinningOptions, setDinningOptions] = useState([]);
  const [dietaryRestriction, setDietaryRestriction] = useState([]);
  const [preOrderItems, setPreOrderItems] = useState([]);
  const [mealTypeCompany, setMealTypeCompany] = useState([]);

  const [tabMenu, setTabMenu] = useState(false);
  const dispatch = useDispatch();

  const hotelReducer = useSelector((state) => ({
    marketing: state.hotelReducer.marketing,
    multipleCompanies: state.hotelReducer.multipleCompanies,
    tags: state.hotelReducer.tags,
    mealTypeCompany: state.hotelReducer.mealTypeCompany,
    permission: state.hotelReducer.permission,
    companyOccasion: state.hotelReducer.companyOccasion,
    preOrderItems: state.hotelReducer.preOrderItems,
    dinningOptions: state.hotelReducer.dinningOptions,
    dietaryRestiction: state.hotelReducer.dietaryRestiction,
  }));

  const redirect = (url) => {
    navigate(url);
  };

  useEffect(() => {
    if (
      hotelReducer.multipleCompanies &&
      hotelReducer.multipleCompanies.length > 0 &&
      ENVIRONMENT_VARIABLES.Base_MARKETING_TAGS &&
      ENVIRONMENT_VARIABLES.Base_OCCASION
    ) {
      const selectedCompanyId =
        hotelReducer.multipleCompanies.length > 1
          ? hotelReducer.multipleCompanies[1].id
          : hotelReducer.multipleCompanies[0].id;

      props.actions.userAction.getMarketing(selectedCompanyId);
      props.actions.userAction.getTagsByMarketingCategory(
        ENVIRONMENT_VARIABLES.Base_MARKETING_TAGS
      );
      props.actions.userAction.getAllOccasion(
        ENVIRONMENT_VARIABLES.Base_OCCASION
      );
      props.actions.userAction.getAllDeitaryRestriction(
        ENVIRONMENT_VARIABLES.Base_DIETARY_RESTRICTION
      );
      props.actions.userAction.getMealTypeByCompany(selectedCompanyId, false);
      props.actions.userAction.getpreOrderByCompany(
        hotelReducer.multipleCompanies
      );
      props.actions.userAction.getdinningOptionsByCompany(
        hotelReducer.multipleCompanies
      );
      setPage(0);
      setRowsPerPage(10);
    }
  }, [hotelReducer.multipleCompanies]);

  useEffect(() => {
    if (hotelReducer.mealTypeCompany) {
      const mealTypeCompany = hotelReducer.mealTypeCompany.filter(
        (data) => data.isActive === true
      );
      if (mealTypeCompany.length > 0) {
        setMealTypeCompany(mealTypeCompany);
      }
    }
  }, [hotelReducer.mealTypeCompany]);

  useEffect(() => {
    if (hotelReducer.companyOccasion) {
      const companyOccasion = hotelReducer.companyOccasion.filter(
        (data) => data.isActive === true
      );
      if (companyOccasion.length > 0) {
        setCompanyOccasion(companyOccasion);
      }
    }
  }, [hotelReducer.companyOccasion]);

  useEffect(() => {
    if (hotelReducer.dinningOptions) {
      const dinningOptions = hotelReducer.dinningOptions.filter(
        (data) => data.isActive === true
      );
      if (dinningOptions.length > 0) {
        setDinningOptions(dinningOptions);
      }
    }
  }, [hotelReducer.dinningOptions]);

  useEffect(() => {
    if (hotelReducer.dietaryRestiction) {
      const outletDietaryRestriction = hotelReducer.dietaryRestiction.filter(
        (data) => data.isActive === true
      );
      if (outletDietaryRestriction.length > 0) {
        setDietaryRestriction(outletDietaryRestriction);
      }
    }
  }, [hotelReducer.dietaryRestiction]);

  useEffect(() => {
    if (hotelReducer.preOrderItems) {
      const preOrderItems = hotelReducer.preOrderItems.filter(
        (data) => data.isActive === true
      );
      if (preOrderItems.length > 0) {
        setPreOrderItems(preOrderItems);
      }
    }
  }, [hotelReducer.preOrderItems]);

  const convertData = (marketing) => {
    const data = marketing.map((role) => {
      return createData(
        role.id,
        role.name,
        role.description,
        role.mailchimpListId,
        role.criteria,
        role.tags,
        role.isActive,
        role.updatedBy,
        role.updatedAt,
        role.createdBy,
        role.createdAt,
        role.outletId
      );
    });
    setRows(data);
    return data;
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
      hotelReducer.permission.CompanyPermission,
      Modules.MARKETING,
      ActionType.read
    );
    if (!hasPermission) {
      redirect("/Admin");
    }
  }, [hotelReducer.permission]);

  useEffect(() => {
    convertData(hotelReducer.marketing);
  }, [hotelReducer.marketing]);

  useEffect(() => {
    if (hotelReducer.tags) {
      const mappedTag = hotelReducer.tags
        .filter((tagType) => tagType.isActive === true)
        .map((data) => {
          return { ...data, isChecked: false };
        });
      setTags(mappedTag);
    }
  }, [hotelReducer.tags]);

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
      const filteredData = convertData(hotelReducer.marketing).filter(
        (item) => {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      );
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.marketing);
    }
  };

  const handleOpenMarketing = () => {
    setOpen(true);
  };

  const handleCloseMarketing = () => {
    setOpen(false);
  };

  const handleOpenDeleteRole = (data) => {
    setSelectedCustomerCriteria(data);
    setDeleteOpen(true);
  };

  const handleCloseDeleteMarketing = () => {
    setDeleteOpen(false);
  };

  const handleSaveMarketing = (data) => {
    props.actions.userAction.addMarketing(
      data,
      hotelReducer.multipleCompanies.length > 1
        ? hotelReducer.multipleCompanies[1].id
        : hotelReducer.multipleCompanies[0].id
    );
  };

  const handleDeleteMarketing = (data, marketingId) => {
    const { id } = data;
    props.actions.userAction.deleteMarketing(id, marketingId);
  };

  const handleSelectedCustomerCriteria = (data) => {
    dispatch({
      type: SET_INVISIBLE_SELECTION,
    });

    setTabMenu(true);
    setSelectedCustomerCriteria(data);
  };

  const handleCloseSelectedCustomerCriteria = () => {
    setTabMenu(false);
    dispatch({
      type: SET_INVISIBLE_SELECTION,
    });
  };

  const handleEditMarketing = (data) => {
    props.actions.userAction.updateMarketing(
      data,
      selectedCustomerCriteria.id,
      hotelReducer.multipleCompanies.length > 1
        ? hotelReducer.multipleCompanies[1].id
        : hotelReducer.multipleCompanies[0].id
    );
    handleCloseSelectedCustomerCriteria();
  };

  return (
    <React.Fragment>
      {/** Add Role */}
      {open && (
        <AddMarketingCriteria
          open={open}
          handleCloseMarketing={handleCloseMarketing}
          handleSaveMarketing={handleSaveMarketing}
          tags={[...tags]}
          companyOccasion={[...companyOccasion]}
          preOrderItems={[...preOrderItems]}
          dinningOptions={[...dinningOptions]}
          dietaryRestriction={[...dietaryRestriction]}
          mealTypeCompany={[...mealTypeCompany]}
        />
      )}

      {/** Delete Role */}
      {deleteOpen && (
        <DeletePopUp
          open={deleteOpen}
          data={selectedCustomerCriteria}
          handleClose={handleCloseDeleteMarketing}
          handleDelete={handleDeleteMarketing}
          message="Confirm To Delete Customer List"
        />
      )}

      {!tabMenu && (
        <div className="user-groups">
          <h1 className="groups-header"> Marketing</h1>
          <h1 className="groups-header-2nd">Customer Criteria</h1>

          <Box className="user-groups-search">
            <div className="user-groups-box">
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
            </div>
            <div className="primary-btn">
              <Button variant="outlined">
                <CSVLink data={rows} filename="Customer Criteria">
                  <CloudDownloadOutlinedIcon /> EXPORT
                </CSVLink>
              </Button>
              <Button
                variant="contained"
                onClick={handleOpenMarketing}
                disabled={handlePermission(
                  hotelReducer.permission.CompanyPermission,
                  Modules.MARKETING,
                  ActionType.create,
                  true
                )}
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
                          <TableCell> {row.name}</TableCell>
                          <TableCell> {row.description}</TableCell>
                          <TableCell> {row.mailchimpListId}</TableCell>
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
                            {handleUpdatedBy(row.UpdatedBy)}
                          </TableCell>
                          <TableCell>
                            {row.UpdatedDate
                              ? moment(row.UpdatedDate).format(
                                  "DD-MM-YYYY hh:mm A"
                                )
                              : "N/A"}
                          </TableCell>
                          <TableCell className="commands-icons">
                            <VisibilityIcon
                              style={{
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleSelectedCustomerCriteria({ ...row })
                              }
                            />
                            <DeleteOutlinedIcon
                              style={{
                                cursor: handlePermission(
                                  hotelReducer.permission.CompanyPermission,
                                  Modules.MARKETING,
                                  ActionType.delete
                                )
                                  ? "pointer"
                                  : "not-allowed",
                              }}
                              onClick={() =>
                                handlePermission(
                                  hotelReducer.permission.CompanyPermission,
                                  Modules.MARKETING,
                                  ActionType.delete
                                ) && handleOpenDeleteRole({ ...row })
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
      )}
      {tabMenu && (
        <CustomerCriteriaMenu
          selectedCustomerCriteria={{ ...selectedCustomerCriteria }}
          handleCloseSelectedCustomerCriteria={
            handleCloseSelectedCustomerCriteria
          }
          tags={[...hotelReducer.tags]}
          handleEditMarketing={handleEditMarketing}
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

export default connect(null, mapDispatchToProps)(CustomerCriteriaList);
