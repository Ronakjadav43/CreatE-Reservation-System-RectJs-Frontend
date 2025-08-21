import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserAction from "../../../../../Action/AdminDashboard";
import ENVIRONMENT_VARIABLES from "../../../../../environment.config";
import "./style.scss";

const ImageDisplay = (props) => {
  const { open, selectedOutlet, handleCloseEditImage } =
    props;

  return (
    <React.Fragment>
      <div>
        <Dialog open={open} onClose={handleCloseEditImage}>
          <Box className="popup-header">
            <DialogTitle>Attachments</DialogTitle>
          </Box>
          <DialogContent sx={{ width: "600px" }} className="popup-body">
            {selectedOutlet.image && (
              <div className="uploaded-files w-100">
                {selectedOutlet.image.map((img) => (
                  <Button variant="outlined" className="upload-inners">
                    <a
                      className="btn-link"
                      href={`${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${img.path}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className=""> {img.fileName}</span>
                      <AttachFileIcon />
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </DialogContent>

          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseEditImage}>
              <CloseOutlinedIcon /> Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(ImageDisplay);
