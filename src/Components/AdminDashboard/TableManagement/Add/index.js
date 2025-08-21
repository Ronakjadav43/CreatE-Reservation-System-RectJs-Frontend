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
import { ReactSVG } from "react-svg";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { getTableShape } from "../../../../utils/tableShapeAdjustment";

import "./style.scss";

const AddTable = (props) => {
  const { open, handleCloseTable, handleSaveTable } = props;

  const shapes = ["circle", "rectangle"];

  const circle = ["2", "4", "6", "8", "10", "12"];

  const rectangle = ["2", "4", "6", "8"];

  const [tableData, setTableData] = useState({
    name: "",
    description: "",
    noOfPerson: "2",
    shape: "circle",
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...tableData };
    commonData[field] = event.target.value;
    return setTableData(commonData);
  };

  const handleAddPreOrder = () => {
    handleSaveTable(tableData);
    handleCloseTable();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseTable}>
        <ValidatorForm
          onSubmit={() => handleAddPreOrder()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Add Table </DialogTitle>
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

            {tableData.noOfPerson && tableData.noOfPerson > 0 && (
              <div className="popup-input-box w-50">
                <Typography>Preview</Typography>
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
          </DialogContent>
          <DialogActions className="primary-btn">
            <Button
              variant="outlined"
              onClick={handleCloseTable}
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
export default AddTable;
