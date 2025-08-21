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

import "./style.scss";
import { handleUpdatedBy } from "../../../../utils/userAccess";

const EditTag = (props) => {
  const { open, handleCloseEditTag, handleSaveEditTag, selectedTag } = props;
  const [tagData, setTagData] = useState({
    name: selectedTag.name,
    description: selectedTag.description,
    isActive: selectedTag.isActive,
    tagCategoryId: props.categoryId,
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...tagData };
    commonData[field] = event.target.value;
    return setTagData(commonData);
  };
  const handleEditTag = () => {
    handleSaveEditTag(tagData, selectedTag.id);
    handleCloseEditTag();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseEditTag}>
        <ValidatorForm
          onSubmit={() => handleEditTag()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Update Tag</DialogTitle>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Status</Typography>
              <Switch
                name="status"
                className="switch-status"
                checked={tagData.isActive}
                onClick={() =>
                  setTagData({ ...tagData, isActive: !tagData.isActive })
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
                value={tagData.name}
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
                value={tagData.description}
                multiline
                rows={4}
                placeholder="Enter Description"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
              />
            </div>

            <div className="popup-input-box w-100 info">
              <DialogContentText>
                Created by :{selectedTag.createdBy}
              </DialogContentText>
              <DialogContentText>
                Created date :
                {selectedTag.createdAt
                  ? moment(selectedTag.createdAt).format("DD-MM-YYYY hh:mm A")
                  : "N/A"}
              </DialogContentText>
              <DialogContentText>
                Updated by:{handleUpdatedBy(selectedTag.updatedBy)}
              </DialogContentText>
              <DialogContentText>
                Updated date :
                {selectedTag.updatedAt
                  ? moment(selectedTag.updatedAt).format("DD-MM-YYYY hh:mm A")
                  : "N/A"}
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseEditTag}>
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
export default EditTag;
