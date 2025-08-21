import React from "react";
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
import { useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import moment from "moment-timezone";
import { handleUpdatedBy } from "../../../../utils/userAccess";

const EditSeatType = (props) => {
  const {
    open,
    handleClosEditSeatType,
    handleEditSaveSeatType,
    selectedSeatType,
  } = props;

  const [seatTypeData, setSeatTypeData] = useState({
    name: selectedSeatType.name,
    description: selectedSeatType.description,
    isActive: selectedSeatType.isActive,
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...seatTypeData };
    commonData[field] = event.target.value;
    return setSeatTypeData(commonData);
  };

  const handleEditSeatTye = () => {
    handleEditSaveSeatType(seatTypeData, props.selectedSeatType.id);
    handleClosEditSeatType();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClosEditSeatType}>
        <ValidatorForm
          onSubmit={() => handleEditSeatTye()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Update SeatType</DialogTitle>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Status</Typography>
              <Switch
                name="status"
                className="switch-status"
                checked={seatTypeData.isActive}
                onClick={() =>
                  setSeatTypeData({
                    ...seatTypeData,
                    isActive: !seatTypeData.isActive,
                  })
                }
              />
            </Stack>
          </Box>
          <DialogContent sx={{ width: "600px" }} className="popup-body">
            <div className="popup-input-box w-100">
              <Typography>Name</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="name"
                value={seatTypeData.name}
                placeholder="Enter Name"
                sx={{ marginTop: 0 }}
                validators={["required"]}
                onChange={handleChange}
                errorMessages={["Name is required"]}
              />
            </div>
            <div className="popup-input-box w-100">
              <Typography>Description</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="description"
                value={seatTypeData.description}
                multiline
                rows={4}
                placeholder="Enter Description"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
              />
            </div>
            <div className="popup-input-box w-100 info">
              <DialogContentText>
                Created by :{selectedSeatType.createdBy}
              </DialogContentText>
              <DialogContentText>
                Created date :
                {selectedSeatType.createdDate
                  ? moment(selectedSeatType.createdDate).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
              <DialogContentText>
                Updated by:{handleUpdatedBy(selectedSeatType.updatedBy)}
              </DialogContentText>
              <DialogContentText>
                Updated date :
                {selectedSeatType.updatedDate
                  ? moment(selectedSeatType.updatedDate).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions className="primary-btn">
            <Button
              variant="outlined"
              onClick={handleClosEditSeatType}
              className="close-btn"
            >
              <CloseOutlinedIcon /> Close
            </Button>
            <Button type="submit" variant="contained" className="add-btn">
              <SaveOutlinedIcon /> SAVE
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </React.Fragment>
  );
};
export default EditSeatType;
