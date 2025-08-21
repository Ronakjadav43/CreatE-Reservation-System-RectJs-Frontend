/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
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
import { useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const AddOutletTable = (props) => {
  const { open, handleCloseAddOutletTable, handleSaveAddOutletTable } = props;

  const tables = props.tables.length > 0 ? props.tables : [];

  const outletSeatTypes =
    props.outletSeatTypes.length > 0 ? props.outletSeatTypes : [];

  const [outletTableData, setOutletTableData] = useState({
    name: "",
    xPosition: 0,
    yPosition: 0,
    tableId: tables.length > 0 ? tables[0].id : 0,
    outletSeatTypeId: 0,
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...outletTableData }; 
    commonData[field] = event.target.value;
    return setOutletTableData(commonData);
  };

  const handleAddOutletTable = () => {
    handleSaveAddOutletTable(outletTableData);
    handleCloseAddOutletTable();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseAddOutletTable}>
        <ValidatorForm
          onSubmit={() => handleAddOutletTable()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>ADD OUTLET TABLE</DialogTitle>
          </Box>
          <DialogContent

            sx={{ width: "600px", maxWidth: "600px" }}
            className="popup-body"
          >
            <div className="popup-input-box w-100">
              <Typography>Table Name</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="name"
                value={outletTableData.name}
                placeholder="Enter Table Name"
                sx={{ marginTop: 0 }}
                validators={["required"]}
                onChange={handleChange}
                errorMessages={["Table Name is required"]}
              />
            </div>

            <div className="popup-input-box w-100">
              <Typography>Table NO</Typography>
              <FormControl>
                <Select
                  size="small"
                  value={outletTableData.tableId}
                  name="tableId"
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  onChange={handleChange}
                >
                  {tables.map((table, index) => (
                    <MenuItem key={index} value={table.id}>
                      {table.name} ({table.noOfPerson} persons)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {outletSeatTypes.length > 0 && (
              <div className="popup-input-box w-100">
                <Typography>Seat Type</Typography>
                <FormControl>
                  <Select
                    size="small"
                    value={outletTableData.outletSeatTypeId}
                    name="outletSeatTypeId"
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    onChange={handleChange}
                  >
                    {outletSeatTypes.map((seatType, index) => (
                      <MenuItem key={index} value={seatType.id}>
                        {seatType.SeatType?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button
              variant="outlined"
              onClick={handleCloseAddOutletTable}
              className="close-btn"
            >
              <CloseOutlinedIcon /> Close
            </Button>
            <Button type="submit" variant="contained" className="add-btn">
              <AddOutlinedIcon /> Add
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </React.Fragment>
  );
};
export default AddOutletTable;
