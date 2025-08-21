/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
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
} from "@mui/material";
import { bindActionCreators } from "redux";
import { visuallyHidden } from "@mui/utils";
import { connect, useSelector } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { isEmpty } from "lodash";

import * as UserAction from "../../../../../Action/AdminDashboard";
import DeletePopUp from "../../../../../CommonComponent/DeletePopUp";
import MergeTableInfo from "../MergeTableInfo";
import EditMergeTable from "../EditMergeTable";
import { handleUpdatedBy } from "../../../../../utils/userAccess";

let moment = require("moment-timezone");

const columns = [
  { field: "name", headerName: "Group Name", width: 233 },
  { field: "tables", headerName: "Tables", width: 233 },
  { field: "minPax", headerName: "Min No Of Pax", width: 233 },
  { field: "maxPax", headerName: "Max No Of Pax", width: 233 },
  { field: "isActive", headerName: "Status", width: 233 },
  { field: "updatedBy", headerName: "Updated By", width: 233 },
  { field: "updatedAt", headerName: "Updated Date", width: 233 },
  { field: "Commands", headerName: "Commands", width: 233 },
];

const createData = (
  id,
  name,
  minPax,
  maxPax,
  tables,
  createdAt,
  updatedAt,
  createdBy,
  updatedBy,
  GroupPossibility,
  GroupSequenceTable,
  OutletSeatingType,
  isActive
) => {
  return {
    id,
    name,
    minPax,
    maxPax,
    tables,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    GroupPossibility,
    GroupSequenceTable,
    OutletSeatingType,
    isActive,
  };
};

