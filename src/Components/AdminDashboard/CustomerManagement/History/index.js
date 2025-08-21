/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  DialogContent,
} from "@mui/material";
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ImportContactsTwoToneIcon from "@mui/icons-material/ImportContactsTwoTone";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import moment from "moment-timezone";
import { ValidatorForm } from "react-material-ui-form-validator";

import ENVIRONMENT_VARIABLES from "../../../../environment.config";
import * as UserAction from "../../../../Action/AdminDashboard";
import { PreorderItems } from "../Reservation/PreorderItems";
import { DiningOptions } from "../Reservation/DiningOptions";
import { RESET_CUSTOMER_RESERVATION } from "../../../../utils/AdminDashboard/Constant";
import "./style.scss";

const History = (props) => {
  const dispatch = useDispatch();

  const customerReservationData = useSelector(
    (state) => state.hotelReducer.customerReservationData
  );

  useEffect(() => {
    if (props.customer.id) {
      props.actions.userAction.getCustomerReservation(
        { filter: "PAST" },
        props.customer.Outlet.id,
        props.customer.id
      );
      props.actions.userAction.getTagsByOutletCategory(
        ENVIRONMENT_VARIABLES.Base_PROFILE_TAGS,
        props.customer.Outlet.id
      );
      dispatch({
        type: RESET_CUSTOMER_RESERVATION,
      });
    }
  }, [props.customer.id]);

  return (
    <div>
      {customerReservationData !== null &&
        customerReservationData?.Customer?.OutletInvoice?.map(
          (invoice, index) => (
            <Accordion sx={{ width: "100%" }} key={index}>
              <AccordionSummary
                expandIcon={<GridExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className="header"
              >
                <div className="header-chip">
                  <Button variant="contained" className="status-btn">
                    {invoice.status}
                  </Button>
                </div>
                <div className="header-chip">
                  <HomeOutlinedIcon />
                  {customerReservationData?.Customer.Outlet.name}
                </div>
                <div className="header-chip">
                  <ImportContactsTwoToneIcon />
                  {invoice.bookingType}
                </div>
                <div className="header-chip">
                  <CalendarTodayOutlinedIcon />
                  {moment(invoice.bookingDate).format("DD MMMM YYYY")}
                </div>
                <div className="header-chip">
                  <AccessTimeOutlinedIcon />
                  {moment(invoice.bookingStartTime)
                    .tz(customerReservationData?.Customer.Outlet.timezone)
                    .format("HH:mm")}
                  -
                  {moment(invoice.bookingEndTime)
                    .tz(customerReservationData?.Customer.Outlet.timezone)
                    .format("HH:mm")}
                </div>
                <div className="header-chip">
                  <PeopleAltOutlinedIcon />
                  {invoice.noOfPerson}
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <ValidatorForm>
                  <DialogContent className="popup-body">
                    <div className="history-main">
                      <div className="history-card">
                        <div className="">
                          <span className="history-card-text">
                            {customerReservationData?.Customer.Outlet.name}
                          </span>
                          <div className="history-card-text">
                            {invoice.bookingType}
                          </div>
                          <div className="history-card-text">
                            {invoice?.OutletTableBooking.map((data, index) => (
                              <span key={index}> {data.OutletTable?.name}</span>
                            ))}
                          </div>
                        </div>

                        <div className="history-card-text">
                          Booked By : {props.customer.name}
                          {props.customer.lastName}
                        </div>

                        <div>
                          <div className="history-card-text">
                            pax ({invoice?.noOfPerson})
                          </div>
                        </div>
                      </div>
                      <div className="history-msg-text">
                        {invoice.specialRequest}
                      </div>
                      <div className="history-msg-text">
                        {invoice.reservationNotes}
                      </div>
                      <div className="history-btn">
                        {customerReservationData.Customer.tags &&
                          customerReservationData.Customer.tags.map(
                            (tag, index) => (
                              <Button
                                key={index}
                                variant="contained"
                                className="history-button"
                              >
                                {tag.name}
                              </Button>
                            )
                          )}
                      </div>
                      {invoice.basket.length > 0 && (
                        <PreorderItems basket={invoice.basket} />
                      )}
                      {invoice.dinningOptions.length > 0 && (
                        <DiningOptions
                          dinningOptions={invoice.dinningOptions}
                        />
                      )}
                    </div>
                  </DialogContent>
                </ValidatorForm>
              </AccordionDetails>
            </Accordion>
          )
        )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(History);
