/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
} from "@mui/material";
import PercentIcon from "@mui/icons-material/Percent";
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import { isEmpty } from "lodash";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ENVIRONMENT_VARIABLES from "../../../environment.config";
import "./style.scss";

let moment = require("moment-timezone");

const ReservationStep_3 = (props) => {
  const [preferredTimeslot, setPreferredTimeslot] = useState(null);
  const [otherOutletTimeslot, setOtherOutletTimeslot] = useState([]);
  const [otherDefaultOutletTimeslot, setOtherDefaultOutletTimeslot] =
    useState(null);
  const [futureDates, setFutureDates] = useState([]);
  const [isVisibleOtherDates, setIsVisibleOtherDates] = useState(false);
  const [isVisibleTimeslot, setIsVisibleTimeslot] = useState(false);
  const [isVisibleOtherOutletTimeslot, setIsVisibleOtherOutletTimeslot] =
    useState(false);
  const [exactTime, setExactTime] = useState(null);
  const [selectedTimeslotOutletId, setSelectedTimeslotOutletId] =
    useState(null);

  useEffect(() => {
    const filterFutureDates = [];
    if (props.reservationTimeSlot && props.customerReservationData) {
      const preferredTime =
        props.reservationTimeSlot?.selectedOutlet.tradingHours[0].timeSlots.find(
          (timeslot) => timeslot === props.customerReservationData.exactTime
        );
      if (preferredTime) {
        setExactTime(preferredTime);
      } else {
        setExactTime("");
      }
      setSelectedTimeslotOutletId(props.customerReservationData.outletId);
      setPreferredTimeslot(props.reservationTimeSlot?.selectedOutlet);
      if (props.reservationTimeSlot?.otherOutlets?.length > 0) {
        setOtherOutletTimeslot(props.reservationTimeSlot.otherOutlets);
        const findOtherSelectedOutlet =
          props.reservationTimeSlot.otherOutlets.find(
            (otherOutlet) =>
              otherOutlet.id === props.customerReservationData.outletId
          );
        if (findOtherSelectedOutlet)
          setOtherDefaultOutletTimeslot(findOtherSelectedOutlet);
        else
          setOtherDefaultOutletTimeslot(
            props.reservationTimeSlot?.otherOutlets[0]
          );
      }
      props.reservationTimeSlot?.selectedOutlet?.finalFutureTradingHours.map(
        (futureDates) => filterFutureDates.push(futureDates.date)
      );
      if (filterFutureDates.length > 0) {
        setFutureDates(filterFutureDates);
      }
    }
  }, [props.reservationTimeSlot, props.customerReservationData]);

  const handleSelectOtherDate = (date) => {
    props.handleChange({
      target: {
        name: "date",
        value: date,
      },
    });
    const data = {
      ...props.customerReservationData,
      date: date,
    };
    props.getReservationTimeSlot(data);
    setIsVisibleOtherDates(false);
    setIsVisibleTimeslot(false);
    setIsVisibleOtherOutletTimeslot(false);
  };

  const handleChange = (event) => {
    setOtherDefaultOutletTimeslot(
      otherOutletTimeslot.find((timeslot) => timeslot.id === event.target.value)
    );
  };

  const handleConfirm = () => {
    props.handleChange({
      target: {
        name: "exactTime",
        value: `${exactTime}`,
        externalName: "outletId",
        externalValue: selectedTimeslotOutletId,
      },
    });
    props.handleComplete();
  };

  const selectTimeSlot = (outlet, timeSlot) => {
    let data = null;
    if (outlet?.discountTimeSlot.length > 0) {
      data = outlet?.discountTimeSlot.find(
        (discount) => discount.timeSlot === timeSlot
      );
    }

    return (
      <span className="time-inner">
        {data && (
          <div className="discount-chip">
            {data.coupon[0].name} <PercentIcon />
          </div>
        )}
        {timeSlot}
      </span>
    );
  };

  const handleAccordion = (accordionType, value) => {
    if (accordionType === "timeSlot") {
      if (value) {
        setIsVisibleTimeslot(false);
      } else {
        setIsVisibleTimeslot(true);
        setIsVisibleOtherOutletTimeslot(false);
        setIsVisibleOtherDates(false);
      }
    } else if (accordionType === "otherTimeSlot") {
      if (value) {
        setIsVisibleOtherOutletTimeslot(false);
      } else {
        setIsVisibleOtherOutletTimeslot(true);
        setIsVisibleTimeslot(false);
        setIsVisibleOtherDates(false);
      }
    } else if (accordionType === "otherDates") {
      if (value) {
        setIsVisibleOtherDates(false);
        setIsVisibleTimeslot(false);
      } else {
        setIsVisibleTimeslot(false);
        setIsVisibleOtherOutletTimeslot(false);
        setIsVisibleOtherDates(true);
      }
    }
  };

  return (
    <React.Fragment>
      {/* <div className="stepper-two"> */}
      <React.Fragment>
        {preferredTimeslot && (
          <div className="stepper-three">
            <div className="stepper-three-left">
              <h1 className="stepper-header-text">Select Time</h1>
              <Accordion
                sx={{ boxShadow: "unset" }}
                expanded={isVisibleTimeslot}
                onChange={() => handleAccordion("timeSlot", isVisibleTimeslot)}
              >
                <AccordionSummary
                  expandIcon={<GridExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  className="time-header-div"
                >
                  Select a time
                </AccordionSummary>
                {preferredTimeslot.isValidTableRequest ? (
                  <AccordionDetails>
                    {preferredTimeslot.tradingHours[0].timeSlots.length > 0 ? (
                      <div className="times">
                        {preferredTimeslot.tradingHours[0].timeSlots.map(
                          (timeSlot, index) => (
                            <div
                              key={index}
                              className={`${
                                exactTime === timeSlot &&
                                preferredTimeslot.id ===
                                  selectedTimeslotOutletId
                                  ? "time selected"
                                  : "time"
                              }`}
                              onClick={() => {
                                setExactTime(timeSlot);
                                setSelectedTimeslotOutletId(
                                  preferredTimeslot.id
                                );
                              }}
                            >
                              {selectTimeSlot(preferredTimeslot, timeSlot)}
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="warning">Close</div>
                    )}
                  </AccordionDetails>
                ) : (
                  <div className="warning">
                    Currently! we dont have
                    {props.customerReservationData.noOfPerson} Pax Capacity
                    table.
                  </div>
                )}
              </Accordion>
              {otherDefaultOutletTimeslot && (
                <Accordion
                  sx={{ boxShadow: "unset" }}
                  expanded={isVisibleOtherOutletTimeslot}
                  onChange={() =>
                    handleAccordion(
                      "otherTimeSlot",
                      isVisibleOtherOutletTimeslot
                    )
                  }
                >
                  <AccordionSummary
                    expandIcon={<GridExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className="time-header-div"
                  >
                    Availability at our other locations
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormControl sx={{ width: "100%", marginBottom: "20px" }}>
                      <label class="input">
                        <select
                          size="small"
                          label="Location"
                          labelId="location"
                          value={otherDefaultOutletTimeslot.id}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          onChange={handleChange}
                          className="input__field"
                        >
                          
                          {otherOutletTimeslot.map((outletTimeslot, index) => (
                            <option key={index} value={outletTimeslot.id}>
                              {outletTimeslot.name}
                            </option>
                          ))}
                        </select>
                        <span class="input__label">Location</span>
                      </label>
                    </FormControl>
                    {otherDefaultOutletTimeslot.isValidTableRequest ? (
                      otherDefaultOutletTimeslot.tradingHours[0]?.timeSlots
                        .length > 0 ? (
                        <div className="times">
                          {otherDefaultOutletTimeslot &&
                            otherDefaultOutletTimeslot?.tradingHours[0]?.timeSlots.map(
                              (timeSlot, index) => (
                                <div
                                  key={index}
                                  className={`${
                                    exactTime === timeSlot &&
                                    otherDefaultOutletTimeslot.id ===
                                      selectedTimeslotOutletId
                                      ? "time selected"
                                      : "time"
                                  }`}
                                  onClick={() => {
                                    setExactTime(timeSlot);
                                    setSelectedTimeslotOutletId(
                                      otherDefaultOutletTimeslot.id
                                    );
                                  }}
                                >
                                  {selectTimeSlot(
                                    otherDefaultOutletTimeslot,
                                    timeSlot
                                  )}
                                </div>
                              )
                            )}
                        </div>
                      ) : (
                        <div className="warning">Close</div>
                      )
                    ) : (
                      <div className="warning">
                        Currently! we dont have
                        {props.customerReservationData.noOfPerson} Pax Capacity
                        table.
                      </div>
                    )}
                  </AccordionDetails>
                </Accordion>
              )}
              <Accordion
                sx={{ boxShadow: "unset" }}
                expanded={isVisibleOtherDates}
                onChange={() =>
                  handleAccordion("otherDates", isVisibleOtherDates)
                }
              >
                <AccordionSummary
                  expandIcon={<GridExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  className="time-header-div"
                >
                  Other dates with availability
                </AccordionSummary>
                <AccordionDetails>
                  {futureDates.length > 0 ? (
                    <div className="times-other">
                      {futureDates.map((date, index) => (
                        <div
                          key={index}
                          className="time"
                          onClick={() => {
                            handleSelectOtherDate(date);
                          }}
                        >
                          <span className="time-inner">
                            {moment(date).format("DD-MMM-YYYY")}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="warning">Close</div>
                  )}
                </AccordionDetails>
              </Accordion>
            </div>

            <div className="right-side">
              <div className="right-side-inner">
                <span className="restaurant-text">Selected Restaurant</span>

                <Accordion
                  className="accordion-div expandedtrue"
                  defaultExpanded
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4bh-content"
                    id="panel4bh-header"
                    className="accordion-summary"
                  >
                    {/* <span
                        style={{ width: "33%", flexShrink: 0 }}
                        className="restaurant-text"
                      >
                        View Details
                      </span> */}

                    <div className="restaurant-card">
                      <img
                        src={`${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${props.selectedOutlet.image}`}
                        alt="imgs"
                      />
                      <div className="restaurant-card-inner">
                        <span className="card-name">
                          Restaurant Reservation
                        </span>
                        <span className="card-pax">
                          <PeopleAltIcon />
                          <span>
                            {props.company.minPax ? props.company.minPax : 0}-
                            {props.company.maxPax ? props.company.maxPax : 0}{" "}
                            pax
                          </span>
                        </span>
                      </div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      padding: "0",
                    }}
                  >
                    <div className="restaurant-info">
                      <span className="restaurant-text-inner">Date</span>
                      <span className="restaurant-text-inner">
                        {moment(
                          props.customerReservationData.date,
                          "YYYY-MM-DD HH:mm"
                        ).format("DD-MM-YYYY")}
                      </span>
                    </div>

                    <div className="restaurant-info">
                      <span className="restaurant-text-inner">
                        No. of Guest
                      </span>
                      <span className="restaurant-text-inner">
                        {props.customerReservationData.noOfPerson}
                      </span>
                    </div>
                    <div className="restaurant-info">
                      <span className="restaurant-text-inner">
                        Operating Time
                      </span>
                      <span className="restaurant-text-inner"></span>
                    </div>

                    <div className="operating-time">
                      {preferredTimeslot.tradingHours.length === 0 ? (
                        <div className="warning">Close</div>
                      ) : (
                        <div className="restaurant-info">
                          {preferredTimeslot?.tradingHours.length > 0 &&
                            preferredTimeslot?.tradingHours.map(
                              (tradingHour, index) => (
                                <span
                                  className="restaurant-text-inner time-text-color"
                                  key={index}
                                >
                                  {tradingHour.dayofweek}
                                </span>
                              )
                            )}
                          <div className="restaurant-text-inner time-text-color">
                            {preferredTimeslot.tradingHours.length > 0 &&
                              preferredTimeslot?.tradingHours.map(
                                (tradingHour) =>
                                  tradingHour.timePeriods.map(
                                    (timePeriod, index) => (
                                      <span className="time-text" key={index}>
                                        {timePeriod.openingTime}-
                                        {timePeriod.closingTime}
                                      </span>
                                    )
                                  )
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionDetails>
                </Accordion>

                <Accordion className="accordion-div expandedfalse">
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4bh-content"
                    id="panel4bh-header"
                    className="accordion-summary"
                  >
                    {/* <span
                        style={{ width: "33%", flexShrink: 0 }}
                        className="restaurant-text"
                      >
                        View Details
                      </span> */}

                    <div className="restaurant-card">
                      <img
                        src={`${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${props.selectedOutlet.image}`}
                        alt="imgs"
                      />
                      <div className="restaurant-card-inner">
                        <span className="card-name">
                          Restaurant Reservation
                        </span>
                        <span className="card-pax">
                          <PeopleAltIcon />
                          <span>
                            {props.company.minPax ? props.company.minPax : 0}-
                            {props.company.maxPax ? props.company.maxPax : 0}{" "}
                            pax
                          </span>
                        </span>
                      </div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      padding: "0",
                    }}
                  >
                    <div className="restaurant-info">
                      <span className="restaurant-text-inner">Date</span>
                      <span className="restaurant-text-inner">
                        {moment(
                          props.customerReservationData.date,
                          "YYYY-MM-DD HH:mm"
                        ).format("DD-MM-YYYY")}
                      </span>
                    </div>

                    <div className="restaurant-info">
                      <span className="restaurant-text-inner">
                        No. of Guest
                      </span>
                      <span className="restaurant-text-inner">
                        {props.customerReservationData.noOfPerson}
                      </span>
                    </div>
                    <div className="restaurant-info">
                      <span className="restaurant-text-inner">
                        Operating Time
                      </span>
                      <span className="restaurant-text-inner"></span>
                    </div>

                    <div className="operating-time">
                      {preferredTimeslot.tradingHours.length === 0 ? (
                        <div className="warning">Close</div>
                      ) : (
                        <div className="restaurant-info">
                          {preferredTimeslot?.tradingHours.length > 0 &&
                            preferredTimeslot?.tradingHours.map(
                              (tradingHour, index) => (
                                <span
                                  className="restaurant-text-inner time-text-color"
                                  key={index}
                                >
                                  {tradingHour.dayofweek}
                                </span>
                              )
                            )}
                          <div className="restaurant-text-inner time-text-color">
                            {preferredTimeslot.tradingHours.length > 0 &&
                              preferredTimeslot?.tradingHours.map(
                                (tradingHour) =>
                                  tradingHour.timePeriods.map(
                                    (timePeriod, index) => (
                                      <span className="time-text" key={index}>
                                        {timePeriod.openingTime}-
                                        {timePeriod.closingTime}
                                      </span>
                                    )
                                  )
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>

              <Box className="footer-btn">
                <Button
                  variant="contained"
                  className="inner-btn"
                  color="inherit"
                  disabled={props.activeStep === 0}
                  onClick={props.handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                {/* <Box sx={{ flex: "1 1 auto" }} /> */}
                <Button
                  variant="contained"
                  disabled={isEmpty(exactTime)}
                  onClick={handleConfirm}
                  sx={{ mr: 1 }}
                >
                  CONFIRM
                </Button>
              </Box>
            </div>
          </div>
        )}
      </React.Fragment>
      {/* </div> */}
    </React.Fragment>
  );
};
export default ReservationStep_3;
