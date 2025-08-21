import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import React from "react";

const MultipleCompanySelection = (props) => {
  const handleCompany = (e) => {
    let tempData = [];
    const value = e.target.value[e.target.value.length - 1];

    const findSelectAll = props.companys.find(
      (company) => company.id === value
    );
    if (findSelectAll.name === "All") {
      if (findSelectAll.isChecked === false) {
        tempData = props.companys.map((data) => ({ ...data, isChecked: true }));
      } else {
        tempData = props.companys.map((data) => ({
          ...data,
          isChecked: false,
        }));
      }
    } else {
      tempData = props.companys.map((data) =>
        data.id === value ? { ...data, isChecked: !data.isChecked } : data
      );

      const checkSelectAll = tempData.filter(
        (data) => data.isChecked !== true && data.name !== "All"
      );
      if (checkSelectAll.length > 0) {
        tempData[0].isChecked = false;
      } else {
        tempData[0].isChecked = true;
      }
    }
    props.setMultipleCompanys(tempData);
  };

  return (
    <div>
      <FormControl sx={{ minWidth: 250, maxWidth: 250 }} size="small">
        <InputLabel id="outlets-data">Brand</InputLabel>
        <Select
          multiple
          size="small"
          labelId="outlets-data"
          id="outlets-data"
          value={props.companys}
          label="Brand"
          onChange={handleCompany}
          renderValue={(selected) => {
            selected = props.companys.filter(
              (data) => data.isChecked === true && data.name !== "All"
            );
            const renderData = selected.map((user) => user.name);
            return renderData.join(", ");
          }}
        >
          {props.companys.map((company) => (
            <MenuItem key={company.id} value={company.id}>
              <ListItemIcon>
                <Checkbox checked={company.isChecked} />
              </ListItemIcon>
              <ListItemText primary={company.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default MultipleCompanySelection;
