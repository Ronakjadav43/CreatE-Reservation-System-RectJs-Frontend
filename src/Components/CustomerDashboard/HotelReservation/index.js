/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import { Card } from "@mui/material";
import { connect, useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { useParams } from "react-router-dom";
import moment from "moment-timezone";
import StepButton from "@mui/material/StepButton";
import { styled } from "@mui/material/styles";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

import ReservationStep4 from "../ReservationStep-4";
import ReservationStep2 from "../ReservationStep-2";
import ReservationStep3 from "../ReservationStep-3";
import ReservationStep1 from "../ReservationStep-1";
import ReservationStep5 from "../ReservationStep-5";
import * as CustomerAction from "../../../Action/Customer";
import {
  GET_RESERVATION_TIMESLOT,
  INPROGRESS,
  STOPLOADER,
  ERROR,
} from "../../../utils/Customer/Constant";
import BookingConfirmation from "../BookingConfirmation";
import PrivateEventBooking from "../PrivateEventBooking";
import "./style.scss";

const steps = [
  "Select Reservation Type ",
  "Select Restaurant & Date",
  "Select Time",
  "Dining Options",
  "Customer Details",
];

const HotelReservation = (props) => {
  const { key, outletId } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [open, setOpen] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [stripePayment, setStripePayment] = useState(null);
  const [isEventBookingOpen, setIsEventBookingOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [reservationDinning, setReservationDinning] = useState(null);
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [hasEvents, setHasEvents] = useState(undefined);

  const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: "#5C231C",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: "#5C231C",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor:
        theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      borderTopWidth: 3,
      borderRadius: 1,
    },
  }));

  const saluation = [
    {
      code: 0,
      name: "Ms.",
    },
    {
      code: 1,
      name: "Miss.",
    },
    {
      code: 2,
      name: "Mdm.",
    },
    {
      code: 3,
      name: "Mrs.",
    },
    {
      code: 4,
      name: "Dr.",
    },
    {
      code: 5,
      name: "Mr.",
    },
  ];

  const paymentMonth = [
    {
      code: 0,
      name: "01",
    },
    {
      code: 1,
      name: "02",
    },
    {
      code: 2,
      name: "03",
    },
    {
      code: 3,
      name: "04",
    },
    {
      code: 4,
      name: "05",
    },
    {
      code: 5,
      name: "06",
    },

    {
      code: 6,
      name: "07",
    },
    {
      code: 7,
      name: "08",
    },
    {
      code: 8,
      name: "09",
    },
    {
      code: 9,
      name: "10",
    },
    {
      code: 10,
      name: "11",
    },
    {
      code: 11,
      name: "12",
    },
  ];

  const year = new Date().getFullYear();
  const years = Array.from(new Array(20), (val, index) => index + year);

  const dispatch = useDispatch();

  const [customerReservationData, setCustomerReservationData] = useState({
    bookingType: "",
    date: null,
    noOfPerson: null,
    preferredTime: null,
    exactTime: "",
    name: "",
    lastName: "",
    email: "",
    mobileNo: "",
    occasion: "",
    specialRequest: "",
    customerCompanyName: "",
    seatingPreference: "",
    diningOptions: null,
    salutation: "Ms",
    promocode: "",
    outletId: null,
    isOPT: false,
    dietaryRestriction: [],
    // cardName: "",
    // cardDetails_number: "",
    // cardDetails_exp_month: "01",
    // cardDetails_exp_year: years[0],
    // cardDetails_cvc: "",
    dinningAmount: 0,
    privateRoom: null,
  });

  const selectedOutletOfReducer = useSelector(
    (state) => state.customerReducer.selectedOutlet
  );
  const companyOutlets = useSelector(
    (state) => state.customerReducer.companyOutlets
  );
  const reservationTimeSlot = useSelector(
    (state) => state.customerReducer.reservationTimeSlot
  );

  const events = useSelector((state) => state.customerReducer.events);
  const company = useSelector((state) => state.customerReducer.company);

  useEffect(() => {
    props.actions.customerAction.getCompanyOutlets(key);
    props.actions.customerAction.getTicketByCompanyKey(key);
  }, []);

  useEffect(() => {
    if (events !== null && events.length > 0) {
      setHasEvents(true);
    } else if (events !== null) {
      setHasEvents(false);
    }
  }, [events]);

  useEffect(() => {
    if (outletId) {
      setCustomerReservationData({
        ...customerReservationData,
        outletId: Number(outletId),
      });
    }
  }, [outletId]);

  useEffect(() => {
    if (selectedOutletOfReducer) {
      setSelectedOutlet(selectedOutletOfReducer);
      setCustomerReservationData({
        ...customerReservationData,
        date: new Date(
          new Date().toLocaleString("en-US", {
            timeZone: selectedOutletOfReducer.timezone,
          })
        ),
      });
    }
  }, [selectedOutletOfReducer]);

  const checkPreOrderItem = (reservationDinning) => {
    let hasPreOrderItem = false;
    let preOrderItemList = [];

    reservationDinning.menu.map((data) => {
      if (checkMealTiming(data))
        data.PreOrderItemDbModel.map((product) =>
          preOrderItemList.push({ ...product, qty: 0 })
        );
    });
    if (preOrderItemList.length > 0) {
      hasPreOrderItem = true;
    } else {
      hasPreOrderItem = false;
    }
    return hasPreOrderItem;
  };

  const checkMealTiming = (mealType) => {
    let isValidMealType = false;

    const formatedDate = moment(customerReservationData.date).format(
      "DD-MM-YYYY"
    );

    const requestedDateAndTime = getFormatedDateAndTime(
      formatedDate,
      customerReservationData.exactTime
    );

    mealType.tradingHours.map((mealTiming) => {
      const startMealTiming = getFormatedDateAndTime(
        formatedDate,
        mealTiming.openingTime
      );
      const endMealTiming = getFormatedDateAndTime(
        formatedDate,
        mealTiming.closingTime
      );

      if (
        requestedDateAndTime.isBetween(
          startMealTiming,
          endMealTiming,
          undefined,
          "[]"
        )
      ) {
        isValidMealType = true;
      }
    });
    return isValidMealType;
  };

  const getFormatedDateAndTime = (date, time) => {
    const splitHours = time.split(":");
    const formatedDate = moment(date, "DD-MM-YYYY").set({
      hour: splitHours[0],
      minute: splitHours[1],
    });
    return formatedDate;
  };

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...customerReservationData };
    commonData[field] = event.target.value;
    if (event.target.name === "bookingType") {
      handleComplete();
    }

    if (event.target.externalName) {
      commonData[event.target.externalName] = event.target.externalValue;
    }
    return setCustomerReservationData(commonData);
  };

  const handleChangeFirstName = (event) => {
    const field = event.target.name;
    let commonData = { ...customerReservationData };
    commonData[field] = event.target.value.replace(/[^\w\s]/gi, "");
    if (event.target.name === "bookingType") {
      handleComplete();
    }

    if (event.target.externalName) {
      commonData[event.target.externalName] = event.target.externalValue;
    }
    return setCustomerReservationData(commonData);
  };

  const handleSelectEvent = (event) => {
    setIsEventBookingOpen(true);
    setSelectedEvent(event);
    handleComplete();
  };

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleOpenConfirmationBooking = () => {
    setOpen(true);
  };

  const handleCloseConfirmationBooking = () => {
    setCustomerReservationData({
      bookingType: "NORMAL_RESERVATION",
      date: new Date(
        new Date().toLocaleString("en-US", {
          timeZone: selectedOutlet.timezone,
        })
      ),
      noOfPerson: null,
      preferredTime: null,
      exactTime: "",
      name: "",
      lastName: "",
      email: "",
      mobileNo: "",
      occasion: "",
      specialRequest: "",
      customerCompanyName: "",
      seatingPreference: "",
      diningOptions: null,
      basket: null,
      salutation: "Ms",
      promocode: "",
      outletId: null,
      dietaryRestriction: [],
      // cardName: "",
      // cardDetails_number: "",
      // cardDetails_exp_month: "01",
      // cardDetails_exp_year: years[0],
      // cardDetails_cvc: "",
      privateRoom: null,
    });
    setOpen(false);
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    if (isLastStep()) {
      dispatch({ type: INPROGRESS });
      CustomerAction.reservation(
        customerReservationData,
        customerReservationData.outletId
      )
        .then((response) => {
          console.log("response", response);
          if (response.status === 201) {
            setInvoice(response.data.data);
            setCustomerReservationData({
              bookingType: "NORMAL_RESERVATION",
              date: null,
              noOfPerson: null,
              preferredTime: null,
              exactTime: "",
              name: "",
              lastName: "",
              email: "",
              mobileNo: "",
              occasion: "",
              specialRequest: "",
              customerCompanyName: "",
              seatingPreference: "",
              diningOptions: null,
              salutation: "Ms",
              promocode: "",
              outletId: null,
              dietaryRestriction: [],
              // cardName: "",
              // cardDetails_number: "",
              // cardDetails_exp_month: "01",
              // cardDetails_exp_year: years[0],
              // cardDetails_cvc: "",
              dinningAmount: 0,
              privateRoom: null,
            });
            setActiveStep(0);
            setCompleted({});
            handleOpenConfirmationBooking();
            dispatch({ type: STOPLOADER });
          } else if (response.status === 200) {
            console.log("response.data.data", response.data.data);
            setStripePayment(response.data.data.client_secret);

            // setCustomerReservationData({
            //   bookingType: "NORMAL_RESERVATION",
            //   date: null,
            //   noOfPerson: null,
            //   preferredTime: null,
            //   exactTime: "",
            //   name: "",
            //   lastName: "",
            //   email: "",
            //   mobileNo: "",
            //   occasion: "",
            //   specialRequest: "",
            //   customerCompanyName: "",
            //   seatingPreference: "",
            //   diningOptions: null,
            //   salutation: "Ms",
            //   promocode: "",
            //   outletId: null,
            //   dietaryRestriction: [],
            //   // cardName: "",
            //   // cardDetails_number: "",
            //   // cardDetails_exp_month: "01",
            //   // cardDetails_exp_year: years[0],
            //   // cardDetails_cvc: "",
            //   dinningAmount: 0,
            //   privateRoom: null,
            // });
            // setActiveStep(0);
            // setCompleted({});
            // handleOpenConfirmationBooking();
            dispatch({ type: STOPLOADER });
          }
        })
        .catch((error) => {
          if (error && error.response) {
            dispatch({
              type: ERROR,
              data: { error_msg: error.response.data.message },
            });
          } else {
            dispatch({
              type: ERROR,
              data: { error_msg: error.message.toString() },
            });
          }
        });
    } else {
      setActiveStep(newActiveStep);
      newActiveStep === 3 && getDiningOption();
    }
  };

  const getReservationTimeSlot = (reservationData) => {
    const data = {
      ...reservationData,
      date: moment(reservationData.date, "YYYY-MM-DD").format("DD-MM-YYYY"),
    };

    dispatch({ type: INPROGRESS });
    CustomerAction.getReservationTimeSlot(data, key)
      .then((response) => {
        if (response.status === 200) {
          if (activeStep < 2) {
            handleComplete();
            setActiveStep(activeStep + 1);
          }
          dispatch({
            type: GET_RESERVATION_TIMESLOT,
            data: response.data.data,
          });
        }
      })
      .catch((error) => {
        if (error && error.response) {
          dispatch({
            type: ERROR,
            data: { error_msg: error.response.data.message },
          });
        } else {
          dispatch({
            type: ERROR,
            data: { error_msg: error.message.toString() },
          });
        }
      });
  };

  const getDiningOption = () => {
    setReservationDinning(null);
    const data = {
      date: moment(customerReservationData.date, "YYYY-MM-DD").format(
        "DD-MM-YYYY"
      ),
      exactTime: customerReservationData.exactTime,
      noOfPerson: customerReservationData.noOfPerson,
    };
    dispatch({ type: INPROGRESS });
    CustomerAction.getDiningOption(data, customerReservationData.outletId)
      .then((response) => {
        if (response.status === 200) {
          if (
            response.data.data.diningOptions.length > 0 ||
            response.data.data.privateRoom.length > 0 ||
            checkPreOrderItem(response.data.data)
          ) {
            setReservationDinning(response.data.data);
          } else {
            const compledtedSteps = { ...completed, 3: true };
            setCompleted(compledtedSteps);
            setActiveStep(4);
          }
          dispatch({
            type: STOPLOADER,
          });
        }
      })
      .catch((error) => {
        if (error && error.response) {
          dispatch({
            type: ERROR,
            data: { error_msg: error.response.data.message },
          });
        } else {
          dispatch({
            type: ERROR,
            data: { error_msg: error.message.toString() },
          });
        }
      });
  };

  const handleBack = () => {
    if (reservationDinning === null && activeStep === 4) {
      setActiveStep((prevActiveStep) => prevActiveStep - 2);
      const newCompleted = completed;
      newCompleted[3] = false;
      newCompleted[2] = false;
      setCompleted(newCompleted);
      setIsEventBookingOpen(false);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      const newCompleted = completed;
      newCompleted[activeStep] = false;
      setCompleted(newCompleted);
      setIsEventBookingOpen(false);
    }
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const setReservationData = (data) => {
    const selectedOutlet = companyOutlets.find(
      (outlet) => outlet.id === data.outletId
    );

    if (selectedOutlet) {
      setSelectedOutlet(selectedOutlet);
    }

    setCustomerReservationData({
      ...customerReservationData,
      outletId: data.outletId,
      date: data.date,
      noOfPerson: data.noOfPerson,
      preferredTime: data.preferredTime,
      exactTime: data.preferredTime,
    });
    getReservationTimeSlot(data);
  };

  const setPreOrderItemData = (
    preOrderData,
    diningOptions,
    selectedRoom,
    dinningBillAmount = 0
  ) => {
    setCustomerReservationData({
      ...customerReservationData,
      basket: preOrderData,
      diningOptions: diningOptions,
      privateRoom: selectedRoom ? selectedRoom : null,
      dinningAmount: dinningBillAmount,
      bookingType: selectedRoom
        ? "PRIVATE_ROOM"
        : customerReservationData.bookingType,
    });
    handleComplete();
  };

  const handleClosePaymentPopup = () => {
    setStripePayment(null);
  };

  return (
    <React.Fragment>
      {open && (
        <BookingConfirmation
          open={open}
          handleClose={handleCloseConfirmationBooking}
          invoice={invoice}
        />
      )}
      {isEventBookingOpen && (
        <PrivateEventBooking
          event={{ ...selectedEvent }}
          handleBack={handleBack}
          company={{ ...company }}
          customerInfo={{ ...customerReservationData }}
          stripePayment={stripePayment}
          handleClosePaymentPopup={handleClosePaymentPopup}
        />
      )}
      {!isEventBookingOpen && hasEvents !== undefined && (
        <div className="main-iframe">
          <div className="main-div">
            <Card className="main">
              <Box className="main-body">
                <div className="main-header">
                  <Stepper
                    nonLinear
                    activeStep={activeStep}
                    alternativeLabel
                    connector={<QontoConnector />}
                    className="stepper"
                  >
                    {steps.map((label, index) => (
                      <Step key={label} completed={completed[index]}>
                        <StepButton color="inherit">{label}</StepButton>
                      </Step>
                    ))}
                  </Stepper>
                </div>

                {/* <div className="header-line"></div> */}
                <React.Fragment>
                  {activeStep === 0 && (
                    <ReservationStep1
                      handleChange={handleChange}
                      events={events}
                      handleSelectEvent={handleSelectEvent}
                      company={{ ...company }}
                    />
                  )}

                  {activeStep === 1 && (
                    <ReservationStep2
                      activeStep={activeStep}
                      handleBack={handleBack}
                      setReservationData={setReservationData}
                      customerReservationData={{ ...customerReservationData }}
                      companyOutlets={[...companyOutlets]}
                      company={{ ...company }}
                      events={[...events]}
                    />
                  )}
                  {activeStep === 2 && (
                    <ReservationStep3
                      activeStep={activeStep}
                      handleBack={handleBack}
                      handleChange={handleChange}
                      handleComplete={handleComplete}
                      getReservationTimeSlot={getReservationTimeSlot}
                      getDiningOption={getDiningOption}
                      companyOutlets={[...companyOutlets]}
                      selectedOutlet={{ ...selectedOutlet }}
                      customerReservationData={{ ...customerReservationData }}
                      reservationTimeSlot={{
                        ...reservationTimeSlot,
                      }}
                      company={{ ...company }}
                    />
                  )}
                  {activeStep === 3 && (
                    <ReservationStep4
                      activeStep={activeStep}
                      handleBack={handleBack}
                      handleChange={handleChange}
                      handleComplete={handleComplete}
                      setPreOrderItemData={setPreOrderItemData}
                      selectedOutlet={{ ...selectedOutlet }}
                      companyOutlets={[...companyOutlets]}
                      customerReservationData={{ ...customerReservationData }}
                      reservationTimeSlot={{ ...reservationTimeSlot }}
                      company={{ ...company }}
                    />
                  )}
                  {activeStep === 4 && (
                    <ReservationStep5
                      activeStep={activeStep}
                      handleBack={handleBack}
                      handleChange={handleChange}
                      handleChangeFirstName={handleChangeFirstName}
                      handleComplete={handleComplete}
                      customerInfo={{ ...customerReservationData }}
                      saluation={[...saluation]}
                      paymentMonth={[...paymentMonth]}
                      years={[...years]}
                      company={{ ...company }}
                      stripePayment={stripePayment}
                      handleClosePaymentPopup={handleClosePaymentPopup}
                    />
                  )}
                </React.Fragment>
              </Box>
            </Card>
          </div>
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
export default connect(null, mapDispatchToProps)(HotelReservation);
