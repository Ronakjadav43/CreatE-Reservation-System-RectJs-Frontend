import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PhoneInput from "react-phone-input-2";
import "./style.scss";

var reader = new FileReader();

const AddOutlet = (props) => {
  const [isImageUpload, setIsImageUpload] = useState(false);
  const [imageDisplay, setImageDisplay] = useState(null);
  const { open, handleCloseOutlet, handleSaveOutlet } = props;
  const [outletData, setOutletData] = useState({
    name: "",
    description: "",
    address1: "",
    postcode: "",
    latitude: " ",
    longitude: " ",
    phone: "",
    email: "",
    googlePlaceId: " ",
    gst: null,
    rebookingTableInterval: "",
    timeSlotInterval: "",
    timezone: "Asia/Singapore",
    allowOrder: true,
    allowBooking: true,
    companyId: props.companies.length > 0 ? props.companies[0].id : 0,
    chopeName: "",
    oddleName : "",
    ivrsPhoneNo: "",
    blockTime: "",
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...outletData };
    commonData[field] = event.target.value;
    return setOutletData(commonData);
  };

  const handleAddOutlet = () => {
    if (isImageUpload) {
      handleSaveOutlet(outletData);
      handleCloseOutlet();
    }
  };

  const handleImageUpload = (event) => {
    setOutletData({
      ...outletData,
      image: event.target.files[0],
    });
    setIsImageUpload(true);
    reader.readAsDataURL(event.target.files[0]);
  };

  reader.onload = function (e) {
    setImageDisplay(e.target.result);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleCloseOutlet}
        className="user-form-dailog"
        x
      >
        <ValidatorForm
          onSubmit={() => handleAddOutlet()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Add New Outlet</DialogTitle>
            <div className="switch-button">
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Allow Order</Typography>
                <Switch
                  name="allowOrder"
                  className="switch-status"
                  checked={outletData.allowOrder}
                  onClick={() =>
                    setOutletData({
                      ...outletData,
                      allowOrder: !outletData.allowOrder,
                    })
                  }
                />
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Allow Booking</Typography>
                <Switch
                  name="allowBooking"
                  className="switch-status"
                  checked={outletData.allowBooking}
                  onClick={() =>
                    setOutletData({
                      ...outletData,
                      allowBooking: !outletData.allowBooking,
                    })
                  }
                />
              </Stack>
            </div>
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
                errorMessages={["Email is required", "Email is not valid"]}
              />
            </div>
            <div className="popup-input-boxs w-50">
              <Typography>Phone </Typography>
              <PhoneInput
                className="w-100"
                country={"sg"}
                inputProps={{
                  name: "phone",
                  required: true,
                }}
                onChange={(phone) =>
                  handleChange({
                    target: { name: "phone", value: phone },
                  })
                }
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
                multiline
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
                errorMessages={["Address is required"]}
                multiline
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

            <div className="popup-input-box w-33">
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
              />
            </div>
            <div className="popup-input-box w-33">
              <Typography>Company</Typography>
              <FormControl>
                <Select
                  size="small"
                  value={outletData.companyId}
                  name="companyId"
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  onChange={handleChange}
                >
                  {props.companies.map((company, index) => (
                    <MenuItem key={index} value={company.id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="popup-input-box w-33">
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
            <div className="popup-input-boxs w-33">
              <Typography>IVRS Phone Number</Typography>
              <PhoneInput
                className="w-100"
                country={"sg"}
                inputProps={{
                  name: "phone",
                  required: true,
                }}
                onChange={(phone) =>
                  handleChange({
                    target: { name: "ivrsPhoneNo", value: phone },
                  })
                }
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
                placeholder="Enter Chope Name"
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
                placeholder="Enter Oddle Name"
                sx={{ marginTop: 0 }}
                validators={["required"]}
                onChange={handleChange}
                errorMessages={["Oddle Name is required"]}
              />
            </div>

            <div className="popup-input-box w-33">
              <Typography>Upload Image</Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                {outletData.image && (
                  <img
                    className="product-image"
                    src={imageDisplay}
                    alt="demo"
                  />
                )}
                <div className="primary-btn popup-btn">
                  <Button variant="contained" component="label">
                    Upload
                    <input
                      name="image"
                      accept="image/*"
                      hidden
                      type="file"
                      onChange={(event) => handleImageUpload(event)}
                    />
                  </Button>
                </div>
              </Stack>
              {!isImageUpload && <p className="danger">Image Is Required</p>}
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseOutlet}>
              <CloseOutlinedIcon /> Close
            </Button>
            <Button type="submit" variant="contained">
              <AddOutlinedIcon /> Add
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </React.Fragment>
  );
};
export default AddOutlet;
