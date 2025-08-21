import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const AddTagCategory = (props) => {
  const { open, handleCloseTagCategory, handleSaveTagCategory } = props;
  const [tagCategoryData, setTagCategoryData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...tagCategoryData };
    commonData[field] = event.target.value;
    return setTagCategoryData(commonData);
  };

  const handleAddTagCategory = () => {
    handleSaveTagCategory(tagCategoryData);
    handleCloseTagCategory();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseTagCategory}>
        <ValidatorForm
          onSubmit={() => handleAddTagCategory()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Add Tag Category</DialogTitle>
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
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="description"
                value={tagCategoryData.description}
                placeholder="Enter Description"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
              />
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseTagCategory}>
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
export default AddTagCategory;
