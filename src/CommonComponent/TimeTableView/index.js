/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import Timeline, { DateHeader, TimelineHeaders } from "react-calendar-timeline";
import { Box } from "@mui/material";
import { connect, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { isEmpty } from "lodash";

import * as UserAction from "../../Action/AdminDashboard";
import ReservationData from "../../Components/AdminDashboard/DashboardTimetableView/ReservationData";
import EventData from "../../Components/AdminDashboard/DashboardTimetableView/EventData";

import "react-calendar-timeline/lib/Timeline.css";
import "./style.scss";

let moment = require("moment-timezone");

const TimeLine = (props) => {
  const [items, setItems] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedTimlineData, setSelectedTimelineData] = useState(null);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);
  const timeline = useSelector((state) => state.hotelReducer.timeline);

  useEffect(() => {
    return () => {
      setItems([]);
      setGroups([]);
    };
  }, []);

  useEffect(() => {
    if (props.searchData && props.selectedOutlet) {
      setItems(null);
      props.actions.userAction.getTimetableView(
        props.selectedOutlet.outlet.id,
        props.searchData
      );
    }
  }, [props.searchData, props.selectedOutlet]);

  useEffect(() => {
    if (timeline && timeline.length > 0) {
      let tableDetails = [];
      let bookingData = [];
      timeline.map((seatingTableData) => {
        seatingTableData?.OutletTableBooking.map((tableBookindData) => {
          bookingData.push({
            id: Math.random() * 10,
            group: tableBookindData.outletTableId,
            title: `${tableBookindData?.Customer[0]?.name} ${tableBookindData?.Customer[0]?.lastName}`,
            start_time: moment(tableBookindData.bookingStartTime).toDate(),
            end_time: moment(tableBookindData.bookingEndTime).toDate(),
            canMove: true,
            canResize: false,
            demo: tableBookindData,
            tableBookindId: tableBookindData.id,
            itemProps: {
              onDoubleClick: () => {
                handleOpenTimelineData({
                  ...tableBookindData,
                  tableName: seatingTableData.name,
                });
              },
              style: {
                color: "black",
                background: "#ff5b33",
              },
            },
          });
        });
      });

      timeline.map((seatingData, index) => {
        tableDetails.push({
          id: seatingData.id,
          title: `${seatingData.name} | ${seatingData?.Table?.noOfPerson} PAX`,
        });
      });
      setGroups(tableDetails);
      setItems([...bookingData]);
    }
  }, [timeline]);

  useEffect(() => {
    if (props.filterBookingType && props.filterBookingType.length > 0) {
      let bookingData = [];
      props.filterBookingType
        .filter((data) => data.isChecked)
        .map((checkedData) =>
          timeline.map((seatingTableData) => {
            seatingTableData?.OutletTableBooking.map((tableBookindData) => {
              if (
                checkedData.name ===
                tableBookindData?.OutletInvoice?.bookingType
              ) {
                bookingData.push({
                  id: Math.random() * 10,
                  group: tableBookindData.outletTableId,
                  title: `${tableBookindData?.Customer[0]?.lastName}`,
                  start_time: moment(
                    tableBookindData.bookingStartTime
                  ).toDate(),
                  end_time: moment(tableBookindData.bookingEndTime).toDate(),
                  canMove: true,
                  canResize: false,
                  tableBookindId: tableBookindData.id,
                  itemProps: {
                    onDoubleClick: () => {
                      handleOpenTimelineData({
                        ...tableBookindData,
                        tableName: seatingTableData.name,
                      });
                    },
                    style: {
                      color: "black",
                      background: "#ff5b33",
                      // background: randomColor({ luminosity: "light" }),
                    },
                  },
                });
              }
            });
          })
        );
      setItems([...bookingData]);
    }
  }, [props.filterBookingType]);

  const handleOpenTimelineData = (data) => {
    setSelectedTimelineData(data);
    if (data.OutletInvoice.bookingType === "NORMAL_RESERVATION") {
      setReservationOpen(true);
    } else {
      setEventOpen(true);
    }
  };

  const handleCloseTimelineData = () => {
    setReservationOpen(false);
    setEventOpen(false);
  };

  const handleMove = (itemId, dragTime, newGroupOrder) => {
    var date = new Date(dragTime);
    var Time = moment(date).format("HH:mm");
    const findItem = items.find((item) => item.id === itemId);
    const group = groups[newGroupOrder];

    if (group.id !== null && findItem) {
      const itemUpdate = items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              start_time: dragTime,
              end_time: dragTime + (item.end_time - item.start_time),
              group: group.id,
            }
          : item
      );
      setItems(itemUpdate);

      props.actions.userAction.changeTablePosition(
        props.selectedOutlet.outlet.id,
        {
          date: moment(props.searchData.date).format("DD-MM-YYYY"),
          time: Time,
          outletTableBookingId: findItem.tableBookindId,
          toOutleTableId: group.id,
        }
      );
    }
  };

  return (
    <React.Fragment>
      {reservationOpen && (
        <ReservationData
          open={reservationOpen}
          handleClose={handleCloseTimelineData}
          selectedRow={selectedTimlineData}
        />
      )}

      {eventOpen && (
        <EventData
          open={eventOpen}
          handleClose={handleCloseTimelineData}
          selectedRow={selectedTimlineData}
        />
      )}

      {props.selectedOutlet && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            width: "100vw",
            maxWidth: "calc(100vw - 450px)",
            margin: "0 auto",
            paddingTop: "10px",
          }}
        >
          <div className="time-line">
            {(!isEmpty(items) || Array.isArray(items)) && (
              <React.Fragment>
                <span className="time-header">
                  {moment(props.searchData.date).format("dddd, MMMM D, YYYY")}
                </span>
                <Timeline
                  className="time-line-inner"
                  timeSteps={{
                    hour: 1,
                    minute: props.selectedOutlet.outlet.timeSlotInterval,
                  }}
                  groups={groups}
                  items={items}
                  onItemMove={handleMove}
                  visibleTimeStart={Math.floor(props.search.fromDate.getTime())}
                  visibleTimeEnd={Math.floor(props.search.toDate.getTime())}
                  lineHeight={50}
                >
                  <TimelineHeaders>
                    <DateHeader labelFormat="HH:mm"></DateHeader>
                  </TimelineHeaders>
                </Timeline>
              </React.Fragment>
            )}
          </div>
        </Box>
      )}
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(TimeLine);
