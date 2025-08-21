/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
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
import { BlockPicker } from "react-color";
import "./style.scss";

const AddSectionTable = (props) => {
  const { open, handleCloseSectionTable, handleSaveSectionTable } = props;
  const [tableSectionList, setTableSectionList] = useState([]);
  const [colors, setColors] = useState(null);
  const colourList = [
    "#000000",
    "#DB2929",
    "#EE0000",
    "#8B2500",
    "#FF6103",
    "#8B4500",
    "#8B7500",
    "#FFE303",
    "#385E0F",
    "#8B8B83",
    "#802A2A",
    "#DD7500",
    "#F87531",
    "#E6B426",
    "#B5A642",
  ];

  const [sectionTableData, setSectionTableData] = useState({
    name: "",
    color: "#6F4242",
    description: "",
    outletTable: [],
  });

  useEffect(() => {
    let sectionTables = "";
    let sectionTableIds = [];
    let noOfPersonList = [];
    let maxCapacity = 0;

    props.tableListForMerge.map((table, index) => {
      noOfPersonList.push(table?.Table.noOfPerson);
      sectionTableIds.push(table.id);
      if (index === 0) {
        sectionTables += table.name;
        maxCapacity += table?.Table.noOfPerson;
      } else {
        sectionTables += "," + table.name;
        maxCapacity += table?.Table.noOfPerson;
      }
    });

    noOfPersonList.sort(function (a, b) {
      return a - b;
    });

    setTableSectionList(sectionTables);
    setSectionTableData({
      ...sectionTableData,
      outletTable: sectionTableIds,
      minPax: noOfPersonList[0] + 1,
      maxPax: maxCapacity,
    });
  }, []);

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...sectionTableData };
    commonData[field] = event.target.value;
    return setSectionTableData(commonData);
  };

  const handleAddSectionTable = () => {
    handleSaveSectionTable(sectionTableData);
    handleCloseSectionTable();
  };

  const colorPicker = (color) => {
    setSectionTableData({
      ...sectionTableData,
      color: color.hex,
    });
    setColors(color);
  };

  return (
    <React.Fragment>
      {sectionTableData.outletTable.length > 0 && (
        <Dialog open={open} onClose={handleCloseSectionTable}>
          <ValidatorForm
            onSubmit={() => handleAddSectionTable()}
            autoComplete="off"
            className="popup-layout"
          >
            <Box
              className="popup-header"
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <DialogTitle>Add New Table Section</DialogTitle>
            </Box>

            <DialogContent sx={{ width: "600px" }} className="popup-body">
              <div className="popup-input-box w-100">
                <Typography>Section Name</Typography>
                <TextValidator
                  fullWidth
                  size="small"
                  margin="normal"
                  type="text"
                  name="name"
                  value={sectionTableData.name}
                  placeholder="Enter Section Name"
                  sx={{ marginTop: 0 }}
                  validators={["required"]}
                  onChange={handleChange}
                  errorMessages={["Section Name is required"]}
                />
              </div>

              <div className="popup-input-box w-100 date-picker1">
                <Typography>Selected Tables</Typography>
                <TextField disabled value={tableSectionList}></TextField>
              </div>

              <div className="popup-input-box w-100">
                <Typography>Minimum No Of Pax</Typography>
                <TextValidator
                  fullWidth
                  size="small"
                  margin="normal"
                  type="number"
                  name="minPax"
                  value={sectionTableData.minPax}
                  placeholder="Enter Minimum No Of Pax"
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
                  value={sectionTableData.maxPax}
                  placeholder="Enter Maximum No Of Pax"
                  sx={{ marginTop: 0 }}
                  onChange={handleChange}
                  validators={["required", "minNumber:0"]}
                  errorMessages={[
                    "Maximum No Of Pax is required",
                    "Maximum No Of Pax should be more than 0",
                  ]}
                />
              </div>

              <div className="p-10 w-100">
                <Typography sx={{ fontWeight: "bold" }}>Color</Typography>
                <BlockPicker
                  className="colour-picker"
                  triangle="hide"
                  color={colors !== null && colors.hex}
                  onChange={(e) => colorPicker(e)}
                  colors={colourList}
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
                  value={sectionTableData.description}
                  placeholder="Enter Description"
                  sx={{ marginTop: 0 }}
                  onChange={handleChange}
                />
              </div>
            </DialogContent>

            <DialogActions className="primary-btn popup-btn">
              <Button variant="outlined" onClick={handleCloseSectionTable}>
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
export default AddSectionTable;
