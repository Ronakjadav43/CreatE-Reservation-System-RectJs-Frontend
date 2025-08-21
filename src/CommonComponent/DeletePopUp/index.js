import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  DialogContentText,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { ValidatorForm } from "react-material-ui-form-validator";

import "./style.scss";

const DeletePopUp = (props) => {
  const { open, handleClose, handleDelete, data, message } = props;

  const handleDeleteData = () => {
    handleDelete(data);
    handleClose();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={() => handleClose(false)}>
        <ValidatorForm
          onSubmit={() => handleDeleteData()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Delete</DialogTitle>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              className="switch"
            ></Stack>
          </Box>

          <DialogContent sx={{ width: "600px" }} className="popup-body ">
            <DialogContentText id="alert-dialog-slide-description info">
              {message}
            </DialogContentText>
          </DialogContent>

          <DialogActions className="primary-btn popup-btn gap">
            <Button variant="outlined" onClick={() => handleClose(false)}>
              <CloseOutlinedIcon /> Close
            </Button>
            <Button type="submit" variant="contained">
              <DeleteOutlinedIcon /> DELETE
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </React.Fragment>
  );
};
export default DeletePopUp;
