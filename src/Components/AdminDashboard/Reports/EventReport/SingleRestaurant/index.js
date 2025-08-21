/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { Fragment, useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import * as UserAction from "../../../../../Action/AdminDashboard";
import { bindActionCreators } from "redux";
import moment from "moment-timezone";

const SingleRestaurant = (props) => {
  const [report, setReport] = useState(null);
  const [timeOut, setTimeOut] = useState(null);
  const [columns, setColumns] = useState([]);

  const hotelReducer = useSelector((state) => ({
    eventSingleReservation: state.hotelReducer.eventSingleReservation,
  }));

  useEffect(() => {
    setReport(null);
    clearTimeout(timeOut);
    const filterMealType = props.mealType.filter(
      (mealType) => mealType.isChecked === true
    );

    if (
      filterMealType.length > 0 &&
      props.filterData.companyIds.length > 0 &&
      props.filterData.outletId
    ) {
      setTimeOut(
        setTimeout(() => {
          props.actions.userAction.getCustomerSingleReservation(
            props.filterData,
            filterMealType
          );
        }, 300)
      );
    }
  }, [props.filterData]);

  useEffect(() => {
    setReport(null);
    clearTimeout(timeOut);
    const filterMealType = props.mealType.filter(
      (mealType) => mealType.isChecked === true
    );

    if (
      filterMealType.length > 0 &&
      props.filterData.companyIds.length > 0 &&
      props.filterData.outletId
    ) {
      setTimeOut(
        setTimeout(() => {
          props.actions.userAction.getCustomerSingleReservation(
            props.filterData,
            filterMealType
          );
        }, 300)
      );
    }
  }, [props.mealType]);

  useEffect(() => {
    if (hotelReducer.eventSingleReservation) {
      let columnList = [{ field: "date", headerName: "Date" }];
      hotelReducer.eventSingleReservation.Total.map((report) => {
        columnList.push({
          field: report.mealType,
          headerName: report.mealType,
          colSpan: 2,
        });
      });
      if (columnList.length > 0) {
        setColumns([...columnList]);
      }

      let header = ["Start Date", "End Date"];
      columnList.map((column) => {
        header.push(column.headerName);
      });

      const body = [];
      for (
        let index = 0;
        index <= hotelReducer.eventSingleReservation.Date.length;
        index++
      ) {
        let object = {};
        if (index === hotelReducer.eventSingleReservation.Date.length) {
          header.map((head) => {
            if (head === "Date") {
              object[head] = "Total Booking";
            }
            const findOutletMealType =
              hotelReducer.eventSingleReservation.Total.find(
                (mealType) => mealType.mealType === head
              );

            if (findOutletMealType) {
              object[`${head} (Reservation)`] =
                findOutletMealType.totalNumberOfReservation !== undefined
                  ? findOutletMealType.totalNumberOfReservation
                  : findOutletMealType.totalNumberOfReservation;

              object[`${head} (Pax)`] =
                findOutletMealType.totalNumberOfPerson !== undefined
                  ? findOutletMealType.totalNumberOfPerson
                  : findOutletMealType.totalNumberOfPreoderItem;

              object[`${head} (Event Value)`] = findOutletMealType.totalAmount;
            }
          });
        } else {
          const outlet = hotelReducer.eventSingleReservation.Date[index];

          header.map((head) => {
            if (index === 0 && head === "Start Date") {
              object[head] = moment(props.filterData.fromDate).format(
                "DD-MM-YYYY"
              );
            } else if (index === 0 && head === "End Date") {
              object[head] = moment(props.filterData.toDate).format(
                "DD-MM-YYYY"
              );
            } else if (head === "Date") {
              object[head] = outlet.name;
            } else {
              const findOutletMealType = outlet.mealTypes.find(
                (mealType) => mealType.mealType === head
              );

              if (findOutletMealType) {
                object[`${head} (Reservation)`] =
                  findOutletMealType.totalNumberOfReservation !== undefined
                    ? findOutletMealType.totalNumberOfReservation
                    : findOutletMealType.totalNumberOfReservation;

                object[`${head} (Pax)`] =
                  findOutletMealType.totalNumberOfPerson !== undefined
                    ? findOutletMealType.totalNumberOfPerson
                    : findOutletMealType.totalNumberOfPreoderItem;

                object[`${head} (Event Value)`] =
                  findOutletMealType.totalAmount;
              }
            }
          });
        }

        body.push(object);
      }
      props.getExportFileData(body);
      setReport(hotelReducer.eventSingleReservation);
    }
  }, [hotelReducer.eventSingleReservation]);

  return (
    <div>
      {report && (
        <Paper sx={{ width: "fit-content" }} className="event-table">
          <TableContainer
            sx={{
              maxHeight: "calc(100vh - 304px)",
              overflow: "auto",
              position: "relative",
              maxWidth: "1485px",
            }}
          >
            <Table
              stickyHeader
              aria-label="sticky table"
              size={"medium"}
              className="report-table"
            >
              <TableHead>
                <TableRow>
                  {columns.length > 0 &&
                    columns.map((headCell, index) => (
                      <Fragment>
                        <TableCell
                          key={index}
                          align={headCell.numeric ? "right" : "left"}
                          padding={headCell.disablePadding ? "none" : "normal"}
                        >
                          <span> {headCell.headerName}</span>
                          <div>
                            <span>
                              {headCell.headerName !== "Date"
                                ? "Reservation"
                                : ""}
                            </span>
                            <span>
                              {headCell.headerName !== "Date" ? "Pax" : ""}
                            </span>
                          </div>
                        </TableCell>

                        {headCell.headerName !== "Date" && (
                          <TableCell
                            key={headCell.field}
                            align={headCell.numeric ? "right" : "left"}
                            padding={
                              headCell.disablePadding ? "none" : "normal"
                            }
                          >
                            <span>
                              {headCell.headerName !== "Date"
                                ? "Event Value"
                                : ""}
                            </span>
                          </TableCell>
                        )}
                      </Fragment>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {report?.Date.map((row, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell sx={{ padding: "16px !important" }}>
                        {row.name}
                      </TableCell>
                      {row.mealTypes.map((mealType) => (
                        <Fragment>
                          <TableCell>
                            <div>
                              <span>{mealType.totalNumberOfReservation}</span>
                              <span>{mealType.totalNumberOfPerson}</span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div>
                              <span>{mealType.totalAmount}</span>
                            </div>
                          </TableCell>
                        </Fragment>
                      ))}
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell sx={{ padding: "16px !important" }}>
                    Total Booking
                  </TableCell>
                  {report?.Total.map((row, index) => {
                    return (
                      <Fragment>
                        <TableCell>
                          <div>
                            <span>{row.totalNumberOfReservation}</span>
                            <span>{row.totalNumberOfPerson}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <span>{row.totalAmount}</span>
                          </div>
                        </TableCell>
                      </Fragment>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(SingleRestaurant);
