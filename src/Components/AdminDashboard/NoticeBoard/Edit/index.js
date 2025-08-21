import React, { useState } from "react";
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
  Typography,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const EditOutletNote = (props) => {
  const {
    open,
    handleCloseEditOutletNote,
    handleEditSaveOutletNote,
    selectedOutletNote,
  } = props;
  const noteLevel = ["HIGH", "MEDIUM", "LOW"];

  const [outletNoteData, setOutletNoteData] = useState({
    noteLevel: selectedOutletNote.noteLevel,
    description: selectedOutletNote.description,
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...outletNoteData };
    commonData[field] = event.target.value;
    return setOutletNoteData(commonData);
  };

  const handleEditOutletNote = () => {
    handleEditSaveOutletNote(outletNoteData, selectedOutletNote.id);
    handleCloseEditOutletNote();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseEditOutletNote}>
        <ValidatorForm
          onSubmit={() => handleEditOutletNote()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Edit Outlet Note</DialogTitle>
          </Box>

          <DialogContent sx={{ width: "600px" }} className="popup-body">
            <div className=" popup-input-box w-100">
              <Typography>Note Level</Typography>
              <FormControl>
                <Select
                  size="small"
                  value={outletNoteData.noteLevel}
                  name="noteLevel"
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  onChange={handleChange}
                >
                  {noteLevel.map((level, index) => (
                    <MenuItem key={index} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="popup-input-box w-100">
              <Typography>Description</Typography>
              <TextValidator
                fullWidth
                margin="normal"
                type="text"
                size="small"
                name="description"
                value={outletNoteData.description}
                multiline
                rows={4}
                placeholder="Enter Description"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
              />
            </div>
          </DialogContent>

          <DialogActions className="primary-btn">
            <Button
              variant="outlined"
              onClick={handleCloseEditOutletNote}
              className="close-btn"
            >
              <CloseOutlinedIcon /> Close
            </Button>
            <Button type="submit" variant="contained">
              <AddOutlinedIcon /> Save
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </React.Fragment>
  );
};
export default EditOutletNote;
