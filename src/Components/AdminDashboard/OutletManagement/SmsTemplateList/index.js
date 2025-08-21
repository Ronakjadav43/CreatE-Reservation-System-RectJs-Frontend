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
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import SearchIcon from "@mui/icons-material/Search";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { isEmpty } from "lodash";
import { visuallyHidden } from "@mui/utils";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { CSVLink } from "react-csv";

import * as UserAction from "../../../../Action/AdminDashboard";
import DeletePopUp from "../../../../CommonComponent/DeletePopUp/index";
import AddTemplate from "./Add/index";
import EditTemplate from "./Edit/index";
import {
  ActionType,
  handlePermission,
  handleUpdatedBy,
  Modules,
} from "../../../../utils/userAccess";
import { contentLanguage } from "../../../../utils/contentLangugage";
import { templateType } from "../../../../utils/templateType";

let moment = require("moment-timezone");

const columns = [
  { field: "name", headerName: "Template Name", width: 233 },
  { field: "contentLanguage", headerName: "Content Language", width: 233 },

  { field: "isActive", headerName: "Status", width: 233 },
  { field: "updatedBy", headerName: "Updated By", width: 233 },
  { field: "updatedAt", headerName: "Updated Date", width: 233 },
  { field: "Commands", headerName: "Commands", width: 233 },
];

const createData = (
  id,
  name,
  templateType,
  contentLanguage,
  body,
  isActive,
  updatedBy,
  updatedAt,
  createdBy,
  createdAt
) => {
  return {
    id,
    name,
    templateType,
    contentLanguage,
    body,
    isActive,
    updatedBy,
    updatedAt,
    createdBy,
    createdAt,
  };
};

const SmsTemplateList = (props) => {
  const [rows, setRows] = useState([]);
  const [selectedSmsTemplate, setSelectedSmsTemplate] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    smsTemplates: state.hotelReducer.smsTemplates,
    permission: state.hotelReducer.permission,
  }));

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      props.actions.userAction.getSmsTemplates(
        hotelReducer.selectedOutlet.outlet.id
      );
    }
  }, [hotelReducer.selectedOutlet]);

  const convertData = (smsTemplates) => {
    const data = smsTemplates.map((smsTemplate) => {
      return createData(
        smsTemplate.id,
        smsTemplate.name,
        smsTemplate.templateType,
        smsTemplate.contentLanguage,
        smsTemplate.body,
        smsTemplate.isActive,
        smsTemplate.updatedBy,
        smsTemplate.createdAt,
        smsTemplate.createdBy,
        smsTemplate.updatedAt
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    convertData(hotelReducer.smsTemplates);
    setPage(0);
    setRowsPerPage(10);
  }, [hotelReducer.smsTemplates]);

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
      const filteredData = convertData(hotelReducer.smsTemplates).filter(
        (item) => {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      );
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.smsTemplates);
    }
  };

  const handleOpenSmsTemplate = () => {
    setOpen(true);
  };

  const handleCloseSmsTemplate = () => {
    setOpen(false);
  };

  const handleSaveSmsTemplate = (data) => {
    props.actions.userAction.addSmsTemplates(
      data,
      hotelReducer.selectedOutlet.outlet.id
    );
  };

  const handleOpenEditSmsTemplate = (data) => {
    setSelectedSmsTemplate(data);
    setEditOpen(true);
  };

  const handleCloseEditSmsTemplate = () => {
    setEditOpen(false);
  };

  const handleEditSaveSmsTemplate = (data, smsTemplateId) => {
    props.actions.userAction.updateSmsTemplate(
      data,
      smsTemplateId,
      hotelReducer.selectedOutlet.outlet.id
    );
  };

  const handleOpenDeleteSmsTemplate = (data) => {
    setSelectedSmsTemplate(data);
    setDeleteOpen(true);
  };

  const handleCloseDeleteSmsTemplate = () => {
    setDeleteOpen(false);
  };

  const handleDeleteSmsTemplate = (data) => {
    const { id } = data;
    props.actions.userAction.deleteSmsTemplate(id);
  };

  return (
    <React.Fragment>
      {open && (
        <AddTemplate
          open={open}
          handleCloseSmsTemplate={handleCloseSmsTemplate}
          handleSaveSmsTemplate={handleSaveSmsTemplate}
          content={[...contentLanguage]}
        />
      )}

      {editOpen && (
        <EditTemplate
          open={editOpen}
          selectedSmsTemplate={selectedSmsTemplate}
          handleCloseEditSmsTemplate={handleCloseEditSmsTemplate}
          handleEditSaveSmsTemplate={handleEditSaveSmsTemplate}
          content={[...contentLanguage]}
          templateType={[...templateType]}
        />
      )}

      {deleteOpen && (
        <DeletePopUp
          open={deleteOpen}
          data={selectedSmsTemplate}
          handleClose={handleCloseDeleteSmsTemplate}
          handleDelete={handleDeleteSmsTemplate}
          message="Confirm To Delete Sms"
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
              <CSVLink data={rows} filename="Sms Template">
                <CloudDownloadOutlinedIcon /> EXPORT
              </CSVLink>
            </Button>
            <Button
              disabled={handlePermission(
                hotelReducer.permission.permission,
                Modules.SMSTEMPLATE,
                ActionType.create,
                true
              )}
              variant="contained"
              onClick={handleOpenSmsTemplate}
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
                  {columns.map((headCell) => (
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
                        <TableCell>{row.name ? row.name : "N/A"}</TableCell>
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
                          {moment(row.updatedAt).format("DD-MM-YYYY hh:mm A")}
                        </TableCell>
                        <TableCell className="commands-icons">
                          <BorderColorOutlinedIcon
                            style={{
                              cursor: handlePermission(
                                hotelReducer.permission.permission,
                                Modules.SMSTEMPLATE,
                                ActionType.update
                              )
                                ? "pointer"
                                : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.SMSTEMPLATE,
                                ActionType.update
                              ) && handleOpenEditSmsTemplate({ ...row })
                            }
                          />
                          <DeleteOutlinedIcon
                            style={{
                              cursor: handlePermission(
                                hotelReducer.permission.permission,
                                Modules.SMSTEMPLATE,
                                ActionType.delete
                              )
                                ? "pointer"
                                : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.SMSTEMPLATE,
                                ActionType.delete
                              ) && handleOpenDeleteSmsTemplate({ ...row })
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

export default connect(null, mapDispatchToProps)(SmsTemplateList);
