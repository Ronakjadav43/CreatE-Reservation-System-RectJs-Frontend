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
import { handleUpdatedBy } from "../../../../utils/userAccess";

let moment = require("moment-timezone");

const EditTagCategory = (props) => {
  const {
    open,
    selectedTagCategory,
    handleCloseEditTagCategory,
    handleSaveEditTagCategory,
  } = props;

  const [tagCategoryData, setTagCategoryData] = useState({
    name: selectedTagCategory.name,
    description: selectedTagCategory.description,
    isActive: selectedTagCategory.isActive,
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...tagCategoryData };
    commonData[field] = event.target.value;
    return setTagCategoryData(commonData);
  };

  const handleEditTagCategory = () => {
    handleSaveEditTagCategory(tagCategoryData, selectedTagCategory.id);
    handleCloseEditTagCategory();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseEditTagCategory}>
        <ValidatorForm
          onSubmit={() => handleEditTagCategory()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Update Tag Category</DialogTitle>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Status</Typography>
              <Switch
                name="status"
                className="switch-status"
                checked={tagCategoryData.isActive}
                onClick={() =>
                  setTagCategoryData({
                    ...tagCategoryData,
                    isActive: !tagCategoryData.isActive,
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
                value={tagCategoryData.name}
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
                value={tagCategoryData.description}
                placeholder="Enter Description"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
              />
            </div>
            <div className="popup-input-box w-100 info">
              <DialogContentText>
                Created by :{props.selectedTagCategory.createdBy}
              </DialogContentText>
              <DialogContentText>
                Created date :
                {props.selectedTagCategory.createdDate
                  ? moment(props.selectedTagCategory.createdDate).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
              <DialogContentText>
                Updated by:
                {handleUpdatedBy(props.selectedTagCategory.updatedBy)}
              </DialogContentText>
              <DialogContentText>
                Updated date :
                {props.selectedTagCategory.updatedDate
                  ? moment(props.selectedTagCategory.updatedDate).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseEditTagCategory}>
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
export default EditTagCategory;
