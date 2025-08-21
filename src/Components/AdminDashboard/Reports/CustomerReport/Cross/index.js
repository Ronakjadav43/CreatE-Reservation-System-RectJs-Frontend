/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import {
  FormControl,
  MenuItem,
  Paper,
  Select,
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

const Cross = (props) => {
  const [crossCustomer, setCrossCustomer] = useState(null);
  const [outletList, setOutletList] = useState([]);

  const hotelReducer = useSelector((state) => ({
    customerCrossReports: state.hotelReducer.customerCrossReports,
    outletForDropDown: state.hotelReducer.outletForDropDown,
  }));

  useEffect(() => {
    if (
      props.filterData &&
      props.filterData.companyIds.length > 0 &&
      hotelReducer.outletForDropDown &&
      hotelReducer.outletForDropDown.length > 0
    ) {
      const outletList = [];

      const companyIds = props.filterData.companyIds.map(
        (company) => company.id
      );

      hotelReducer.outletForDropDown.map((outlet) => {
        if (companyIds.includes(outlet.outlet.companyId)) {
          outletList.push(outlet);
        }
      });
      setOutletList(outletList);
    }
  }, [props.filterData]);

  useEffect(() => {
    setCrossCustomer(null);
    if (outletList && outletList.length > 1) {
      setCrossCustomer({
        outlet1: outletList[0].outlet.id,
        outlet2: outletList[1].outlet.id,
      });
    }
  }, [outletList]);

  useEffect(() => {
    if (crossCustomer) {
      props.actions.userAction.getAllCustomerCrossReport(
        props.filterData,
        crossCustomer
      );
    }
  }, [crossCustomer]);

  const handleChangeFilter = (event) => {
    const field = event.target.name;
    let commonData = { ...crossCustomer };
    if (event.target.value !== crossCustomer.outlet2) {
      commonData[field] = event.target.value;
      return setCrossCustomer(commonData);
    }
  };

  const handleChangeFilter1 = (event) => {
    const field = event.target.name;
    let commonData = { ...crossCustomer };
    if (event.target.value !== crossCustomer.outlet1) {
      commonData[field] = event.target.value;
      return setCrossCustomer(commonData);
    }
  };

  return (
    <div className="">
      {outletList.length > 1 && crossCustomer && (
        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: "calc(100vh - 304px)" }}>
            <Table
              stickyHeader
              aria-label="sticky table"
              sx={{ minWidth: 750 }}
              size={"medium"}
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">Outlet1</TableCell>
                  <TableCell align="center">Outlet2</TableCell>
                  <TableCell align="center">Total Customer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">
                    <FormControl sx={{ width: "270px" }}>
                      <Select
                        id="demo-simple-select"
                        value={crossCustomer.outlet1}
                        name="outlet1"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={handleChangeFilter}
                      >
                        {outletList.map((filterType, index) => (
                          <MenuItem key={index} value={filterType.outlet.id}>
                            {filterType.outlet.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    <FormControl sx={{ width: "270px" }}>
                      <Select
                        id="demo-simple-select"
                        value={crossCustomer.outlet2}
                        name="outlet2"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={handleChangeFilter1}
                      >
                        {outletList.map((filterType, index) => (
                          <MenuItem key={index} value={filterType.outlet.id}>
                            {filterType.outlet.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    {hotelReducer.customerCrossReports}
                  </TableCell>
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

export default connect(null, mapDispatchToProps)(Cross);
