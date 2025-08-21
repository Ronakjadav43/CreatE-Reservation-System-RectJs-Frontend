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
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SearchIcon from "@mui/icons-material/Search";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { isEmpty } from "lodash";
import { visuallyHidden } from "@mui/utils";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { CSVLink } from "react-csv";

import * as UserAction from "../../../../Action/AdminDashboard";
import AddEmailTemplate from "./Add";
import EditEmailTemplate from "./Edit";
import {
  ActionType,
  Modules,
  handlePermission,
  handleUpdatedBy,
} from "../../../../utils/userAccess";
import DeletePopUp from "../../../../CommonComponent/DeletePopUp";
import { contentLanguage } from "../../../../utils/contentLangugage";
import { templateType } from "../../../../utils/templateType";

let moment = require("moment-timezone");

const columns = [
  { field: "name", headerName: "Email Template Name", width: 233 },
  { field: "templateType", headerName: "Email Template Type", width: 233 },
  { field: "contentLanguage", headerName: "Content Language", width: 233 },
  { field: "subject", headerName: "Subject", width: 233 },
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
  subject,
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
    subject,
    isActive,
    updatedBy,
    updatedAt,
    createdBy,
    createdAt,
  };
};

const EmailTemplate = (props) => {
  const [rows, setRows] = useState([]);
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    emailTemplates: state.hotelReducer.emailTemplates,
    permission: state.hotelReducer.permission,
  }));

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      setRows([]);
      props.actions.userAction.getEmailTemplates(
        hotelReducer.selectedOutlet.outlet.id
      );
    }
  }, [hotelReducer.selectedOutlet]);

  const convertData = (emailTemplates) => {
    const data = emailTemplates.map((emailTemplate) => {
      return createData(
        emailTemplate.id,
        emailTemplate.name,
        emailTemplate.templateType,
        emailTemplate.contentLanguage,
        emailTemplate.body,
        emailTemplate.subject,
        emailTemplate.isActive,
        emailTemplate.updatedBy,
        emailTemplate.createdAt,
        emailTemplate.createdBy,
        emailTemplate.updatedAt
      );
    });
    setRows(data);
    return data;
  };

  useEffect(() => {
    convertData(hotelReducer.emailTemplates);
  }, [hotelReducer.emailTemplates]);

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
      const filteredData = convertData(hotelReducer.emailTemplates).filter(
        (item) => {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      );
      setRows([...filteredData]);
    } else {
      convertData(hotelReducer.emailTemplates);
    }
  };

  const handleOpenEmailTemplate = () => {
    setOpen(true);
  };

  const handleCloseEmailTemplate = () => {
    setOpen(false);
  };

  const handleSaveEmailTemplate = (emailTemplateData, htmlValue) => {
    const data = { ...emailTemplateData, htmlValue };
    props.actions.userAction.addEmailTemplates(
      data,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleOpenEditEmailTemplate = (data) => {
    setSelectedEmailTemplate(data);
    setEditOpen(true);
  };

  const handleCloseEditEmailTemplate = () => {
    setEditOpen(false);
  };

  const handleEditSaveEmailTemplate = (
    emailTemplateData,
    htmlValue,
    emailtemplateId
  ) => {
    const data = { ...emailTemplateData, htmlValue };
    props.actions.userAction.updateEmailTemplate(
      data,
      emailtemplateId,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleOpenDeleteEmailTemplate = (data) => {
    setSelectedEmailTemplate(data);
    setDeleteOpen(true);
  };

  const handleCloseDeleteEmailTemplate = () => {
    setDeleteOpen(false);
  };

  const handleDeleteEmailTemplate = (data) => {
    const { id } = data;
    props.actions.userAction.deleteEmailTemplate(
      id,
      hotelReducer.selectedOutlet.outlet.id
    );
  };

  return (
    <React.Fragment>
      {open && (
        <AddEmailTemplate
          open={open}
          handleCloseEmailTemplate={handleCloseEmailTemplate}
          handleSaveEmailTemplate={handleSaveEmailTemplate}
          content={[...contentLanguage]}
          templateType={[...templateType]}
        />
      )}

      {editOpen && (
        <EditEmailTemplate
          open={editOpen}
          selectedEmailTemplate={selectedEmailTemplate}
          handleCloseEditEmailTemplate={handleCloseEditEmailTemplate}
          handleEditSaveEmailTemplate={handleEditSaveEmailTemplate}
          content={[...contentLanguage]}
          templateType={[...templateType]}
        />
      )}

      {deleteOpen && (
        <DeletePopUp
          open={deleteOpen}
          data={selectedEmailTemplate}
          handleClose={handleCloseDeleteEmailTemplate}
          handleDelete={handleDeleteEmailTemplate}
          message="Confirm To Delete Email Template"
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
              <CSVLink data={rows} filename="Email Template">
                <CloudDownloadOutlinedIcon /> EXPORT
              </CSVLink>
            </Button>
            <Button
              disabled={handlePermission(
                hotelReducer.permission.permission,
                Modules.EMAILTEMPLATE,
                ActionType.create,
                true
              )}
              variant="contained"
              onClick={handleOpenEmailTemplate}
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
                        <TableCell>{row.name ? row.name : "N/A"}</TableCell>
                        <TableCell>
                          {row.templateType ? row.templateType : "N/A"}
                        </TableCell>
                        <TableCell>
                          {row.contentLanguage ? row.contentLanguage : "N/A"}
                        </TableCell>
                        <TableCell>
                          {row.subject ? row.subject : "N/A"}
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
                                Modules.EMAILTEMPLATE,
                                ActionType.update
                              )
                                ? "pointer"
                                : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.EMAILTEMPLATE,
                                ActionType.update
                              ) && handleOpenEditEmailTemplate({ ...row })
                            }
                          />
                          <DeleteOutlinedIcon
                            style={{
                              cursor: handlePermission(
                                hotelReducer.permission.permission,
                                Modules.EMAILTEMPLATE,
                                ActionType.delete
                              )
                                ? "pointer"
                                : "not-allowed",
                            }}
                            onClick={() =>
                              handlePermission(
                                hotelReducer.permission.permission,
                                Modules.EMAILTEMPLATE,
                                ActionType.delete
                              ) && handleOpenDeleteEmailTemplate({ ...row })
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

export default connect(null, mapDispatchToProps)(EmailTemplate);
