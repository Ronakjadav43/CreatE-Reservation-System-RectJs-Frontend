/* eslint-disable react-hooks/exhaustive-deps */
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
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import ENVIRONMENT_VARIABLES from "../../../../../environment.config";
import { handleUpdatedBy } from "../../../../../utils/userAccess";

var reader = new FileReader();
let moment = require("moment-timezone");

const EditPrivateRoom = (props) => {
  const { open, handleCloseEditPrivateRoom, handleSaveEditPrivateRoom } = props;
  const [imageDisplay, setImageDisplay] = useState(
    `${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${props.selectedPrivateRoom.image}`
  );

  const [outletTableData, setOutletTableData] = useState({
    isActive: props.selectedPrivateRoom.isActive,
    image: props.selectedPrivateRoom.image,
    name: props.selectedPrivateRoom.name,
    description: props.selectedPrivateRoom.description,
    sequenceTables: props.selectedPrivateRoom.sequenceTables,
    originalPrice: props.selectedPrivateRoom.originalPrice,
    price: props.selectedPrivateRoom.price,
    blockTime: props.selectedPrivateRoom.blockTime,
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...outletTableData };
    commonData[field] = event.target.value;
    return setOutletTableData(commonData);
  };

  const handleEditPrivateRoom = () => {
    handleSaveEditPrivateRoom(outletTableData);
    handleCloseEditPrivateRoom();
  };

  reader.onload = function (e) {
    setImageDisplay(e.target.result);
  };

  const handleImageUpload = (event) => {
    setOutletTableData({
      ...outletTableData,
      image: event.target.files[0],
    });
    reader.readAsDataURL(event.target.files[0]);
  };

  return (
    <React.Fragment>
      {outletTableData && (
        <Dialog open={open} onClose={handleCloseEditPrivateRoom}>
          <ValidatorForm
            onSubmit={() => handleEditPrivateRoom()}
            autoComplete="off"
            className="popup-layout"
          >
            <Box className="popup-header">
              <DialogTitle>Update Private Room</DialogTitle>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Status</Typography>
                <Switch
                  checked={outletTableData.isActive}
                  onClick={() =>
                    setOutletTableData({
                      ...outletTableData,
                      isActive: !outletTableData.isActive,
                    })
                  }
                />
              </Stack>
            </Box>
            <DialogContent
              sx={{ width: "600px", maxWidth: "600px" }}
              className="popup-body"
            >
              <div className="popup-input-box w-50">
                <Typography>Name</Typography>
                <TextValidator
                  fullWidth
                  size="small"
                  margin="normal"
                  type="text"
                  name="name"
                  value={outletTableData.name}
                  placeholder="Enter Name"
                  sx={{ marginTop: 0 }}
                  validators={["required"]}
                  onChange={handleChange}
                  errorMessages={["Name is required"]}
                />
              </div>

              <div className="popup-input-box w-50">
                <Typography>Unit Price</Typography>
                <TextValidator
                  fullWidth
                  size="small"
                  type="number"
                  name="originalPrice"
                  value={outletTableData.originalPrice}
                  placeholder="Enter Unit Price"
                  sx={{ marginTop: 0 }}
                  onChange={handleChange}
                  validators={["minNumber:0"]}
                  errorMessages={["Unit Price should be more than 0"]}
                />
              </div>

              <div className="popup-input-box w-50">
                <Typography>Deposit Price</Typography>
                <TextValidator
                  fullWidth
                  size="small"
                  type="number"
                  name="price"
                  value={outletTableData.price}
                  placeholder="Enter Deposit Price"
                  sx={{ marginTop: 0 }}
                  onChange={handleChange}
                  validators={["minNumber:0"]}
                  errorMessages={["Deposit Price should be more than 0"]}
                />
              </div>

              <div className="popup-input-box w-50">
                <Typography>Block Time (In Minutes)</Typography>
                <TextValidator
                  fullWidth
                  size="small"
                  type="number"
                  name="blockTime"
                  value={outletTableData.blockTime}
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

              <div className="popup-input-box w-100">
                <Typography>Description</Typography>
                <TextValidator
                  fullWidth
                  size="small"
                  type="text"
                  name="description"
                  multiline
                  rows={4}
                  value={outletTableData.description}
                  placeholder="Enter Description"
                  sx={{ marginTop: 0 }}
                  onChange={handleChange}
                />
              </div>

              <div className="popup-input-box w-50">
                <Typography>Upload Image</Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                  {outletTableData.image && (
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
              </div>
              <div className="popup-input-box w-50 info">
                <DialogContentText>
                  Created by :{props.selectedPrivateRoom.createdBy}
                </DialogContentText>
                <DialogContentText>
                  Created date :
                  {props.selectedPrivateRoom.createdAt
                    ? moment(props.selectedPrivateRoom.createdAt).format(
                        "DD-MM-YYYY hh:mm A"
                      )
                    : "N/A"}
                </DialogContentText>
                <DialogContentText>
                  Updated by:
                  {handleUpdatedBy(props.selectedPrivateRoom.updatedBy)}
                </DialogContentText>
                <DialogContentText>
                  Updated date :
                  {props.selectedPrivateRoom.updatedAt
                    ? moment(props.selectedPrivateRoom.updatedAt).format(
                        "DD-MM-YYYY hh:mm A"
                      )
                    : "N/A"}
                </DialogContentText>
              </div>
            </DialogContent>
            <DialogActions className="primary-btn popup-btn">
              <Button
                variant="outlined"
                onClick={handleCloseEditPrivateRoom}
                className="close-btn"
              >
                <CloseOutlinedIcon /> Close
              </Button>
              <Button type="submit" variant="contained" className="add-btn">
                <AddOutlinedIcon /> Save
              </Button>
            </DialogActions>
          </ValidatorForm>
        </Dialog>
      )}
    </React.Fragment>
  );
};
export default EditPrivateRoom;
