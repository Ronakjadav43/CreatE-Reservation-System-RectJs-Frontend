/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Button,
  DialogActions,
  DialogContentText,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { bindActionCreators } from "redux";
import { connect, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as UserAction from "../../../../Action/AdminDashboard";
import ENVIRONMENT_VARIABLES from "../../../../environment.config";
import {
  ActionType,
  handlePermission,
  handleUpdatedBy,
  Modules,
} from "../../../../utils/userAccess";

let moment = require("moment-timezone");
var reader = new FileReader();

const BasicInformation = (props) => {
  const navigate = useNavigate();
  const [outletData, setOutletData] = useState(null);
  const [updateButtonActive, setUpdateButtonActive] = useState(true);

  const [imageDisplay, setImageDisplay] = useState(null);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    companies: state.hotelReducer.companies,
    permission: state.hotelReducer.permission,
  }));

  const redirect = (url) => {
    navigate(url);
  };

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      const selectedOutlet = hotelReducer.selectedOutlet.outlet;
      setOutletData({
        name: selectedOutlet.name,
        description: selectedOutlet.description,
        address1: selectedOutlet.address1,
        postcode: selectedOutlet.postcode,
        latitude: selectedOutlet.latitude,
        longitude: selectedOutlet.longitude,
        phone: selectedOutlet.phone,
        email: selectedOutlet.email,
        googlePlaceId: selectedOutlet.googlePlaceId,
        gst: selectedOutlet.gst,
        rebookingTableInterval: selectedOutlet.rebookingTableInterval,
        timeSlotInterval: selectedOutlet.timeSlotInterval,
        isActive: selectedOutlet.isActive,
        timezone: selectedOutlet.timezone,
        allowOrder: selectedOutlet.allowOrder,
        allowBooking: selectedOutlet.allowBooking,
        companyId: selectedOutlet.companyId,
        image: selectedOutlet.image,
        paxSpacing: selectedOutlet.paxSpacing,
        ivrsPhoneNo: selectedOutlet.ivrsPhoneNo,
        blockTime: selectedOutlet.blockTime,
        chopeName: selectedOutlet.chopeName ? selectedOutlet.chopeName : "",
        oddleName: selectedOutlet.oddleName ? selectedOutlet.oddleName : "",
      });
      setImageDisplay(
        `${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${hotelReducer.selectedOutlet.outlet.image}`
      );
    }
  }, [hotelReducer.selectedOutlet]);

  const handleChange = (event) => {
    setUpdateButtonActive(false);
    const field = event.target.name;
    let commonData = { ...outletData };
    commonData[field] = event.target.value;
    return setOutletData(commonData);
  };

  const handleToggleButton = (event) => {
    setUpdateButtonActive(false);
    const field = event.target.name;
    let commonData = { ...outletData };
    commonData[field] = event.target.checked;
    return setOutletData(commonData);
  };

  const handleEditOutlet = () => {
    props.actions.userAction.updateOutlet(
      outletData,
      hotelReducer.selectedOutlet.outlet.id
    );
  };

  const handleImageUpload = (event) => {
    setUpdateButtonActive(false);
    setOutletData({
      ...outletData,
      image: event.target.files[0],
    });
    reader.readAsDataURL(event.target.files[0]);
  };

  reader.onload = function (e) {
    setImageDisplay(e.target.result);
  };

  return (
    <React.Fragment>
      {hotelReducer.selectedOutlet && outletData && (
        <div>
          <ValidatorForm
            onSubmit={() => handleEditOutlet()}
            autoComplete="off"
            className="1"
          >
            <DialogActions className="primary-btn popup-btn">
              <Button
                onClick={() => {
                  redirect("/Admin/OutletList");
                }}
                variant="outlined"
              >
                <ArrowBackIcon /> BACK
              </Button>
              <Button
                disabled={
                  handlePermission(
                    hotelReducer.permission.permission,
                    Modules.OUTLETMANAGEMENT,
                    ActionType.create,
                    true
                  ) || updateButtonActive
                }
                type="submit"
                variant="contained"
              >
                <SaveOutlinedIcon /> UPDATE
              </Button>
            </DialogActions>

            <div className="basicinformation">
              <div className="basicinformation-left">
                <div className="w-100 p-10">
                  <Typography>Brand</Typography>
                  <FormControl sx={{ width: "100%" }}>
                    <Select
                      size="small"
                      value={outletData.companyId}
                      defaultValue="Select Company"
                      name="companyId"
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      onChange={handleChange}
                    >
                      {hotelReducer.companies.map((company, index) => (
                        <MenuItem key={index} value={company.id}>
                          {company.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="w-50 p-10">
                  <Typography>Name</Typography>
                  <TextValidator
                    fullWidth
                    size="small"
                    margin="normal"
                    type="text"
                    name="name"
                    value={outletData.name}
                    placeholder="Enter Name"
                    sx={{ marginTop: 0 }}
                    validators={["required"]}
                    onChange={handleChange}
                    errorMessages={["Name is required"]}
                  />
                </div>
                <div className="w-50 p-10">
                  <Typography>Email</Typography>
                  <TextValidator
                    fullWidth
                    size="small"
                    margin="normal"
                    type="email"
                    name="email"
                    value={outletData.email}
                    placeholder="Enter Email"
                    sx={{ marginTop: 0 }}
                    onChange={handleChange}
                    validators={["required", "isEmail"]}
                    errorMessages={["Email is required", "email is not valid"]}
                  />
                </div>
                <div className="w-50 p-10">
                  <Typography>Phone </Typography>
                  <TextValidator
                    fullWidth
                    size="small"
                    margin="normal"
                    type="text"
                    name="phone"
                    value={outletData.phone}
                    placeholder="Enter Phone"
                    sx={{ marginTop: 0 }}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["Phone is required"]}
                  />
                </div>
                <div className="w-50 p-10">
                  <Typography>Description</Typography>
                  <TextValidator
                    fullWidth
                    size="small"
                    margin="normal"
                    type="text"
                    name="description"
                    value={outletData.description}
                    placeholder="Enter Description"
                    sx={{ marginTop: 0 }}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-50 p-10">
                  <Typography>Address</Typography>
                  <TextValidator
                    fullWidth
                    size="small"
                    margin="normal"
                    type="text"
                    name="address1"
                    value={outletData.address1}
                    placeholder="Enter Address"
                    sx={{ marginTop: 0 }}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["Address is required"]}
                  />
                </div>
                <div className="w-50 p-10">
                  <Typography>Post Code</Typography>
                  <TextValidator
                    fullWidth
                    size="small"
                    margin="normal"
                    type="text"
                    name="postcode"
                    value={outletData.postcode}
                    placeholder="Enter Post code"
                    sx={{ marginTop: 0 }}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["Post code is required"]}
                  />
                </div>

                <div className="w-33 p-10">
                  <Typography>GST</Typography>
                  <TextValidator
                    fullWidth
                    size="small"
                    margin="normal"
                    type="number"
                    name="gst"
                    value={outletData.gst}
                    placeholder="Enter GST"
                    sx={{ marginTop: 0 }}
                    onChange={handleChange}
                    validators={["required", "minNumber:0"]}
                    errorMessages={[
                      "GST is required",
                      "GST should be more than 0",
                    ]}
                  />
                </div>
                <div className="w-33 p-10">
                  <Typography>Table Turn Time (in minutes )</Typography>
                  <TextValidator
                    fullWidth
                    size="small"
                    margin="normal"
                    type="text"
                    name="rebookingTableInterval"
                    value={outletData.rebookingTableInterval}
                    placeholder="Enter Table Turn Time"
                    sx={{ marginTop: 0 }}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["Table Turn Time is required"]}
                    inputProps={{ min: 0 }}
                  />
                </div>
                <div className="w-33 p-10">
                  <Typography>Timeslot Interval (in minutes )</Typography>
                  <TextValidator
                    fullWidth
                    size="small"
                    margin="normal"
                    type="text"
                    name="timeSlotInterval"
                    value={outletData.timeSlotInterval}
                    placeholder="Enter Timeslot Interval"
                    sx={{ marginTop: 0 }}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["Timeslot Interval is required"]}
                    inputProps={{ min: 0 }}
                  />
                </div>
                <div className="w-33 p-10">
                  <Typography>Timezone (Asia/Singapore)</Typography>
                  <TextValidator
                    disabled
                    fullWidth
                    size="small"
                    margin="normal"
                    type="text"
                    name="timezone"
                    value={outletData.timezone}
                    placeholder="Asia/Singapore"
                    sx={{ marginTop: 0 }}
                  />
                </div>
                <div className="w-33 p-10">
                  <Typography>Pax Pacing</Typography>
                  <TextValidator
                    fullWidth
                    size="small"
                    margin="normal"
                    type="number"
                    name="paxSpacing"
                    value={outletData.paxSpacing}
                    placeholder="Enter Pax Pacing"
                    sx={{ marginTop: 0 }}
                    onChange={handleChange}
                    validators={["required", "minNumber:0"]}
                    errorMessages={[
                      "Pax Pacing is required",
                      "Pax Pacing should be more than 0",
                    ]}
                  />
                </div>
                <div className="w-33 p-10">
                  <Typography>IVRS Phone Number</Typography>
                  <TextValidator
                    fullWidth
                    size="small"
                    margin="normal"
                    type="text"
                    name="ivrsPhoneNo"
                    value={outletData.ivrsPhoneNo}
                    placeholder="Enter IVRS Phone Number"
                    sx={{ marginTop: 0 }}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["IVRS Phone Number is required"]}
                  />
                </div>

                <div className="w-33 p-10">
                  <Typography>Block Time (minutes)</Typography>
                  <TextValidator
                    fullWidth
                    size="small"
                    type="number"
                    name="blockTime"
                    value={outletData.blockTime}
                    placeholder="Enter Block Time"
                    sx={{ marginTop: 0 }}
                    onChange={handleChange}
                    validators={["required", "minNumber:0"]}
                    errorMessages={[
                      "Block Time is required",
                      "Block Time should be more than 0",
                    ]}
                  />
                </div>

                <div className="w-33 p-10">
                  <Typography>Chope Name</Typography>
                  <TextValidator
                    fullWidth
                    size="small"
                    margin="normal"
                    type="text"
                    name="chopeName"
                    value={outletData.chopeName}
                    sx={{ marginTop: 0 }}
                    validators={["required"]}
                    onChange={handleChange}
                    errorMessages={["Chope Name is required"]}
                  />
                </div>
                <div className="w-33 p-10">
                  <Typography>Oddle Name</Typography>
                  <TextValidator
                    fullWidth
                    size="small"
                    margin="normal"
                    type="text"
                    name="oddleName"
                    value={outletData.oddleName}
                    sx={{ marginTop: 0 }}
                    validators={["required"]}
                    onChange={handleChange}
                    errorMessages={["Oddle Name is required"]}
                  />
                </div>
              </div>

              <div className="basicinformation-right">
                <Stack className="switch-div">
                  <div className="switching">
                    <Typography>Status</Typography>
                    <Switch
                      name="isActive"
                      className="switch-status"
                      checked={outletData.isActive}
                      onClick={handleToggleButton}
                    />
                  </div>
                  <div className="switching">
                    <Typography>Allow Order</Typography>
                    <Switch
                      name="allowOrder"
                      className="switch-status"
                      checked={outletData.allowOrder}
                      onClick={handleToggleButton}
                    />
                  </div>
                  <div className="switching">
                    <Typography>Allow Booking</Typography>
                    <Switch
                      name="allowBooking"
                      className="switch-status"
                      checked={outletData.allowBooking}
                      onClick={handleToggleButton}
                    />
                  </div>
                </Stack>
                <div className="upload-img">
                  <Typography className="w-100">Image/s</Typography>
                  <div className="upload-block w-100">
                    {outletData.image && (
                      <img
                        className="product-image"
                        src={imageDisplay}
                        alt="outletImage"
                      />
                    )}
                    <Button
                      className="upload-btn"
                      variant="contained"
                      component="label"
                    >
                      <FileUploadOutlinedIcon />
                      <input
                        name="image"
                        accept=".jpeg,.jpg,.png"
                        hidden
                        type="file"
                        onChange={(event) => handleImageUpload(event)}
                      />
                    </Button>
                  </div>
                </div>

                <div className="w-100 info p-10">
                  <DialogContentText>
                    Created by :{hotelReducer.selectedOutlet.outlet.createdBy}
                  </DialogContentText>
                  <DialogContentText>
                    Created date :
                    {hotelReducer.selectedOutlet.outlet.createdAt
                      ? moment(
                          hotelReducer.selectedOutlet.outlet.createdAt
                        ).format("DD-MM-YYYY hh:mm A")
                      : "N/A"}
                  </DialogContentText>
                  <DialogContentText>
                    Updated by:
                    {handleUpdatedBy(
                      hotelReducer.selectedOutlet.outlet.updatedBy
                    )}
                  </DialogContentText>
                  <DialogContentText>
                    Updated date :
                    {hotelReducer.selectedOutlet.outlet.updatedAt
                      ? moment(
                          hotelReducer.selectedOutlet.outlet.updatedAt
                        ).format("DD-MM-YYYY hh:mm A")
                      : "N/A"}
                  </DialogContentText>
                </div>
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

export default connect(null, mapDispatchToProps)(BasicInformation);
