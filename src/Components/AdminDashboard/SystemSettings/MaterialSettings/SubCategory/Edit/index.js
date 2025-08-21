import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Switch,
  Typography,
  DialogContentText,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useState } from "react";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import moment from "moment-timezone";
import { handleUpdatedBy } from "../../../../../../utils/userAccess";

const Edit = (props) => {
  const {
    open,
    handleCloseEditSubCategory,
    handleSaveEditSubCategory,
    selectedSubCategory,
  } = props;
  const [subCategoryData, setSubCategoryData] = useState({
    name: selectedSubCategory.name,
    description: selectedSubCategory.description,
    isActive: selectedSubCategory.isActive,
    categoryId: props.categoryId,
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...subCategoryData };
    commonData[field] = event.target.value;
    return setSubCategoryData(commonData);
  };
  const handleEditTag = () => {
    handleSaveEditSubCategory(subCategoryData, selectedSubCategory.id);
    handleCloseEditSubCategory();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseEditSubCategory}>
        <ValidatorForm
          onSubmit={() => handleEditTag()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Update Sub Category</DialogTitle>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Status</Typography>
              <Switch
                name="status"
                className="switch-status"
                checked={subCategoryData.isActive}
                onClick={() =>
                  setSubCategoryData({
                    ...subCategoryData,
                    isActive: !subCategoryData.isActive,
                  })
                }
              />
            </Stack>
          </Box>
          <DialogContent sx={{ width: "600px" }} className="popup-body">
            <div className="popup-input-box w-100">
              <Typography>Name</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="name"
                value={subCategoryData.name}
                placeholder="Enter Name"
                sx={{ marginTop: 0 }}
                validators={["required"]}
                onChange={handleChange}
                errorMessages={["Name is required"]}
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
                value={subCategoryData.description}
                multiline
                rows={4}
                placeholder="Enter Description"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
              />
            </div>

            <div className="popup-input-box w-100 info">
              <DialogContentText>
                Created by :{selectedSubCategory.createdBy}
              </DialogContentText>
              <DialogContentText>
                Created date :
                {selectedSubCategory.createdAt
                  ? moment(selectedSubCategory.createdAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
              <DialogContentText>
                Updated by:{handleUpdatedBy(selectedSubCategory.updatedBy)}
              </DialogContentText>
              <DialogContentText>
                Updated date :
                {selectedSubCategory.updatedAt
                  ? moment(selectedSubCategory.updatedAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseEditSubCategory}>
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
export default Edit;
