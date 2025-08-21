import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { ValidatorForm } from "react-material-ui-form-validator";
import { useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import "./style.scss";

var reader = new FileReader();

const UploadFloorPlan = (props) => {
  const [isImageUpload, setIsImageUpload] = useState(false);
  const { open, handleCloseFloorPlanImage, handleUploadFloorPlan } = props;
  const [floorPlanData, setFloorPlanData] = useState([]);
  const [imageDisplay, setImageDisplay] = useState(null);

  const handleUploadFloorPlanImage = () => {
    if (isImageUpload === true) {
      handleUploadFloorPlan(floorPlanData);
      handleCloseFloorPlanImage();
    }
  };

  const handleImageUpload = (event) => {
    setFloorPlanData({
      ...floorPlanData,
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
      <Dialog open={open} onClose={handleCloseFloorPlanImage}>
        <ValidatorForm
          onSubmit={() => handleUploadFloorPlanImage()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>ADD NEW FLOOR</DialogTitle>
          </Box>
          <DialogContent
            sx={{ width: "600px" }}
            className="popup-body"
          >
            <Stack
              sx={{ width: "100%" }}
              direction="row"
              alignItems="center"
              spacing={2}
            >
              <div className="upload-block">
                {floorPlanData.image && (
                  <img
                    className="product-image"
                    src={imageDisplay}
                    alt="demo"
                  />
                )}
                <Button
                  className="upload-btn"
                  variant="contained"
                  component="label"
                >
                  {/* Upload */}
                  <FileUploadOutlinedIcon />
                  <input
                    validators={["required"]}
                    errorMessages={["Image is required"]}
                    name="image"
                    accept="image/*"
                    hidden
                    type="file"
                    onChange={(event) => handleImageUpload(event)}
                  />
                </Button>
                {!isImageUpload && <p className="danger">Image Is Required</p>}
              </div>
            </Stack>
          </DialogContent>
          <DialogActions className="primary-btn">
            <Button
              variant="outlined"
              onClick={handleCloseFloorPlanImage}
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
export default UploadFloorPlan;
