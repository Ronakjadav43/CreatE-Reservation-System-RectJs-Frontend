import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import "./style.scss";

var reader = new FileReader();

const AddDiningOption = (props) => {
  const [isImageUpload, setIsImageUpload] = useState(false);
  const [isImageType, setIsImageType] = useState(false);
  const { open, handleCloseDiningOption, handleSaveDiningOption } = props;
  const [diningOptionData, setDiningOptionData] = useState({
    name: "",
    description: "",
    price: "",
    dailyMaxQty: "",
    bookingMaxQty: "",
    image: "",
    originalPrice: 0,
  });
  const [imageDisplay, setImageDisplay] = useState(null);

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...diningOptionData };
    commonData[field] = event.target.value;
    return setDiningOptionData(commonData);
  };

  const handleAddDiningOption = () => {
    if (isImageUpload) {
      handleSaveDiningOption(diningOptionData);
      handleCloseDiningOption();
    }
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
      setIsImageUpload(true);
      setIsImageType(false);
      reader.readAsDataURL(event.target.files[0]);
    } else {
      setIsImageType(true);
      setIsImageUpload(false);
    }
  };

  reader.onload = function (e) {
    setImageDisplay(e.target.result);
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseDiningOption}>
        <ValidatorForm
          onSubmit={() => handleAddDiningOption()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Add Dining Option</DialogTitle>
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
              <Typography>Unit Price</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="number"
                name="originalPrice"
                value={diningOptionData.originalPrice}
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
                {isImageUpload ? (
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
              {isImageType && (
                <div className="dangers">This File Type Not Allowed</div>
              )}
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn gap">
            <Button variant="outlined" onClick={handleCloseDiningOption}>
              <CloseOutlinedIcon /> Close
            </Button>
            <Button disabled={!isImageUpload} type="submit" variant="contained">
              <AddOutlinedIcon /> Add
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </React.Fragment>
  );
};
export default AddDiningOption;
