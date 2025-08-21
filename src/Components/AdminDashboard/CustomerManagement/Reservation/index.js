/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Accordion, AccordionSummary, Button } from "@mui/material";
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ImportContactsTwoToneIcon from "@mui/icons-material/ImportContactsTwoTone";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import moment from "moment-timezone";

import * as UserAction from "../../../../Action/AdminDashboard";
import {
  RESET_CUSTOMER_RESERVATION,
  SET_OUTLET_FROM_CUSTOMER,
} from "../../../../utils/AdminDashboard/Constant";
import InvoiceDetail from "./InvoiceDetail";
import "./style.scss";

const Reservation = (props) => {
  const dispatch = useDispatch();
  const [occasion, setOccasion] = useState([]);
  const [seatingPreference, setSeatingPreference] = useState([]);
  const [dieteryTag, setDieteryTag] = useState([]);

  const customerReservationData = useSelector(
    (state) => state.hotelReducer.customerReservationData
  );
  const permission = useSelector((state) => state.hotelReducer.permission);

  const tags = useSelector((state) => state.hotelReducer.tags);
  const outletForDropDown = useSelector(
    (state) => state.hotelReducer.outletForDropDown
  );

  useEffect(() => {
    return () => {
      dispatch({
        type: RESET_CUSTOMER_RESERVATION,
      });
    };
  }, []);

  useEffect(() => {
    if (
      props.customer.id &&
      outletForDropDown &&
      outletForDropDown.length > 0
    ) {
      const outlet = outletForDropDown.find(
        (singleOutlet) => singleOutlet.outlet.id === props.customer.Outlet.id
      );

      if (outlet) {
        dispatch({
          type: SET_OUTLET_FROM_CUSTOMER,
          data: outlet,
        });
      }

      props.actions.userAction.getCustomerReservation(
        { filter: "UPCOMING" },
        props.customer.Outlet.id,
        props.customer.id
      );
      props.actions.userAction.getAllTagsByOutletId(props.customer.Outlet.id);
    }
  }, [props.customer.id]);

  useEffect(() => {
    if (tags) {
      const mappedTag = tags
        .filter((tag) => tag.isActive === true)
        .map((data) => {
          return { ...data, isChecked: false };
        });

      if (mappedTag) {
        const dieteriesTag = mappedTag.filter(
          (dietTag) => dietTag?.TagCategory.id === 24
        );

        const occasionTag = mappedTag.filter(
          (occasionTag) => occasionTag?.TagCategory.id === 26
        );

        const seatingPreferenceTag = mappedTag.filter(
          (seatTag) => seatTag?.TagCategory.id === 27
        );

        setOccasion(occasionTag);
        setSeatingPreference(seatingPreferenceTag);
        setDieteryTag(dieteriesTag);
      }
    }
  }, [tags]);

  const invoiceDetail = (invoice) => {
    let mappedDietTags = dieteryTag;
    if (invoice.dietaryRestriction?.length > 0) {
      mappedDietTags = dieteryTag
        .filter((tag) => tag.isActive === true)
        .map((data) => {
          if (
            invoice.dietaryRestriction?.find((dietTag) => dietTag === data.name)
          ) {
            return { ...data, isChecked: true };
          }
          return { ...data, isChecked: false };
        });
    }

    return (
      <InvoiceDetail
        outlet={{ ...customerReservationData.Customer.Outlet }}
        invoice={{ ...invoice }}
        customer={{ ...props.customer }}
        occasion={[...occasion]}
        seatingPreference={[...seatingPreference]}
        mappedDietTags={[...mappedDietTags]}
        permission={permission.permission}
      />
    );
  };

  return (
    <div>
      {customerReservationData &&
        customerReservationData?.Customer?.OutletInvoice?.length > 0 &&
        customerReservationData?.Customer?.OutletInvoice?.map((invoice) => (
          <Accordion sx={{ width: "100%" }}>
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
                {customerReservationData?.Customer?.Outlet.name}
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
            {invoiceDetail(invoice)}
          </Accordion>
        ))}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(Reservation);
