/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControl,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SyncIcon from "@mui/icons-material/Sync";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { connect, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";

import {
  SET_INVISIBLE_SELECTION,
  SET_VISIBLE_SELECTION,
} from "../../../../utils/AdminDashboard/Constant";
import * as UserAction from "../../../../Action/AdminDashboard";
import ENVIRONMENT_VARIABLES from "../../../../environment.config";
import {
  ActionType,
  Modules,
  handlePermission,
} from "../../../../utils/userAccess";
import "./style.scss";

const Integration = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const status = [
    { id: "active", value: true },
    { id: "inactive", value: false },
  ];

  const redirect = (url) => {
    navigate(url);
  };

  const marketing = useSelector((state) => state.hotelReducer.marketing);
  const companies = useSelector((state) => state.hotelReducer.companies);
  const marketingAudienceList = useSelector(
    (state) => state.hotelReducer.marketingAudienceList
  );
  const permission = useSelector((state) => state.hotelReducer.permission);

  const [integrationData, setIntegrationData] = useState({
    mailChimpPublicKey: "",
    mailChimpPrivateKey: "",
    mailChimpUserName: "",
    tags: [],
  });
  const [marketingData, setMarketingData] = useState([]);
  const [integrationInformation, setIntegrationInformation] = useState({
    mailChimpStatus: "",
    marketingId: "",
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
    const hasPermission = handlePermission(
      permission.CompanyPermission,
      Modules.MARKETING,
      ActionType.read
    );
    if (!hasPermission) {
      redirect("/Admin");
    }
  }, [permission]);

  useEffect(() => {
    if (companies && companies.length > 0) {
      setMarketingData([]);
      setSelectedCompany(companies[0]);
      props.actions.userAction.getMarketing(companies[0].id);
      props.actions.userAction.getAudienceList(
        ENVIRONMENT_VARIABLES.Base_MAIL_CHIMP_AUDIANCE_LIST
      );

      setIntegrationData({
        ...integrationData,
        mailChimpPublicKey: companies[0].mailChimpPublicKey
          ? companies[0].mailChimpPublicKey
          : "",
        mailChimpPrivateKey: companies[0].mailChimpPrivateKey
          ? companies[0].mailChimpPrivateKey
          : "",
        mailChimpUserName: companies[0].mailChimpUserName
          ? companies[0].mailChimpUserName
          : "",
      });
    }
  }, [companies]);

  useEffect(() => {
    if (
      marketingAudienceList &&
      marketingAudienceList.length > 0 &&
      selectedCompany
    ) {
      let mappedTag = [];
      let companyAudianceList = [];
      if (selectedCompany?.tags) {
        companyAudianceList = selectedCompany.tags;
      }
      mappedTag = marketingAudienceList
        .filter((tagsType) => tagsType.isActive === true)
        .map((tagType) => {
          const findTagType = companyAudianceList.find(
            (material) => material.name === tagType.name
          );
          if (findTagType) return { ...tagType, isChecked: true };
          else return { ...tagType, isChecked: false };
        });

      setIntegrationData({ ...integrationData, tags: mappedTag });
      setIntegrationInformation({
        ...{
          mailChimpStatus: selectedCompany.mailChimpStatus,
          marketingId: selectedCompany.Marketing && selectedCompany.marketingId,
        },
      });
    }
  }, [marketingAudienceList]);

  useEffect(() => {
    if (marketing) {
      const filterMarketing = marketing.filter(
        (data) => data.isActive === true
      );
      setMarketingData(filterMarketing);
    }
  }, [marketing]);

  const handleFilter = (e) => {
    const value = e.target.value[e.target.value.length - 1];
    let tempData = integrationData.tags.map((data) =>
      data.id === value ? { ...data, isChecked: !data.isChecked } : data
    );
    setIntegrationData({ ...integrationData, tags: tempData });
  };

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...integrationData };
    commonData[field] = event.target.value;
    return setIntegrationData(commonData);
  };

  const handleChangeStatus = (event) => {
    const field = event.target.name;
    let commonData = { ...integrationInformation };
    commonData[field] = event.target.value;
    return setIntegrationInformation(commonData);
  };

  const handleUpdateIntegration = () => {
    props.actions.userAction.updateIntegration(
      integrationData,
      selectedCompany.id
    );
  };

  const handleUpdateIntegrationInformation = () => {
    props.actions.userAction.updateIntegrationInformation(
      integrationInformation,
      selectedCompany.id
    );
  };

  const handlegetSyncIntegrationInformation = (data) => {
    props.actions.userAction.getSyncDataToMailChimp(
      data,
      integrationInformation.marketingId,
      selectedCompany.id
    );
  };

  return (
    <React.Fragment>
      <div className="user-groups">
        <h1 className="groups-header"> Marketing</h1>
        <h1 className="groups-header-2nd">Integration</h1>
        <Box className="integration-box">
          <div className="integration_main">
            <div className="integration_inner">
              <span className="integration_text">Connect to MailChimp</span>
              <span>MailChimp API / Audience Settings</span>
            </div>
            <div className="integration_btn">
              <Accordion className="btn-integration ">
                <AccordionSummary
                  sx={{ width: "250px", padding: "0px 28px" }}
                  className="pl-0"
                  expandIcon={
                    <Button type="submit" variant="contained">
                      <AttachFileIcon /> CONNECT TO MAILCHIMP
                    </Button>
                  }
                ></AccordionSummary>
                <AccordionDetails className="p-0 accordion-details">
                  <ValidatorForm>
                    <div className="integration-box-inner">
                      <div className="popup-input-box w-25 p-10">
                        <Typography>Public API Key</Typography>
                        <TextValidator
                          fullWidth
                          sx={{ marginTop: 0 }}
                          size="small"
                          margin="normal"
                          value={integrationData.mailChimpPublicKey}
                          type="text"
                          name="mailChimpPublicKey"
                          validators={["required"]}
                          errorMessages={["Public API Key is required"]}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="popup-input-box w-25 p-10">
                        <Typography>Private API Key</Typography>
                        <TextValidator
                          fullWidth
                          size="small"
                          margin="normal"
                          value={integrationData.mailChimpPrivateKey}
                          type="text"
                          name="mailChimpPrivateKey"
                          sx={{ marginTop: 0 }}
                          validators={["required"]}
                          errorMessages={["Private API Key is required"]}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="integration-box-inner">
                      <div className="popup-input-box w-25 p-10">
                        <Typography>Audience List</Typography>
                        <FormControl size="small" sx={{ width: "100%" }}>
                          <Select
                            multiple
                            margin="normal"
                            type="text"
                            value={integrationData.tags}
                            name="audianceList"
                            onChange={handleFilter}
                            renderValue={(selected) => {
                              selected = integrationData.tags.filter(
                                (tag) => tag.isChecked === true
                              );
                              const renderData = selected.map(
                                (tag) => tag.name
                              );
                              return renderData.join(", ");
                            }}
                          >
                            {integrationData.tags.map((tagType) => (
                              <MenuItem key={tagType.id} value={tagType.id}>
                                <ListItemIcon>
                                  <Checkbox checked={tagType.isChecked} />
                                </ListItemIcon>
                                <ListItemText primary={tagType.name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {/* )} */}
                      </div>

                      <div className="popup-input-box w-25 p-10">
                        <Typography> Mail Chimp User Name</Typography>
                        <TextValidator
                          fullWidth
                          size="small"
                          margin="normal"
                          value={integrationData.mailChimpUserName}
                          type="text"
                          name="mailChimpUserName"
                          sx={{ marginTop: 0 }}
                          validators={["required"]}
                          errorMessages={["Private API Key is required"]}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="inte_btn" style={{ paddingTop: "15px" }}>
                      <Button
                        variant="contained"
                        onClick={() => handleUpdateIntegration()}
                        disabled={handlePermission(
                          permission.CompanyPermission,
                          Modules.MARKETING,
                          ActionType.update,
                          true
                        )}
                      >
                        <SaveOutlinedIcon /> UPDATE
                      </Button>
                    </div>
                  </ValidatorForm>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </Box>

        <Box className="integration-box" sx={{ marginTop: "30px" }}>
          <div className="integration_main w-50">
            <div className="integration_inner">
              <span className="integration_text">Information to Send</span>
            </div>
            <div className="select p">
              <div className="popup-input-box ">
                <Typography>Status</Typography>
                <FormControl>
                  <Select
                    sx={{ minWidth: "420px" }}
                    size="small"
                    value={integrationInformation.mailChimpStatus}
                    name="mailChimpStatus"
                    inputProps={{ "aria-label": "Without label" }}
                    onChange={handleChangeStatus}
                  >
                    {status.map((statusType, index) => (
                      <MenuItem key={index} value={statusType.value}>
                        {statusType.id}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {marketingData.length > 0 && (
                <div className="popup-input-box ">
                  <Typography>Contact To Send</Typography>
                  <FormControl>
                    <Select
                      sx={{ minWidth: "420px" }}
                      size="small"
                      value={integrationInformation.marketingId}
                      name="marketingId"
                      inputProps={{ "aria-label": "Without label" }}
                      onChange={handleChangeStatus}
                    >
                      {marketingData.map((data, index) => (
                        <MenuItem key={index} value={data.id}>
                          {data.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              )}
            </div>
          </div>
          <div className="switch_integration w-50">
            <div className="inte_btn" style={{ paddingTop: "85px" }}>
              <Button
                disabled={marketingData.length < 1}
                variant="outlined"
                onClick={() => handlegetSyncIntegrationInformation()}
              >
                <SyncIcon /> SYNC CONTACT & ORDER
              </Button>

              <Button
                variant="contained"
                onClick={() => handleUpdateIntegrationInformation()}
                disabled={handlePermission(
                  permission.CompanyPermission,
                  Modules.MARKETING,
                  ActionType.update,
                  true
                )}
              >
                <SaveOutlinedIcon /> UPDATE
              </Button>
            </div>
          </div>
        </Box>
      </div>
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(Integration);
