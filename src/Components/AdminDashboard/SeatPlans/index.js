/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import BasicInformation from "./BasicInformation";
import { connect, useSelector } from "react-redux";
import { bindActionCreators } from "redux";

import * as UserAction from "../../../Action/AdminDashboard";
import FloorPlan from "./FloorPlan";
import PrivateRoom from "../SeatPlans/FloorPlan/PrivateRoom";

const SeatPlans = (props) => {
  const [activeTab, setActiveTab] = useState("basicInformation");
  const [outletSeatingTypes, setOutletSeatingTypes] = useState([]);
  const [outletSeatTypes, setOutletSeatTypes] = useState([]);
  const [seatingTypes, setSeatingTypes] = useState([]);
  const [seatTypes, setSeatTypes] = useState([]);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    outletSeatingInfo: state.hotelReducer.outletSeatingInfo,
    seatingType: state.hotelReducer.seatingType,
    seatType: state.hotelReducer.seatType,
    permission: state.hotelReducer.permission,
  }));

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      setActiveTab("basicInformation");
      props.actions.userAction.getOutletSeatingInfo(
        hotelReducer.selectedOutlet.outlet.id
      );
      props.actions.userAction.getSeatingType(
        hotelReducer.selectedOutlet.outlet.id
      );
      props.actions.userAction.getSeatType(
        hotelReducer.selectedOutlet.outlet.id
      );
    }
  }, [hotelReducer.selectedOutlet]);

  useEffect(() => {
    if (hotelReducer.outletSeatingInfo) {
      setOutletSeatingTypes([
        ...hotelReducer.outletSeatingInfo.OutletSeatingType,
      ]);
      setOutletSeatTypes([...hotelReducer.outletSeatingInfo.OutletSeatType]);
    }
  }, [hotelReducer.outletSeatingInfo]);

  useEffect(() => {
    if (hotelReducer.seatingType) {
      const filterSeatingType = hotelReducer.seatingType.filter(
        (seatingType) => seatingType.isActive === true
      );
      setSeatingTypes(filterSeatingType);
    }
  }, [hotelReducer.seatingType]);

  useEffect(() => {
    if (hotelReducer.seatType) {
      const filterSeatType = hotelReducer.seatType.filter(
        (seatType) => seatType.isActive === true
      );
      setSeatTypes(filterSeatType);
    }
  }, [hotelReducer.seatType]);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="user-groups">
      <h1 className="groups-header">Seat Management</h1>
      <h1 className="groups-header-2nd">Seat Plans</h1>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={activeTab}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="BASIC INFORMATION" value="basicInformation" />

              {outletSeatingTypes.map((outletSeatingTypes, index) => (
                <Tab
                  key={index}
                  label={outletSeatingTypes.SeatingType.name}
                  value={outletSeatingTypes.id.toString()}
                />
              ))}
            </TabList>
          </Box>

          <TabPanel value="basicInformation">
            <BasicInformation
              selectedOutlet={{ ...hotelReducer.selectedOutlet }}
              outletSeatingInfo={{
                ...hotelReducer.outletSeatingInfo,
                seatTypes: [...seatTypes],
                seatingTypes: [...seatingTypes],
              }}
              permission={{ ...hotelReducer.permission }}
            />
          </TabPanel>

          {outletSeatingTypes.map((outletSeatingType, index) => (
            <TabPanel value={outletSeatingType.id.toString()} key={index}>
              {outletSeatingType.SeatingType.name === "Private Room" ? (
                <PrivateRoom
                  outletSeatingType={{ ...outletSeatingType }}
                  selectedOutlet={{ ...hotelReducer.selectedOutlet }}
                  permission={{ ...hotelReducer.permission }}
                />
              ) : (
                <FloorPlan
                  outletSeatingType={{ ...outletSeatingType }}
                  outletSeatTypes={[...outletSeatTypes]}
                  selectedOutlet={{ ...hotelReducer.selectedOutlet }}
                  permission={{ ...hotelReducer.permission }}
                />
              )}
            </TabPanel>
          ))}
        </TabContext>
      </Box>
    </div>
  );
};
const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});
export default connect(null, mapDispatchToProps)(SeatPlans);
