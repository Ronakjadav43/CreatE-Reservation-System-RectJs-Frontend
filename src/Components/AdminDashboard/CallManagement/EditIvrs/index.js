/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, DialogActions } from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { bindActionCreators } from "redux";
import ReactAudioPlayer from "react-audio-player";
import { connect, useDispatch, useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import * as UserAction from "../../../../Action/AdminDashboard";
import ENVIRONMENT_VARIABLES from "../../../../environment.config";
import CustomerProfile from "../CustomerProfile";
import {
  SET_INVISIBLE_DISABLE_OUTLET,
  SET_INVISIBLE_SELECTION,
  SET_VISIBLE_DISABLE_OUTLET,
  SET_VISIBLE_SELECTION,
} from "../../../../utils/AdminDashboard/Constant";
import "./style.scss";
import {
  ActionType,
  handlePermission,
  Modules,
} from "../../../../utils/userAccess";

let moment = require("moment-timezone");

const EditIvrs = (props) => {
  const { selectedIvrsDetails, handleCloseIvrsDetails, handleSaveEditTicket } =
    props;

  const dispatch = useDispatch();

  const [ivrsInfos, setIvrsInfos] = useState([]);
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(true);

  const [ivrsData, setIvrsData] = useState({
    name: selectedIvrsDetails.name,
    caller: selectedIvrsDetails.from,
    number: selectedIvrsDetails.to,
    status: selectedIvrsDetails.status,
    date: selectedIvrsDetails.callstart,
    start: selectedIvrsDetails.callstart,
    end: selectedIvrsDetails.callstart,
    duration: selectedIvrsDetails.duration,
    isDone: selectedIvrsDetails.isDone,
    notes: selectedIvrsDetails.notes,
    outlet: selectedIvrsDetails.outlet,
    email: selectedIvrsDetails.email,
    logs: selectedIvrsDetails.logs,
    createdAt: selectedIvrsDetails.createdAt,
    IvrsVoiceCall: selectedIvrsDetails.IvrsVoiceCall,
  });

  const hotelReducer = useSelector((state) => ({
    ivrsInfo: state.hotelReducer.ivrsInfo,
    permission: state.hotelReducer.permission,
  }));

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

  useEffect(() => {
    dispatch({
      type: SET_INVISIBLE_DISABLE_OUTLET,
    });
    return () => {
      dispatch({
        type: SET_VISIBLE_DISABLE_OUTLET,
      });
    };
  }, []);

  useEffect(() => {
    if (hotelReducer.ivrsInfo) {
      setIvrsInfos(hotelReducer.ivrsInfo);
    }
  }, [hotelReducer.ivrsInfo]);

  const handleChange = (event) => {
    setIsUpdate(false);
    const field = event.target.name;
    let commonData = { ...ivrsData };
    commonData[field] = event.target.value;
    return setIvrsData(commonData);
  };

  const handleEditOutlet = () => {
    handleSaveEditTicket(ivrsData, selectedIvrsDetails.id);
    handleCloseIvrsDetails();
  };

  const handleIvrsDetailsChange = () => {
    let data = { ...selectedIvrsDetails };

    let updatedTag = [];
    if (data.tags) {
      updatedTag.push({
        id: data.tags.id,
        name: data.tags.name,
      });
    }

    const newUpdateData = {
      isDone: data.isDone,
      tags: updatedTag.length > 0 ? updatedTag : [],
      notes: ivrsData.notes,
    };

    props.actions.userAction.updateIvrsDetail(newUpdateData, data.id);
  };

  const handleOpenMarketing = () => {
    setOpen(true);
  };

  const handleCloseMarketing = () => {
    setOpen(false);
  };

  const handleSaveMarketing = () => {
    const data = {
      fromDate: moment(ivrsData.fromDate).format("DD-MM-YYYY"),
      toDate: moment(ivrsData.toDate).format("DD-MM-YYYY"),
    };
    props.actions.userAction.getIvrs(data);
  };

  return (
    <React.Fragment>
      {open && (
        <CustomerProfile
          open={open}
          handleCloseMarketing={handleCloseMarketing}
          selectedIvrsDetails={{ ...selectedIvrsDetails }}
          handleSaveMarketing={handleSaveMarketing}
        />
      )}
      <span
        open={open}
        onClose={handleCloseIvrsDetails}
      >
        <ValidatorForm
          onSubmit={() => handleEditOutlet()}
          autoComplete="off"
          className="1"
        >
          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseIvrsDetails}>
              <ArrowBackIcon /> BACK
            </Button>
          </DialogActions>

          <div className="ivrs-layout">
            <div className="ivrs-detail">
              <div className="ivrs-row">
                <span>Restaurant</span> <span>{ivrsData.outlet}</span>
              </div>
              <div className="ivrs-row">
                <span>Number</span> <span>{}</span>
              </div>
              <div className="ivrs-row">
                <span>Name</span> <span>{ivrsData.name}</span>
              </div>
              <div className="ivrs-row">
                <span>Caller</span> <span>{ivrsData.caller}</span>
              </div>

              <div className="ivrs-row">
                <span>Call Center</span> <span>{}</span>
              </div>
              <div className="ivrs-row">
                <span>Status</span> <span>{ivrsData.status}</span>
              </div>
              <div className="ivrs-row">
                <span>Date</span>

                <span> {moment(ivrsData.date).format("DD-MM-YYYY ")}</span>
              </div>
              <div className="ivrs-row">
                <span>Start</span>

                <span> {moment(ivrsData.start).format("hh:mm:ss A ")}</span>
              </div>
              <div className="ivrs-row">
                <span>End</span>
                <span>
                  {moment(ivrsData.end)
                    .add(ivrsData.duration, "seconds")
                    .format("DD-MM-YYYY hh:mm:ss A ")}
                </span>
              </div>
              <div className="ivrs-row">
                <span>Duration(s)</span> <span>{ivrsData.duration}</span>
              </div>

              {ivrsData.IvrsVoiceCall && (
                <div className="ivrs-row">
                  <span>Call Recording</span>
                  <span>
                    <ReactAudioPlayer
                      src={`${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${ivrsData.IvrsVoiceCall}`}
                      // autoPlay
                      controls
                      onLoadedMetadata
                    />
                  </span>
                </div>
              )}

              <div className="view-btn">
                <Button
                  disabled={props.selectedIvrsDetails.Customer === null}
                  variant="contained"
                  onClick={handleOpenMarketing}
                >
                  VIEW PROFILE
                </Button>
              </div>
              <div className="ivrs-row">
                <span>Notes</span>
                <span>
                  <TextValidator
                    className="w-100"
                    fullWidth
                    size="small"
                    margin="normal"
                    type="text"
                    name="notes"
                    value={ivrsData.notes}
                    multiline
                    rows={4}
                    placeholder="Enter Notes"
                    sx={{ marginTop: 0 }}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["Notes is required"]}
                  />
                </span>
              </div>
              <div className="footer-btn">
                <Button
                  disabled={
                    handlePermission(
                      hotelReducer.permission.permission,
                      Modules.CALLMANAGEMENT,
                      ActionType.update,
                      true
                    ) || isUpdate
                  }
                  variant="outlined"
                  onClick={handleIvrsDetailsChange}
                >
                  UPDATE
                </Button>
              </div>
            </div>
            <div className="ivrs-main">
              <span className="ivrsheader-text">Call Control Action Logs</span>
              <div className="ivrs-card">
                <span className="ivrs-card-text">Date</span>
                <div className="dates-inner">
                  {ivrsInfos.map((data, index) => (
                    <span key={index}>
                      {moment(data.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                    </span>
                  ))}
                </div>
              </div>

              <div className="ivrs-card">
                <span className="ivrs-card-text">Email</span>
                <div className="dates-inner">
                  {ivrsInfos.map((data, index) => (
                    <span key={index}>{data.IvrsDetails?.Customer?.email}</span>
                  ))}
                </div>
              </div>

              <div className="ivrs-card">
                <span className="ivrs-card-text">Description</span>
                <div className="dates-inner">
                  {ivrsInfos.map((data, index) => (
                    <span key={index}> {data.logs}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ValidatorForm>
      </span>
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(EditIvrs);
