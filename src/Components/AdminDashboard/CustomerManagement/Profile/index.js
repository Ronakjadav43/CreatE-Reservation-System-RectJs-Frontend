/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Checkbox,
  FormControl,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Typography,
  TextField,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { bindActionCreators } from "redux";
import { connect, useDispatch, useSelector } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import * as UserAction from "../../../../Action/AdminDashboard";
import { RESET_PROFILE } from "../../../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../../../environment.config";
import {
  ActionType,
  handlePermission,
  Modules,
} from "../../../../utils/userAccess";

const Profile = (props) => {
  const [customerProfile, setCustomerProfile] = useState(null);
  const genderSelection = ["Male", "Female"];
  const dispatch = useDispatch();
  const [isUpdate, setIsUpdate] = useState(true);

  const profiles = useSelector((state) => state.hotelReducer.profiles);
  const tags = useSelector((state) => state.hotelReducer.tags);
  const permission = useSelector((state) => state.hotelReducer.permission);

  useEffect(() => {
    if (props.customer.id) {
      setIsUpdate(true);
      props.actions.userAction.getTagsByOutletCategory(
        ENVIRONMENT_VARIABLES.Base_PROFILE_TAGS,
        props.customer.Outlet.id
      );
      props.actions.userAction.getCustomerProfile(
        props.customer.id,
        props.customer.Outlet.id
      );
    }
    return () => {
      dispatch({ type: RESET_PROFILE });
    };
  }, [props.customer.id]);

  useEffect(() => {
    if (profiles && tags) {
      let mappedTag = [];
      if (profiles.tags !== null) {
        mappedTag = tags
          .filter((tag) => tag.isActive === true)
          .map((data) => {
            if (profiles.tags.find((cusTag) => cusTag.name === data.name)) {
              return { ...data, isChecked: true };
            }
            return { ...data, isChecked: false };
          });
      } else {
        mappedTag = tags
          .filter((tag) => tag.isActive === true)
          .map((data) => {
            return { ...data, isChecked: false };
          });
      }
      setCustomerProfile({
        name: profiles.name ? profiles.name : "",
        lastName: profiles.lastName ? profiles.lastName : "",
        customerCompanyName: profiles.customerCompanyName
          ? profiles.customerCompanyName
          : "",
        email: profiles.email ? profiles.email : "",
        mobileNo: profiles.mobileNo ? profiles.mobileNo : "",
        gender: profiles.gender ? profiles.gender : "",
        salutation: profiles.salutation ? profiles.salutation : "",
        dob: profiles.dob ? profiles.dob : null,
        address: profiles.address ? profiles.address : "",
        postalCode: profiles.postalCode ? profiles.postalCode : "",
        programName: profiles.programName ? profiles.programName : "",
        activationTerminal: profiles.activationTerminal
          ? profiles.activationTerminal
          : "",
        lastTransactionDate: profiles.lastTransactionDate
          ? profiles.lastTransactionDate
          : "",
        noOfRefferalSignUp: profiles.noOfRefferalSignUp
          ? profiles.noOfRefferalSignUp
          : 0,
        noOfRefferalPurchased: profiles.noOfRefferalPurchased
          ? profiles.noOfRefferalPurchased
          : 0,
        createdAt: profiles.createdAt ? profiles.createdAt : "",
        eatPoints: profiles.eatPoints ? profiles.eatPoints : 0,
        isPrivateTableBooked: profiles.isPrivateTableBooked
          ? profiles.isPrivateTableBooked
          : "",
        averageSpend: profiles.averageSpend ? profiles.averageSpend : "",
        notes: profiles.notes ? profiles.notes : "",
        tags: mappedTag,
        isOPT: profiles.isOPT ? profiles.isOPT : "",
      });
    }
  }, [profiles, tags]);

  const handleChange = (event) => {
    setIsUpdate(false);
    const field = event.target.name;
    let commonData = { ...customerProfile };
    commonData[field] = event.target.value;
    return setCustomerProfile(commonData);
  };

  const handleFilter = (e) => {
    setIsUpdate(false);
    const value = e.target.value[e.target.value.length - 1];
    let tempData = customerProfile.tags.map((data) => {
      return data.id === value ? { ...data, isChecked: !data.isChecked } : data;
    });
    setCustomerProfile({ ...customerProfile, tags: [...tempData] });
  };

  const handleUpdate = () => {
    props.actions.userAction.updateCustomerProfile(
      customerProfile,
      props.customer.Outlet.id,
      props.customer.id
    );
  };

  const handleChangeDOB = (date) => {
    setIsUpdate(false);
    let dob = new Date(date);
    return setCustomerProfile({ ...customerProfile, dob: dob });
  };

  const handleChangeLastTrans = (date) => {
    let lastTransactionDate = new Date(date);
    return setCustomerProfile({
      ...customerProfile,
      lastTransactionDate: lastTransactionDate,
    });
  };

  return (
    <React.Fragment>
      {customerProfile && (
        <div className="popup-layout ">
          <ValidatorForm
            onSubmit={() => handleUpdate()}
            autoComplete="off"
            className="popup-header p-0"
          >
            <div sx={{ width: "600px" }} className="popup-body1 ">
              <div className="popup-input-box w-100">
                <Box className="user-groups-search">
                  <span style={{ width: "100%" }}>Customer Information</span>
                  <div
                    className="primary-btn"
                    style={{
                      flexDirection: "row-reverse",
                      padding: "0px",
                    }}
                  >
                    <Button
                      disabled={
                        handlePermission(
                          permission.permission,
                          Modules.CUSTOMERMANAGEMENT,
                          ActionType.update,
                          true
                        ) || isUpdate
                      }
                      type="submit"
                      variant="contained"
                    >
                      SAVE
                    </Button>
                  </div>
                </Box>
              </div>

              <div className="popup-input-box w-33">
                <Typography>Customer Company Name</Typography>
                <TextValidator
                  size="small"
                  fullWidth
                  margin="normal"
                  type="text"
                  name="customerCompanyName"
                  value={customerProfile.customerCompanyName}
                  onChange={handleChange}
                  placeholder="Enter Customer Company Name"
                  sx={{ marginTop: 0 }}
                />
              </div>

              <div className="popup-input-box w-33">
                <Typography>First Name</Typography>
                <TextValidator
                  size="small"
                  fullWidth
                  margin="normal"
                  type="text"
                  name="name"
                  value={customerProfile.name}
                  onChange={handleChange}
                  placeholder="Enter First Name"
                  sx={{ marginTop: 0 }}
                  validators={["required"]}
                  errorMessages={["First Name is required"]}
                />
              </div>
              {customerProfile?.lastName && (
                <div className="popup-input-box w-33">
                  <Typography>Last Name</Typography>
                  <TextValidator
                    size="small"
                    fullWidth
                    margin="normal"
                    type="text"
                    name="lastName"
                    value={customerProfile.lastName}
                    onChange={handleChange}
                    placeholder="Enter Last Name"
                    sx={{ marginTop: 0 }}
                    validators={["required"]}
                    errorMessages={["Last Name is required"]}
                  />
                </div>
              )}

              <div className="popup-input-box w-33">
                <Typography>Gender</Typography>
                <Select
                  size="small"
                  name="gender"
                  value={customerProfile.gender}
                  inputProps={{ "aria-label": "Without label" }}
                  onChange={handleChange}
                >
                  {genderSelection.map((gender, index) => (
                    <MenuItem key={index} value={gender}>
                      {gender}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              <div className="popup-input-box w-33 ">
                <Typography>Email</Typography>
                <TextValidator
                  disabled
                  size="small"
                  fullWidth
                  margin="normal"
                  type="email"
                  name="email"
                  value={customerProfile.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  sx={{ marginTop: 0 }}
                />
              </div>

              <div className="popup-input-box w-33">
                <Typography>Phone Number</Typography>
                <TextValidator
                  disabled
                  size="small"
                  fullWidth
                  margin="normal"
                  type="text"
                  name="mobileNo"
                  value={customerProfile.mobileNo}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  sx={{ marginTop: 0 }}
                />
              </div>

              <div className="popup-input-box w-33 date-picker1">
                <Typography>Birthday</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
                  <DesktopDatePicker
                    value={customerProfile.dob}
                    onChange={(date) => {
                      handleChangeDOB(date);
                    }}
                    inputFormat="DD-MM-YYYY"
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>

              <div className="popup-input-box w-33">
                <Typography>Address</Typography>
                <TextValidator
                  size="small"
                  fullWidth
                  margin="normal"
                  type="text"
                  name="address"
                  value={customerProfile.address}
                  onChange={handleChange}
                  placeholder="Enter Address"
                  sx={{ marginTop: 0 }}
                />
              </div>

              <div className="popup-input-box w-33">
                <Typography>Postal Code</Typography>
                <TextValidator
                  size="small"
                  fullWidth
                  margin="normal"
                  type="number"
                  name="postalCode"
                  value={customerProfile.postalCode}
                  onChange={handleChange}
                  placeholder="Enter Postal Code"
                  sx={{ marginTop: 0 }}
                  validators={["minNumber:0"]}
                  errorMessages={["Postal Code should be more than 0"]}
                />
              </div>

              <div className="popup-input-box w-33">
                <Typography>Program Name</Typography>
                <TextValidator
                  size="small"
                  fullWidth
                  margin="normal"
                  type="text"
                  name="programName"
                  value={customerProfile?.programName}
                  onChange={handleChange}
                  placeholder="Enter Program Name"
                  sx={{ marginTop: 0 }}
                />
              </div>

              <div className="popup-input-box w-33">
                <Typography>Activation Terminal</Typography>
                <TextValidator
                  size="small"
                  fullWidth
                  margin="normal"
                  type="text"
                  name="activationTerminal"
                  value={customerProfile?.activationTerminal}
                  onChange={handleChange}
                  placeholder="Enter Activation Terminal"
                  sx={{ marginTop: 0 }}
                />
              </div>

              <div className="popup-input-box w-33 date-picker1">
                <Typography>Activation Date</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
                  <DesktopDatePicker
                    disabled
                    value={customerProfile.createdAt}
                    onChange={(date) => {
                      handleChangeDOB(date);
                    }}
                    inputFormat="DD-MM-YYYY"
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>

              <div className="popup-input-box w-33 date-picker1">
                <Typography>Registration Date</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
                  <DesktopDatePicker
                    disabled
                    value={customerProfile.createdAt}
                    onChange={(date) => {
                      handleChangeDOB(date);
                    }}
                    inputFormat="DD-MM-YYYY"
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>

              <div className="popup-input-box w-33">
                <Typography>Eat Points</Typography>
                <TextValidator
                  size="small"
                  fullWidth
                  margin="normal"
                  type="number"
                  name="eatPoints"
                  value={customerProfile.eatPoints}
                  onChange={handleChange}
                  placeholder="Enter Eat Points"
                  sx={{ marginTop: 0 }}
                  validators={["required", "minNumber:0"]}
                  errorMessages={[
                    "Eat Points is required",
                    "Eat Points should be more than 0",
                  ]}
                />
              </div>

              <div className="popup-input-box w-33">
                <Typography>Is Private Room Booked</Typography>
                <TextValidator
                  disabled
                  size="small"
                  fullWidth
                  margin="normal"
                  type="text"
                  name="isPrivateTableBooked"
                  value={customerProfile.isPrivateTableBooked ? "Yes" : "No"}
                  sx={{ marginTop: 0 }}
                />
              </div>

              <div className="popup-input-box w-100">
                <span>TOP positives</span>
              </div>

              <div className="popup-input-box w-33 date-picker1">
                <Typography>Last Transaction Date</Typography>

                <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
                  <DesktopDatePicker
                    disabled
                    value={customerProfile.lastTransactionDate}
                    onChange={(date) => {
                      handleChangeLastTrans(date);
                    }}
                    inputFormat="DD-MM-YYYY"
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>

              <div className="popup-input-box w-33">
                <Typography>Average Spend</Typography>
                <TextValidator
                  disabled
                  size="small"
                  fullWidth
                  margin="normal"
                  type="text"
                  name="averageSpend"
                  value={customerProfile.averageSpend}
                  onChange={handleChange}
                  placeholder="Enter Average Spend"
                  sx={{ marginTop: 0 }}
                />
              </div>

              <div className="popup-input-box w-33">
                <Typography>Number Of Referral Sign Up</Typography>
                <TextValidator
                  size="small"
                  fullWidth
                  margin="normal"
                  type="number"
                  name="noOfRefferalSignUp"
                  value={customerProfile.noOfRefferalSignUp}
                  onChange={handleChange}
                  placeholder="Enter Number Of Referral Sign Up"
                  sx={{ marginTop: 0 }}
                  validators={["required", "minNumber:0"]}
                  errorMessages={[
                    "Number Of Referral Sign Up is required",
                    "Number Of Referral Sign Up should be more than 0",
                  ]}
                />
              </div>

              <div className="popup-input-box w-33">
                <Typography>Number Of Referral Who Purchased</Typography>
                <TextValidator
                  size="small"
                  fullWidth
                  margin="normal"
                  type="number"
                  name="noOfRefferalPurchased"
                  value={customerProfile.noOfRefferalPurchased}
                  onChange={handleChange}
                  placeholder="Enter Number Of Referral Who Purchased"
                  sx={{ marginTop: 0 }}
                  validators={["required", "minNumber:0"]}
                  errorMessages={[
                    "Number Of Referral Who Purchased is required",
                    "Number Of Referral Who Purchased should be more than 0",
                  ]}
                />
              </div>

              <div className="popup-input-box w-33">
                <Typography>Mailchimp Subscription</Typography>
                <TextValidator
                  disabled
                  size="small"
                  fullWidth
                  margin="normal"
                  type="text"
                  name="isOPT"
                  value={customerProfile.isOPT ? "Yes" : "No"}
                  sx={{ marginTop: 0 }}
                />
              </div>

              <div className="popup-input-box w-100">
                <span>Manager notes</span>
              </div>

              {customerProfile.tags && (
                <div className="popup-input-box w-100">
                  <Typography>Tags</Typography>
                  <FormControl fullWidth size="small" sx={{ width: "160px" }}>
                    <Select
                      multiple
                      size="small"
                      value={customerProfile.tags}
                      name="tagCategories"
                      inputProps={{ "aria-label": "Without label" }}
                      onChange={handleFilter}
                      renderValue={(selected) => {
                        selected = customerProfile.tags.filter(
                          (data) => data.isChecked === true
                        );
                        const renderData = selected.map((user) => user.name);
                        return renderData.join(", ");
                      }}
                    >
                      {customerProfile.tags.map((data, index) => (
                        <MenuItem key={index} value={data.id}>
                          <ListItemIcon>
                            <Checkbox checked={data.isChecked} />
                          </ListItemIcon>
                          <ListItemText primary={data.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              )}

              <div className="popup-input-box w-100">
                <Typography>Note</Typography>
                <TextValidator
                  size="small"
                  fullWidth
                  margin="normal"
                  type="text"
                  name="notes"
                  value={customerProfile.notes}
                  placeholder="Enter Note"
                  onChange={handleChange}
                  sx={{ marginTop: 0 }}
                />
              </div>
            </div>
          </ValidatorForm>
        </div>
      )}
    </React.Fragment>
  );
};
const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(Profile);
