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

const AddOutletNote = (props) => {
  const { open, handleCloseOutletNote, handleSaveOutletNote } = props;
  const noteLevel = ["HIGH", "MEDIUM", "LOW"];

  const [outletNoteData, setOutletNoteData] = useState({
    description: "",
    noteLevel: noteLevel.length > 0 ? noteLevel[0] : 0,
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...outletNoteData };
    commonData[field] = event.target.value;
    return setOutletNoteData(commonData);
  };

  const handleAddOutletNote = () => {
    handleSaveOutletNote(outletNoteData);
    handleCloseOutletNote();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseOutletNote}>
        <ValidatorForm
          onSubmit={() => handleAddOutletNote()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Add New Outlet Note</DialogTitle>
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
              onClick={handleCloseOutletNote}
              className="close-btn"
            >
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
export default AddOutletNote;
