import React from "react";
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
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { ValidatorForm } from "react-material-ui-form-validator";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import "./style.scss";

const ConfirmationPopUp = (props) => {
  const { open, handleClose, handleUpdate, data, message } = props;
  const title = props.title ? props.title : "Update";
  const handleUpdateData = () => {
    handleUpdate(data);
    handleClose();
  };

  const buttonTitle = props.buttonTitle ? props.buttonTitle : "UPDATE";
  const closeButtonTitle = props.closeButtonTitle
    ? props.closeButtonTitle
    : "CLOSE";
  const hasPermission = props.hasUpdatePermissoin
    ? props.hasUpdatePermissoin
    : false;

  return (
    <React.Fragment>
      <Dialog open={open} onClose={() => handleClose(data)}>
        <ValidatorForm
          onSubmit={() => handleUpdateData()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle className="warning-div">
              {title} {title === "Warning" && <WarningAmberIcon />}
            </DialogTitle>
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
            <Button variant="outlined" onClick={() => handleClose(data)}>
              <CloseOutlinedIcon /> {closeButtonTitle}
            </Button>
            <Button disabled={hasPermission} type="submit" variant="contained">
              {buttonTitle}
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </React.Fragment>
  );
};
export default ConfirmationPopUp;
