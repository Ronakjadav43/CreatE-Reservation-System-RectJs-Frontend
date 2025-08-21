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
  Typography,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import "./style.scss";
import { handleUpdatedBy } from "../../../../../utils/userAccess";

let moment = require("moment-timezone");

const EditMeal = (props) => {
  const { open, handleCloseEditMeal, handleEditSaveMeal } = props;
  const [mealData, setMealData] = useState({
    name: props.selectedmeal.name,
    description: props.selectedmeal.description,
    isActive: props.selectedmeal.isActive,
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...mealData };
    commonData[field] = event.target.value;
    return setMealData(commonData);
  };

  const handleEditMeal = () => {
    handleEditSaveMeal(mealData, props.selectedmeal.id);
    handleCloseEditMeal();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseEditMeal}>
        <ValidatorForm
          onSubmit={() => handleEditMeal()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Update Meal Type</DialogTitle>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Status</Typography>
              <Switch
                name="status"
                className="switch-status"
                checked={mealData.isActive}
                onClick={() =>
                  setMealData({ ...mealData, isActive: !mealData.isActive })
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
                value={mealData.name}
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
                value={mealData.description}
                multiline
                rows={4}
                placeholder="Enter Description"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
              />
            </div>
            <div className="popup-input-box w-100  info">
              <DialogContentText>
                Created by :{props.selectedmeal.createdBy}
              </DialogContentText>
              <DialogContentText>
                Created date :
                {props.selectedmeal.createdAt
                  ? moment(props.selectedmeal.createdAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
              <DialogContentText>
                Updated by:{handleUpdatedBy(props.selectedmeal.updatedBy)}
              </DialogContentText>
              <DialogContentText>
                Updated date :
                {props.selectedmeal.updatedAt
                  ? moment(props.selectedmeal.updatedAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseEditMeal}>
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
export default EditMeal;
