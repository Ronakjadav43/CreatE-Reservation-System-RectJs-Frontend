import {
  GET_COMPANY_OUTLET,
  INPROGRESS,
  GET_COMPANY,
  SET_COMPANY_OUTLET,
  GET_RESERVATION_TIMESLOT,
  ERROR,
  UPDATE_STATUS,
  GET_INVOICE_DETAILS,
  STOPLOADER,
  GET_DINING_OPTION,
  GET_TICKET_COMPANY_KEY,
  GET_EVENT_BOOKING_TICKET,
} from "../../utils/Customer/Constant";
import initialState from "./initialState";
import { GET_ALL_TAGS } from "../../utils/AdminDashboard/Constant";

const customerReducer = (state = initialState.customerReducer, action) => {
  switch (action.type) {
    case INPROGRESS:
      return {
        ...state,
        error_msg: "",
        success_msg: null,
        loading: true,
      };

    case ERROR:
      return {
        ...state,
        error_msg: action.data.error_msg + "E:" + Math.random(),
        success_msg: null,
        transactionMessage: null,
        loading: false,
      };

    case STOPLOADER:
      return {
        ...state,
        error_msg: "",
        success_msg: null,
        loading: false,
      };

    case GET_COMPANY_OUTLET:
      let selectedOutlet = null;
      if (action.data.Outlet.length > 0) {
        selectedOutlet = action.data.Outlet[0];
      }
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        companyOutlets: action.data.Outlet,
        company: action.data,
        selectedOutlet: selectedOutlet,
      };

    case GET_TICKET_COMPANY_KEY:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        events: action.data.data,
      };

    case GET_EVENT_BOOKING_TICKET:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        eventReservations: action.data.data,
      };

    case SET_COMPANY_OUTLET:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        selectedOutlet: action.data,
      };

    case GET_COMPANY:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        companies: action.data,
      };

    case GET_RESERVATION_TIMESLOT:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        reservationTimeSlot: action.data,
      };

    case GET_INVOICE_DETAILS:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        invoiceDetails: action.data,
      };

    case UPDATE_STATUS:
      state.invoiceDetails = action.data.data;
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        invoiceDetails: { ...state.invoiceDetails },
      };

    case GET_ALL_TAGS:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        tags: action.data,
      };

    case GET_DINING_OPTION:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        diningOptions: action.data,
      };

    default:
      return state;
  }
};
export default customerReducer;
