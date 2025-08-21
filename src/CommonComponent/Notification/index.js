/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import swal from "@sweetalert/with-react";
import { ReactSVG } from "react-svg";
import "react-toastify/dist/ReactToastify.css";

import "./style.scss";

const Notification = (props) => {
  const hotelReducer = useSelector((state) => ({
    success_msg: state.hotelReducer.success_msg,
    error_msg: state.hotelReducer.error_msg,
  }));

  const customerReducer = useSelector((state) => ({
    success_msg: state.customerReducer.success_msg,
    error_msg: state.customerReducer.error_msg,
  }));

  const notificationSetting = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
  };

  /* hotelreducer Notification */
  useEffect(() => {
    if (hotelReducer.error_msg) {
      let message = hotelReducer.error_msg.split("E:");
      if (message.length > 1) {
        message = message[0];
      }
      toast.error(message, notificationSetting);
    }
  }, [hotelReducer.error_msg]);

  useEffect(() => {
    if (hotelReducer.success_msg) {
      toast.success(hotelReducer.success_msg, notificationSetting);
    }
  }, [hotelReducer.success_msg]);

  /* customerReducer Notification */
  useEffect(() => {
    if (customerReducer.error_msg) {
      let message = customerReducer.error_msg.split("E:");
      if (message.length > 1) {
        message = message[0];
      }
      swal(
        <div className="swal-modal-main">
          <ReactSVG
            className="swal-modal-inner"
            src="/assets/images/error.svg"
          />
          <div className="swal-modal-inner">
            <span className="message-head">Opps!</span>
            <p className="message-text">{message}</p>
          </div>
        </div>
      );
    }
  }, [customerReducer.error_msg]);

  useEffect(() => {
    if (customerReducer.success_msg) {
      swal(
        <div className="swal-modal-main">
          <ReactSVG
            className="swal-modal-inner success-bg"
            src="/assets/images/success.svg"
          />
          <div className="swal-modal-inner">
            <span className="message-head">{customerReducer.success_msg}</span>
          </div>
        </div>
      );
    }
  }, [customerReducer.success_msg]);

  return <ToastContainer />;
};

export default Notification;
