import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  MenuItem,
  Select,
  DialogTitle,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { getTableShape } from "../../../../utils/tableShapeAdjustment";

import "./style.scss";
import { handleUpdatedBy } from "../../../../utils/userAccess";
import { ReactSVG } from "react-svg";

let moment = require("moment-timezone");

const EditTable = (props) => {
  const { open, handleClosEditTable, handleEditSaveTable, selectedTable } =
    props;

  const shapes = ["circle", "rectangle"];

  const circle = ["2", "4", "6", "8", "10", "12"];

  const rectangle = ["2", "4", "6", "8"];

  const [tableData, setTableData] = useState({
    name: selectedTable.name,
    noOfPerson: selectedTable.noOfPerson,
    description: selectedTable.description,
    shape: selectedTable.shape,
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...tableData };
    commonData[field] = event.target.value;
    return setTableData(commonData);
  };

  const handleEditFloor = () => {
    handleEditSaveTable(tableData, props.selectedTable.id);
    handleClosEditTable();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClosEditTable}>
        <ValidatorForm
          onSubmit={() => handleEditFloor()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Update Table</DialogTitle>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Status</Typography>
              <Switch
                name="status"
                className="switch-status"
                checked={tableData.isActive}
                onClick={() =>
                  setTableData({
                    ...tableData,
                    isActive: !tableData.isActive,
                  })
                }
              />
            </Stack>
          </Box>
          <DialogContent sx={{ width: "600px" }} className="popup-body">
            <div className="popup-input-box w-100">
              <Typography>Table Name</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="name"
                value={tableData.name}
                placeholder="Enter Table Name"
                sx={{ marginTop: 0 }}
                validators={["required"]}
                onChange={handleChange}
                errorMessages={["Table Name is required"]}
              />
            </div>

            <div className="popup-input-box w-100">
              <Typography>Shape Type</Typography>
              <FormControl className="add-table">
                <Select
                  size="small"
                  value={tableData.shape}
                  name="shape"
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  onChange={handleChange}
                >
                  {shapes.map((name, index) => (
                    <MenuItem key={index} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {tableData.shape === "circle" && (
              <div className="popup-input-box w-100">
                <Typography>Number Of Pax</Typography>
                <FormControl className="add-table">
                  <Select
                    size="small"
                    value={tableData.noOfPerson}
                    name="noOfPerson"
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    onChange={handleChange}
                  >
                    {circle.map((name, index) => (
                      <MenuItem key={index} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}

            {tableData.shape === "rectangle" && (
              <div className="popup-input-box w-100">
                <Typography>Number Of Pax</Typography>
                <FormControl className="add-table">
                  <Select
                    size="small"
                    value={tableData.noOfPerson}
                    name="noOfPerson"
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    onChange={handleChange}
                  >
                    {rectangle.map((name, index) => (
                      <MenuItem key={index} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}

            <div className="popup-input-box w-100">
              <Typography>Description</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="description"
                value={tableData.description}
                multiline
                rows={4}
                placeholder="Enter Description"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
              />
            </div>

            {tableData.noOfPerson && (
              <div className="popup-input-box w-50">
                <Typography sx={{ marginBottom: "10px" }}>Preview</Typography>
                <ReactSVG
                  style={{
                    fill: getTableShape(tableData.shape, tableData.noOfPerson)
                      .borderColor,
                    width: "100%",
                    height: "100%",
                  }}
                  src={
                    getTableShape(tableData.shape, tableData.noOfPerson).svgUrl
                  }
                />
              </div>
            )}

            <div className="popup-input-box w-50 info">
              <DialogContentText>
                Created by :{props.selectedTable.createdBy}
              </DialogContentText>
              <DialogContentText>
                Created date :
                {props.selectedTable.createdAt
                  ? moment(props.selectedTable.createdAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
              <DialogContentText>
                Updated by:{handleUpdatedBy(props.selectedTable.updatedBy)}
              </DialogContentText>
              <DialogContentText>
                Updated date :
                {props.selectedTable.updatedAt
                  ? moment(props.selectedTable.updatedAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions className="primary-btn">
            <Button
              variant="outlined"
              onClick={handleClosEditTable}
              className="close-btn"
            >
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
export default EditTable;
