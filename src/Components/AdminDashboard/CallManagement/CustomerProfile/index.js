import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const CustomerProfile = (props) => {
  const { open, handleCloseMarketing, handleSaveMarketing } = props;

  const [marketingData, setMarketingData] = useState({});

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...marketingData };
    commonData[field] = event.target.value;
    return setMarketingData(commonData);
  };

  const handleAddMarketing = () => {
    handleSaveMarketing(marketingData);
    handleCloseMarketing();
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleCloseMarketing}
        className="user-form-dailog"
      >
        <ValidatorForm
          onSubmit={() => handleAddMarketing()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Customer Profile</DialogTitle>
          </Box>
          <DialogContent sx={{ width: "800px" }} className="popup-body">
            <div className="popup-input-box w-33">
              <Typography>First Name</Typography>
              <TextValidator
                disabled
                size="small"
                fullWidth
                margin="normal"
                type="text"
                name="name"
                value={props.selectedIvrsDetails?.Customer?.name}
                onChange={handleChange}
                placeholder="Enter First Name"
                sx={{ marginTop: 0 }}
              />
            </div>
            <div className="popup-input-box w-33">
              <Typography>Last Name</Typography>
              <TextValidator
                disabled
                size="small"
                fullWidth
                margin="normal"
                type="text"
                name="lastName"
                value={props.selectedIvrsDetails?.Customer?.lastName}
                onChange={handleChange}
                placeholder="Enter Last Name"
                sx={{ marginTop: 0 }}
              />
            </div>
            <div className="popup-input-box w-33">
              <Typography>Gender</Typography>
              <TextValidator
                disabled
                size="small"
                fullWidth
                margin="normal"
                type="text"
                name="gender"
                value={props.selectedIvrsDetails?.Customer?.gender}
                onChange={handleChange}
                placeholder="Enter Gender"
                sx={{ marginTop: 0 }}
              />
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
                value={props.selectedIvrsDetails?.Customer?.email}
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
                value={props.selectedIvrsDetails?.Customer?.mobileNo}
                onChange={handleChange}
                placeholder="Enter Phone Number"
                sx={{ marginTop: 0 }}
              />
            </div>
            <div className="popup-input-box w-33">
              <Typography>Birthday</Typography>
              <TextValidator
                disabled
                size="small"
                fullWidth
                margin="normal"
                type="number"
                name="dob"
                value={props.selectedIvrsDetails?.Customer?.dob}
                onChange={handleChange}
                placeholder="Enter Birthday"
                sx={{ marginTop: 0 }}
              />
            </div>
            <div className="popup-input-box w-33">
              <Typography>Address</Typography>
              <TextValidator
                disabled
                size="small"
                fullWidth
                margin="normal"
                type="text"
                name="address"
                value={props.selectedIvrsDetails?.Customer?.address}
                onChange={handleChange}
                placeholder="Enter Address"
                sx={{ marginTop: 0 }}
              />
            </div>
            <div className="popup-input-box w-33">
              <Typography>Postal Code</Typography>
              <TextValidator
                disabled
                size="small"
                fullWidth
                margin="normal"
                type="number"
                name="postalCode"
                value={props.selectedIvrsDetails?.Customer?.postalCode}
                onChange={handleChange}
                placeholder="Enter Postal Code"
                sx={{ marginTop: 0 }}
              />
            </div>
            <div className="popup-input-box w-33">
              <Typography>Program Name</Typography>
              <TextValidator
                disabled
                size="small"
                fullWidth
                margin="normal"
                type="text"
                name="programName"
                value={props.selectedIvrsDetails?.Customer?.programName}
                onChange={handleChange}
                placeholder="Enter Program Name"
                sx={{ marginTop: 0 }}
              />
            </div>
            <div className="popup-input-box w-33">
              <Typography>Activation Terminal</Typography>
              <TextValidator
                disabled
                size="small"
                fullWidth
                margin="normal"
                type="text"
                name="activationTerminal"
                value={props.selectedIvrsDetails?.Customer?.activationTerminal}
                onChange={handleChange}
                placeholder="Enter Activation Terminal"
                sx={{ marginTop: 0 }}
              />
            </div>

            <div className="popup-input-box w-33">
              <Typography>Activation Date</Typography>
              <TextValidator
                disabled
                size="small"
                fullWidth
                margin="normal"
                type="number"
                name="activeDate"
                onChange={handleChange}
                placeholder="Enter Activation Date"
                sx={{ marginTop: 0 }}
              />
            </div>

            <div className="popup-input-box w-33">
              <Typography>Registration Date </Typography>
              <TextValidator
                disabled
                size="small"
                fullWidth
                margin="normal"
                type="number"
                name="registerDate"
                onChange={handleChange}
                placeholder="Enter Registration Date"
                sx={{ marginTop: 0 }}
              />
            </div>

            <div className="popup-input-box w-33">
              <Typography>Eat Points</Typography>
              <TextValidator
                disabled
                size="small"
                fullWidth
                margin="normal"
                type="number"
                name="eatpoints"
                onChange={handleChange}
                placeholder="Enter Eat Points"
                sx={{ marginTop: 0 }}
                validators={["required", "minNumber:1"]}
                errorMessages={[
                  "Eat Points is required",
                  "Eat points should be more than 1",
                ]}
              />
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseMarketing}>
              <CloseOutlinedIcon /> Close
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </React.Fragment>
  );
};
export default CustomerProfile;
