/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import Timeline from "react-calendar-timeline";
import { Card, TextField, Typography } from "@mui/material";
import { Box, Button } from "@mui/material";
import { ValidatorForm } from "react-material-ui-form-validator";
import { connect, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import _, { isEmpty } from "lodash";
import "react-calendar-timeline/lib/Timeline.css";
import {
  DesktopDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Stack } from "@mui/system";
import randomColor from "randomcolor";

import AddTimingPromo from "./Add";
import EditPromo from "./Edit";
import * as UserAction from "../../../../Action/AdminDashboard";
import "./style.scss";
import {
  ActionType,
  handlePermission,
  Modules,
} from "../../../../utils/userAccess";

let moment = require("moment-timezone");

const TimingPromo = (props) => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [promos, setPromos] = useState(null);
  const [selectedpromo, setSelectedPromo] = useState(null);
  const [groups, setGroups] = useState([]);
  const [coupons, setCoupons] = useState([]);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    coupons: state.hotelReducer.coupons,
    couponsTimeSlotDetails: state.hotelReducer.couponsTimeSlotDetails,
    permission: state.hotelReducer.permission,
  }));

  const [dateRange, setDateRange] = useState({
    fromDate: moment().startOf("day").toDate(),
    toDate: moment().endOf("day").add(5, "days").toDate(),
  });

  const [displayDateRange, setDisplayDateRange] = useState(null);

  useEffect(() => {
    handleResetTimmigPromo();
    if (hotelReducer.selectedOutlet) {
      let outletStartDate = moment().tz(
        hotelReducer.selectedOutlet.outlet.timezone
      );

      let outletEndDate = moment()
        .tz(hotelReducer.selectedOutlet.outlet.timezone)
        .endOf("day");

      props.actions.userAction.getPromo(
        {},
        hotelReducer.selectedOutlet.outlet.id
      );

      const search = {
        ...dateRange,
        fromDate: moment(outletStartDate).startOf("day").toDate(),
        toDate: outletEndDate.add(5, "days").toDate(),
      };

      setDateRange(search);
      setDisplayDateRange(search);
    }
  }, [hotelReducer.selectedOutlet]);

  const buildTimeSlots = () => {
    if (hotelReducer.couponsTimeSlotDetails) {
      const { openingTime, closingTime, timeSlotInterval } =
        hotelReducer.couponsTimeSlotDetails;

      if (openingTime && closingTime) {
        const startTime = openingTime.split(":");
        const endTime = closingTime.split(":");

        let outletStartDate = moment()
          .tz(hotelReducer.selectedOutlet.outlet.timezone)
          .set({
            hour: startTime[0],
            minute: startTime[1],
          });

        let outletEndDate = moment()
          .tz(hotelReducer.selectedOutlet.outlet.timezone)
          .set({ hour: endTime[0], minute: endTime[1] });

        const timeLineGroups = [];
        let index = 1;

        while (outletStartDate.isBefore(outletEndDate)) {
          timeLineGroups.push({
            id: index,
            title: outletStartDate.format("HH:mm"),
          });
          outletStartDate = outletStartDate.add(timeSlotInterval, "minutes");
          index++;
        }
        setGroups([...timeLineGroups]);
        return timeLineGroups;
      }
    }
  };

  useEffect(() => {
    const timezone = hotelReducer.selectedOutlet.outlet.timezone;
    const promosData = [];
    if (
      hotelReducer.coupons &&
      timezone &&
      displayDateRange &&
      hotelReducer.couponsTimeSlotDetails
    ) {
      const groups = buildTimeSlots(hotelReducer.couponsTimeSlotDetails);
      let startDateTime = moment(displayDateRange.fromDate);
      let endDateTime = moment(displayDateRange.toDate);
      while (startDateTime.isBefore(endDateTime)) {
        const currentDateEndDateTime = moment(startDateTime).endOf("day");
        const result = convertData(
          groups,
          hotelReducer.coupons,
          timezone,
          startDateTime,
          currentDateEndDateTime
        );
        result.map((singlePromo) => {
          promosData.push(singlePromo);
        });
        startDateTime.add(1, "days");
      }
      setPromos(promosData.flat(1));
      setCoupons(hotelReducer.coupons);
    }
  }, [hotelReducer.coupons, hotelReducer.couponsTimeSlotDetails]);

  const convertData = (
    groups,
    promos,
    timezone,
    startDateTime,
    currentDateEndDateTime
  ) => {
    const data = promos.map((promo) => {
      const start_time = moment(promo.startDate).tz(timezone);
      const end_time = moment(promo.endDate).tz(timezone);

      const openingTime = moment()
        .set({
          hour: moment(promo.openingTime, "HH:mm").format("HH"),
          minute: moment(promo.openingTime, "HH:mm").format("mm"),
        })
        .tz(timezone);

      const closingTime = moment()
        .set({
          hour: moment(promo.closingTime, "HH:mm").format("HH"),
          minute: moment(promo.closingTime, "HH:mm").format("mm"),
        })
        .tz(timezone);

      //check promo is available in between and check dayofweek
      const checkIscorrectData =
        startDateTime.isBetween(start_time, end_time, "days", "[]") &&
        promo.repeatOn.includes(startDateTime.format("dddd"));

      let findGroup = groups.filter((data) => {
        const timeSlotStartTime = moment()
          .set({
            hour: moment(data.title, "HH:mm").format("HH"),
            minute: moment(data.title, "HH:mm").format("mm"),
          })
          .tz(timezone);
        if (timeSlotStartTime.isBetween(openingTime, closingTime, null, "[)")) {
          return data;
        }
        return null;
      });

      findGroup = _.compact(findGroup);

      if (checkIscorrectData && findGroup.length > 0) {
        const filtterredData = findGroup.map((singleGroup) => {
          const returnData = {
            id: Math.random() * 10,
            dbId: promo.id,
            name: promo.name,
            tc: promo.tc,
            group: singleGroup.id,
            title: promo.name,
            start_time: startDateTime.toDate(),
            end_time: currentDateEndDateTime.toDate(),
            startDate: moment(promo.startDate).tz(timezone).format(),
            endDate: moment(promo.endDate).tz(timezone).format(),
            discountAmount: promo.discountAmount,
            noOfPerson: promo.noOfPerson,
            openingTime: openingTime.format(),
            closingTime: closingTime.format(),
            repeatOn: promo.repeatOn,
            isCampaignActive: promo.isCampaignActive,
          };
          return {
            ...returnData,
            canMove: false,
            itemProps: {
              onDoubleClick: () => {
                handleOpenEditTimingPromo(returnData);
              },
              style: {
                color: "black",
                background: randomColor({ luminosity: "light" }),
              },
            },
          };
        });
        return filtterredData;
      }
      return null;
    });
    return _.compact(data);
  };

  const searchPromo = () => {
    const search = {
      ...dateRange,
      fromDate: moment(dateRange.fromDate).startOf("day").format("DD-MM-YYYY"),
      toDate: moment(dateRange.toDate).endOf("day").format("DD-MM-YYYY"),
    };
    setDisplayDateRange(dateRange);
    props.actions.userAction.getPromo(
      search,
      hotelReducer.selectedOutlet.outlet.id
    );
  };

  const handleSaveTimingPromo = (data) => {
    const addNewPromo = {
      ...data,
      name: `${data.discountAmount} % off on Total bill`,
      startDate: moment(data.startDate).format("DD-MM-YYYY"),
      endDate: moment(data.endDate).format("DD-MM-YYYY"),
      openingTime: moment(data.openingTime).format("HH:mm"),
      closingTime: moment(data.closingTime).format("HH:mm"),
    };
    props.actions.userAction.addPromo(
      addNewPromo,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleResetTimmigPromo = () => {
    if (hotelReducer.selectedOutlet) {
      let outletStartDate = moment().tz(
        hotelReducer.selectedOutlet.outlet.timezone
      );

      let outletEndDate = moment()
        .tz(hotelReducer.selectedOutlet.outlet.timezone)
        .endOf("day");

      props.actions.userAction.getPromo(
        {},
        hotelReducer.selectedOutlet.outlet.id
      );

      const search = {
        ...dateRange,
        fromDate: moment(outletStartDate).startOf("day").toDate(),
        toDate: outletEndDate.add(5, "days").toDate(),
      };

      setDateRange(search);
      setDisplayDateRange(search);
    }
  };

  const handleEditSaveTimingPromo = (data, couponId) => {
    const editNewPromo = {
      ...data,
      name: `${data.discountAmount} % off on Total bill`,
      startDate: moment(data.startDate).format("DD-MM-YYYY"),
      endDate: moment(data.endDate).format("DD-MM-YYYY"),
      openingTime: moment(data.openingTime).format("HH:mm"),
      closingTime: moment(data.closingTime).format("HH:mm"),
    };
    props.actions.userAction.editPromo(
      editNewPromo,
      couponId,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleOpenCoupon = () => {
    setOpen(true);
  };

  const handleCloseTimingPromo = () => {
    setOpen(false);
  };

  const handleEditCloseTimingPromo = () => {
    setEditOpen(false);
  };

  const handleOpenEditTimingPromo = (data, isCheck = false) => {
    let promoData = data;
    if (isCheck) {
      const timezone = hotelReducer.selectedOutlet.outlet.timezone;
      const openingTime = moment()
        .set({
          hour: moment(data.openingTime, "HH:mm").format("HH"),
          minute: moment(data.openingTime, "HH:mm").format("mm"),
        })
        .tz(timezone);

      const closingTime = moment()
        .set({
          hour: moment(data.closingTime, "HH:mm").format("HH"),
          minute: moment(data.closingTime, "HH:mm").format("mm"),
        })
        .tz(timezone);
      promoData = {
        id: Math.random() * 10,
        dbId: data.id,
        name: data.name,
        tc: data.tc,
        title: data.name,
        startDate: moment(data.startDate).tz(timezone).format(),
        endDate: moment(data.endDate).tz(timezone).format(),
        discountAmount: data.discountAmount,
        noOfPerson: data.noOfPerson,
        openingTime: openingTime.format(),
        closingTime: closingTime.format(),
        repeatOn: data.repeatOn,
        isCampaignActive: data.isCampaignActive,
      };
    }
    setSelectedPromo(promoData);
    setEditOpen(true);
  };

  return (
    <React.Fragment>
      {displayDateRange && (
        <React.Fragment>
          {open && (
            <AddTimingPromo
              open={open}
              handleCloseTimingPromo={handleCloseTimingPromo}
              handleSaveTimingPromo={handleSaveTimingPromo}
              timezone={hotelReducer.selectedOutlet.outlet.timezone}
            />
          )}

          {editOpen && (
            <EditPromo
              open={editOpen}
              selectedpromo={selectedpromo}
              handleEditCloseTimingPromo={handleEditCloseTimingPromo}
              handleEditSaveTimingPromo={handleEditSaveTimingPromo}
              timezone={hotelReducer.selectedOutlet.outlet.timezone}
            />
          )}

          <Box
            className="user-groups"
            style={{ height: "calc(100vh - 275px)" }}
          >
            <div className="user-groups-search">
              <Box className="filter-data">
                <div className="popup-input-box w-50 date-picker">
                  <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
                    <Stack sx={{ width: "160px" }}>
                      <DesktopDatePicker
                        value={dateRange.fromDate}
                        onChange={(newValue) => {
                          setDateRange({
                            ...dateRange,
                            fromDate: new Date(newValue),
                          });
                        }}
                        inputFormat="DD-MM-YYYY"
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Stack>
                  </LocalizationProvider>
                </div>
                <Typography className="search-bar-to">To</Typography>
                <div className="popup-input-box w-50 date-picker">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack sx={{ width: "160px" }}>
                      <DesktopDatePicker
                        minDate={dateRange.fromDate}
                        value={dateRange.toDate}
                        onChange={(newValue) => {
                          setDateRange({
                            ...dateRange,
                            toDate: new Date(newValue),
                          });
                        }}
                        inputFormat="DD-MM-YYYY"
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Stack>
                  </LocalizationProvider>
                </div>
                <div className="primary-btn">
                  <Button
                    disabled={dateRange.fromDate > dateRange.toDate}
                    variant="contained"
                    onClick={searchPromo}
                  >
                    search
                  </Button>
                </div>
              </Box>
              <div className="primary-btn">
                <Button variant="contained" onClick={handleResetTimmigPromo}>
                  <RestartAltOutlinedIcon /> RESET
                </Button>
                <Button
                  disabled={handlePermission(
                    hotelReducer.permission.permission,
                    Modules.TIMINGPROMO,
                    ActionType.create,
                    true
                  )}
                  type="submit"
                  variant="outlined"
                  onClick={handleOpenCoupon}
                >
                  <AddOutlinedIcon />
                  Add
                </Button>
              </div>
            </div>

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  width: "100vw",
                  maxWidth: "calc(100vw - 875px)",
                  margin: "0 auto",
                }}
              >
                <div className="time-lines">
                  {(!isEmpty(promos) || Array.isArray(promos)) && (
                    <Timeline
                      className="time-line-inner"
                      groups={groups}
                      items={promos}
                      visibleTimeStart={Math.floor(
                        displayDateRange.fromDate.getTime()
                      )}
                      visibleTimeEnd={Math.floor(
                        displayDateRange.toDate.getTime()
                      )}
                      lineHeight={50}
                      minZoom={
                        displayDateRange.toDate - displayDateRange.fromDate
                      }
                      maxZoom={
                        displayDateRange.toDate - displayDateRange.fromDate
                      }
                    ></Timeline>
                  )}
                </div>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  width: "100vw",
                  maxWidth: "417px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingLeft: "50px",
                  }}
                >
                  <Box
                    sx={{
                      overflow: "auto",
                      height: "calc(100vh - 409px)",
                      width: "100%",
                      gap: "10px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {coupons?.map((promo, index) => (
                      <Card
                        sx={{
                          cursor: "pointer",
                          width: "100%",
                          padding: "5px",
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          minHeight: "60px",
                        }}
                        key={index}
                        onClick={() => handleOpenEditTimingPromo(promo, true)}
                      >
                        <div>
                          <span className="discount">
                            {promo.discountAmount}% Off Total Bill
                          </span>
                          <span className="seats">
                            {promo.startDate
                              ? moment(promo.startDate)
                                  .tz(
                                    hotelReducer.selectedOutlet.outlet.timezone
                                  )
                                  .format("DD-MMMM-YYYY")
                              : "N/A"}
                          </span>

                          <span className="seats">
                            {promo.openingTime
                              ? moment(promo.openingTime, "HH:mm")
                                  .tz(
                                    hotelReducer.selectedOutlet.outlet.timezone
                                  )
                                  .format("hh:mm A")
                              : "N/A"}
                            {"  - "}
                            {promo.closingTime
                              ? moment(promo.closingTime, "HH:mm")
                                  .tz(
                                    hotelReducer.selectedOutlet.outlet.timezone
                                  )
                                  .format("hh:mm A")
                              : "N/A"}
                          </span>
                        </div>
                        <span className="discount">
                          {promo.noOfPerson} Seats
                        </span>
                      </Card>
                    ))}
                  </Box>
                  <ValidatorForm
                    autoComplete="off"
                    className="timelineAmount "
                  ></ValidatorForm>
                </Box>
              </Box>
            </Box>
          </Box>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(TimingPromo);
