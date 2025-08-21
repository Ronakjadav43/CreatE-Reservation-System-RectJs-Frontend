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
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const AddAdmin = (props) => {
  const { open, handleCloseAdmin, handleSaveAdmin } = props;
  const [adminData, setAdminData] = useState({
    email: "",
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...adminData };
    commonData[field] = event.target.value;
    return setAdminData(commonData);
  };

  const handleAddRole = () => {
    handleSaveAdmin(adminData);
    handleCloseAdmin();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseAdmin}>
        <ValidatorForm
          onSubmit={() => handleAddRole()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Add New Superuser</DialogTitle>
          </Box>
          <DialogContent sx={{ width: "600px" }} className="popup-body">
            <div className="popup-input-box w-100">
              <Typography>Email</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="email"
                value={adminData.email}
                placeholder="Enter Email"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["required", "isEmail"]}
                errorMessages={["Email is required", "email is not valid"]}
              />
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseAdmin}>
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
export default AddAdmin;
