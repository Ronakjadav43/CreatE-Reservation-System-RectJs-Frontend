/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import { TextField, Box } from "@mui/material";
import { bindActionCreators } from "redux";
import { connect, useDispatch, useSelector } from "react-redux";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useNavigate } from "react-router-dom";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import { CSVLink } from "react-csv";

import * as UserAction from "../../../../Action/AdminDashboard";
import {
  SET_INVISIBLE_MULTIPLE_COMPANY_SELECTION,
  SET_INVISIBLE_SELECTION,
  SET_VISIBLE_MULTIPLE_COMPANY_SELECTION,
  SET_VISIBLE_SELECTION,
} from "../../../../utils/AdminDashboard/Constant";
import GroupEvent from "./GroupEvent";
import SingleRestaurant from "./SingleRestaurant";
import ENVIRONMENT_VARIABLES from "../../../../environment.config";
import {
  ActionType,
  Modules,
  handlePermission,
} from "../../../../utils/userAccess";

const EventReport = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [exportFile, setExportFile] = useState([]);
  const [fileName, setFileName] = useState([]);
  const filterselection = [
    {
      id: "GROUP_EVENT",
      value: "Group Event Report",
    },
    {
      id: "SINGLE_RESTAURANT",
      value: "Single Restaurant Event Report",
    },
  ];

  const redirect = (url) => {
    navigate(url);
  };
  const [outlets, setOutlets] = useState([]);
  const [customerReportData, setCustomerReportData] = useState({
    fromDate: new Date(),
    toDate: new Date(),
    filter: filterselection[0],
    companyIds: [],
  });
  const [mealType, setMealType] = useState([]);

  const hotelReducer = useSelector((state) => ({
    companyMealSession: state.hotelReducer.companyMealSession,
    permission: state.hotelReducer.permission,
    multipleCompanies: state.hotelReducer.multipleCompanies,
    outletForDropDown: state.hotelReducer.outletForDropDown,
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
    const hasPermission = handlePermission(
      hotelReducer.permission.CompanyPermission,
      Modules.REPORTS,
      ActionType.read
    );
    if (!hasPermission) {
      redirect("/Admin");
    }
  }, [hotelReducer.permission]);

  useEffect(() => {
    setCustomerReportData({
      ...customerReportData,
      outletId: null,
      companyIds: [],
    });
    if (
      hotelReducer.multipleCompanies &&
      hotelReducer.multipleCompanies.length > 0
    ) {
      let outletList = [];

      const mappedCompany = hotelReducer.multipleCompanies.filter(
        (company) => company.isChecked === true && company.name !== "All"
      );

      const companyIds = mappedCompany.map((company) => company.id);

      hotelReducer.outletForDropDown.map((outlet) => {
        if (companyIds.includes(outlet.outlet.companyId)) {
          outletList.push(outlet);
        }
      });

      if (mappedCompany.length > 0 && outletList.length > 0) {
        setCustomerReportData({
          ...customerReportData,
          companyIds: mappedCompany,
          outletId: outletList[0],
        });
        setOutlets(outletList);
      }

      props.actions.userAction.getMealSessionByCompany(
        ENVIRONMENT_VARIABLES.Base_MEAL_SESSION
      );
    }
  }, [hotelReducer.multipleCompanies]);

  useEffect(() => {
    if (
      hotelReducer.companyMealSession &&
      hotelReducer.companyMealSession.length > 0
    ) {
      const mappedMeal = hotelReducer.companyMealSession
        .filter((mealtype) => mealtype.isActive === true)
        .map((data) => {
          return { ...data, isChecked: true };
        });

      if (mappedMeal.length > 0) setMealType(mappedMeal);
    }
  }, [hotelReducer.companyMealSession]);

  useEffect(() => {
    if (customerReportData.outletId?.outlet && customerReportData.filter)
      if (customerReportData.filter.value === "Group Event Report") {
        let companyNames = "";
        customerReportData.companyIds.map((company, index) => {
          if (index === 0) companyNames += company.name;
          else companyNames += "," + company.name;
          return null;
        });

        setFileName(`${companyNames}  ${customerReportData.filter.value}`);
      } else
        setFileName(
          `${customerReportData.outletId.name}  ${customerReportData.filter.value}`
        );
  }, [customerReportData.outletId, customerReportData.filter]);

  const handleChangeFilter = (event) => {
    const field = event.target.name;
    let commonData = { ...customerReportData };
    const findFilter = filterselection.find(
      (filter) => filter.id === event.target.value
    );
    if (findFilter) {
      commonData[field] = findFilter;
    }

    return setCustomerReportData(commonData);
  };

  const handleChangeDate = (date) => {
    const data = {
      ...customerReportData,
      fromDate: date,
    };

    setCustomerReportData({
      ...data,
    });
  };

  const handleChangeDate1 = (date) => {
    const data = {
      ...customerReportData,
      toDate: date,
    };

    setCustomerReportData({
      ...data,
    });
  };

  const handleFilter1 = (e) => {
    const value = e.target.value[e.target.value.length - 1];
    let tempData = mealType.map((data) =>
      data.id === value ? { ...data, isChecked: !data.isChecked } : data
    );
    setMealType(tempData);
  };

  const handleChangeOutlet = (event) => {
    const outletId = event.target.value;
    const data = outlets.find((data) => data.outlet.id === Number(outletId));
    setCustomerReportData({ ...customerReportData, outletId: data });
  };

  const getExportFileData = (data) => {
    setExportFile(data);
  };

  return (
    <Fragment>
      <div className="user-groups" style={{ height: "calc(100vh - 280px)" }}>
        <h1 className="groups-header">Report</h1>
        <h1 className="groups-header-2nd">Event Report</h1>
        <Box>
          <FormControl size="small" sx={{ width: "270px" }}>
            <InputLabel id="demo-simple-select-label">Filter</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={customerReportData.filter.id}
              name="filter"
              label="Filter"
              inputProps={{ "aria-label": "Without label" }}
              onChange={handleChangeFilter}
            >
              {filterselection.map((filterType, index) => (
                <MenuItem key={index} value={filterType.id}>
                  {filterType.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box className="user-groups-search">
          <div className="filter-data">
            <div className="date-picker">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack sx={{ width: "160px" }}>
                  <DesktopDatePicker
                    className="date-pic"
                    value={customerReportData.fromDate}
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
                    className="date-pic"
                    minDate={customerReportData.fromDate}
                    value={customerReportData.toDate}
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
            <FormControl size="small" sx={{ width: "180px" }}>
              <InputLabel id="demo-simple-select-label">MealType</InputLabel>
              <Select
                multiple
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={mealType}
                name="mealType"
                label="MealType"
                inputProps={{ "aria-label": "Without label" }}
                required={true}
                onChange={handleFilter1}
                renderValue={(selected) => {
                  selected = mealType.filter((data) => data.isChecked === true);
                  const renderData = selected.map((user) => user.name);
                  return renderData.join(", ");
                }}
              >
                {mealType.map((mealType) => (
                  <MenuItem key={mealType.id} value={mealType.id}>
                    <ListItemIcon>
                      <Checkbox checked={mealType.isChecked} />
                    </ListItemIcon>
                    <ListItemText primary={mealType.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {customerReportData.filter.id === "SINGLE_RESTAURANT" &&
              customerReportData.outletId && (
                <FormControl size="small" sx={{ width: "350px" }}>
                  <InputLabel id="demo-simple-select-label">Outlet</InputLabel>
                  <Select
                    id="demo-simple-select"
                    value={customerReportData.outletId.outlet.id}
                    name="outletId"
                    label="Outlet"
                    inputProps={{ "aria-label": "Without label" }}
                    onChange={handleChangeOutlet}
                  >
                    {outlets.map((outlet, index) => (
                      <MenuItem key={index} value={outlet.outlet.id}>
                        {outlet.outlet.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
          </div>
          <div className="primary-btn">
            <Button variant="outlined">
              <CSVLink data={exportFile} filename={fileName}>
                <CloudDownloadOutlinedIcon /> EXPORT
              </CSVLink>
            </Button>
          </div>
        </Box>

        {customerReportData.filter.id === "GROUP_EVENT" && (
          <div className="">
            <GroupEvent
              filterData={customerReportData}
              mealType={mealType}
              getExportFileData={getExportFileData}
            />
          </div>
        )}

        {customerReportData.filter.id === "SINGLE_RESTAURANT" && (
          <div className="">
            <SingleRestaurant
              filterData={customerReportData}
              mealType={mealType}
              getExportFileData={getExportFileData}
            />
          </div>
        )}
      </div>
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(EventReport);
