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
  ListItemIcon,
  Checkbox,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { visuallyHidden } from "@mui/utils";
import { bindActionCreators } from "redux";
import { connect, useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { CSVLink } from "react-csv";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import NormalBooking from "./NormalBooking/index";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import { RESET_INVOICE } from "../../../../utils/AdminDashboard/Constant";
import BasicInfo from "./BasicInfo";
import Filter from "./Filter";
import * as UserAction from "../../../../Action/AdminDashboard";
import ConfirmationPopUp from "../../../../CommonComponent/ConfirmationPopUp";
import EventBooking from "./EventBooking";
import ImageDisplay from "./ImageDisplay";
import ENVIRONMENT_VARIABLES from "../../../../environment.config";
import {
  ActionType,
  Modules,
  handlePermission,
} from "../../../../utils/userAccess";
import "./style.scss";

let moment = require("moment-timezone");

const createData = (
  id,
  bookingDate,
  bookingType,
  customerName,
  mealType,
  Outlet,
  source,
  specialRequest,
  specialRequests,
  discountAmount,
  status,
  isValidSetupIntent,
  email,
  mobileNo,
  noOfPerson,
  updatedAt,
  timezone,
  createdAt,
  time,
  occasion,
  OutletTableBooking,
  seatingPreference,
  customerId,
  outletTableName,
  image,
  Customer,
  bookingStartTime,
  totalAmount
) => {
  return {
    id,
    bookingDate,
    bookingType,
    customerName,
    mealType,
    Outlet,
    source,
    specialRequest,
    specialRequests,
    discountAmount,
    status,
    isValidSetupIntent,
    email,
    mobileNo,
    noOfPerson,
    updatedAt,
    timezone,
    createdAt,
    time,
    occasion,
    OutletTableBooking,
    seatingPreference,
    customerId,
    outletTableName,
    image,
    Customer,
    bookingStartTime,
    totalAmount,
  };
};

const ListingView = (props) => {
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [tableData, setTableData] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [orderBy, setOrderBy] = useState("bookingDate");
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterColumn, setFilterColumn] = useState([]);
  const [mealTypes, setMealTypes] = useState([]);
  const [mealSessions, setMealSessions] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [openUpdateStatus, setOpenUpdateStatus] = useState(false);
  const [isPaymentConfirmation, setIsPaymentConfirmation] = useState(false);

  const status = [
    { id: "ALL", value: "All" },
    { id: "BOOKED", value: "Booked" },
    { id: "CONFIRMED", value: "Confirmed" },
    { id: "POSTPONED", value: "Postponed" },
    { id: "CANCELLED", value: "Cancelled" },
    { id: "NOSHOW", value: "Noshow" },
    { id: "SEATED", value: "Seated" },
    { id: "LEFT", value: "Left" },
  ];
  const [sourceList, setSourceList] = useState([
    { id: "ALL", value: "All", isActive: true, isChecked: true },
    { id: "WEB", value: "web", isActive: true, isChecked: true },
    { id: "CHOPE", value: "Chope", isActive: true, isChecked: true },
    { id: "ODDLE", value: "Oddle", isActive: true, isChecked: true },
    { id: "MANUAL", value: "Manual", isActive: true, isChecked: true },
  ]);

  const updateStatus = [
    { id: "BOOKED", value: "Booked" },
    { id: "CONFIRMED", value: "Confirmed" },
    { id: "POSTPONED", value: "Postponed" },
    { id: "CANCELLED", value: "Cancelled" },
    { id: "NOSHOW", value: "Noshow" },
    { id: "SEATED", value: "Seated" },
    { id: "LEFT", value: "Left" },
  ];
  const [listingData, setListingData] = useState({
    date: new Date(),
    mealType: "All",
    status: status.length > 0 ? status[0].id : 0,
  });

  const [columns, setColumns] = useState([
    {
      field: "time",
      headerName: "TIME",
      width: 233,
      isChecked: true,
      type: "time",
    },
    {
      field: "customerName",
      headerName: "CUSTOMER",
      width: 233,
      isChecked: true,
      type: "string",
    },
    {
      field: "mobileNo",
      headerName: "MOBILE NUMBER",
      width: 233,
      isChecked: true,
      type: "number",
    },
    {
      field: "noOfPerson",
      headerName: "PAX",
      width: 233,
      isChecked: true,
      type: "string",
    },
    {
      field: "outletTableName",
      headerName: "TABLE",
      width: 233,
      isChecked: true,
      type: "string",
    },
    {
      field: "bookingType",
      headerName: "BOOKING TYPE",
      width: 233,
      isChecked: true,
      type: "string",
    },
    {
      field: "specialRequest",
      headerName: "SPECIAL INSTRUCTION",
      width: 233,
      isChecked: true,
      type: "string",
    },
    {
      field: "specialRequests",
      headerName: "SPECIAL REQUEST",
      width: 233,
      isChecked: true,
      type: "string",
    },
    {
      field: "source",
      headerName: "SOURCE",
      width: 233,
      isChecked: true,
      type: "string",
    },
    {
      field: "status",
      headerName: "STATUS",
      width: 233,
      isChecked: true,
      type: "bookingStatus",
    },
    {
      field: "Commands",
      headerName: "COMMANDS",
      width: 233,
      isChecked: true,
      type: "commands",
    },
  ]);

  const hotelReducer = useSelector((state) => ({
    outlets: state.hotelReducer.outlets,
    selectedOutlet: state.hotelReducer.selectedOutlet,
    invoiceDetails: state.hotelReducer.invoiceDetails,
    mealTypes: state.hotelReducer.mealTypes,
    bookingReservations: state.hotelReducer.bookingReservations,
    timeSlots: state.hotelReducer.timeSlots,
    mealSession: state.hotelReducer.mealSession,
    permission: state.hotelReducer.permission,
  }));

  const reservationTypes = [
    { id: "NORMAL_RESERVATION", value: "New Booking" },
    { id: "PRIVATE_EVENT", value: "New Event" },
  ];
  const [reservationType, setReservationType] = useState(
    reservationTypes[0].id
  );

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      //Get Invoices
      props.actions.userAction.getAllInvoiceDetails(
        hotelReducer.selectedOutlet.outlet.id,
        listingData
      );
      //Get mealType
      props.actions.userAction.getMealTypes(
        hotelReducer.selectedOutlet.outlet.id
      );
      props.actions.userAction.getMealSessionByOutlet(
        ENVIRONMENT_VARIABLES.Base_MEAL_SESSION,
        hotelReducer.selectedOutlet.outlet.id
      );
      setPage(0);
      setRowsPerPage(10);
      return () => {
        dispatch({ type: RESET_INVOICE });
      };
    }
  }, [hotelReducer.selectedOutlet]);

  const convertData = (invoiceDetails) => {
    const data = invoiceDetails.map((invoice) => {
      let outletTableName = "";
      invoice.OutletTableBooking.map((sequenceTable, index) => {
        if (index === 0) outletTableName += sequenceTable.OutletTable.name;
        else outletTableName += "," + sequenceTable.OutletTable.name;
        return null;
      });
      if (!isEmpty(props.selectedRow) && props.selectedRow.id === invoice.id) {
        let selectedRowData = { ...props.selectedRow };
        selectedRowData.GroupPossibility = [...invoice.GroupPossibility];
        tableRowRender(selectedRowData);
      }
      let specialRequests = [];
      let data = "";
      if (invoice.dinningOptions && invoice.dinningOptions.length > 0) {
        // specialRequests = `${specialRequests}Dinning Option`+ " "
        specialRequests.push("Dinning Option");
      }
      if (invoice.basket && invoice.basket.length > 0) {
        // specialRequests = `${specialRequests}Preorder Menu Item`+ " "
        specialRequests.push("Preorder Menu Item");
      }
      if (invoice.isPrivateTableBooked) {
        //specialRequests = `${specialRequests}Private Room`;
        specialRequests.push("Private Room");
      }
      if (specialRequests.length > 0) {
        specialRequests.map((specialRequest, index) => {
          if (index === 0) data += specialRequest;
          else data += "," + specialRequest;
        });
      }

      return createData(
        invoice.id,
        invoice.bookingDate,
        invoice.bookingType,
        `${invoice?.Customer.name} ${invoice?.Customer.lastName}`,
        invoice.mealType,
        invoice.Outlet,
        invoice.source,
        invoice.specialRequest,
        data,
        invoice?.Coupon?.name,
        invoice.status,
        invoice.isValidSetupIntent,
        invoice.Customer.email,
        invoice.Customer.mobileNo,
        invoice.noOfPerson,
        invoice.updatedAt,
        invoice?.Outlet.timezone,
        invoice.createdAt,
        [invoice?.bookingStartTime, invoice?.bookingEndTime],
        invoice.occasion,
        invoice.OutletTableBooking,
        invoice.seatingPreference,
        invoice.customerId,
        outletTableName,
        invoice.image,
        invoice.Customer,
        invoice.bookingStartTime,
        invoice.totalAmount
      );
    });
    setRows(data);
    return data;
  };

  const filterSource = (sourceList) => {
    setRows([]);
    let filterSourceList = [];
    sourceList
      .filter((source) => source.isChecked === true)
      .map((filter) => filterSourceList.push(filter.id));

    let invoiceDetails = [];
    if (filterSourceList.length > 0) {
      hotelReducer.invoiceDetails.map((invoice) => {
        if (filterSourceList.includes(invoice.source)) {
          invoiceDetails.push(invoice);
        }
      });
      if (invoiceDetails.length > 0) {
        convertData(invoiceDetails);
      }
    }
  };

  useEffect(() => {
    if (hotelReducer.invoiceDetails)
      if (!isEmpty(searchText)) {
        const filteredData = convertData(hotelReducer.invoiceDetails).filter(
          (item) => {
            return Object.values(item)
              .join("")
              .toLowerCase()
              .includes(searchText.toLowerCase());
          }
        );
        setRows([...filteredData]);
      } else {
        convertData(hotelReducer.invoiceDetails);
      }
  }, [hotelReducer.invoiceDetails]);

  useEffect(() => {
    if (hotelReducer.mealSession) {
      setMealSessions([...hotelReducer.mealSession]);
    }
  }, [hotelReducer.mealSession]);

  useEffect(() => {
    setMealTypes([...hotelReducer.mealTypes, { name: "All" }]);
  }, [hotelReducer.mealTypes]);

  useEffect(() => {
    const filterColumn = columns.filter((data) => data.isChecked === true);
    setFilterColumn(filterColumn);
  }, [columns]);

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

  const filterData = () => {
    props.actions.userAction.getAllInvoiceDetails(
      hotelReducer.selectedOutlet.outlet.id,
      listingData
    );
  };

  const handleOpenEditBasicInfo = (data) => {
    setSelectedRow(data);
    setEditOpen(true);
  };

  const handleOpenEditImage = (data) => {
    setSelectedRow(data);
    setImageOpen(true);
  };

  const handleCloseEditBasicInfo = () => {
    setEditOpen(false);
  };

  const handleCloseEditImage = () => {
    setImageOpen(false);
  };

  const handleApplyFilterInvoiceData = (filterColumn) => {
    setFilterOpen(false);
    setColumns(filterColumn);
  };

  const handleCloseFilterInvoiceData = () => {
    setFilterOpen(false);
  };

  const handleOpenFilterInvoiceData = () => {
    setFilterOpen(true);
  };

  const tableRowRender = (row, col, index) => {
    if (hotelReducer.selectedOutlet) {
      switch (col.type) {
        case "string":
          return (
            <TableCell key={index}>
              {row[col.field] ? row[col.field] : "N/A"}
            </TableCell>
          );

        case "number":
          return (
            <TableCell key={index}>
              {row[col.field] ? row[col.field] : "0"}
            </TableCell>
          );

        case "bookingStatus":
          return (
            <TableCell key={index}>
              {row[col.field] ? (
                <Box>
                  <FormControl fullWidth size="small" sx={{ width: "130px" }}>
                    <Select
                      disabled={false}
                      value={row[col.field]}
                      name="status"
                      onChange={(event) => {
                        handleOpenUpdateStatus(event, row);
                      }}
                    >
                      {updateStatus.map((data, index) => (
                        <MenuItem key={index} value={data.id}>
                          {data.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              ) : (
                "N/A"
              )}
            </TableCell>
          );

        case "date":
          return (
            <TableCell key={index}>
              {row[col.field]
                ? moment(row[col.field])
                    .tz(hotelReducer.selectedOutlet.outlet.timezone)
                    .format("DD-MM-YYYY hh:mm A")
                : "N/A"}
            </TableCell>
          );

        case "time":
          return (
            <TableCell key={index}>
              {row.time[0] && row.time[1]
                ? `${moment(row.time[0])
                    .tz(hotelReducer.selectedOutlet.outlet.timezone)
                    .format("hh:mm A")} `
                : "N/A"}
            </TableCell>
          );

        case "commands":
          return (
            <TableCell key={index} className="commands-icons">
              <VisibilityIcon
                onClick={() => handleOpenEditBasicInfo({ ...row })}
              />
              {row.image && row.image.length > 0 && (
                <AttachFileIcon
                  onClick={() => handleOpenEditImage({ ...row })}
                />
              )}
            </TableCell>
          );

        default:
          return (
            <TableCell key={index}>
              {row[col.field] ? row[col.field] : "N/A"}
            </TableCell>
          );
      }
    }
  };

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...listingData };
    commonData[field] = event.target.value;
    return setListingData(commonData);
  };

  const handleFilter1 = (e) => {
    let tempData = [];
    const value = e.target.value[e.target.value.length - 1];

    const findSelectAll = sourceList.find((source) => source.id === value);
    if (findSelectAll.value === "All") {
      if (findSelectAll.isChecked === false) {
        tempData = sourceList.map((data) => ({ ...data, isChecked: true }));
      } else {
        tempData = sourceList.map((data) => ({
          ...data,
          isChecked: false,
        }));
      }
    } else {
      tempData = sourceList.map((data) =>
        data.id === value ? { ...data, isChecked: !data.isChecked } : data
      );

      const checkSelectAll = tempData.filter(
        (data) => data.isChecked !== true && data.value !== "All"
      );
      if (checkSelectAll.length > 0) {
        tempData[0].isChecked = false;
      } else {
        tempData[0].isChecked = true;
      }
    }
    filterSource(tempData);

    setSourceList(tempData);
  };

  const handleInvoiceChange = (data) => {
    const { status, id } = data;
    const newStatus = { status: status };
    if (status === "NOSHOW") {
      props.actions.userAction.updateInvoiceStatus(
        { ...newStatus, isCharge: true },
        id
      );
    } else {
      props.actions.userAction.updateInvoiceStatus(newStatus, id);
    }
  };

  const handleOpenUpdateStatus = (event, data) => {
    if (event.target.value === "NOSHOW" && data.isValidSetupIntent === true) {
      setIsPaymentConfirmation(true);
    }
    setOpenUpdateStatus(true);
    setSelectedRow({ ...data, status: event.target.value });
  };

  const handleCloseUpdateStatus = (data = null) => {
    if (isPaymentConfirmation) {
      if (data) {
        const { status, id } = data;
        const newStatus = { status: status };
        props.actions.userAction.updateInvoiceStatus(newStatus, id);
      }
      setIsPaymentConfirmation(false);
    }
    setOpenUpdateStatus(false);
  };

  const handleOpenBookingTable = () => {
    setTableData(true);
  };

  const handleCloseBookingTable = () => {
    setTableData(false);
    setReservationType(reservationTypes[0].id);
  };

  const handlePreviousDate = () => {
    const data = {
      ...listingData,
      mealType: "All",
      status: "ALL",
      date: new Date(moment(listingData.date).subtract(1, "days")),
    };
    props.actions.userAction.getAllInvoiceDetails(
      hotelReducer.selectedOutlet.outlet.id,
      data
    );
    setListingData({
      ...data,
    });
  };

  const handleNextDate = () => {
    const data = {
      ...listingData,
      mealType: "All",
      status: "ALL",
      date: new Date(moment(listingData.date).add(1, "days")),
    };
    props.actions.userAction.getAllInvoiceDetails(
      hotelReducer.selectedOutlet.outlet.id,
      data
    );
    setListingData({
      ...data,
    });
  };

  const handleChangeDate = (date) => {
    const data = {
      ...listingData,
      mealType: "All",
      status: "ALL",
      date,
    };
    props.actions.userAction.getAllInvoiceDetails(
      hotelReducer.selectedOutlet.outlet.id,
      data
    );
    setListingData({
      ...data,
    });
  };

  const handleChangeBookingType = (event) => {
    setReservationType(event.target.value);
  };

  return (
    <div className="user-groups" style={{ height: "calc(100vh - 280px)" }}>
      {filterOpen && (
        <Filter
          open={filterOpen}
          columns={columns}
          handleCloseFilterInvoiceData={handleCloseFilterInvoiceData}
          handleApplyFilterInvoiceData={handleApplyFilterInvoiceData}
        />
      )}

      {imageOpen && (
        <ImageDisplay
          open={imageOpen}
          selectedOutlet={selectedRow}
          handleCloseEditImage={handleCloseEditImage}
        />
      )}

      {editOpen && (
        <BasicInfo
          open={editOpen}
          selectedInvoice={selectedRow}
          handleCloseEditBasicInfo={handleCloseEditBasicInfo}
          outlet={hotelReducer.selectedOutlet.outlet}
          hasUpdatePermissoin={handlePermission(
            hotelReducer.permission.permission,
            Modules.RESERVATIONMANAGEMENT,
            ActionType.update,
            true
          )}
        />
      )}

      {tableData &&
        (reservationType === "NORMAL_RESERVATION" ? (
          <NormalBooking
            open={tableData}
            selectedOutlet={hotelReducer.selectedOutlet}
            handleCloseBookingTable={handleCloseBookingTable}
            handleOpenBookingTable={handleOpenBookingTable}
            handleChangeBookingType={handleChangeBookingType}
            filterData={{ ...listingData }}
          />
        ) : (
          <EventBooking
            open={tableData}
            selectedOutlet={hotelReducer.selectedOutlet}
            handleCloseEventTable={handleCloseBookingTable}
            handleOpenEventTable={handleOpenBookingTable}
            handleChangeBookingType={handleChangeBookingType}
            mealSessions={mealSessions}
          />
        ))}

      {openUpdateStatus && (
        <ConfirmationPopUp
          open={openUpdateStatus}
          data={{ ...selectedRow }}
          handleClose={handleCloseUpdateStatus}
          handleUpdate={handleInvoiceChange}
          message={
            isPaymentConfirmation
              ? `${selectedRow.Customer.name} has previously placed a deposit of ${selectedRow.totalAmount} . Would you like to charge the ${selectedRow.totalAmount} to the customer now?`
              : "Confirm To Update Status"
          }
          buttonTitle={isPaymentConfirmation ? "YES" : "UPDATE"}
          title={isPaymentConfirmation ? " " : "UPDATE"}
          closeButtonTitle={isPaymentConfirmation ? "NO" : "CLOSE"}
          hasUpdatePermissoin={handlePermission(
            hotelReducer.permission.permission,
            Modules.RESERVATIONMANAGEMENT,
            ActionType.update,
            true
          )}
        />
      )}

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
          <Box>
            <FormControl size="small" sx={{ width: "160px" }}>
              <InputLabel id="demo-simple-select-label">MealType</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={listingData.mealType}
                name="mealType"
                label="mealType"
                inputProps={{ "aria-label": "Without label" }}
                onChange={handleChange}
              >
                {mealTypes.map((mealType, index) => (
                  <MenuItem key={index} value={mealType.name}>
                    {mealType.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <FormControl fullWidth size="small" sx={{ width: "160px" }}>
              <InputLabel id="status">Status</InputLabel>
              <Select
                labelId="status"
                id="status"
                value={listingData.status}
                name="status"
                label="status"
                onChange={handleChange}
              >
                {status.map((data, index) => (
                  <MenuItem key={index} value={data.id}>
                    {data.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <FormControl size="small" sx={{ width: "160px" }}>
              <InputLabel id="demo-simple-select-label">Source</InputLabel>
              <Select
                multiple
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sourceList}
                name="source"
                label="source"
                inputProps={{ "aria-label": "Without label" }}
                required={true}
                onChange={handleFilter1}
                renderValue={(selected) => {
                  selected = sourceList.filter(
                    (data) => data.isChecked === true
                  );
                  const renderData = selected.map((user) => user.value);
                  return renderData.join(", ");
                }}
              >
                {sourceList.map((sources) => (
                  <MenuItem key={sources.id} value={sources.id}>
                    <ListItemIcon>
                      <Checkbox checked={sources.isChecked} />
                    </ListItemIcon>
                    <ListItemText primary={sources.value} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <div className="date-picker">
            <div className="icon-box pointers" onClick={handlePreviousDate}>
              <ArrowBackIosIcon />
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack sx={{ width: "160px" }}>
                <DesktopDatePicker
                  className="date-pic"
                  value={listingData.date}
                  onChange={(newValue) => {
                    handleChangeDate(new Date(newValue));
                  }}
                  inputFormat="DD-MM-YYYY"
                  renderInput={(params) => <TextField {...params} />}
                  label="Date"
                />
              </Stack>
            </LocalizationProvider>
            <div className="icon-box pointers" onClick={handleNextDate}>
              <ArrowForwardIosIcon />
            </div>
          </div>
        </div>

        <div className="primary-btn">
          <Button
            variant="outlined"
            onClick={handleOpenFilterInvoiceData}
            className="filter-btn"
          >
            <FilterAltOutlinedIcon />
          </Button>
          <Button variant="contained" onClick={filterData}>
            filter
          </Button>
          <Button variant="outlined">
            <CSVLink data={rows} filename="Listing View">
              <CloudDownloadOutlinedIcon /> EXPORT
            </CSVLink>
          </Button>
          <div className="primary-btn">
            <Button
              disabled={handlePermission(
                hotelReducer.permission.permission,
                Modules.RESERVATIONMANAGEMENT,
                ActionType.create,
                true
              )}
              variant="contained"
              onClick={handleOpenBookingTable}
            >
              <AddOutlinedIcon /> ADD
            </Button>
          </div>
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
                {columns.map(
                  (headCell, index) =>
                    headCell.isChecked && (
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
                    )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      className={
                        selectedRow && row.id === selectedRow.id ? "active" : ""
                      }
                      key={index}
                    >
                      {filterColumn.map((col, index) => {
                        return tableRowRender(row, col, index);
                      })}
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
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(ListingView);
