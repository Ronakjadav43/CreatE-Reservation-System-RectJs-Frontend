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

const EditRole = (props) => {
  const { open, handleClosEditRole, handleEditSaveRole } = props;
  const [roleData, setRoleData] = useState({
    name: props.selectedRole.name,
    description: props.selectedRole.description,
    isActive: props.selectedRole.isActive,
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...roleData };
    commonData[field] = event.target.value;
    return setRoleData(commonData);
  };

  const handleEditRole = () => {
    handleEditSaveRole(roleData, props.selectedRole.id);
    handleClosEditRole();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClosEditRole}>
        <ValidatorForm
          onSubmit={() => handleEditRole()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Update User Group</DialogTitle>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Status</Typography>
              <Switch
                name="status"
                className="switch-status"
                checked={roleData.isActive}
                onClick={() =>
                  setRoleData({ ...roleData, isActive: !roleData.isActive })
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
                value={roleData.name}
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
                value={roleData.description}
                multiline
                rows={4}
                placeholder="Enter Description"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
              />
            </div>

            <div className="popup-input-box w-100 info">
              <DialogContentText>
                Created by :{props.selectedRole.CreatedBy}
              </DialogContentText>
              <DialogContentText>
                Created date :
                {props.selectedRole.CreatedDate
                  ? moment(props.selectedRole.CreatedDate).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
              <DialogContentText>
                Updated by:{handleUpdatedBy(props.selectedRole.UpdatedBy)}
              </DialogContentText>
              <DialogContentText>
                Updated date :
                {props.selectedRole.UpdatedDate
                  ? moment(props.selectedRole.UpdatedDate).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleClosEditRole}>
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
export default EditRole;
