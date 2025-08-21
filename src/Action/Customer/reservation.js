/* eslint-disable no-unreachable */
import axios from "axios";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import moment from "moment-timezone";

export const reservation = async (data, outletId) => {
  const filterPreorderItem =
    data.basket &&
    data.basket.length > 0 &&
    data.basket
      .filter((preOrderItem) => preOrderItem.qty > 0)
      .map((orderItem) => {
        return { itemId: orderItem.id, qty: orderItem.qty };
      });

  const filterDietaryRestriction = data.dietaryRestriction
    .filter((dietaryRestriction) => dietaryRestriction.isChecked)
    .map((diet) => diet.name);

  const requestPayload = {
    bookingType: data.bookingType,
    date: moment(data.date).format("DD-MM-YYYY"),
    noOfPerson: data.noOfPerson,
    preferredTime: data.preferredTime,
    dietaryRestriction: filterDietaryRestriction,
    basket: {
      items:
        filterPreorderItem && filterPreorderItem.length > 0
          ? [...filterPreorderItem]
          : [],
    },

    diningOptions:
      data.diningOptions && data.diningOptions.id > 0
        ? [
            {
              diningOptionId: data.diningOptions.id,
              diningOptionQty: data.diningOptions.qty,
            },
          ]
        : [],
    privateRoom: data.privateRoom ? { id: data.privateRoom.id } : null,
    email: data.email,
    exactTime: data.exactTime,
    name: data.name,
    lastName: data.lastName,
    mobileNo: `+${data.mobileNo}`,
    occasion: data.occasion,
    promocode: data.promocode,
    salutation: data.salutation,
    customerCompanyName: data.customerCompanyName,
    seatingPreference: data.seatingPreference,
    specialRequest: data.specialRequest,
    isOPT: data.isOPT,
  };

  const api = {
    method: "POST",
    url:
      ENVIRONMENT_VARIABLES.Base_API_URL +
      "/reservation/outlet/" +
      outletId +
      "/booking",
    data: requestPayload,
  };
  return await axios(api);
};

export const EventBookingTicket = async (data, ticketbookingId) => {
  const requestPayload = {
    date: data.date,
    noOfPerson: data.noOfPerson,
    exactTime: data.exactTime,
    name: data.name,
    lastName: data.lastName,
    email: data.email,
    mobileNo: data.mobileNo,
    bookingType: data.bookingType,
    occasion: data.occasion,
    dietaryRestriction: data.dietaryRestriction,
    specialRequest: data.specialRequest,
    customerCompanyName: data.customerCompanyName,
    salutation: data.salutation,
    isOPT: data.isOPT,
  };

  const api = {
    method: "POST",
    url:
      ENVIRONMENT_VARIABLES.Base_API_URL +
      "/ticketbooking/" +
      ticketbookingId +
      "/reservation/",
    data: requestPayload,
  };
  return await axios(api);
};
