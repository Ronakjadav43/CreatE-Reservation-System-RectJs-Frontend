/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
} from "@mui/material";
import { ValidatorForm } from "react-material-ui-form-validator";
import { useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import ENVIRONMENT_VARIABLES from "../../../../../../environment.config";

var reader = new FileReader();

const View = (props) => {
  const { open, handleCloseImageInfo } = props;

  const [imageDisplay, setImageDisplay] = useState(
    `${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${props.selectedPrivateRoom.image}`
  );

  const [outletTableData, setOutletTableData] = useState({
    name: props.selectedPrivateRoom.name,
    image: props.selectedPrivateRoom.image,
    description: props.selectedPrivateRoom.description,
  });

  reader.onload = function (e) {
    setImageDisplay(e.target.result);
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseImageInfo}>
        <ValidatorForm autoComplete="off" className="popup-layout">
          <DialogContent
            sx={{ width: "300px", maxWidth: "300px" }}
            className="popup-body"
          >
            <div className="popup-input-box">
              <Stack direction="row" alignItems="center" spacing={2}>
                {outletTableData.image && (
                  <img
                    className="product-image"
                    src={imageDisplay}
                    alt="demo"
                    style={{ width: "100%", height: "150px" }}
                  />
                )}
              </Stack>

              <h3 className="w-100 text_align ">{outletTableData.name}</h3>
              <span className="text_align">{outletTableData.description}</span>
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button
              variant="outlined"
              onClick={handleCloseImageInfo}
              className="close-btn"
            >
              <CloseOutlinedIcon /> Close
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </React.Fragment>
  );
};
export default View;
