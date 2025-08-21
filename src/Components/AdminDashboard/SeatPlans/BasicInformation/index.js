/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Checkbox from "@mui/material/Checkbox";
import { bindActionCreators } from "redux";
import { isEmpty } from "lodash";
import { connect } from "react-redux";

import * as UserAction from "../../../../Action/AdminDashboard";
import {
  ActionType,
  handlePermission,
  Modules,
} from "../../../../utils/userAccess";
import "./style.scss";

const BasicInformation = (props) => {
  const [isSeatingTypeSetError, setIsSeatingTypeSetError] = useState(false);
  const [outletSeatingInfo, setOutletSeatingInfo] = useState(null);

  useEffect(() => {
    setOutletSeatingInfo(null);
    return () => {
      setOutletSeatingInfo(null);
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(props.outletSeatingInfo)) {
      const { seatTypes, seatingTypes, OutletSeatType, OutletSeatingType } =
        props.outletSeatingInfo;
      if (seatTypes && seatingTypes && OutletSeatType && OutletSeatingType) {
        const mappedOutletSeatingTypes = seatingTypes.map((seatingType) => {
          const findSeatingType = OutletSeatingType.find(
            (outletSeatingType) =>
              outletSeatingType.seatingTypeId === seatingType.id
          );
          if (findSeatingType) return { ...seatingType, isChecked: true };
          else return { ...seatingType, isChecked: false };
        });
        const mappedOutletSeatTypes = seatTypes.map((seatType) => {
          const findSeatType = OutletSeatType.find(
            (outletSeatType) => outletSeatType.seatTypeId === seatType.id
          );
          if (findSeatType) return { ...seatType, isChecked: true };
          else return { ...seatType, isChecked: false };
        });
        setOutletSeatingInfo({
          seatingType: mappedOutletSeatingTypes,
          seatType: mappedOutletSeatTypes,
        });
      }
    }
  }, [props.outletSeatingInfo]);

  const handleSaveSeatingTypeInfo = () => {
    if (isSeatingTypeSetError) {
      props.actions.userAction.updateOutletSeatingBasicInfo(
        outletSeatingInfo,
        props.selectedOutlet.outlet.id
      );
    }
  };

  const handleChangeFilter = (e) => {
    const value = e.target.value[e.target.value.length - 1];
    let tempData = outletSeatingInfo.seatingType.map((data) =>
      data.name === value ? { ...data, isChecked: !data.isChecked } : data
    );
    setOutletSeatingInfo({ ...outletSeatingInfo, seatingType: tempData });
  };

  const handleSeatType = (e) => {
    const value = e.target.value[e.target.value.length - 1];
    let tempData = outletSeatingInfo.seatType.map((data) =>
      data.name === value ? { ...data, isChecked: !data.isChecked } : data
    );
    setOutletSeatingInfo({ ...outletSeatingInfo, seatType: tempData });
  };

  useEffect(() => {
    if (outletSeatingInfo) {
      const seatingType = outletSeatingInfo.seatingType.filter(
        (outletSeatingType) => outletSeatingType.isChecked === true
      );

      if (seatingType.length > 0) {
        setIsSeatingTypeSetError(true);
      } else {
        setIsSeatingTypeSetError(false);
      }
    }
  }, [outletSeatingInfo]);

  return (
    <React.Fragment>
      {outletSeatingInfo && (
        <Box className="user-groups-search">
          <div className="basic-info-box">
            <div className="add-user-groups up-btn">
              <Button
                disabled={handlePermission(
                  props.permission.permission,
                  Modules.SEATPLANS,
                  ActionType.update,
                  true
                )}
                className="add-btn"
                variant="contained"
                onClick={handleSaveSeatingTypeInfo}
              >
                <AddOutlinedIcon /> UPDATE
              </Button>
            </div>
            <div className="box-inner">
              <div className="input-box">
                <Typography>Space Type</Typography>
                <FormControl sx={{ width: 450 }} size="small">
                  <Select
                    multiple
                    value={outletSeatingInfo.seatingType}
                    onChange={handleChangeFilter}
                    renderValue={(selected) => {
                      selected = outletSeatingInfo.seatingType.filter(
                        (seatingType) => seatingType.isChecked === true
                      );
                      const renderData = selected.map((data) => data.name);
                      return renderData.join(", ");
                    }}
                  >
                    {outletSeatingInfo.seatingType.map((option) => (
                      <MenuItem key={option.id} value={option.name}>
                        <ListItemIcon>
                          <Checkbox checked={option.isChecked} />
                        </ListItemIcon>
                        <ListItemText primary={option.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {!isSeatingTypeSetError && (
                  <p className="danger">Space Type Is Required</p>
                )}
              </div>
              <div className="input-box">
                <Typography>Seat Type</Typography>
                <FormControl sx={{ width: 450 }} size="small">
                  <Select
                    multiple
                    value={outletSeatingInfo.seatType}
                    name="seatType"
                    onChange={handleSeatType}
                    renderValue={(selected) => {
                      selected = outletSeatingInfo.seatType.filter(
                        (person) => person.isChecked === true
                      );
                      const renderData = selected.map((user) => user.name);
                      return renderData.join(", ");
                    }}
                  >
                    {outletSeatingInfo.seatType.map((option) => (
                      <MenuItem key={option.id} value={option.name}>
                        <ListItemIcon>
                          <Checkbox checked={option.isChecked} />
                        </ListItemIcon>
                        <ListItemText primary={option.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
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
export default connect(null, mapDispatchToProps)(BasicInformation);
