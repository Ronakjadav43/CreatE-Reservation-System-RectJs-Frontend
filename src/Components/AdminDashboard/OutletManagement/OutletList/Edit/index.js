import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import "../../OutletList/Edit/style.scss";
import { handleUpdatedBy } from "../../../../../utils/userAccess";

let moment = require("moment-timezone");

const EditOutlet = (props) => {
  const { open, selectedOutlet, handleCloseEditOutlet, handleSaveEditOutlet } =
    props;

  const [outletData, setOutletData] = useState({
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
    isActive: selectedOutlet.isActive,
    timezone: selectedOutlet.timezone,
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...outletData };
    commonData[field] = event.target.value;
    return setOutletData(commonData);
  };

  const handleEditOutlet = () => {
    handleSaveEditOutlet(outletData, selectedOutlet.id);
    handleCloseEditOutlet();
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleCloseEditOutlet}
        className="user-form-dailog"
      >
        <ValidatorForm
          onSubmit={() => handleEditOutlet()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Update Outlet</DialogTitle>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Status</Typography>
              <Switch
                name="status"
                className="switch-status"
                checked={outletData.isActive}
                onClick={() =>
                  setOutletData({
                    ...outletData,
                    isActive: !outletData.isActive,
                  })
                }
              />
            </Stack>
          </Box>
          <DialogContent sx={{ width: "1000px" }} className="popup-body">
            <div className="popup-input-box w-50">
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
            <div className="popup-input-box w-50">
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
            <div className="popup-input-box w-50">
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
            <div className="popup-input-box w-50">
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
            <div className="popup-input-box w-50">
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
                errorMessages={[" Address is required"]}
              />
            </div>

            <div className="popup-input-box w-50">
              <Typography>Post Code</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="postcode"
                value={outletData.postcode}
                placeholder="Enter Post Code"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["Post code is required"]}
              />
            </div>
            <div className="popup-input-box w-33">
              <Typography>Latitude</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="latitude"
                value={outletData.latitude}
                placeholder="Enter Latitude"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["Latitude is required"]}
              />
            </div>
            <div className="popup-input-box w-33">
              <Typography>Longitude</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="longitude"
                value={outletData.longitude}
                placeholder="Enter Longitude"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["Longitude is required"]}
              />
            </div>
            <div className="popup-input-box w-33">
              <Typography>Google Place Id</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="googlePlaceId"
                value={outletData.googlePlaceId}
                placeholder="Enter Google Place Id"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["Google Place Id is required"]}
              />
            </div>
            <div className="popup-input-box w-33">
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
                errorMessages={["GST is required", "GST should be more than 0"]}
              />
            </div>
            <div className="popup-input-box w-33">
              <Typography>Rebooking Table Intervel</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="rebookingTableInterval"
                value={outletData.rebookingTableInterval}
                placeholder="Enter Rebooking Table Interval"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["Rebooking Table Interval is required"]}
              />
            </div>
            <div className="popup-input-box w-33">
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
                validators={["required"]}
                errorMessages={["Timezone is required"]}
              />
            </div>
            <div className="popup-input-box w-100 info">
              <DialogContentText>
                Created by :{selectedOutlet.createdBy}
              </DialogContentText>
              <DialogContentText>
                Created date :
                {selectedOutlet.createdAt
                  ? moment(selectedOutlet.createdAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
              <DialogContentText>
                Updated by:{handleUpdatedBy(selectedOutlet.updatedBy)}
              </DialogContentText>
              <DialogContentText>
                Updated date :
                {selectedOutlet.updatedAt
                  ? moment(selectedOutlet.updatedAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseEditOutlet}>
              <CloseOutlinedIcon /> Close
            </Button>
            <Button type="submit" variant="contained">
              <SaveOutlinedIcon /> SAVE
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </React.Fragment>
  );
};
export default EditOutlet;
