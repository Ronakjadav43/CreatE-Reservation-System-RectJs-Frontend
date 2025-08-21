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

import ENVIRONMENT_VARIABLES from "../../../../../environment.config";
import "./style.scss";
import { handleUpdatedBy } from "../../../../../utils/userAccess";

let moment = require("moment-timezone");
var reader = new FileReader();

const EditDiningOption = (props) => {
  const {
    open,
    handleClosEditDiningOption,
    handleEditSaveDiningOption,
    selectedDiningOption,
  } = props;

  const [diningOptionData, setDiningOptionData] = useState({
    name: selectedDiningOption.name,
    price: selectedDiningOption.price,
    dailyMaxQty: selectedDiningOption.dailyMaxQty,
    bookingMaxQty: selectedDiningOption.bookingMaxQty,
    description: selectedDiningOption.description,
    isActive: selectedDiningOption.isActive,
    image: selectedDiningOption.image,
    originalPrice: selectedDiningOption.originalPrice,
  });

  const [isImageLoad, setIsImageLoad] = useState(false);
  const [imageDisplay, setImageDisplay] = useState(
    `${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${selectedDiningOption.image}`
  );

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...diningOptionData };
    commonData[field] = event.target.value;
    return setDiningOptionData(commonData);
  };

  const handleEditSavePreOrder = () => {
    handleEditSaveDiningOption(diningOptionData, props.selectedDiningOption.id);
    handleClosEditDiningOption();
  };

  const handleImageUpload = (event) => {
    if (
      event.target.files[0].type === "image/jpeg" ||
      event.target.files[0].type === "image/png"
    ) {
      setDiningOptionData({
        ...diningOptionData,
        image: event.target.files[0],
      });
      reader.readAsDataURL(event.target.files[0]);
      setIsImageLoad(false);
    } else {
      setIsImageLoad(true);
    }
  };

  reader.onload = function (e) {
    setImageDisplay(e.target.result);
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClosEditDiningOption}>
        <ValidatorForm
          onSubmit={() => handleEditSavePreOrder()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Update Dining Option</DialogTitle>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Status</Typography>
              <Switch
                name="status"
                checked={diningOptionData.isActive}
                onClick={() =>
                  setDiningOptionData({
                    ...diningOptionData,
                    isActive: !diningOptionData.isActive,
                  })
                }
              />
            </Stack>
          </Box>
          <DialogContent sx={{ width: "600px" }} className="popup-body">
            <div className="popup-input-box w-50">
              <Typography>Item Name</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="name"
                value={diningOptionData.name}
                placeholder="Enter Item Name"
                sx={{ marginTop: 0 }}
                validators={["required"]}
                onChange={handleChange}
                errorMessages={["Item Name is required"]}
              />
            </div>

            <div className="popup-input-box w-50">
              <Typography>Day Max Quantity</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="number"
                name="dailyMaxQty"
                value={diningOptionData.dailyMaxQty}
                placeholder="Enter Day Max Quantity"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["required", "minNumber:0"]}
                errorMessages={[
                  "Day Max Quantity is required",
                  "Day Max Quantity should be more than 0",
                ]}
              />
            </div>
            <div className="popup-input-box w-50">
              <Typography>Booking Max Quantity</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="number"
                name="bookingMaxQty"
                value={diningOptionData.bookingMaxQty}
                placeholder="Enter Booking Max Quantity"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["required", "minNumber:0"]}
                errorMessages={[
                  "Booking Max Quantity is required",
                  "Booking Max Quantity should be more than 0",
                ]}
              />
            </div>

            <div className="popup-input-box w-50">
              <Typography>Price</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="number"
                name="originalPrice"
                value={diningOptionData.originalPrice}
                placeholder="Enter Price"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["required", "minNumber:0"]}
                errorMessages={[
                  "Price is required",
                  "Price should be more than 0",
                ]}
              />
            </div>

            <div className="popup-input-box w-50">
              <Typography>Deposit Amount</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="number"
                name="price"
                value={diningOptionData.price}
                placeholder="Enter Deposit Amount"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["required", "minNumber:0"]}
                errorMessages={[
                  "Deposit Amount is required",
                  "Deposit Amount should be more than 0",
                ]}
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
                value={diningOptionData.description}
                multiline
                rows={4}
                placeholder="Enter Description"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
              />
            </div>
            <div className="popup-input-box w-50">
              <Typography>Upload Image</Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                {!isImageLoad ? (
                  <img
                    className="product-image"
                    src={imageDisplay}
                    alt="demo"
                  />
                ) : (
                  ""
                )}
                <Button variant="contained" component="label">
                  Upload
                  <input
                    name="image"
                    accept=".jpeg,.jpg,.png"
                    hidden
                    type="file"
                    onChange={(event) => handleImageUpload(event)}
                  />
                </Button>
              </Stack>
              {isImageLoad && (
                <div className="dangers">This File Type Not Allowed</div>
              )}
            </div>
            <div className="popup-input-box w-50 info">
              <DialogContentText>
                Created by :{props.selectedDiningOption.createdBy}
              </DialogContentText>
              <DialogContentText>
                Created date :
                {props.selectedDiningOption.createdAt
                  ? moment(props.selectedDiningOption.createdAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
              <DialogContentText>
                Updated by:
                {handleUpdatedBy(props.selectedDiningOption.updatedBy)}
              </DialogContentText>
              <DialogContentText>
                Updated date :
                {props.selectedDiningOption.updatedAt
                  ? moment(props.selectedDiningOption.updatedAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn gap">
            <Button variant="outlined" onClick={handleClosEditDiningOption}>
              <CloseOutlinedIcon /> Close
            </Button>
            <Button disabled={isImageLoad} type="submit" variant="contained">
              <SaveOutlinedIcon /> SAVE
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </React.Fragment>
  );
};
export default EditDiningOption;
