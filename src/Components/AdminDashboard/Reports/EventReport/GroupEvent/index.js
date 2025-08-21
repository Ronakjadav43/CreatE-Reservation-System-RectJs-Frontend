/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { Fragment, useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { bindActionCreators } from "redux";

import * as UserAction from "../../../../../Action/AdminDashboard";
import { connect, useSelector } from "react-redux";
import "./style.scss";

import moment from "moment-timezone";

const GroupEvent = (props) => {
  const [report, setReport] = useState(null);
  const [columns, setColumns] = useState([]);
  const [timeOut, setTimeOut] = useState(null);

  const hotelReducer = useSelector((state) => ({
    eventReports: state.hotelReducer.eventReports,
  }));

  useEffect(() => {
    setReport(null);
    clearTimeout(timeOut);
    const filterMealType = props.mealType.filter(
      (mealType) => mealType.isChecked === true
    );
    if (
      props.filterData &&
      filterMealType.length > 0 &&
      props.filterData.companyIds.length > 0
    ) {
      setTimeOut(
        setTimeout(() => {
          props.actions.userAction.getCustomerEventReports(
            props.filterData,
            filterMealType
          );
        }, 100)
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
      props.filterData &&
      filterMealType.length > 0 &&
      props.filterData.companyIds.length > 0
    ) {
      setTimeOut(
        setTimeout(() => {
          props.actions.userAction.getCustomerEventReports(
            props.filterData,
            filterMealType
          );
        }, 100)
      );
    }
  }, [props.mealType]);

  useEffect(() => {
    if (hotelReducer.eventReports) {
      let columnList = [{ field: "outlet", headerName: "Outlet" }];
      hotelReducer.eventReports.Total.map((report) => {
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
        index <= hotelReducer.eventReports.Outlet.length;
        index++
      ) {
        let object = {};
        if (index === hotelReducer.eventReports.Outlet.length) {
          header.map((head) => {
            if (head === "Outlet") {
              object[head] = "Total Booking";
            }
            const findOutletMealType = hotelReducer.eventReports.Total.find(
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
          const outlet = hotelReducer.eventReports.Outlet[index];

          header.map((head) => {
            if (index === 0 && head === "Start Date") {
              object[head] = moment(props.filterData.fromDate).format(
                "DD-MM-YYYY"
              );
            } else if (index === 0 && head === "End Date") {
              object[head] = moment(props.filterData.toDate).format(
                "DD-MM-YYYY"
              );
            } else if (head === "Outlet") {
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
      setReport(hotelReducer.eventReports);
    }
  }, [hotelReducer.eventReports]);

  return (
    <div className="">
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
                              {headCell.headerName !== "Outlet"
                                ? "Reservation"
                                : ""}
                            </span>
                            <span>
                              {headCell.headerName !== "Outlet" ? "Pax" : ""}
                            </span>
                          </div>
                        </TableCell>

                        {headCell.headerName !== "Outlet" && (
                          <TableCell
                            key={headCell.field}
                            align={headCell.numeric ? "right" : "left"}
                            padding={
                              headCell.disablePadding ? "none" : "normal"
                            }
                          >
                            <span>
                              {headCell.headerName !== "Outlet"
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
                {report?.Outlet.map((row, index) => {
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

export default connect(null, mapDispatchToProps)(GroupEvent);
