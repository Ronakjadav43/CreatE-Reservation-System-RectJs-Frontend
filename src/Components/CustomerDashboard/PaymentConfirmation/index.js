import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "./Loader";
import { ReactSVG } from "react-svg";
import { Button, Card, Dialog } from "@mui/material";
import moment from "moment-timezone";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import PeopleIcon from "@mui/icons-material/People";
import "./style.scss";

import { bindActionCreators } from "redux";
import * as CustomerAction from "../../../Action/Customer";

const Checkout = (props) => {
  const { id, time } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [bookingTime, setBookingTime] = useState(null);

  const invoiceDetails = useSelector(
    (state) => state.customerReducer.invoiceDetails
  );

  useEffect(() => {
    if (invoiceDetails) {
      setInvoice(invoiceDetails);
      let time = moment()
        .set({
          hour: moment(invoiceDetails.bookingStartTime)
            .tz(invoiceDetails.Outlet.timezone)
            .format("HH"),
          minute: moment(invoiceDetails.bookingStartTime)
            .tz(invoiceDetails.Outlet.timezone)
            .format("mm"),
        })
        .format("hh:mm A");
      setBookingTime(time);
    }
  }, [invoiceDetails]);

  useEffect(() => {
    if (id !== null && id !== undefined) {
      console.log("id", id, "time", time);

      if (time !== null && time !== undefined) {
        setTimeout(() => {
          props.actions.customerAction.getOrderBySessionId(id);
        }, time);
      }
    }
  }, []);

  return (
    <div>
      {invoice === null ? (
        <Loader />
      ) : (
        <Dialog open={true}>
          <div className="confirmation">
            <Card className="thanks-div">
              <div className="swal-modal-main">
                <ReactSVG
                  className="swal-modal-inner success-bg"
                  src="/assets/images/success.svg"
                />
                <div className="swal-modal-inner">
                  <span className="message-head">
                    Reservation Added For {invoice.Customer.salutation}
                    &nbsp;
                    {invoice.Customer.name}&nbsp;
                    {invoice.Customer.lastName}
                  </span>
                  {invoice.Coupon && (
                    <span className="message-inner">
                      You have saved {invoice.Coupon?.discountAmount} % on this
                      reservation
                    </span>
                  )}

                  <div className="table-detail">
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <CalendarMonthIcon />
                      &nbsp;
                      {moment(invoice.bookingStartTime)
                        .tz(invoice.Outlet.timezone)
                        .format("DD MMM YYYY ")}{" "}
                    </span>
                    &nbsp;<span>| </span>&nbsp; <AccessTimeFilledIcon />
                    &nbsp; {bookingTime}&nbsp;|&nbsp; <PeopleIcon />
                    &nbsp;{invoice.noOfPerson} Pax
                  </div>
                  {/* <Button
                    className="confirm-btn"
                    variant="outlined"
                    // onClick={handleClose}
                  >
                    Close
                  </Button> */}
                </div>
              </div>
            </Card>
          </div>
        </Dialog>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    customerAction: bindActionCreators(CustomerAction, dispatch),
  },
});
export default connect(null, mapDispatchToProps)(Checkout);
