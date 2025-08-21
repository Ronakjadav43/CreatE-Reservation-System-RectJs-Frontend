import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import CheckIcon from "@mui/icons-material/Check";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const Filter = (props) => {
  const [filterColumn, setFilterColumn] = useState([]);
  const { open, handleCloseFilterInvoiceData } = props;

  useEffect(() => {
    if (props.columns) {
      setFilterColumn(props.columns);
    }
  }, [props.columns]);

  const handleChangeFilter = (e) => {
    const { name, checked } = e.target;
    if (name === "allSelect") {
      let tempData = filterColumn.map((data) => {
        return { ...data, isChecked: checked };
      });
      setFilterColumn(tempData);
    } else {
      let tempData = filterColumn.map((data) =>
        data.field === name ? { ...data, isChecked: !data.isChecked } : data
      );
      setFilterColumn(tempData);
    }
  };

  const applyFilter = () => {
    props.handleApplyFilterInvoiceData(filterColumn);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleCloseFilterInvoiceData}
        className="popup-layout"
      >
        <Box className="popup-header">
          <DialogTitle>Display Field</DialogTitle>
        </Box>

        <DialogContent sx={{ width: "500px" }} className="popup-body">
          {filterColumn.length > 0 && (
            <FormGroup sx={{ width: "100%" }}>
              <FormControlLabel
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
                control={<Checkbox />}
                label="Select All"
                name="allSelect"
                checked={
                  filterColumn.filter((data) => data.isChecked !== true)
                    .length < 1
                }
                onChange={handleChangeFilter}
              />

              {filterColumn.map((checked, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    sx={{ width: "100%" }}
                    onChange={handleChangeFilter}
                    control={<Checkbox />}
                    label={checked.field}
                    name={checked.field}
                    value={checked.isChecked}
                    checked={checked.isChecked || false}
                  />
                );
              })}
            </FormGroup>
          )}
        </DialogContent>
        <DialogActions className="primary-btn popup-btn">
          <Button variant="outlined" onClick={handleCloseFilterInvoiceData}>
            <CloseOutlinedIcon /> Close
          </Button>
          <Button type="submit" variant="contained" onClick={applyFilter}>
            <CheckIcon /> APPLY
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
export default Filter;
