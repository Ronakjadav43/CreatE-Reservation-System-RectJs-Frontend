/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { Card } from "@mui/material";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const createData = (
  id,
  name,
  noOfPerson,
  time,
  date,
  tags,
  mealType,
  table,
  tableList,
  bookingType,
  status,
  mobileNo,
  specialRequest
) => {
  return {
    id,
    name,
    noOfPerson,
    time,
    date,
    tags,
    mealType,
    table,
    tableList,
    bookingType,
    status,
    mobileNo,
    specialRequest,
  };
};

const InvoiceList = (props) => {
  const [rows, setRows] = useState([]);

  const selectedOutlet = useSelector(
    (state) => state.hotelReducer.selectedOutlet
  );

  useEffect(() => {
    if (props.invoiceDetails) {
      convertData(props.invoiceDetails);
    }
  }, [props.invoiceDetails]);

  const convertData = (invoiceDetails) => {
    const data = invoiceDetails.map((invoice) => {
      let sequenceTables = "";

      invoice.OutletTableBooking.map((sequenceTable, index) => {
        if (index === 0) sequenceTables += sequenceTable.OutletTable.name;
        else sequenceTables += "," + sequenceTable.OutletTable.name;
      });
      return createData(
        invoice.id,
        `${invoice?.Customer.name} ${invoice?.Customer.lastName}`,
        invoice.noOfPerson,
        moment(invoice.bookingStartTime)
          .tz(selectedOutlet.outlet.timezone)
          .format("hh:mm A"),
        moment(invoice.bookingData)
          .tz(selectedOutlet.outlet.timezone)
          .format("DD-MM-YYYY hh:mm A"),
        "N/A",
        invoice.mealType,
        sequenceTables,
        invoice.OutletTableBooking,
        invoice.bookingType,
        invoice.status,
        invoice.Customer.mobileNo,
        invoice.specialRequest
      );
    });
    setRows(data);
    return data;
  };

  return (
    <Card className="seatingview-main-card pointers">
      {rows.map((row, index) => (
        <Card
          className={
            props.selectedInvoice && props.selectedInvoice.id === row.id
              ? "seatingview-card actives"
              : "seatingview-card"
          }
          key={index}
          onClick={() => props.setInvoiceData(row)}
        >
          <div className="seatingview-card-inner w-48">
            <span className="card-inner-text">Name: </span>
            <span className="card-inner-text">{row.name}</span>
          </div>

          <div className="seatingview-card-inner w-48">
            <span className="card-inner-text">Pax: </span>
            <span className="card-inner-text">{row.noOfPerson}</span>
          </div>
          <div className="seatingview-card-inner w-48">
            <span className="card-inner-text">Table: </span>
            <span className="card-inner-text1" title={row.table}>
              {row.table}
            </span>
          </div>
          <div className="seatingview-card-inner w-48">
            <span className="card-inner-text">Time: </span>
            <span className="card-inner-text">{row.time}</span>
          </div>
          <div className="seatingview-card-inner w-100">
            <span className="card-inner-text min-w122">Mobile Number:</span>
            <span className="card-inner-text">{row.mobileNo}</span>
          </div>
          <div className="seatingview-card-inner w-100">
            <span className="card-inner-text min-w122">Status:</span>
            <span className="card-inner-text">{row.status}</span>
          </div>
          <div className="seatingview-card-inner w-100">
            <span className="card-inner-text min-w122">Booking Type:</span>
            <span className="card-inner-text">{row.bookingType}</span>
          </div>
          <div className="seatingview-card-inner w-100">
            <span className="card-inner-text min-w122">
              Special Instruction:
            </span>
            <span className="card-inner-text">{row.specialRequest}</span>
          </div>
        </Card>
      ))}
    </Card>
  );
};

export default InvoiceList;
