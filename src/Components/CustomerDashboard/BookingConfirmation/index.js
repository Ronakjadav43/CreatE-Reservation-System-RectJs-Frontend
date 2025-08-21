/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Button, Card, Dialog } from "@mui/material";
import moment from "moment-timezone";
import { ReactSVG } from "react-svg";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import PeopleIcon from "@mui/icons-material/People";
import "./style.scss";

const BookingConfirmation = (props) => {
  const { open, handleClose } = props;

  const bookingTime = moment()
    .set({
      hour: moment(props.invoice.bookingStartTime)
        .tz(props.invoice.Outlet.timezone)
        .format("HH"),
      minute: moment(props.invoice.bookingStartTime)
        .tz(props.invoice.Outlet.timezone)
        .format("mm"),
    })
    .format("hh:mm A");

  return (
    <Dialog open={open}>
      {props.invoice && (
        <div className="confirmation">
          <Card className="thanks-div">
            <div className="swal-modal-main">
              <ReactSVG
                className="swal-modal-inner success-bg"
                src="/assets/images/success.svg"
              />
              <div className="swal-modal-inner">
                <span className="message-head">
                  Reservation Added For {props.invoice.Customer.salutation}
                  &nbsp;
                  {props.invoice.Customer.name}&nbsp;
                  {props.invoice.Customer.lastName}
                </span>
                {props.invoice.Coupon && (
                  <span className="message-inner">
                    You have saved {props.invoice.Coupon?.discountAmount} % on
                    this reservation
                  </span>
                )}

                <div className="table-detail">
                  <span style={{display: "flex", alignItems: "center"}}>
                  <CalendarMonthIcon />
                  &nbsp;
                  {moment(props.invoice.bookingStartTime)
                    .tz(props.invoice.Outlet.timezone)
                    .format("DD MMM YYYY ")} </span>
                &nbsp;<span>| </span>&nbsp; <AccessTimeFilledIcon />
                  &nbsp; {bookingTime}&nbsp;|&nbsp; <PeopleIcon />
                  &nbsp;{props.invoice.noOfPerson} Pax
                </div>
                <Button
                  className="confirm-btn"
                  variant="outlined"
                  onClick={handleClose}
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Dialog>
  );
};

export default BookingConfirmation;