const MergeTableList = (props) => {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [openDeleteTableMerge, setOpenDeleteTableMerge] = useState(false);
  const [openDeleteGroupTablePossibility, setOpenDeleteGroupTablePossibility] =
    useState(false);
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedMergedTableDrawerOpen, setSelectedMergedTableDrawerOpen] =
    useState(false);
  const [selectedDeletePosibility, setSelectedDeletePosibility] =
    useState(null);
  const [editMergeTable, setEditMergeTable] = useState(false);

  useEffect(() => {
    if (props.mergedTables) {
      convertData(props.mergedTables);
    }
  }, [props.mergedTables]);

  useEffect(() => {
    if (rows.length > 0) {
      if (page * rowsPerPage >= rows.length) {
        setPage(page - 1);
      }
    }
  }, [rows]);

  const convertData = (mergedTables) => {
    const data = mergedTables.map((table) => {
      let sequenceTables = "";
      table.GroupSequenceTable.map((sequenceTable, index) => {
        if (index === 0) sequenceTables += sequenceTable.OutletTable.name;
        else sequenceTables += "," + sequenceTable.OutletTable.name;
      });
      if (!isEmpty(props.selectedRow) && props.selectedRow.id === table.id) {
        let selectedRowData = { ...props.selectedRow };
        selectedRowData.GroupPossibility = [...table.GroupPossibility];
      }

      return createData(
        table.id,
        table.name,
        table.minPax,
        table.maxPax,
        sequenceTables,
        table.createdAt,
        table.updatedAt,
        table.createdBy,
        table.updatedBy,
        table.GroupPossibility,
        table.GroupSequenceTable,
        table.OutletSeatingType,
        table.isActive
      );
    });
    setRows(data);
    return data;
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

  const handleOpenDeleteMergeTable = () => {
    setOpenDeleteTableMerge(true);
    setSelectedMergedTableDrawerOpen(false);
  };

  const handleCloseDeleteMergeTable = () => {
    setOpenDeleteTableMerge(false);
  };

  const handleOpenDeleteMergeTablePossibility = (data) => {
    setSelectedDeletePosibility(data);
    setOpenDeleteGroupTablePossibility(true);
  };

  const handleCloseDeleteMergeTablePossibility = () => {
    setOpenDeleteGroupTablePossibility(false);
    setSelectedDeletePosibility(null);
  };

  const handleSaveEditMergeTable = (data) => {
    props.actions.userAction.updateTableMerge(
      data,
      props.selectedRow.id,
      props.outletSeatingType.id
    );
    props.selectedTableRow(null);
  };

  const handleDeleteMergeTable = (data) => {
    const { id } = data;
    props.actions.userAction.deleteMergeTable(id, props.outletSeatingType.id);
    selectedTableRow(null);
  };

  const addTableMergePossibility = (data) => {
    props.actions.userAction.addMergeTablePossibility(
      props.outletSeatingType.id,
      props.selectedRow.id,
      data
    );
  };

  const handleDeleteMergeTablePossibility = (data) => {
    const { id, groupId } = data;
    props.actions.userAction.deleteMergeTablePossibility(
      props.outletSeatingType.id,
      groupId,
      id
    );
  };

  const handleOpenMergeTable = () => {
    setSelectedMergedTableDrawerOpen(true);
  };

  const handleCloseMergeTable = () => {
    setSelectedMergedTableDrawerOpen(false);
  };

  const handleOpenEditMergetTable = () => {
    setEditMergeTable(true);
    setSelectedMergedTableDrawerOpen(false);
  };

  const handleCloseEditMergetTable = () => {
    setEditMergeTable(false);
  };

  const selectedTableRow = (row) => {
    props.selectedTableRow({ ...row, check: 3 });
  };

  return (
    <React.Fragment>
      <div>
        {selectedMergedTableDrawerOpen && (
          <MergeTableInfo
            open={selectedMergedTableDrawerOpen}
            selectedMergedTable={{ ...props.selectedRow }}
            permission={{ ...props.permission }}
            handleOpenEditMergetTable={handleOpenEditMergetTable}
            handleOpenDeleteMergeTablePossibility={
              handleOpenDeleteMergeTablePossibility
            }
            handleCloseMergeTable={handleCloseMergeTable}
            handleOpenDeleteMergeTable={handleOpenDeleteMergeTable}
            addTableMergePossibility={addTableMergePossibility}
          />
        )}

        {editMergeTable && (
          <EditMergeTable
            open={editMergeTable}
            selectedMergedTable={{ ...props.selectedRow }}
            handleCloseEditMergetTable={handleCloseEditMergetTable}
            handleSaveEditMergeTable={handleSaveEditMergeTable}
          />
        )}
        {/** Delete Group Table */}
        {openDeleteTableMerge && (
          <DeletePopUp
            open={openDeleteTableMerge}
            data={{ ...props.selectedRow }}
            handleClose={handleCloseDeleteMergeTable}
            handleDelete={handleDeleteMergeTable}
            message="Confirm To Delete Table Group"
          />
        )}

        {/** Delete possibility */}
        {openDeleteGroupTablePossibility && (
          <DeletePopUp
            open={openDeleteGroupTablePossibility}
            data={{ ...selectedDeletePosibility }}
            handleClose={handleCloseDeleteMergeTablePossibility}
            handleDelete={handleDeleteMergeTablePossibility}
            message="Confirm To Delete Table Possibility"
          />
        )}

        <h1>Merged Table List</h1>
        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
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
                        onClick={() => {
                          createSortHandler(headCell.field);
                        }}
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
                      <TableRow
                        className={
                          props.selectedRow &&
                          props.selectedRow.check === 3 &&
                          row.id === props.selectedRow.id
                            ? "active"
                            : ""
                        }
                        key={index}
                        onClick={() => selectedTableRow(row)}
                      >
                        <TableCell>{row.name ? row.name : "N/A"}</TableCell>
                        <TableCell>{row.tables ? row.tables : "N/A"}</TableCell>
                        <TableCell>{row.minPax ? row.minPax : "N/A"}</TableCell>
                        <TableCell>{row.maxPax ? row.maxPax : "N/A"}</TableCell>
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
                            onClick={() => handleOpenMergeTable()}
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

export default connect(null, mapDispatchToProps)(MergeTableList);
