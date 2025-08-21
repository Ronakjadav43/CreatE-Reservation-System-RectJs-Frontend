/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Stack,
  styled,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Paper,
  TextField,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Box,
  Button,
} from "@mui/material";
import { bindActionCreators } from "redux";
import { connect, useDispatch, useSelector } from "react-redux";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import { CSVLink } from "react-csv";

import * as UserAction from "../../../../Action/AdminDashboard";
import {
  SET_INVISIBLE_MULTIPLE_COMPANY_SELECTION,
  SET_INVISIBLE_SELECTION,
  SET_VISIBLE_MULTIPLE_COMPANY_SELECTION,
  SET_VISIBLE_SELECTION,
} from "../../../../utils/AdminDashboard/Constant";
import "./style.scss";

import moment from "moment-timezone";

const ReservationSummary = (props) => {
  const dispatch = useDispatch();
  const [chunkRisk, setChunkRisk] = useState(0);
  const [report, setReport] = useState(null);
  const [timeOut, setTimeOut] = useState(null);
  const [columns, setColumns] = useState([]);
  const [exportFile, setExportFile] = useState([]);
  const [fileName, setFileName] = useState(null);
  const filterStatus = [
    { id: "BOOKED", name: "Booked", isActive: true, isChecked: true },
    { id: "CONFIRMED", name: "Confirmed", isActive: true, isChecked: true },
    { id: "POSTPONED", name: "Postponed", isActive: true, isChecked: true },
    { id: "CANCELLED", name: "Cancelled", isActive: true, isChecked: true },
    { id: "NOSHOW", name: "Noshow", isActive: true, isChecked: true },
    { id: "SEATED", name: "Seated", isActive: true, isChecked: true },
    { id: "LEFT", name: "Left", isActive: true, isChecked: true },
  ];

  const [filterBookingType, setFilterBookingType] = useState([
    {
      name: "NORMAL_RESERVATION",
      isChecked: true,
    },
    {
      name: "PRIVATE_EVENT",
      isChecked: true,
    },
    {
      name: "TICKETING_EVENT",
      isChecked: true,
    },
  ]);

  const filterSelection = [
    {
      id: "UPCOMING",
      value: "Upcoming Reservation Report",
    },
    {
      id: "PAST",
      value: "Post Dated Reservation Report",
    },
  ];

  const [reportData, setReportData] = useState({
    fromDate: new Date(),
    toDate: new Date(),
    mealType: [],
    status: filterStatus,
    filter: filterSelection[0],
    bookingType: filterBookingType,
    companyIds: [],
  });

  const hotelReducer = useSelector((state) => ({
    reports: state.hotelReducer.reports,
    mealTypeCompany: state.hotelReducer.mealTypeCompany,
    selectedCompany: state.hotelReducer.selectedCompany,
    permission: state.hotelReducer.permission,
    multipleCompanies: state.hotelReducer.multipleCompanies,
  }));

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

  useEffect(() => {
    setReport(null);
    clearTimeout(timeOut);
    const filterMealType = reportData.mealType.filter(
      (mealType) => mealType.isChecked === true
    );
    const filterBookingType = reportData.bookingType.filter(
      (bookingType) => bookingType.isChecked === true
    );
    const filterStatus = reportData.status.filter(
      (status) => status.isChecked === true
    );
    if (
      reportData &&
      filterMealType.length > 0 &&
      filterBookingType.length > 0 &&
      filterStatus.length > 0 &&
      reportData.companyIds.length > 0
    ) {
      if (reportData.companyIds.length > 0) {
        setTimeOut(
          setTimeout(() => {
            props.actions.userAction.getAllReports(reportData);
          }, 1500)
        );
      }
    }
  }, [reportData]);

  useEffect(() => {
    if (
      hotelReducer.mealTypeCompany &&
      hotelReducer.mealTypeCompany.length > 0
    ) {
      const mappedMeal = hotelReducer.mealTypeCompany
        .filter((mealtype) => mealtype.isActive === true)
        .map((data) => {
          return { ...data, isChecked: true };
        });
      setReportData({ ...reportData, mealType: mappedMeal });
    }
  }, [hotelReducer.mealTypeCompany]);

  useEffect(() => {
    if (
      hotelReducer.multipleCompanies &&
      hotelReducer.multipleCompanies.length > 0
    ) {
      const mappedCompany = hotelReducer.multipleCompanies.filter(
        (company) => company.isChecked === true && company.name !== "All"
      );
      if (mappedCompany.length > 0) {
        props.actions.userAction.getMealTypeByCompany(
          hotelReducer.multipleCompanies,
          true
        );
      }

      let companyName = "";
      mappedCompany.map((company, index) => {
        if (index === 0) companyName += company.name;
        else companyName += "," + company.name;
        return null;
      });
      setFileName(companyName);

      setReportData({ ...reportData, companyIds: mappedCompany });
    }
  }, [hotelReducer.multipleCompanies]);

  useEffect(() => {
    if (hotelReducer.reports) {
      let columnList = [{ field: "outlet", headerName: "Outlet" }];
      hotelReducer.reports.Total.map((report) => {
        columnList.push({
          field: report.mealType,
          headerName: report.mealType,
          colSpan: 2,
        });
      });
      if (columnList.length > 0) {
        setColumns([...columnList]);
      }
      let header = ["Start Date", "End Date"];
      columnList.map((column) => {
        header.push(column.headerName);
      });

      const body = [];
      for (
        let index = 0;
        index <= hotelReducer.reports.Outlet.length;
        index++
      ) {
        let object = {};
        if (index === hotelReducer.reports.Outlet.length) {
          header.map((head) => {
            if (head === "Outlet") {
              object[head] = "Total Booking";
            }
            const findOutletMealType = hotelReducer.reports.Total.find(
              (mealType) => mealType.mealType === head
            );

            if (findOutletMealType) {
              object[`${head} (Reservation)`] =
                findOutletMealType.totalNumberOfReservation !== undefined
                  ? findOutletMealType.totalNumberOfReservation
                  : findOutletMealType.totalNumberOfReservation;

              object[`${head} (Pax)`] =
                findOutletMealType.totalNumberOfPerson !== undefined
                  ? findOutletMealType.totalNumberOfPerson
                  : findOutletMealType.totalNumberOfPreoderItem;
            }
          });
        } else {
          const outlet = hotelReducer.reports.Outlet[index];

          header.map((head) => {
            if (index === 0 && head === "Start Date") {
              object[head] = moment(reportData.fromDate).format("DD-MM-YYYY");
            } else if (index === 0 && head === "End Date") {
              object[head] = moment(reportData.toDate).format("DD-MM-YYYY");
            } else if (head === "Outlet") {
              object[head] = outlet.name;
            } else {
              const findOutletMealType = outlet.mealTypes.find(
                (mealType) => mealType.mealType === head
              );

              if (findOutletMealType) {
                object[`${head} (Reservation)`] =
                  findOutletMealType.totalNumberOfReservation !== undefined
                    ? findOutletMealType.totalNumberOfReservation
                    : findOutletMealType.totalNumberOfReservation;

                object[`${head} (Pax)`] =
                  findOutletMealType.totalNumberOfPerson !== undefined
                    ? findOutletMealType.totalNumberOfPerson
                    : findOutletMealType.totalNumberOfPreoderItem;
              }
            }
          });
        }
        body.push(object);
      }

      setExportFile(body);
      setReport(hotelReducer.reports);
    }
  }, [hotelReducer.reports]);

  const handleChangeFilter = (event) => {
    const field = event.target.name;
    let commonData = { ...reportData };
    const findFilter = filterSelection.find(
      (filter) => filter.id === event.target.value
    );
    if (findFilter) {
      commonData[field] = findFilter;
    }
    if (event.target.value === "PAST") {
      commonData.fromDate = moment(reportData.fromDate).subtract(1, "days");
      commonData.toDate = moment(reportData.toDate).subtract(1, "days");
    } else {
      commonData.fromDate = new Date();
      commonData.toDate = new Date();
    }
    return setReportData(commonData);
  };

  const handleChangeDate = (date) => {
    const data = {
      ...reportData,
      fromDate: date,
    };
    setReportData({
      ...data,
    });
  };

  const handleChangeDate1 = (date) => {
    const data = {
      ...reportData,
      toDate: date,
    };
    setReportData({
      ...data,
    });
  };

  const handleFilter = (e) => {
    const value = e.target.value[e.target.value.length - 1];
    let tempData = filterBookingType.map((data) =>
      data.name === value ? { ...data, isChecked: !data.isChecked } : data
    );
    setFilterBookingType([...tempData]);
    setReportData({ ...reportData, bookingType: tempData });
  };

  const handleFilter1 = (e) => {
    const value = e.target.value[e.target.value.length - 1];
    let tempData = reportData.mealType.map((data) =>
      data.id === value ? { ...data, isChecked: !data.isChecked } : data
    );
    setReportData({ ...reportData, mealType: tempData });
  };

  const handleFilter2 = (e) => {
    const value = e.target.value[e.target.value.length - 1];
    let tempData = reportData.status.map((data) =>
      data.id === value ? { ...data, isChecked: !data.isChecked } : data
    );
    setReportData({ ...reportData, status: tempData });
  };

  useEffect(() => {
    if (report?.noShow !== null) {
      ChunkDetails(report?.noShow);
    }
  }, [report?.noShow]);

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === "light" ? "#1A90FF" : "#308FE8",
    },
  }));

  const ChunkDetails = (details) => {
    setChunkRisk(details);
  };

  return (
    <div className="user-groups" style={{ height: "calc(100vh - 280px)" }}>
      <h1 className="groups-header">Reports</h1>
      <h1 className="groups-header-2nd">Reservation Summary</h1>
      <Box>
        <FormControl size="small" sx={{ width: "270px" }}>
          <InputLabel id="demo-simple-select-label">Filter</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={reportData.filter.id}
            name="filter"
            label="Filter"
            inputProps={{ "aria-label": "Without label" }}
            onChange={handleChangeFilter}
          >
            {filterSelection.map((filterType, index) => (
              <MenuItem key={index} value={filterType.id}>
                {filterType.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {reportData.filter.id === "PAST" && (
        <div>
          <div style={{ display: "flex" }}>
            <span>
              RATE OF NO SHOW:{" "}
              {chunkRisk !== null && parseFloat(chunkRisk).toFixed(2)}
            </span>
            <Box
              sx={{
                marginLeft: "5px",
                width: "285px",
                marginTop: "10px ",
              }}
            >
              <BorderLinearProgress
                variant="determinate"
                value={chunkRisk}
                valueBuffer={chunkRisk}
              />
            </Box>
          </div>
        </div>
      )}

      <Box className="user-groups-search">
        <div
          className="filter-data w-100"
          style={{ justifyContent: "space-between" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="date-picker">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack sx={{ width: "160px" }}>
                  <DesktopDatePicker
                    disablePast={reportData.filter.id === "UPCOMING"}
                    disableFuture={reportData.filter.id === "PAST"}
                    className="date-pic"
                    value={reportData.fromDate}
                    onChange={(newValue) => {
                      handleChangeDate(new Date(newValue));
                    }}
                    inputFormat="DD-MM-YYYY"
                    renderInput={(params) => <TextField {...params} />}
                    label="Start"
                  />
                </Stack>
              </LocalizationProvider>
            </div>
            To
            <div className="date-picker">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack sx={{ width: "160px" }}>
                  <DesktopDatePicker
                    disablePast={reportData.filter.id === "UPCOMING"}
                    disableFuture={reportData.filter.id === "PAST"}
                    minDate={reportData.fromDate}
                    className="date-pic"
                    value={reportData.toDate}
                    onChange={(newValue) => {
                      handleChangeDate1(new Date(newValue));
                    }}
                    inputFormat="DD-MM-YYYY"
                    renderInput={(params) => <TextField {...params} />}
                    label="End"
                  />
                </Stack>
              </LocalizationProvider>
            </div>
            <Box>
              <FormControl size="small" sx={{ width: "160px" }}>
                <InputLabel id="demo-simple-select-label">MealType</InputLabel>
                <Select
                  multiple
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={reportData.mealType}
                  name="mealType"
                  label="mealType"
                  inputProps={{ "aria-label": "Without label" }}
                  required={true}
                  onChange={handleFilter1}
                  renderValue={(selected) => {
                    selected = reportData.mealType.filter(
                      (data) => data.isChecked === true
                    );
                    const renderData = selected.map((user) => user.name);
                    return renderData.join(", ");
                  }}
                >
                  {reportData.mealType.map((mealType) => (
                    <MenuItem key={mealType.id} value={mealType.id}>
                      <ListItemIcon>
                        <Checkbox checked={mealType.isChecked} />
                      </ListItemIcon>
                      <ListItemText primary={mealType.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <FormControl fullWidth size="small" sx={{ width: "160px" }}>
                <InputLabel id="status">Status</InputLabel>
                <Select
                  multiple
                  labelId="status"
                  id="status"
                  value={reportData.status}
                  name="status"
                  label="status"
                  required={true}
                  onChange={handleFilter2}
                  renderValue={(selected) => {
                    selected = reportData.status.filter(
                      (data) => data.isChecked === true
                    );
                    const renderData = selected.map((user) => user.name);
                    return renderData.join(", ");
                  }}
                >
                  {reportData.status.map((mealType) => (
                    <MenuItem key={mealType.id} value={mealType.id}>
                      <ListItemIcon>
                        <Checkbox checked={mealType.isChecked} />
                      </ListItemIcon>
                      <ListItemText primary={mealType.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {filterBookingType.length > 0 && (
              <FormControl size="small" sx={{ width: 300 }}>
                <InputLabel id="status">Booking Type</InputLabel>
                <Select
                  multiple
                  margin="normal"
                  labelId="filterBookingType"
                  type="text"
                  label="filterBookingType"
                  value={filterBookingType}
                  name="audianceList"
                  onChange={handleFilter}
                  renderValue={(selected) => {
                    selected = filterBookingType.filter(
                      (data) => data.isChecked === true
                    );
                    const renderData = selected.map((tag) => tag.name);
                    return renderData.join(", ");
                  }}
                >
                  {filterBookingType.map((data, index) => (
                    <MenuItem key={index} value={data.name}>
                      <ListItemIcon>
                        <Checkbox checked={data.isChecked} />
                      </ListItemIcon>
                      <ListItemText primary={data.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>

          <div className="primary-btn">
            {fileName !== null && (
              <Button variant="outlined">
                <CSVLink
                  data={exportFile}
                  filename={`${fileName}  ${reportData.filter.value}`}
                >
                  <CloudDownloadOutlinedIcon /> EXPORT
                </CSVLink>
              </Button>
            )}
          </div>
        </div>
      </Box>
      {report && (
        <Paper sx={{ width: "fit-content" }} className="sumary-table">
          <TableContainer
            sx={{
              maxHeight: "calc(100vh - 304px)",
              overflow: "auto",
              position: "relative",
              maxWidth: "1485px",
            }}
          >
            <Table
              stickyHeader
              aria-label="sticky table"
              size={"medium"}
              className="report-table"
            >
              <TableHead>
                <TableRow>
                  {columns.length > 0 &&
                    columns.map((headCell, index) => (
                      <TableCell
                        key={headCell.field}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                      >
                        <span> {headCell.headerName}</span>
                        <div>
                          <span>
                            {headCell.headerName !== "Outlet"
                              ? "Reservation"
                              : ""}
                          </span>
                          <span>
                            {headCell.headerName === "Outlet"
                              ? ""
                              : headCell.headerName.slice(0, 9) === "Pre Order"
                              ? "Item"
                              : "Pax"}
                          </span>
                        </div>
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {report?.Outlet.map((row, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell sx={{ padding: "16px !important" }}>
                        {row.name}
                      </TableCell>
                      {row.mealTypes.map((mealType) => (
                        <TableCell>
                          <div>
                            <span>{mealType.totalNumberOfReservation}</span>
                            <span>
                              {mealType.mealType.slice(0, 9) === "Pre Order"
                                ? mealType.totalNumberOfPreoderItem
                                : mealType.totalNumberOfPerson}
                            </span>
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell sx={{ padding: "16px !important" }}>
                    Total Booking
                  </TableCell>
                  {report?.Total.map((row, index) => {
                    return (
                      <TableCell>
                        <div>
                          <span>{row.totalNumberOfReservation}</span>
                          <span>
                            {row.mealType.slice(0, 9) === "Pre Order"
                              ? row.totalNumberOfPreoderItem
                              : row.totalNumberOfPerson}
                          </span>
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(ReservationSummary);
