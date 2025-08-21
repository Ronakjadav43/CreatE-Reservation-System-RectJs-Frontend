/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Button, Card } from "@mui/material";
import { useParams } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import moment from "moment-timezone";
import { bindActionCreators } from "redux";
import ENVIRONMENT_VARIABLES from "../../../environment.config";
import * as CustomerAction from "../../../Action/Customer";
import "./style.scss";

const Invoice = (props) => {
  const { invoiceId } = useParams();

  const invoiceDetails = useSelector(
    (state) => state.customerReducer.invoiceDetails
  );

  useEffect(() => {
    if (invoiceId) {
      props.actions.customerAction.getInvoiceDetails(invoiceId);
    }
  }, [invoiceId]);

  const handleConfimEmail = () => {
    window.location.replace(
      `${ENVIRONMENT_VARIABLES.Base_API_URL}/invoice/${invoiceId}/status/CONFIRMED`
    );
  };

  const handleCancelEmail = () => {
    window.location.replace(
      `${ENVIRONMENT_VARIABLES.Base_API_URL}/invoice/${invoiceId}/status/CANCELLED`
    );
  };

  return (
    <React.Fragment>
      {invoiceDetails && (
        <div className="hotellist-layout">
          <div className="logo">
            <img
              src="https://dev.api.reservation.theadventus.com/images/Logo.png"
              alt="logo"
            />
          </div>
          <Card className="confirmation-card">
            <h2> We would like to confirm your upcoming reservation.</h2>
            <span className="invoice-text">
              {invoiceDetails?.Customer.salutation} &nbsp;
              {invoiceDetails?.Customer.name} &nbsp;
              {invoiceDetails?.Customer.lastName}
            </span>
            <span className="invoice-text">{invoiceDetails?.bookingType}</span>
            <span className="invoice-text">
              {moment(invoiceDetails?.bookingStartTime)
                .tz(invoiceDetails?.Outlet.timezone)
                .format("DD MMM YYYY hh:mm A")}
            </span>
            <span className="invoice-text">
              {invoiceDetails?.noOfPerson} Pax
            </span>

            <div className="primary-btn">
              <Button
                type="submit"
                variant="contained"
                onClick={handleConfimEmail}
              >
                Confirm
              </Button>
              <Button
                type="submit"
                variant="outlined"
                onClick={handleCancelEmail}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    customerAction: bindActionCreators(CustomerAction, dispatch),
  },
});
export default connect(null, mapDispatchToProps)(Invoice);
