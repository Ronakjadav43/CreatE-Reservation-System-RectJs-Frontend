/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { Box, Button, Card, Menu } from "@mui/material";
import Draggable from "react-draggable";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { connect, useSelector } from "react-redux";
import Xarrow from "react-xarrows";
import moment from "moment-timezone";
import { bindActionCreators } from "redux";
import { ReactSVG } from "react-svg";

import { getGlobalStyle } from "../../utils/tableShapeAdjustment";
import * as UserAction from "../../Action/AdminDashboard";
import NewReservation from "../../Components/AdminDashboard/BookingOverView/SeatingView/NewReservation";
import ConfirmationPopUp from "../ConfirmationPopUp";

import "./style.scss";

const FloorPlan = (props) => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [openTableMenu, setOpenTableMenu] = useState(null);
  const open = Boolean(openTableMenu);
  const [isTableSelectedForMove, setIsTableSelectedForMove] = useState(false);
  const [tableListForMove, setTableListForMove] = useState([]);
  const [isOpenConfirmMsg, setIsOpenConfirmMsg] = useState(false);
  const [isOpenWarningMsg, setIsOpenWarningMsg] = useState(false);
  const [warningMsg, setWarningMsg] = useState("");
  const [reservationType, setReservationType] = useState("");
  const [isOpenNewReservation, setIsOpenNewReservation] = useState(false);

  const selectedOutlet = useSelector(
    (state) => state.hotelReducer.selectedOutlet
  );
  const mergedTables = useSelector((state) => state.hotelReducer.mergedTables);

  useEffect(() => {
    if (props.selectedInvoice) {
      setIsTableSelectedForMove(false);
      setSelectedTable(null);
      setTableListForMove([]);
    }
  }, [props.selectedInvoice]);

  const handleClick = (event, selectedTable) => {
    props.setInvoiceData && props.setInvoiceData(null);
    if (!isTableSelectedForMove) {
      setOpenTableMenu(event.currentTarget);
      setSelectedTable(selectedTable);
    } else {
      tableListForMove.push(selectedTable);
      if (
        tableListForMove[0]?.Table.noOfPerson <=
        tableListForMove[1]?.Table.noOfPerson
      ) {
        if (selectedTable.OutletTableBooking.length > 0) {
          setIsOpenConfirmMsg(true);
          setWarningMsg("Are you sure want to override reservation?");
        } else {
          setIsOpenConfirmMsg(true);
          setWarningMsg("Are you sure want to move reservation?");
        }
      } else {
        setIsOpenWarningMsg(true);
        setWarningMsg(
          "You are selecting a table where pax is less than the pax that you are moving a Table, please confirm if you want to proceed."
        );
      }
    }
  };

  const getSelectedTableMenu = (selectedTable) => {
    let menuInnerButton = null;
    if (selectedTable?.OutletTableBooking.length > 0) {
      const bookingTable = selectedTable?.OutletTableBooking[0];
      menuInnerButton = (
        <Box className="menu-btn" sx={{}}>
          {bookingTable?.status !== "SEATED" ? (
            <Button
              disabled={props.hasUpdatePermission}
              variant="outlined"
              onClick={() => {
                handleTableStatus(
                  "SEATED",
                  props.filterData.date,
                  selectedTable?.OutletTableBooking[0].id
                );
              }}
            >
              <Diversity3Icon />
              Seated
            </Button>
          ) : (
            <Button
              disabled={props.hasUpdatePermission}
              variant="outlined"
              onClick={() => {
                handleTableStatus(
                  "LEFT",
                  props.filterData.date,
                  selectedTable?.OutletTableBooking[0].id
                );
              }}
            >
              <ExitToAppIcon />
              Left
            </Button>
          )}

          <Button
            disabled={props.hasUpdatePermission}
            variant="outlined"
            onClick={() => {
              handleTableMove();
            }}
          >
            <SyncAltIcon />
            Move
          </Button>
        </Box>
      );
    } else {
      menuInnerButton = (
        <Box className="menu-btn" sx={{}}>
          <Button
            disabled={props.hasCreatePermission}
            variant="outlined"
            onClick={() => {
              handleOpenNewReservation();
              setReservationType("walkIn");
            }}
          >
            Add Walk-in
          </Button>
          <Button
            disabled={props.hasCreatePermission}
            variant="outlined"
            onClick={() => {
              handleOpenNewReservation();
              setReservationType("reservation");
            }}
          >
            Add Reservation
          </Button>
        </Box>
      );
    }

    const handleClose = () => {
      setOpenTableMenu(null);
    };

    return (
      <Menu
        anchorEl={openTableMenu}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            backgroundColor: "#F6F6F6",
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {menuInnerButton}
      </Menu>
    );
  };

  const selectedTableColour = (seatingTable) => {
    if (isTableSelectedForMove) {
      const findTable = tableListForMove.find(
        (data) => data.id === seatingTable.id
      );
      if (findTable) {
        return "cornflowerblue";
      }
    } else if (props.selectedInvoice) {
      const findTable = props.selectedInvoice.tableList.find(
        (data) => data?.OutletTable.id === seatingTable.id
      );
      if (findTable) {
        return "cornflowerblue";
      }
    }
    return null;
  };

  const renderTableInfo = (seatingTable) => {
    if (selectedOutlet) {
      if (seatingTable.OutletTableBooking.length > 0) {
        const randerData = seatingTable.OutletTableBooking.map(
          (outletTableBooking, index) => {
            const customerInfo = outletTableBooking?.Customer[0];
            if (index === 0) {
              return (
                <div className="info-inner" key={index}>
                  <span className="info-text">
                    {seatingTable.OutletTableBooking[0].seatStartTime && (
                      <span>{seatingTable.timeSpent} Min</span>
                    )}
                    <span>{customerInfo.OutletInvoiceDbModel?.noOfPerson}</span>
                    <span>{customerInfo.name}</span>
                    <span>
                      {moment(outletTableBooking?.bookingStartTime)
                        .tz(selectedOutlet.outlet.timezone)
                        .format("hh:mm A")}
                    </span>
                  </span>
                </div>
              );
            } else if (index < 3) {
              return (
                <div className="info-inner" key={index}>
                  <span className="info-chip">
                    {moment(outletTableBooking.bookingStartTime)
                      .tz(selectedOutlet.outlet.timezone)
                      .format("hh:mm A")}
                  </span>
                </div>
              );
            }
          }
        );
        return randerData;
      } else {
        return (
          <div className="info-inner">
            <span>{seatingTable.name}</span>
            <span>{seatingTable.Table.noOfPerson}PX</span>
          </div>
        );
      }
    }
  };

  const getMergeTableConnected = (mergedTables) => {
    if (mergedTables?.length > 0) {
      let tableList = [];
      const mergeTableList = mergedTables.map((groupPossibility, index) => {
        return groupPossibility.GroupPossibility.map((outletGroupTable) => {
          return outletGroupTable.OutletGroupTable.map((singleTable, index) => {
            if (index < outletGroupTable.OutletGroupTable.length - 1) {
              const firstTable = singleTable;
              const secondTable = outletGroupTable.OutletGroupTable[index + 1];
              const findTable = tableList.find(
                (table) =>
                  table.t1 === firstTable.OutletTable.id &&
                  table.t2 === secondTable.OutletTable.id
              );

              if (findTable) {
                return null;
              }
              tableList.push({
                t1: firstTable.OutletTable.id,
                t2: secondTable.OutletTable.id,
              });
              return (
                <Xarrow
                  key={index}
                  color="#EF5350"
                  showHead={false}
                  start={firstTable.OutletTable.id.toString()}
                  end={secondTable.OutletTable.id.toString()}
                />
              );
            } else {
              return null;
            }
          });
        });
      });
      return mergeTableList;
    }
  };

  const handleOpenNewReservation = () => {
    setIsOpenNewReservation(true);
  };

  const handleCloseNewReservation = () => {
    setIsOpenNewReservation(false);
  };

  const handleCloseWarningMsg = () => {
    setIsOpenWarningMsg(false);
    setIsOpenConfirmMsg(false);
    setIsTableSelectedForMove(false);
    setTableListForMove([]);
  };

  const handleSaveTableMove = (tableListForMove) => {
    const data = { tableListForMove, date: props.filterData.date };
    props.actions.userAction.moveTableReservation(
      selectedOutlet.outlet.id,
      data
    );
    setTableListForMove([]);
    setIsTableSelectedForMove(false);
    setSelectedTable(null);
  };

  const handleBookNewReservation = (bookingData) => {
    props.actions.userAction.newBookingReservation(
      bookingData,
      selectedOutlet.outlet.id
    );
    setSelectedTable(null);
  };

  const handleTableStatus = (status, date, id) => {
    const data = { outletTableBookingId: id, status, date };
    props.actions.userAction.updateSeatingTable(selectedOutlet.outlet.id, data);
    setSelectedTable(null);
  };

  const handleTableMove = () => {
    setIsTableSelectedForMove(true);
    tableListForMove.push(selectedTable);
  };

  return (
    <React.Fragment>
      {isOpenNewReservation && (
        <NewReservation
          open={isOpenNewReservation}
          selectedTable={selectedTable}
          selectedOutlet={selectedOutlet}
          reservationType={reservationType}
          handleCloseNewReservation={handleCloseNewReservation}
          handleBookNewReservation={handleBookNewReservation}
          date={props.filterData.date}
        />
      )}

      {isOpenConfirmMsg && (
        <ConfirmationPopUp
          open={isOpenConfirmMsg}
          data={[...tableListForMove]}
          title={"Move"}
          message={warningMsg}
          handleClose={handleCloseWarningMsg}
          handleUpdate={handleSaveTableMove}
        />
      )}

      {isOpenWarningMsg && (
        <ConfirmationPopUp
          open={isOpenWarningMsg}
          data={[...tableListForMove]}
          title={"Warning"}
          message={warningMsg}
          handleClose={handleCloseWarningMsg}
          handleUpdate={handleSaveTableMove}
        />
      )}

      {props.seatingViewData.map((seatingTable) => (
        <React.Fragment>
          <Draggable
            id={seatingTable.id}
            disabled
            bounds="parent"
            position={{
              x: seatingTable.xPosition,
              y: seatingTable.yPosition,
            }}
            key={seatingTable.id}
          >
            <Card
              id={seatingTable.id}
              className={seatingTable.Table.shape}
              style={{
                ...getGlobalStyle(seatingTable, selectedTable),
              }}
              onClick={(e) => handleClick(e, seatingTable)}
            >
              <ReactSVG
                style={{
                  fill: selectedTableColour(seatingTable)
                    ? selectedTableColour(seatingTable)
                    : getGlobalStyle(seatingTable, selectedTable).borderColor,
                }}
                id={seatingTable.id}
                className="table-image"
                src={getGlobalStyle(seatingTable, selectedTable).svgUrl}
              />
              <div className="table-infos">{renderTableInfo(seatingTable)}</div>
            </Card>
          </Draggable>
          {getMergeTableConnected(mergedTables)}
        </React.Fragment>
      ))}
      {selectedTable && getSelectedTableMenu(selectedTable)}
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(FloorPlan);
