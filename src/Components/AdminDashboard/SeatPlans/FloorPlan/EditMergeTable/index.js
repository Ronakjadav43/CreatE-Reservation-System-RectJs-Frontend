import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { handleUpdatedBy } from "../../../../../utils/userAccess";

let moment = require("moment-timezone");

const EditMergeTable = (props) => {
  const { open, handleCloseEditMergetTable, handleSaveEditMergeTable } = props;

  const [mergetableData, setMergetableData] = useState({
    name: props.selectedMergedTable.name,
    minPax: props.selectedMergedTable.minPax,
    maxPax: props.selectedMergedTable.maxPax,
    isActive: props.selectedMergedTable.isActive
      ? props.selectedMergedTable.isActive
      : false,
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...mergetableData };
    commonData[field] = event.target.value;
    return setMergetableData(commonData);
  };

  const handleAddMergeTable = () => {
    handleCloseEditMergetTable();
    handleSaveEditMergeTable(mergetableData);
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseEditMergetTable}>
        <ValidatorForm
          onSubmit={() => handleAddMergeTable()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Edit Merge Table</DialogTitle>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Status</Typography>
              <Switch
                size="small"
                name="status"
                className="switch-status"
                checked={mergetableData.isActive}
                onClick={() =>
                  setMergetableData({
                    ...mergetableData,
                    isActive: !mergetableData.isActive,
                  })
                }
              />
            </Stack>
          </Box>

          <DialogContent sx={{ width: "600px" }} className="popup-body">
            <div className="popup-input-box w-100">
              <Typography>Group Name</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="name"
                value={mergetableData.name}
                placeholder="Enter Group Name"
                sx={{ marginTop: 0 }}
                validators={["required"]}
                onChange={handleChange}
                errorMessages={["Group Name is required"]}
              />
            </div>

            <div className="popup-input-box w-100">
              <Typography>Selected Tables</Typography>
              <TextField
                disabled
                multiline
                size={"small"}
                rows={"2"}
                value={props.selectedMergedTable.tables}
              ></TextField>
            </div>

            <div className="popup-input-box w-100">
              <Typography>Minimum No Of Pax</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="number"
                name="minPax"
                value={mergetableData.minPax}
                placeholder="Min No Of Pax"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["required", "minNumber:0"]}
                errorMessages={[
                  "Minimum No Of Pax is required",
                  "Minimum No Of Pax should be more than 0",
                ]}
              />
            </div>
            <div className="popup-input-box w-100">
              <Typography>Maximum No Of Pax</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="number"
                name="maxPax"
                value={mergetableData.maxPax}
                placeholder="Max No Of Pax"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["required", "minNumber:0"]}
                  errorMessages={[
                    "Maximum No Of Pax is required",
                    "Maximum No Of Pax should be more than 0",
                  ]}
              />
            </div>
            <div className="popup-input-box w-50 info">
              <DialogContentText>
                Created by :{props.selectedMergedTable.createdBy}
              </DialogContentText>
              <DialogContentText>
                Created date :
                {props.selectedMergedTable.createdAt
                  ? moment(props.selectedMergedTable.createdAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
              <DialogContentText>
                Updated by:
                {handleUpdatedBy(props.selectedMergedTable.updatedBy)}
              </DialogContentText>
              <DialogContentText>
                Updated date :
                {props.selectedMergedTable.updatedAt
                  ? moment(props.selectedMergedTable.updatedAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
            </div>
          </DialogContent>

          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseEditMergetTable}>
              <CloseOutlinedIcon /> Close
            </Button>
            <Button type="submit" variant="contained">
              <AddOutlinedIcon /> SAVE
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </React.Fragment>
  );
};
export default EditMergeTable;
