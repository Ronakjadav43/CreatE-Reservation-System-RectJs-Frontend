import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import "./style.scss";

var reader = new FileReader();

const AddPreOrder = (props) => {
  const [isImageUpload, setIsImageUpload] = useState(false);
  const { open, handleClosePreOrder, handleSavePreOrder } = props;
  const [preOrderData, setPreOrderData] = useState({
    sectionId: props.mealTypes,
    name: "",
    dailyMaxQty: "",
    price: 0,
    bookingMaxQty: "",
    description: "",
    image: null,
    originalPrice: 0,
  });
  const [imageDisplay, setImageDisplay] = useState(null);

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...preOrderData };
    commonData[field] = event.target.value;
    return setPreOrderData(commonData);
  };

  const handleFilter = (e) => {
    const value = e.target.value[e.target.value.length - 1];
    let tempData = preOrderData.sectionId.map((data) =>
      data.id === value ? { ...data, isChecked: !data.isChecked } : data
    );
    setPreOrderData({ ...preOrderData, sectionId: tempData });
  };

  const handleAddPreOrder = () => {
    if (isImageUpload) {
      handleSavePreOrder(preOrderData);
      handleClosePreOrder();
    }
  };

  const handleImageUpload = (event) => {
    setPreOrderData({
      ...preOrderData,
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
      <Dialog open={open} onClose={handleClosePreOrder}>
        <ValidatorForm
          onSubmit={() => handleAddPreOrder()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Add Pre Order Item</DialogTitle>
          </Box>
          <DialogContent sx={{ width: "600px" }} className="popup-body">
            <div className="popup-input-box w-50">
              <Typography>Meal Type</Typography>
              {props.mealTypes && (
                <FormControl size="small" sx={{ width: 450 }}>
                  <Select
                    multiple
                    value={preOrderData.sectionId}
                    name="sectionId"
                    required={true}
                    onChange={handleFilter}
                    renderValue={(selected) => {
                      selected = preOrderData.sectionId.filter(
                        (data) => data.isChecked === true
                      );
                      const renderData = selected.map((user) => user.name);
                      return renderData.join(", ");
                    }}
                  >
                    {preOrderData.sectionId.map((mealType) => (
                      <MenuItem key={mealType.id} value={mealType.id}>
                        <ListItemIcon>
                          <Checkbox checked={mealType.isChecked} />
                        </ListItemIcon>
                        <ListItemText primary={mealType.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
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
              {!isImageUpload && <p className="danger">Image Is Required</p>}
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn gap">
            <Button variant="outlined" onClick={handleClosePreOrder}>
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
export default AddPreOrder;
