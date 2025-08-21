/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
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
import { connect, useSelector } from "react-redux";

import * as UserAction from "../../../../../Action/AdminDashboard";

import "./style.scss";
const Frequent = (props) => {
  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: "name",
      headerName: "OUTLET",
      width: 233,
      isChecked: true,
      type: "string",
    },
    {
      field: "1",
      headerName: "1",
      width: 233,
      isChecked: true,
      type: "number",
    },
    {
      field: "2",
      headerName: "2",
      width: 233,
      isChecked: true,
      type: "number",
    },
    {
      field: "3",
      headerName: "3",
      width: 233,
      isChecked: true,
      type: "number",
    },
    {
      field: ">4",
      headerName: ">4",
      width: 233,
      isChecked: true,
      type: "number",
    },
  ];

  const createData = (name, count1, count2, count3, count4) => {
    return {
      name,
      count1,
      count2,
      count3,
      count4,
    };
  };

  const hotelReducer = useSelector((state) => ({
    customerReports: state.hotelReducer.customerReports,
  }));

  useEffect(() => {
    setRows([]);
    if (props.filterData && props.filterData.companyIds.length > 0) {
      props.actions.userAction.getAllCustomerReports(props.filterData);
    }
  }, [props.filterData]);

  useEffect(() => {
    if (hotelReducer.customerReports) convertData(hotelReducer.customerReports);
  }, [hotelReducer.customerReports]);

  const convertData = (customerReports) => {
    const data = customerReports.Outlet.map((customerReport) => {
      const count1 = customerReport.customerTotalDines.find(
        (customerDineCount) => customerDineCount.index === "1"
      );
      const count2 = customerReport.customerTotalDines.find(
        (customerDineCount) => customerDineCount.index === "2"
      );
      const count3 = customerReport.customerTotalDines.find(
        (customerDineCount) => customerDineCount.index === "3"
      );
      const count4 = customerReport.customerTotalDines.find(
        (customerDineCount) => customerDineCount.index === ">4"
      );
      return createData(
        customerReport.name,
        count1 ? count1.totalDines : 0,
        count2 ? count2.totalDines : 0,
        count3 ? count3.totalDines : 0,
        count4 ? count4.totalDines : 0
      );
    });

    const count1 = customerReports.Total.find(
      (customerDineCount) => customerDineCount.index === "1"
    );
    const count2 = customerReports.Total.find(
      (customerDineCount) => customerDineCount.index === "2"
    );
    const count3 = customerReports.Total.find(
      (customerDineCount) => customerDineCount.index === "3"
    );
    const count4 = customerReports.Total.find(
      (customerDineCount) => customerDineCount.index === ">4"
    );

    const total = createData(
      "Total Customer",
      count1 ? count1.totalDines : 0,
      count2 ? count2.totalDines : 0,
      count3 ? count3.totalDines : 0,
      count4 ? count4.totalDines : 0
    );

    setRows([...data, total]);
    return data;
  };

  return (
    <div className="">
      <Paper sx={{ width: "fit-content" }} className="sumary-table">
        <TableContainer sx={{ maxHeight: "calc(100vh - 304px)" }}>
          <Table
            stickyHeader
            aria-label="sticky table"
            sx={{ minWidth: 750 }}
            size={"medium"}
            className="reports-table"
          >
            <TableHead>
              <TableRow>
                {columns.map((headCell) => (
                  <TableCell
                    key={headCell.field}
                    align={headCell.numeric ? "right" : "left"}
                    padding={headCell.disablePadding ? "none" : "normal"}
                  >
                    {headCell.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <span>{row.name ? row.name : "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span>{row.count1}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span>{row.count2}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span>{row.count3}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span>{row.count4}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(Frequent);
