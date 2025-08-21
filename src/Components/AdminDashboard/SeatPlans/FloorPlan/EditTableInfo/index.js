/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useState } from "react";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { handleUpdatedBy } from "../../../../../utils/userAccess";

const EditOutletTable = (props) => {
  let moment = require("moment-timezone");
  const { open, handleCloseEditTableInfo, handleSaveEditTableInfo } = props;

  const [outletTableData, setOutletTableData] = useState(null);

  useEffect(() => {
    if (props.selectedTable) {
      setOutletTableData({
        name: props.selectedTable.name,
        xPosition: props.selectedTable.xPosition,
        yPosition: props.selectedTable.yPosition,
        tableId: props.selectedTable?.Table?.id,
        outletSeatTypeId: props.selectedTable.OutletSeatType
          ? props.selectedTable?.OutletSeatType?.id
          : 0,
        isActive: true,
      });
    }
  }, [props.selectedTable]);

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...outletTableData };
    commonData[field] = event.target.value;
    return setOutletTableData(commonData);
  };

  const handleEditOutletTable = () => {
    handleSaveEditTableInfo(outletTableData, props.selectedTable.id);
    handleCloseEditTableInfo();
  };

  return (
    <React.Fragment>
      {outletTableData && (
        <Dialog open={open} onClose={handleCloseEditTableInfo}>
          <ValidatorForm
            onSubmit={() => handleEditOutletTable()}
            autoComplete="off"
            className="popup-layout"
          >
            <Box className="popup-header">
              <DialogTitle>EDIT OUTLET TABLE</DialogTitle>
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
                    {props.tables.map((table, index) => (
                      <MenuItem key={index} value={table.id}>
                        {table.name} ({table.noOfPerson} persons)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {props.outletSeatTypes.length > 0 && (
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
                      {props.outletSeatTypes.map((seatType, index) => (
                        <MenuItem key={index} value={seatType.id}>
                          {seatType.SeatType?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              )}

              <div className="popup-input-box w-100 info">
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
              <Button variant="outlined" onClick={handleCloseEditTableInfo}>
                <CloseOutlinedIcon /> Close
              </Button>
              <Button type="submit" variant="contained">
                <SaveOutlinedIcon /> SAVE
              </Button>
            </DialogActions>
          </ValidatorForm>
        </Dialog>
      )}
    </React.Fragment>
  );
};
export default EditOutletTable;
