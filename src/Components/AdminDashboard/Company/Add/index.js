import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

var reader = new FileReader();

const AddCompany = (props) => {
  const { open, handleCloseCompany, handleSaveCompany, content } = props;

  const [isImageUpload, setIsImageUpload] = useState(false);

  const [adminData, setAdminData] = useState({
    name: "",
    contentLanguage: content[0].id,
    description: "",
    paymentTC: "",
    noPaymentTC: "",
    image: null,
  });

  const [imageDisplay, setImageDisplay] = useState(null);

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...adminData };
    commonData[field] = event.target.value;
    return setAdminData(commonData);
  };

  const handleAddCompany = () => {
    handleSaveCompany(adminData);
    handleCloseCompany();
  };

  const handleImageUpload = (event) => {
    setAdminData({
      ...adminData,
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
      <Dialog open={open} onClose={handleCloseCompany}>
        <ValidatorForm
          onSubmit={() => handleAddCompany()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Add Brand</DialogTitle>
          </Box>
          <DialogContent sx={{ width: "600px" }} className="popup-body">
            <div className="popup-input-box w-50">
              <Typography>Name</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="name"
                value={adminData.name}
                placeholder="Enter Name"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["name is required"]}
              />
            </div>
            {props.content.length > 0 && (
              <div className="popup-input-box w-50">
                <Typography>Content Language</Typography>
                <FormControl>
                  <Select
                    size="small"
                    value={adminData.contentLanguage}
                    name="contentLanguage"
                    inputProps={{ "aria-label": "Without label" }}
                    onChange={handleChange}
                  >
                    {props.content.map((data, index) => (
                      <MenuItem key={index} value={data.id}>
                        {data.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}

            <div className="popup-input-box w-100">
              <Typography>Description</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="description"
                value={adminData.description}
                placeholder="Enter Description"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
              />
            </div>
            <div className="popup-input-box w-100">
              <Typography>Payment Terms & Condition</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="paymentTC"
                value={adminData.paymentTC}
                onChange={handleChange}
                placeholder="Enter Payment Terms and Conditions"
                sx={{ marginTop: 0 }}
                multiline
                rows={4}
              />
            </div>

            <div className="popup-input-box w-100">
              <Typography>No Payment Terms & Condition</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="noPaymentTC"
                value={adminData.noPaymentTC}
                onChange={handleChange}
                placeholder="Enter No Payment Terms and Conditions"
                sx={{ marginTop: 0 }}
                multiline
                rows={4}
              />
            </div>
            <div className="popup-input-box w-50">
              <Typography>Upload Image</Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                {adminData.image && (
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
                      accept=".jpeg,.jpg,.png/*"
                      hidden
                      type="file"
                      onChange={(event) => handleImageUpload(event)}
                      validators={["required"]}
                    />
                  </Button>
                </div>
              </Stack>
              {!isImageUpload && <p className="danger">Image Is Required</p>}
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseCompany}>
              <CloseOutlinedIcon /> Close
            </Button>
            <Button type="submit" variant="contained">
              <AddOutlinedIcon />
              Add
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </React.Fragment>
  );
};
export default AddCompany;
