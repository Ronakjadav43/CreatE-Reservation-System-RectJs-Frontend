import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContentText,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Stack,
  Switch,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useState } from "react";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import moment from "moment-timezone";
import PhoneInput from "react-phone-input-2";
import { handleUpdatedBy } from "../../../../utils/userAccess";

const EditAdmin = (props) => {
  const { open, selectedAdmin, handleCloseEditAdmin, handleSaveEditAdmin } =
    props;

  const [adminData, setAdminData] = useState({
    firstName: selectedAdmin.firstName,
    lastName: selectedAdmin.lastName,
    email: selectedAdmin.email,
    phone: selectedAdmin.phone,
    isActive: selectedAdmin.isActive,
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...adminData };
    commonData[field] = event.target.value;
    return setAdminData(commonData);
  };

  const handleEditAdmin = () => {
    handleSaveEditAdmin(adminData, selectedAdmin.id);
    handleCloseEditAdmin();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseEditAdmin}>
        <ValidatorForm
          onSubmit={() => handleEditAdmin()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Update Admin</DialogTitle>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Status</Typography>
              <Switch
                name="status"
                className="switch-status"
                checked={adminData.isActive}
                onClick={() =>
                  setAdminData({ ...adminData, isActive: !adminData.isActive })
                }
              />
            </Stack>
          </Box>
          <DialogContent sx={{ width: "600px" }} className="popup-body">
            <div className="popup-input-box w-100">
              <Typography>First Name</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="firstName"
                value={adminData.firstName}
                placeholder="Enter First Name"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["First name is required"]}
              />
            </div>
            <div className="popup-input-box w-100">
              <Typography>Last Name</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="lastName"
                value={adminData.lastName}
                placeholder="Enter Last Name"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["Last name is required"]}
              />
            </div>

            <div className="popup-input-box w-100">
              <Typography>Email</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="email"
                name="email"
                value={adminData.email}
                placeholder="Enter Email"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["required", "isEmail"]}
                errorMessages={["Email is required", "email is not valid"]}
              />
            </div>
            {selectedAdmin.phone ? (
              <div className="popup-input-box w-100">
                <Typography>Phone Number</Typography>
                <TextValidator
                  fullWidth
                  size="small"
                  margin="normal"
                  type="text"
                  name="phone"
                  value={adminData.phone}
                  placeholder="Enter Phone Number"
                  sx={{ marginTop: 0 }}
                  onChange={handleChange}
                  validators={["required"]}
                  errorMessages={["Phone Number is required"]}
                />
              </div>
            ) : (
              <div className="popup-input-boxs w-50">
                <Typography>Phone Number</Typography>
                <PhoneInput
                  className="w-100"
                  country={"sg"}
                  inputProps={{
                    name: "phone",
                    required: true,
                  }}
                  onChange={(phone) =>
                    handleChange({
                      target: { name: "phone", value: `+${phone}` },
                    })
                  }
                />
              </div>
            )}

            <div className="popup-input-box w-100 info">
              <DialogContentText>
                Created by :{selectedAdmin.createdBy}
              </DialogContentText>
              <DialogContentText>
                Created date :
                {selectedAdmin.createdDate
                  ? moment(selectedAdmin.createdDate).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
              <DialogContentText>
                Updated by:{handleUpdatedBy(selectedAdmin.updatedBy)}
              </DialogContentText>
              <DialogContentText>
                Updated date :
                {selectedAdmin.updatedDate
                  ? moment(selectedAdmin.updatedDate).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseEditAdmin}>
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
export default EditAdmin;
