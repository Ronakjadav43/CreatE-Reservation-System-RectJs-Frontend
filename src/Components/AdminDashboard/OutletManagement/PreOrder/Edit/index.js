import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ENVIRONMENT_VARIABLES from "../../../../../environment.config";

import "./style.scss";
import { handleUpdatedBy } from "../../../../../utils/userAccess";

let moment = require("moment-timezone");
var reader = new FileReader();

const EditPreOrder = (props) => {
  const {
    open,
    handleClosEditPreOrder,
    handleEditSavePreOrder,
    selectedPreOrder,
    mealTypes,
  } = props;

  const [preOrderData, setPreOrderData] = useState({
    sectionId: selectedPreOrder.sectionId,
    name: selectedPreOrder.name,
    dailyMaxQty: selectedPreOrder.dailyMaxQty,
    price: selectedPreOrder.price,
    bookingMaxQty: selectedPreOrder.bookingMaxQty,
    originalPrice: selectedPreOrder.originalPrice,
    description: selectedPreOrder.description,
    isActive: selectedPreOrder.isActive,
    image: selectedPreOrder.image,
  });

  const [imageDisplay, setImageDisplay] = useState(
    `${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${selectedPreOrder.image}`
  );

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...preOrderData };
    commonData[field] = event.target.value;
    return setPreOrderData(commonData);
  };

  const handleEditPreOrder = () => {
    handleEditSavePreOrder(preOrderData, props.selectedPreOrder.id);
    handleClosEditPreOrder();
  };

  const handleImageUpload = (event) => {
    setPreOrderData({
      ...preOrderData,
      image: event.target.files[0],
    });
    reader.readAsDataURL(event.target.files[0]);
  };

  reader.onload = function (e) {
    setImageDisplay(e.target.result);
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClosEditPreOrder}>
        <ValidatorForm
          onSubmit={() => handleEditPreOrder()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Update Pre Order Item</DialogTitle>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Status</Typography>
              <Switch
                name="status"
                checked={preOrderData.isActive}
                onClick={() =>
                  setPreOrderData({
                    ...preOrderData,
                    isActive: !preOrderData.isActive,
                  })
                }
              />
            </Stack>
          </Box>
          <DialogContent sx={{ width: "600px" }} className="popup-body">
            <div className="popup-input-box w-50">
              <Typography>Meal Type</Typography>
              <FormControl>
                <Select
                  size="small"
                  value={preOrderData.sectionId}
                  name="sectionId"
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  onChange={handleChange}
                >
                  {mealTypes.map((mealType, index) => (
                    <MenuItem key={index} value={mealType.id}>
                      {mealType.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="popup-input-box w-50">
              <Typography>Item Name</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="name"
                value={preOrderData.name}
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
                value={preOrderData.dailyMaxQty}
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
                value={preOrderData.bookingMaxQty}
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
              <Typography>Unit Price</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="number"
                name="originalPrice"
                value={preOrderData.originalPrice}
                placeholder="Enter Unit Price"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["required", "minNumber:0"]}
                errorMessages={[
                  "Unit Price is required",
                  "Unit Price should be more than 0",
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
                value={preOrderData.price}
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
                value={preOrderData.description}
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
                {preOrderData.image && (
                  <img
                    className="product-image"
                    src={imageDisplay}
                    alt="demo"
                  />
                )}
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
              </Stack>
            </div>
            <div className="popup-input-box w-50 info">
              <DialogContentText>
                Created by :{props.selectedPreOrder.createdBy}
              </DialogContentText>
              <DialogContentText>
                Created date :
                {props.selectedPreOrder.createdAt
                  ? moment(props.selectedPreOrder.createdAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
              <DialogContentText>
                Updated by:{handleUpdatedBy(props.selectedPreOrder.updatedBy)}
              </DialogContentText>
              <DialogContentText>
                Updated date :
                {props.selectedPreOrder.updatedAt
                  ? moment(props.selectedPreOrder.updatedAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn gap">
            <Button variant="outlined" onClick={handleClosEditPreOrder}>
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
export default EditPreOrder;
