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

const IvrsConfiguration = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const redirect = (url) => {
    navigate(url);
  };

  const IvrsConfigration = useSelector(
    (state) => state.hotelReducer.IvrsConfigration
  );
  const selectedCompany = useSelector(
    (state) => state.hotelReducer.selectedCompany
  );

  const permission = useSelector((state) => state.hotelReducer.permission);

  const [integrationData, setIntegrationData] = useState({
    ivrsUserKey: "",
    ivrsSecretKey: "",
  });

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
      type: SET_VISIBLE_COMPANY_SELECTION,
    });
    return () => {
      dispatch({
        type: SET_INVISIBLE_COMPANY_SELECTION,
      });
    };
  }, []);

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
    if (selectedCompany) {
      setIntegrationData({
        ...{
          ivrsUserKey: selectedCompany.ivrsUserKey
            ? selectedCompany.ivrsUserKey
            : "",
          ivrsSecretKey: selectedCompany.ivrsSecretKey
            ? selectedCompany.ivrsSecretKey
            : "",
        },
      });
    }
  }, [selectedCompany]);

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...integrationData };
    commonData[field] = event.target.value;
    return setIntegrationData(commonData);
  };

  const handleUpdateIntegration = () => {
    props.actions.userAction.updateIvrsConfigration(
      integrationData,
      selectedCompany.id
    );
  };

  return (
    <React.Fragment>
      <div className="user-groups">
        <h1 className="groups-header">System Settings</h1>
        <h1 className="groups-header-2nd">IVRS Configuration</h1>
        <div className="integration_main">
          <div className="integration_btn">
            <ValidatorForm
              onSubmit={() => handleUpdateIntegration()}
              autoComplete="off"
            >
              <div className="integration-box-inner">
                <div className="popup-input-box w-25 p-10">
                  <Typography>User Key</Typography>
                  <TextValidator
                    fullWidth
                    sx={{ marginTop: 0 }}
                    size="small"
                    margin="normal"
                    value={integrationData.ivrsUserKey}
                    type="text"
                    name="ivrsUserKey"
                    // validators={["required"]}
                    errorMessages={["User Key is required"]}
                    onChange={handleChange}
                  />
                </div>
                <div className="popup-input-box w-25 p-10">
                  <Typography>Secret Key</Typography>
                  <TextValidator
                    fullWidth
                    size="small"
                    margin="normal"
                    value={integrationData.ivrsSecretKey}
                    type="text"
                    name="ivrsSecretKey"
                    sx={{ marginTop: 0, minWidth: "420px" }}
                    // validators={["required"]}
                    errorMessages={["Secret Key is required"]}
                    onChange={handleChange}
                  />
                </div>
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

export default connect(null, mapDispatchToProps)(IvrsConfiguration);
