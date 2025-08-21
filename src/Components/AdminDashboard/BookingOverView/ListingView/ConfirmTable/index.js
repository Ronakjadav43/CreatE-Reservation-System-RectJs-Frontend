/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Switch,
} from "@mui/material";
import { Card } from "@mui/material";
import { bindActionCreators } from "redux";
import { FormControl } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { connect, useDispatch, useSelector } from "react-redux";
import moment from "moment-timezone";
import Draggable from "react-draggable";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Xarrow from "react-xarrows";
import { concat } from "lodash";
import { Stack } from "@mui/system";
import { ReactSVG } from "react-svg";

import * as UserAction from "../../../../../Action/AdminDashboard";
import {
  getGlobalStyle,
  getReservationStyle,
  getSVGColour,
  getTableShape,
} from "../../../../../utils/tableShapeAdjustment";
import ConfirmationPopUp from "../../../../../CommonComponent/ConfirmationPopUp/index";
import "./style.scss";
import {
  MANAGE_FLOOR_PLAN,
  RESET_BOOKING_TABLES,
  RESET_MERGE_TABLES,
  RESET_SECTION_TABLES,
} from "../../../../../utils/AdminDashboard/Constant";

const ConfirmTable = (props) => {
  const dispatch = useDispatch();
  const { handleCloseConfirmTable, open } = props;

  const [tableListForMerge, setTableListForMerge] = useState([]);
  const [openUpdateStatus, setOpenUpdateStatus] = useState(false);
  const [activeTableSection, setActiveTabelSection] = useState(false);
  const [seatType, setSeatType] = useState(null);
  const [seatingInfo, setSeatingInfo] = useState([]);
  const [outletSectionTables, setOutletSectionTables] = useState([]);

  const selectedOutlet = useSelector(
    (state) => state.hotelReducer.selectedOutlet
  );

  const bookingTables = useSelector(
    (state) => state.hotelReducer.bookingTables
  );

  const outletSeatingInfo = useSelector(
    (state) => state.hotelReducer.outletSeatingInfo
  );

  const sectionTables = useSelector(
    (state) => state.hotelReducer.sectionTables
  );
  const mergedTables = useSelector((state) => state.hotelReducer.mergedTables);

  useEffect(() => {
    dispatch({
      type: MANAGE_FLOOR_PLAN,
    });
    return () => {
      dispatch({
        type: RESET_BOOKING_TABLES,
      });
      dispatch({
        type: RESET_SECTION_TABLES,
      });
      dispatch({
        type: RESET_MERGE_TABLES,
      });
      dispatch({
        type: MANAGE_FLOOR_PLAN,
      });
    };
  }, []);

  useEffect(() => {
    if (selectedOutlet) {
      if (!outletSeatingInfo) {
        props.actions.userAction.getOutletSeatingInfo(selectedOutlet.outlet.id);
      }
    }
  }, [selectedOutlet]);

  useEffect(() => {
    if (outletSeatingInfo && outletSeatingInfo?.OutletSeatingType?.length > 0) {
      const filterOutletSeatType = outletSeatingInfo.OutletSeatingType.filter(
        (seatType) => seatType.SeatingType.name !== "Private Room"
      );
      if (filterOutletSeatType && filterOutletSeatType.length > 0) {
        setSeatType(filterOutletSeatType[0].id);
        setSeatingInfo(filterOutletSeatType);
        getBookingTablesAction(filterOutletSeatType[0].id);
      }
    }
  }, [outletSeatingInfo]);

  useEffect(() => {
    if (sectionTables) {
      const tables = [];

      sectionTables
        .filter((tables) => tables.isPrivate === false)
        .map((section) => {
          section.OutletTableSection.map((outletTable) => {
            tables.push({ ...outletTable, color: section.color });
          });
        });
      setOutletSectionTables([...tables]);
    }
  }, [sectionTables]);

  const getBookingTablesAction = (seatType) => {
    if (props.bookingType === "NORMAL_RESERVATION") {
      props.actions.userAction.getBookingTable(
        { ...props.getTableInfo, outletSeatingTypeId: seatType },
        selectedOutlet.outlet.id
      );
    } else if (props.bookingType === "PRIVATE_EVENT") {
      const data = {
        ...props.getTableInfo,
        startDate: moment(props.getTableInfo.startDate).format("DD-MM-YYYY"),
        endDate: moment(props.getTableInfo.endDate).format("DD-MM-YYYY"),
        startTime: moment(props.getTableInfo.startTime).format("HH:mm"),
        endTime: moment(props.getTableInfo.endTime).format("HH:mm"),
        outletSeatingTypeId: seatType,
      };
      props.actions.userAction.getBookingEvent(
        { ...data },
        selectedOutlet.outlet.id
      );
    } else if (props.bookingType === "PRIVATE_ROOM_CREATION") {
      props.actions.userAction.getTables(seatType);
    }
    props.actions.userAction.getTableMerge(seatType);
    props.actions.userAction.getSectionTables(seatType);
  };

  const handleChangeSeatType = (event) => {
    setSeatType(event.target.value);
    getBookingTablesAction(event.target.value);
  };

  const handleChangeActiveSections = (event) => {
    setActiveTabelSection(!activeTableSection);
    setTableListForMerge([]);
  };

  const handleSave = () => {
    let paxCapacity = 0;
    tableListForMerge.map((table) => (paxCapacity += table.Table.noOfPerson));
    if (props.getTableInfo.noOfPerson > paxCapacity) {
      setOpenUpdateStatus(true);
    } else {
      props.confirmTables(tableListForMerge, seatType);
      setTableListForMerge([]);
    }
  };

  const handleUpdate = () => {
    props.confirmTables(tableListForMerge, seatType);
    setTableListForMerge([]);
  };

  const handleClick = (singleTable) => {
    let paxCapacity = 0;
    tableListForMerge.map((table) => (paxCapacity += table.Table.noOfPerson));

    if (
      !singleTable.OutletTableBooking ||
      (singleTable.OutletTableBooking &&
        singleTable.OutletTableBooking.length === 0)
    ) {
      let mergingTableList = [...tableListForMerge];
      const findMergeTable = mergingTableList.find(
        (table) => table.id === singleTable.id
      );
      if (findMergeTable) {
        const index = mergingTableList.indexOf(findMergeTable);
        mergingTableList.splice(index, 1);
      } else {
        if (activeTableSection) {
          const findTable = outletSectionTables.find(
            (table) => table.outletTableId === singleTable.id
          );
          if (findTable) {
            const findTables = outletSectionTables.filter(
              (table) => table.tableSectionId === findTable.tableSectionId
            );
            const outletTables = bookingTables.filter((bookingTable) => {
              if (
                findTables.find(
                  (table) =>
                    table.outletTableId === bookingTable.id &&
                    (!bookingTable.OutletTableBooking ||
                      (bookingTable.OutletTableBooking &&
                        bookingTable.OutletTableBooking.length === 0))
                )
              ) {
                return bookingTable;
              }
            });
            if (outletTables && outletTables.length === findTables.length) {
              let sectionPaxCapacity = 0;
              outletTables.map(
                (table) => (sectionPaxCapacity += table.Table.noOfPerson)
              );
              mergingTableList = concat(mergingTableList, outletTables);
            }
          }
        } else {
          mergingTableList.push(singleTable);
        }
      }
      setTableListForMerge(mergingTableList);
    }
  };

  const renderTableInfo = (seatingTable) => {
    if (
      selectedOutlet &&
      seatingTable.OutletTableBooking &&
      seatingTable.OutletTableBooking.length > 0
    ) {
      const randerData = seatingTable.OutletTableBooking.map(
        (outletTableBooking, index) => {
          const customerInfo = outletTableBooking?.Customer[0];
          if (index < 3) {
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
    }
  };

  const handleCloseUpdateStatus = () => {
    setOpenUpdateStatus(false);
  };

  const getMergeTableConnected = (mergedTables) => {
    if (mergedTables) {
      let tableList = [];
      const mergeTableList = mergedTables.map((groupPossibility) => {
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

  return (
    <React.Fragment>
      {openUpdateStatus && (
        <ConfirmationPopUp
          open={openUpdateStatus}
          title="Warning"
          handleClose={handleCloseUpdateStatus}
          message="You are selecting a table where pax is less than the pax that you are making a reservation for, please confirm if you want to proceed."
          buttonTitle="CONFIRM"
          handleUpdate={handleUpdate}
        />
      )}

      <Dialog open={open} className="user-form-dailog floor_plan_layout">
        <DialogContent className="popup-body" sx={{ minWidth: "1300px" }}>
          <div>
            <Box className="indoor" pb={2}>
              <div className="hed">
                <div className="popup-input-box">
                  {(props.isSection === undefined || props.isSection) && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography>Highlight all sections</Typography>
                      <Switch
                        className="switch-status"
                        checked={activeTableSection}
                        onClick={(event) => handleChangeActiveSections(event)}
                      />
                    </Stack>
                  )}
                </div>
                {seatType && (
                  <div className="popup-input-box space-box">
                    <Typography>Space Type</Typography>
                    <FormControl>
                      <Select
                        sx={{ minWidth: "200px" }}
                        size="small"
                        value={seatType}
                        name="outletSeatingTypeId"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={handleChangeSeatType}
                      >
                        {seatingInfo.map((seatingType, index) => (
                          <MenuItem key={index} value={seatingType.id}>
                            {seatingType?.SeatingType?.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )}
              </div>
              <div className="floor-plan-main">
                <div className="floor-plan">
                  {bookingTables.map((table) => (
                    <React.Fragment>
                      <Draggable
                        id={table.id}
                        disabled
                        bounds="parent"
                        position={{
                          x: table.xPosition,
                          y: table.yPosition,
                        }}
                        key={table.id}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                      >
                        <Card
                          id={table.id}
                          className={table.Table.shape}
                          style={{
                            ...getTableShape(
                              table.Table.shape,
                              table.Table.noOfPerson
                            ),
                          }}
                          onClick={() => handleClick(table)}
                        >
                          <ReactSVG
                            style={{
                              fill: getReservationStyle(
                                table,
                                tableListForMerge,
                                activeTableSection,
                                outletSectionTables
                              ),
                            }}
                            id={table.id}
                            className="table-image"
                            src={
                              getTableShape(
                                table.Table.shape,
                                table.Table.noOfPerson
                              ).svgUrl
                            }
                          />

                          <div className="table-infos">
                            <div className="info-inner ">
                              {table ? (
                                <div className="info-text">
                                  {Number(tableListForMerge.indexOf(table)) !==
                                  -1
                                    ? Number(tableListForMerge.indexOf(table)) +
                                      1
                                    : table.name}
                                </div>
                              ) : (
                                <div className="info-text">{table.name}</div>
                              )}

                              <div className="info-text">
                                {table.Table.noOfPerson}PX
                              </div>
                            </div>
                            {renderTableInfo(table)}
                          </div>
                        </Card>
                      </Draggable>
                      {mergedTables &&
                        mergedTables.length > 0 &&
                        getMergeTableConnected(mergedTables)}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </Box>
          </div>

          <DialogActions className="primary-btn popup-btn p-0">
            <Button variant="outlined" onClick={handleCloseConfirmTable}>
              <CloseOutlinedIcon /> Close
            </Button>
            <Button
              disabled={tableListForMerge.length < 1}
              variant="contained"
              onClick={handleSave}
            >
              <SaveOutlinedIcon /> SAVE
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(ConfirmTable);
