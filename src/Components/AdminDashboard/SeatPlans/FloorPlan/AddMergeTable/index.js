/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const AddMergeTable = (props) => {
  const { open, handleCloseAddMergeTable, handleSaveMergeTable } = props;
  const [tableSequanceList, setTableSequanceList] = useState([]);

  const [mergetableData, setMergetableData] = useState({
    name: "",
    outletTable: [],
    minPax: "",
    maxPax: "",
  });

  useEffect(() => {
    let sequenceTables = "";
    let sequenceTableIds = [];
    let noOfPersonList = [];
    let maxCapacity = 0;

    props.tableListForMerge.map((table, index) => {
      noOfPersonList.push(table?.Table.noOfPerson);
      sequenceTableIds.push(table.id);
      if (index === 0) {
        sequenceTables += table.name;
        maxCapacity += table?.Table.noOfPerson;
      } else {
        sequenceTables += "," + table.name;
        maxCapacity += table?.Table.noOfPerson;
      }
    });
    noOfPersonList.sort(function (a, b) {
      return a - b;
    });

    setTableSequanceList(sequenceTables);
    setMergetableData({
      ...mergetableData,
      outletTable: sequenceTableIds,
      minPax: noOfPersonList[0] + 1,
      maxPax: maxCapacity,
    });
  }, []);

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...mergetableData };
    commonData[field] = event.target.value;
    return setMergetableData(commonData);
  };

  const handleAddMergeTable = () => {
    handleSaveMergeTable(mergetableData);
    handleCloseAddMergeTable();
  };

  return (
    <React.Fragment>
      {mergetableData.outletTable.length > 0 && (
        <Dialog open={open} onClose={handleCloseAddMergeTable}>
          <ValidatorForm
            onSubmit={() => handleAddMergeTable()}
            autoComplete="off"
            className="popup-layout"
          >
            <Box className="popup-header">
              <DialogTitle>Add New Table Group</DialogTitle>
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
                  size="small"
                  disabled
                  multiline
                  rows={"2"}
                  value={tableSequanceList}
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
                  placeholder="Enter Minimum No Of Pax"
                  sx={{ marginTop: 0 }}
                  onChange={handleChange}
                  validators={["required", "minNumber:1"]}
                  errorMessages={[
                    "Minimum No Of Pax is required",
                    "Minimum No Of Pax should be more than 1",
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
                  validators={["required", "minNumber:1"]}
                  errorMessages={[
                    "Maximum No Of Pax is required",
                    "Maximum No Of Pax should be more than 1",
                  ]}
                />
              </div>
            </DialogContent>

            <DialogActions className="primary-btn popup-btn">
              <Button variant="outlined" onClick={handleCloseAddMergeTable}>
                <CloseOutlinedIcon /> Close
              </Button>
              <Button type="submit" variant="contained">
                <AddOutlinedIcon /> Add
              </Button>
            </DialogActions>
          </ValidatorForm>
        </Dialog>
      )}
    </React.Fragment>
  );
};
export default AddMergeTable;
