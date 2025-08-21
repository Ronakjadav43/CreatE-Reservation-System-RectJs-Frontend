/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./style.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { connect, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";

import { TablePagination } from "@mui/material";
import {
  SET_INVISIBLE_SELECTION,
  SET_VISIBLE_SELECTION,
} from "../../../../utils/AdminDashboard/Constant";
import * as UserAction from "../../../../Action/AdminDashboard";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("{{BookingStartTime}}", "Start time of Reservation "),
  createData("{{BookingEndTime}}", "End time of Reservation"),
  createData("{{BookingDate}}", "Date when reservation took place"),
  createData("{{Salutation}}", "Salution of Customer e.g Mr.,Mrs.,Miss "),
  createData("{{CustomerName}}", "Name of customer of Reservation"),
  createData("{{CustomerNumber}}", "Contact info of Reservation"),

  createData("{{CustomerEmail}}", "Email details of Reservation"),
  createData("{{Pax}}", "Number of person of Reservation"),
  createData(
    "{{BookingType}}",
    "Booking type of Reservation e.g normal-reservation, event-booking, private-booking"
  ),
  createData(
    "{{DietaryRestriction}}",
    "Any dietary restriction provided while Reservation"
  ),
  createData(
    "{{SpecialRequest}}",
    "Any special request mentioned while Reservation"
  ),
  createData("{{Source}}", "Source of Reservation e.g social media, website, "),
  createData(
    "{{Status}}",
    "Status of Reservation e.g booked,cancelled,confirmed, etc.."
  ),
  createData(
    "{{Outlet}}",
    "At which outlet of the company Reservation took place"
  ),
  createData("{{Company}}", "At which company Reservation took place"),
  createData("{{Occasion}}", "Occassion of the Reservation"),
  createData(
    "{{TablePreference}}",
    "Seating Preference of Reservation e.g window or booth"
  ),
  createData("{{ConfirmationLink}}", "Confirmation link of Reservation"),
  createData("{{CancellationLink}}", "Cancellation link of Reservation"),
  createData("{{ReservationLink}}", "Reservation link for Outlet"),
  createData("{{DepositAmount}}", "Deposit Amount of Reservation"),
  createData("{{RemainingAmount}}", "Remaining Amount of Reservation"),
  createData("{{TotalAmount}}", "Total Amount of Reservation"),
  createData("{{ConfirmOrCancelLink}}", "Confirmation and Cancellation Link of Reservation"),
];

const ReservedKeywords = (props) => {
  const [rowsPerPage, setRowsPerPage] = useState(18);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch({
      type: SET_INVISIBLE_SELECTION,
    });
    return () => {
      dispatch({
        type: SET_VISIBLE_SELECTION,
      });
    };
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="user-groups">
      <h1 className="groups-header">System Settings</h1>
      <h1 className="groups-header-2nd">Reserved Keywords</h1>
      <Paper sx={{ width: "100%" }}>
        <TableContainer sx={{ maxHeight: "calc(100vh - 235px)" }}>
          <Table
            stickyHeader
            aria-label="sticky table"
            sx={{ minWidth: 750 }}
            size={"medium"}
          >
            <TableHead>
              <TableRow>
                <TableCell align="center">Reserved Keywords</TableCell>
                <TableCell align="left">Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="center">
                    {row.name}
                  </TableCell>
                  <TableCell align="left">{row.calories}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(ReservedKeywords);
