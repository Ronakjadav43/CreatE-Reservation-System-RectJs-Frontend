import * as React from "react";
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
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import "./style.scss";
import moment from "moment-timezone";
import { handleUpdatedBy } from "../../../../utils/userAccess";

const EditSeatingType = (props) => {
  const { open, handleCloseEditSeatingType, handleEditSaveSeatingType } = props;

  const [seatingData, setSeatingData] = useState({
    name: props.selectedSeatingType.name,
    description: props.selectedSeatingType.description,
    isActive: props.selectedSeatingType.isActive,
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...seatingData };
    commonData[field] = event.target.value;
    return setSeatingData(commonData);
  };

  const handleEditSeatingType = () => {
    handleEditSaveSeatingType(seatingData, props.selectedSeatingType.id);
    handleCloseEditSeatingType();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseEditSeatingType}>
        <ValidatorForm
          onSubmit={() => handleEditSeatingType()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Update Space</DialogTitle>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Status</Typography>
              <Switch
                name="status"
                className="switch-status"
                checked={seatingData.isActive}
                onClick={() =>
                  setSeatingData({
                    ...seatingData,
                    isActive: !seatingData.isActive,
                  })
                }
              />
            </Stack>
          </Box>

          <DialogContent sx={{ width: "600px" }} className="popup-body">
            <div className="popup-input-box w-100">
              <Typography>Space Name</Typography>
              <TextValidator
                sx={{ width: "100%", marginTop: 0 }}
                size="small"
                margin="normal"
                name="name"
                value={seatingData.name}
                placeholder="Enter Space Name"
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["Space Name is required"]}
              />
            </div>
            <div className="popup-input-box w-100">
              <Typography>Description</Typography>
              <TextValidator
                sx={{ width: "100%", marginTop: 0 }}
                size="small"
                margin="normal"
                type="text"
                name="description"
                multiline
                rows={4}
                value={seatingData.description}
                placeholder="Enter Description"
                onChange={handleChange}
              />
            </div>
            <div className="popup-input-box w-100 info">
              <DialogContentText>
                Created by :{props.selectedSeatingType.createdBy}
              </DialogContentText>
              <DialogContentText>
                Created date :
                {props.selectedSeatingType.createdDate
                  ? moment(props.selectedSeatingType.createdAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
              <DialogContentText>
                Updated by:
                {handleUpdatedBy(props.selectedSeatingType.updatedBy)}
              </DialogContentText>
              <DialogContentText>
                Updated date :
                {props.selectedSeatingType.updatedDate
                  ? moment(props.selectedSeatingType.updatedAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
            </div>
          </DialogContent>

          <DialogActions className="primary-btn">
            <Button variant="outlined" onClick={handleCloseEditSeatingType}>
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
export default EditSeatingType;
