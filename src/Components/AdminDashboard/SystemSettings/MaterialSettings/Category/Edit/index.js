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
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useState } from "react";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { handleUpdatedBy } from "../../../../../../utils/userAccess";

let moment = require("moment-timezone");

const EditCategory = (props) => {
  const {
    open,
    selectedCategory,
    handleCloseEditCategory,
    handleSaveEditCategory,
  } = props;

  const [categoryData, setCategoryData] = useState({
    name: selectedCategory.name,
    description: selectedCategory.description,
    isActive: selectedCategory.isActive,
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...categoryData };
    commonData[field] = event.target.value;
    return setCategoryData(commonData);
  };

  const handleEditTagCategory = () => {
    handleSaveEditCategory(categoryData, selectedCategory.id);
    handleCloseEditCategory();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseEditCategory}>
        <ValidatorForm
          onSubmit={() => handleEditTagCategory()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Update Category</DialogTitle>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Status</Typography>
              <Switch
                name="status"
                className="switch-status"
                checked={categoryData.isActive}
                onClick={() =>
                  setCategoryData({
                    ...categoryData,
                    isActive: !categoryData.isActive,
                  })
                }
              />
            </Stack>
          </Box>
          <DialogContent sx={{ width: "600px" }} className="popup-body">
            <div className="popup-input-box w-100">
              <Typography>Name</Typography>
              <TextValidator
                size="small"
                fullWidth
                margin="normal"
                type="text"
                name="name"
                value={categoryData.name}
                placeholder="Enter Name"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["Name is required"]}
              />
            </div>
            <div className="popup-input-box w-100">
              <Typography>Description</Typography>
              <TextValidator
                size="small"
                fullWidth
                margin="normal"
                type="text"
                name="description"
                value={categoryData.description}
                multiline
                rows={4}
                placeholder="Enter Description"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
              />
            </div>
            <div className="popup-input-box w-100 info">
              <DialogContentText>
                Created by :{props.selectedCategory.createdBy}
              </DialogContentText>
              <DialogContentText>
                Created date :
                {props.selectedCategory.createdDate
                  ? moment(props.selectedCategory.createdDate).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
              <DialogContentText>
                Updated by:{handleUpdatedBy(props.selectedCategory.updatedBy)}
              </DialogContentText>
              <DialogContentText>
                Updated date :
                {props.selectedCategory.updatedDate
                  ? moment(props.selectedCategory.updatedDate).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseEditCategory}>
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
export default EditCategory;
