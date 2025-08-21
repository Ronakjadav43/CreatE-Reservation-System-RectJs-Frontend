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

import "./style.scss";

const AddSeatingType = (props) => {
  const { open, handleCloseSeatingType, handleSaveSeatingType } = props;

  const [seatingData, setSeatingData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...seatingData };
    commonData[field] = event.target.value;
    return setSeatingData(commonData);
  };

  const handleAddSeatingType = () => {
    handleSaveSeatingType(seatingData);
    handleCloseSeatingType();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={() => handleCloseSeatingType(false)}>
        <ValidatorForm
          onSubmit={() => handleAddSeatingType()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Add Space</DialogTitle>
          </Box>
          <DialogContent sx={{ width: "600px" }} className="popup-body">
            <div className="popup-input-box w-100">
              <Typography>Space Name</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="name"
                name="name"
                value={seatingData.name}
                placeholder="Enter Space Name"
                sx={{ marginTop: 0 }}
                validators={["required"]}
                onChange={handleChange}
                errorMessages={["Space Name is required"]}
              />
            </div>
            <div className="popup-input-box w-100">
              <Typography>Description</Typography>
              <TextValidator
                sx={{ width: "100%", marginTop: 0 }}
                size="small"
                margin="normal"
                type="description"
                name="description"
                value={seatingData.description}
                placeholder="Enter Description"
                multiline
                rows={4}
                onChange={handleChange}
              />
            </div>
          </DialogContent>
          <DialogActions className="primary-btn">
            <Button
              variant="outlined"
              onClick={() => handleCloseSeatingType(false)}
              className="close-btn"
            >
              <CloseOutlinedIcon /> Close
            </Button>
            <Button type="submit" variant="contained" className="add-btn">
              <AddOutlinedIcon /> Add
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </React.Fragment>
  );
};

export default AddSeatingType;
