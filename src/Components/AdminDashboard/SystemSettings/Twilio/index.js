/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { connect, useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { useNavigate } from "react-router-dom";

import {
  SET_INVISIBLE_COMPANY_SELECTION,
  SET_INVISIBLE_SELECTION,
  SET_VISIBLE_COMPANY_SELECTION,
  SET_VISIBLE_SELECTION,
} from "../../../../utils/AdminDashboard/Constant";
import * as UserAction from "../../../../Action/AdminDashboard";
import {
  ActionType,
  Modules,
  handlePermission,
} from "../../../../utils/userAccess";
import "./style.scss";

const Twilio = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const companies = useSelector((state) => state.hotelReducer.companies);
  const permission = useSelector((state) => state.hotelReducer.permission);

  const redirect = (url) => {
    navigate(url);
  };

  const [integrationData, setIntegrationData] = useState({
    twilioAccountSid: "",
    twilioAuthToken: "",
    twilioMessagingServiceSid: "",
  });

  useEffect(() => {
    const hasPermission = handlePermission(
      permission.CompanyPermission,
      Modules.IVRSCONFIGURATION,
      ActionType.read
    );
    if (!hasPermission) {
      redirect("/Admin");
    }
  }, [permission]);

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
    if (companies && companies.length > 0) {
      setIntegrationData({
        ...{
          twilioAccountSid: companies[0].twilioAccountSid
            ? companies[0].twilioAccountSid
            : "",
          twilioAuthToken: companies[0].twilioAuthToken
            ? companies[0].twilioAuthToken
            : "",
          twilioMessagingServiceSid: companies[0].twilioMessagingServiceSid
            ? companies[0].twilioMessagingServiceSid
            : "",
        },
      });
    }
  }, [companies]);

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...integrationData };
    commonData[field] = event.target.value;
    return setIntegrationData(commonData);
  };

  const handleUpdateIntegration = () => {
    props.actions.userAction.updateTwilio(integrationData, companies[0].id);
  };

  return (
    <React.Fragment>
      <div className="user-groups">
        <h1 className="groups-header">System Settings</h1>
        <h1 className="groups-header-2nd">Twilio Configration</h1>
        <div className="integration_main">
          <div className="integration_btn">
            <ValidatorForm
              onSubmit={() => handleUpdateIntegration()}
              autoComplete="off"
            >
              <div className="integration-box-inner">
                <div className="popup-input-box w-25 p-10">
                  <Typography>Twilio Account Sid</Typography>
                  <TextValidator
                    fullWidth
                    sx={{ marginTop: 0, minWidth: "380px" }}
                    size="small"
                    margin="normal"
                    value={integrationData.twilioAccountSid}
                    type="text"
                    name="twilioAccountSid"
                    errorMessages={["Twilio Account Sid is required"]}
                    onChange={handleChange}
                  />
                </div>
                <div className="popup-input-box w-25 p-10">
                  <Typography>Twilio Auth Token</Typography>
                  <TextValidator
                    fullWidth
                    size="small"
                    margin="normal"
                    value={integrationData.twilioAuthToken}
                    type="text"
                    name="twilioAuthToken"
                    sx={{ marginTop: 0, minWidth: "380px" }}
                    errorMessages={["Twilio Auth Token is required"]}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="popup-input-box w-25 p-10">
                <Typography>Twilio Messaging Service Sid</Typography>
                <TextValidator
                  fullWidth
                  size="small"
                  margin="normal"
                  value={integrationData.twilioMessagingServiceSid}
                  type="text"
                  name="twilioMessagingServiceSid"
                  sx={{ marginTop: 0, minWidth: "380px" }}
                  errorMessages={["Twilio Messaging Service Sid is required"]}
                  onChange={handleChange}
                />
              </div>

              <div className="inte_btn" style={{ paddingTop: "15px" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={handlePermission(
                    permission.CompanyPermission,
                    Modules.IVRSCONFIGURATION,
                    ActionType.update,
                    true
                  )}
                >
                  <SaveOutlinedIcon /> UPDATE
                </Button>
              </div>
            </ValidatorForm>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(Twilio);
