import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Stack,
  Switch,
  DialogContentText,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useState } from "react";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { handleUpdatedBy } from "../../../../utils/userAccess";
import ENVIRONMENT_VARIABLES from "../../../../environment.config";

let moment = require("moment-timezone");
var reader = new FileReader();

const EditCompany = (props) => {
  const {
    open,
    selectedCompany,
    handleCloseEditCompany,
    handleSaveEditCompany,
    content,
  } = props;

  const [adminData, setAdminData] = useState({
    name: selectedCompany.name,
    description: selectedCompany.description,
    contentLanguage: selectedCompany.contentLanguage,
    isActive: selectedCompany.isActive,
    paymentTC: selectedCompany.paymentTC,
    noPaymentTC: selectedCompany.noPaymentTC,
    image: selectedCompany.image,
  });

  const [imageDisplay, setImageDisplay] = useState(
    `${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${selectedCompany.image}`
  );

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...adminData };
    commonData[field] = event.target.value;
    return setAdminData(commonData);
  };

  const handleEditAdmin = () => {
    handleSaveEditCompany(adminData, selectedCompany.id);
    handleCloseEditCompany();
  };

  const handleImageUpload = (event) => {
    setAdminData({
      ...adminData,
      image: event.target.files[0],
    });
    reader.readAsDataURL(event.target.files[0]);
  };

  reader.onload = function (e) {
    setImageDisplay(e.target.result);
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseEditCompany}>
        <ValidatorForm
          onSubmit={() => handleEditAdmin()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Update Brand</DialogTitle>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Status</Typography>
              <Switch
                name="status"
                className="switch-status"
                checked={adminData.isActive}
                onClick={() =>
                  setAdminData({ ...adminData, isActive: !adminData.isActive })
                }
              />
            </Stack>
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
            <div className="popup-input-box w-50">
              <Typography>Content Language</Typography>
              <FormControl>
                <Select
                  size="small"
                  value={adminData.contentLanguage}
                  name="contentLanguage"
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  onChange={handleChange}
                >
                  {content.map((data, index) => (
                    <MenuItem key={index} value={data.id}>
                      {data.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

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
              </Stack>
            </div>

            <div className="popup-input-box w-100 info">
              <DialogContentText>
                Created by :{props.selectedCompany.createdBy}
              </DialogContentText>
              <DialogContentText>
                Created date :
                {props.selectedCompany.createdDate
                  ? moment(props.selectedCompany.createdDate).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
              <DialogContentText>
                Updated by:{handleUpdatedBy(props.selectedCompany.updatedBy)}
              </DialogContentText>
              <DialogContentText>
                Updated date :
                {props.selectedCompany.updatedDate
                  ? moment(props.selectedCompany.updatedDate).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseEditCompany}>
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
export default EditCompany;
