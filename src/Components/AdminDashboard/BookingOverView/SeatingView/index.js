/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Stack,
} from "@mui/material";
import { connect, useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box } from "@mui/system";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";

import InvoiceList from "./InvoiceList";
import FloorPlan from "../../../../CommonComponent/FloorPlan";
import * as UserAction from "../../../../Action/AdminDashboard";
import {
  RESET_INVOICE,
  RESET_SEATING_VIEW_TABLES,
} from "../../../../utils/AdminDashboard/Constant";
import {
  ActionType,
  Modules,
  handlePermission,
} from "../../../../utils/userAccess";
import "./style.scss";

const SeatingView = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mealTypes, setMealTypes] = useState([]);
  const [seatingViewData, setSeatingViewData] = useState([]);
  const [filterData, setFilterData] = useState({
    date: props.date,
    mealType: "All",
    outletSeatingTypeId: "",
  });
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [outletSeatingType, setOutletSeatingType] = useState([]);

  const seatingView = useSelector((state) => state.hotelReducer.seatingView);
  const selectedOutlet = useSelector(
    (state) => state.hotelReducer.selectedOutlet
  );
  const mealType = useSelector((state) => state.hotelReducer.mealTypes);
  const outletSeatingInfo = useSelector(
    (state) => state.hotelReducer.outletSeatingInfo
  );
  const invoiceDetails = useSelector(
    (state) => state.hotelReducer.invoiceDetails
  );
  const permission = useSelector((state) => state.hotelReducer.permission);

  const redirect = (url) => {
    navigate(url);
  };

  useEffect(() => {
    if (selectedOutlet) {
      props.actions.userAction.getOutletSeatingInfo(selectedOutlet.outlet.id);
      props.actions.userAction.getMealTypes(selectedOutlet.outlet.id);
    }
    return () => {
      dispatch({ type: RESET_SEATING_VIEW_TABLES });
      dispatch({ type: RESET_INVOICE });
    };
  }, [selectedOutlet]);

  useEffect(() => {
    if (
      props.date &&
      outletSeatingInfo &&
      outletSeatingInfo.OutletSeatingType.length > 0
    ) {
      const innerFilterData = {
        ...filterData,
        date: props.date,
        mealType: "All",
        outletSeatingTypeId: outletSeatingInfo?.OutletSeatingType[0]?.id,
      };
      if (outletSeatingInfo) {
        props.actions.userAction.getSeatingView(
          selectedOutlet.outlet.id,
          innerFilterData
        );
        props.actions.userAction.getAllInvoiceDetails(
          selectedOutlet.outlet.id,
          null,
          true
        );
      }
      setFilterData(innerFilterData);
    }
  }, [props.date]);

  useEffect(() => {
    if (outletSeatingInfo && outletSeatingInfo.OutletSeatingType.length > 0) {
      const filterOutletSeatType = outletSeatingInfo.OutletSeatingType.filter(
        (seatType) => seatType.SeatingType.name !== "Private Room"
      );
      const innerFilterData = {
        ...filterData,
        outletSeatingTypeId: outletSeatingInfo?.OutletSeatingType[0]?.id,
      };

      props.actions.userAction.getSeatingView(
        selectedOutlet.outlet.id,
        innerFilterData
      );
      props.actions.userAction.getTableMerge(
        innerFilterData.outletSeatingTypeId
      );
      setOutletSeatingType(filterOutletSeatType);
      setFilterData({ ...innerFilterData });
    } else {
      setOutletSeatingType([]);
    }
  }, [outletSeatingInfo]);

  useEffect(() => {
    if (seatingView && selectedOutlet) {
      renderMinutes(seatingView);
      const interval = setInterval(() => {
        renderMinutes(seatingView);
      }, 30000);

      const invoicePayload = {
        mealType: filterData.mealType,
        status: "ALL",
        date: filterData.date,
      };
      props.actions.userAction.getAllInvoiceDetails(
        selectedOutlet.outlet.id,
        invoicePayload,
        true
      );
      return () => clearInterval(interval);
    }
  }, [seatingView]);

  useEffect(() => {
    setMealTypes([...mealType, { name: "All" }]);
  }, [mealType]);

  const renderMinutes = (seatingViewData) => {
    const seatingTempData = seatingViewData.map((seatingTable) => {
      if (seatingTable?.OutletTableBooking[0]?.status === "SEATED") {
        const seatedTime = moment(
          seatingTable?.OutletTableBooking[0]?.seatStartTime
        );
        const currentTime = moment();
        const minutes = currentTime.diff(seatedTime, "minutes");
        if (minutes >= 0) {
          let minuteTemp = parseInt(minutes);
          if (minuteTemp < 10) {
            minuteTemp = "0" + minuteTemp;
          }
          seatingTable.timeSpent = minuteTemp;
        }
      }
      return seatingTable;
    });
    setSeatingViewData([...seatingTempData]);
  };

  const setInvoiceData = (invoice) => {
    if (selectedInvoice && invoice && selectedInvoice.id === invoice.id) {
      setSelectedInvoice(null);
    } else {
      setSelectedInvoice(invoice);
    }
  };

  const handleChangeDate = (date) => {
    const data = {
      ...filterData,
      mealType: "All",
      date: date,
    };

    const invoicePayload = {
      mealType: "All",
      status: "ALL",
      date,
    };

    setFilterData({
      ...data,
    });
    props.actions.userAction.getSeatingView(selectedOutlet.outlet.id, data);
    props.actions.userAction.getAllInvoiceDetails(
      selectedOutlet.outlet.id,
      invoicePayload,
      true
    );
    props.actions.userAction.getTableMerge(data.outletSeatingTypeId);
  };

  const handleChangeMealType = (event) => {
    const data = {
      ...filterData,
      mealType: event.target.value,
    };
    const invoicePayload = {
      mealType: event.target.value,
      status: "ALL",
      date: filterData.date,
    };
    props.actions.userAction.getSeatingView(selectedOutlet.outlet.id, data);
    props.actions.userAction.getAllInvoiceDetails(
      selectedOutlet.outlet.id,
      invoicePayload,
      true
    );
    props.actions.userAction.getTableMerge(data.outletSeatingTypeId);
    setFilterData({
      ...data,
    });
  };

  const handleChangeSpaceType = (event) => {
    const data = {
      ...filterData,
      outletSeatingTypeId: event.target.value,
    };
    props.actions.userAction.getSeatingView(selectedOutlet.outlet.id, data);
    props.actions.userAction.getTableMerge(data.outletSeatingTypeId);
    setFilterData({
      ...data,
    });
  };

  return (
    <Fragment>
      {outletSeatingInfo && outletSeatingInfo.OutletSeatingType.length > 0 && (
        <div className="user-groups" style={{ height: "calc(100vh - 320px)" }}>
          <div className="user-groups-search">
            <div className="filter-data">
              {!props.date && (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack sx={{ width: "160px" }} className="date-picker">
                    <DesktopDatePicker
                      value={filterData.date}
                      onChange={(newValue) => {
                        handleChangeDate(new Date(newValue));
                      }}
                      inputFormat="DD-MM-YYYY"
                      renderInput={(params) => <TextField {...params} />}
                      label="Date"
                    />
                  </Stack>
                </LocalizationProvider>
              )}

              <FormControl size="small" sx={{ width: "160px" }}>
                <InputLabel id="mealType">MealType</InputLabel>
                <Select
                  labelId="mealType"
                  id="mealType"
                  value={filterData.mealType}
                  name="mealType"
                  label="Meal Type"
                  inputProps={{ "aria-label": "Without label" }}
                  onChange={handleChangeMealType}
                >
                  {mealTypes.map((mealType, index) => (
                    <MenuItem key={index} value={mealType.name}>
                      {mealType.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {outletSeatingType && (
                <FormControl size="small" sx={{ width: "160px" }}>
                  <InputLabel id="spaceType">Space Type</InputLabel>
                  <Select
                    labelId="spaceType"
                    id="spaceType"
                    value={filterData.outletSeatingTypeId}
                    name="outletSeatingTypeId"
                    label="Space Type"
                    inputProps={{ "aria-label": "Without label" }}
                    onChange={handleChangeSpaceType}
                  >
                    {outletSeatingType.map((seatingType, index) => (
                      <MenuItem key={index} value={seatingType.id}>
                        {seatingType?.SeatingType?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </div>
          </div>

          <Box
            className={props.drawerOpen ? "open-sidebar" : ""}
            sx={{
              display: "flex",
              gap: "30px",
              width: "100%",

              minHeight: "630px",
            }}
          >
            <InvoiceList
              invoiceDetails={[...invoiceDetails]}
              selectedInvoice={selectedInvoice}
              setInvoiceData={setInvoiceData}
            />

            <div className="floor-plan-main">
              <div className="floor-plan">
                <FloorPlan
                  filterData={filterData}
                  seatingViewData={seatingViewData}
                  selectedInvoice={selectedInvoice}
                  setInvoiceData={setInvoiceData}
                  hasCreatePermission={
                    props.hasCreatePermission === undefined
                      ? handlePermission(
                          permission.permission,
                          Modules.RESERVATIONMANAGEMENT,
                          ActionType.create,
                          true
                        )
                      : false
                  }
                  hasUpdatePermission={
                    props.hasUpdatePermission === undefined
                      ? handlePermission(
                          permission.permission,
                          Modules.RESERVATIONMANAGEMENT,
                          ActionType.update,
                          true
                        )
                      : false
                  }
                />
              </div>
            </div>
          </Box>
        </div>
      )}
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(SeatingView);
