/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from "react";
import { Stack } from "@mui/material";
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

import * as UserAction from "../../../../Action/AdminDashboard";
import {
  SET_INVISIBLE_MULTIPLE_COMPANY_SELECTION,
  SET_INVISIBLE_SELECTION,
  SET_VISIBLE_MULTIPLE_COMPANY_SELECTION,
  SET_VISIBLE_SELECTION,
} from "../../../../utils/AdminDashboard/Constant";
import Frequent from "./Frequent";
import Cross from "./Cross";
import {
  ActionType,
  Modules,
  handlePermission,
} from "../../../../utils/userAccess";
import "./style.scss";

const CustomerReport = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const filterselection = [
    {
      id: "FREQUENT_CUSTOMER",
      value: "Frequent Customer Report",
    },
    {
      id: "CROSS_CUSTOMER",
      value: "Cross Customer Report",
    },
  ];

  const redirect = (url) => {
    navigate(url);
  };

  const hotelReducer = useSelector((state) => ({
    multipleCompanies: state.hotelReducer.multipleCompanies,
  }));

  const permission = useSelector((state) => state.hotelReducer.permission);

  const [customerReportData, setCustomerReportData] = useState({
    fromDate: new Date(),
    toDate: new Date(),
    filter: filterselection[0].id,
    companyIds: [],
  });

  useEffect(() => {
    const hasPermission = handlePermission(
      permission.CompanyPermission,
      Modules.REPORTS,
      ActionType.read
    );
    if (!hasPermission) {
      redirect("/Admin");
    }
  }, [permission]);

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
    const mappedCompany = hotelReducer.multipleCompanies.filter(
      (company) => company.isChecked === true && company.name !== "All"
    );
    setCustomerReportData({
      ...customerReportData,
      companyIds: mappedCompany,
    });
  }, [hotelReducer.multipleCompanies]);

  const handleChangeFilter = (event) => {
    const field = event.target.name;
    let commonData = { ...customerReportData };
    commonData[field] = event.target.value;
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

  return (
    <Fragment>
      <div className="user-groups" style={{ height: "calc(100vh - 280px)" }}>
        <h1 className="groups-header">Report</h1>
        <h1 className="groups-header-2nd">Customer Report</h1>

        <Box>
          <FormControl size="small" sx={{ width: "240px" }}>
            <InputLabel id="demo-simple-select-label">Filter</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={customerReportData.filter}
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
          </div>
        </Box>

        {customerReportData.filter === "FREQUENT_CUSTOMER" && (
          <div className="">
            <Frequent filterData={customerReportData} />
          </div>
        )}

        {customerReportData.filter === "CROSS_CUSTOMER" && (
          <div className="">
            <Cross filterData={customerReportData} />
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

export default connect(null, mapDispatchToProps)(CustomerReport);
