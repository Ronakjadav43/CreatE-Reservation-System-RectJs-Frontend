/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { ReactSVG } from "react-svg";
import { useParams } from "react-router-dom";
import swal from "@sweetalert/with-react";
import { connect, useSelector } from "react-redux";
import moment from "moment-timezone";
import { bindActionCreators } from "redux";

import * as CustomerAction from "../../../Action/Customer";

const Confimation = (props) => {
  const { invoiceId, status } = useParams();

  const invoiceDetails = useSelector(
    (state) => state.customerReducer.invoiceDetails
  );

  useEffect(() => {
    if (invoiceId) {
      props.actions.customerAction.getInvoiceDetails(invoiceId);
    }
  }, [invoiceId]);

  const success = () => {
    swal(
      <div className="swal-modal-main ">
        <ReactSVG
          className="swal-modal-inner success-bg"
          src="/assets/images/success.svg"
        />

        <div className="swal-modal-inner" style={{ height: "220px" }}>
          <span className="message-head">
            Your reservation has been confirmed !
          </span>
          <div
            className="table-detail"
            style={{ flexDirection: "column", gap: "10px", fontSize: "16px" }}
          >
            <span>
              {invoiceDetails?.Customer.salutation} &nbsp;
              {invoiceDetails?.Customer.name} &nbsp;
              {invoiceDetails?.Customer.lastName}
            </span>
            <span>{invoiceDetails?.bookingType}</span>
            <span>
              {moment(invoiceDetails?.bookingStartTime)
                .tz(invoiceDetails?.Outlet.timezone)
                .format("DD MMM YYYY hh:mm A")}
            </span>
            <span>{invoiceDetails?.noOfPerson} Pax</span>
          </div>
        </div>
      </div>
    );
  };

  const cancel = () => {
    swal(
      <div className="swal-modal-main">
        <ReactSVG
          className="swal-modal-inner success-bg"
          src="/assets/images/success.svg"
        />
        <div className="swal-modal-inner">
          <p className="message-text">
            Your booking has been cancelled successfully. We hope to have the
            chance to serve you in our restaurant soon!
          </p>
        </div>
      </div>
    );
  };

  const error = () => {
    swal(
      <div className="swal-modal-main">
        <ReactSVG className="swal-modal-inner" src="/assets/images/error.svg" />
        <div className="swal-modal-inner">
          <span className="message-head">Opps!</span>
          <p className="message-text">
            Your order is already {invoiceDetails.status}!
          </p>
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="email-popup">
        {invoiceDetails && status === "CONFIRMED" && success()}
        {invoiceDetails && status === "CANCELLED" && cancel()}
        {invoiceDetails && status === "ERROR" && error()}
      </div>
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    customerAction: bindActionCreators(CustomerAction, dispatch),
  },
});
export default connect(null, mapDispatchToProps)(Confimation);
