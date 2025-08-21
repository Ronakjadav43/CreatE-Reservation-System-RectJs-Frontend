/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import {
  Button,
  DialogActions,
  DialogTitle,
  Stack,
  Switch,
  Typography,
  FormControl,
  Select,
  MenuItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  DialogContentText,
} from "@mui/material";
import { connect, useSelector } from "react-redux";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { bindActionCreators } from "redux";

import * as UserAction from "../../../../../Action/AdminDashboard";
import "./style.scss";
import moment from "moment-timezone";
import {
  ActionType,
  Modules,
  handlePermission,
  handleUpdatedBy,
} from "../../../../../utils/userAccess";

const CustomerCriteria = (props) => {
  const { handleCloseSelectedCustomerCriteria } = props;
  const [tags, setTags] = useState([]);
  const [marketingData, setMarketingData] = useState(null);

  const permission = useSelector((state) => state.hotelReducer.permission);

  useEffect(() => {
    if (props.selectedCustomerCriteria) {
      setMarketingData({
        ...marketingData,
        name: props.selectedCustomerCriteria.name,
        description: props.selectedCustomerCriteria.description,
        isActive: props.selectedCustomerCriteria.isActive,
        criteria: props.selectedCustomerCriteria.criteria,
        tags: props.selectedCustomerCriteria.tags,
      });
    }
  }, [props.selectedCustomerCriteria]);

  useEffect(() => {
    const commonData = { ...props.selectedCustomerCriteria };
    if (props.tags && props.tags.length > 0) {
      const mappedTag = props.tags.map((tagType) => {
        const findTagType = commonData.tags.find(
          (material) => material.name === tagType.name
        );
        if (findTagType) return { ...tagType, isChecked: true };
        else return { ...tagType, isChecked: false };
      });
      setTags(mappedTag);
    }
  }, [props.tags]);

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...marketingData };
    commonData[field] = event.target.value;
    return setMarketingData(commonData);
  };

  const handleUpdateMarketing = () => {
    props.handleEditMarketing(marketingData);
  };

  return (
    <React.Fragment>
      {marketingData && (
        <ValidatorForm
          onSubmit={() => handleUpdateMarketing()}
          autoComplete="off"
          className="1"
        >
          <DialogActions className="popup-header">
            <div className="costomer-header">
              <DialogTitle style={{ padding: "16px 2px", fontWeight: "700" }}>
                Update Customer Criteria
              </DialogTitle>
            </div>
            <Stack direction="row" spacing={1} alignItems="center">
              <div className="primary-btn">
                <Button
                  onClick={handleCloseSelectedCustomerCriteria}
                  variant="outlined"
                >
                  <ArrowBackIcon /> BACK
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={handlePermission(
                    permission.CompanyPermission,
                    Modules.MARKETING,
                    ActionType.update,
                    true
                  )}
                >
                  <SaveOutlinedIcon /> UPDATE
                </Button>
              </div>
            </Stack>
          </DialogActions>

          <div className="basicinformation">
            <div className="basicinformation-left">
              <div className="w-100 p-10">
                <Typography>Name</Typography>
                <TextValidator
                  fullWidth
                  size="small"
                  margin="normal"
                  type="text"
                  name="name"
                  value={marketingData.name}
                  placeholder="Enter Name"
                  sx={{ marginTop: 0 }}
                  validators={["required"]}
                  onChange={handleChange}
                  errorMessages={["Name is required"]}
                />
              </div>

              <div className="w-100 p-10">
                <Typography>Description</Typography>
                <TextValidator
                  fullWidth
                  size="small"
                  margin="normal"
                  type="text"
                  name="description"
                  value={marketingData.description}
                  multiline
                  rows={4}
                  placeholder="Enter Description"
                  sx={{ marginTop: 0 }}
                  onChange={handleChange}
                />
              </div>
              {marketingData.criteria.length > 0 && (
                <Typography
                  sx={{ width: "100%", padding: "0 10px", fontWeight: "bold" }}
                >
                  Criteria
                </Typography>
              )}
              {marketingData.criteria.length > 0 &&
                marketingData.criteria.map((criteria) => (
                  <React.Fragment>
                    <div className="w-33 p-10">
                      <TextValidator
                        disabled
                        fullWidth
                        size="small"
                        margin="normal"
                        type="text"
                        name="fieldName"
                        value={criteria.displayName}
                        sx={{ marginTop: 0 }}
                      />
                    </div>

                    <div className="w-33 p-10">
                      <TextValidator
                        disabled
                        fullWidth
                        size="small"
                        margin="normal"
                        type="text"
                        name="criteria"
                        value={criteria.displayCriteria}
                        sx={{ marginTop: 0 }}
                      />
                    </div>

                    {criteria.criteria !== "BETWEEN" && (
                      <div className="w-33 p-10">
                        <TextValidator
                          disabled
                          fullWidth
                          size="small"
                          margin="normal"
                          type="text"
                          name="criteria_value"
                          value={criteria.displayValue}
                          sx={{ marginTop: 0 }}
                          onChange={handleChange}
                        />
                      </div>
                    )}
                    {criteria.criteria === "BETWEEN" && (
                      <div className="p-10" style={{ width: "16.66%" }}>
                        <TextValidator
                          disabled
                          fullWidth
                          size="small"
                          margin="normal"
                          type="text"
                          name="criteria_value"
                          value={criteria.value.displayValue1}
                          sx={{ marginTop: 0 }}
                          onChange={handleChange}
                        />
                      </div>
                    )}
                    {criteria.criteria === "BETWEEN" && (
                      <div className="p-10" style={{ width: "16.66%" }}>
                        <TextValidator
                          disabled
                          fullWidth
                          size="small"
                          margin="normal"
                          type="text"
                          name="criteria_value"
                          value={criteria.value.displayValue2}
                          sx={{ marginTop: 0 }}
                          onChange={handleChange}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}

              <div className="w-100 p-10">
                <Typography>Tags</Typography>
                {tags && tags.length > 0 && (
                  <FormControl size="small" sx={{ width: "100%" }}>
                    <Select
                      disabled
                      multiple
                      margin="normal"
                      type="text"
                      value={tags}
                      name="tags"
                      renderValue={(selected) => {
                        selected = tags.filter(
                          (data) => data.isChecked === true
                        );
                        const renderData = selected.map((user) => user.name);
                        return renderData.join(", ");
                      }}
                    >
                      {tags.map((tagType) => (
                        <MenuItem key={tagType.id} value={tagType.id}>
                          <ListItemIcon>
                            <Checkbox checked={tagType.isChecked} />
                          </ListItemIcon>
                          <ListItemText primary={tagType.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </div>
            </div>
            <div className="basicinformation-right">
              <Stack className="switch-div">
                <div className="switching">
                  <Typography>Status</Typography>
                  <Switch
                    name="status"
                    className="switch-status"
                    checked={marketingData.isActive}
                    onClick={() =>
                      setMarketingData({
                        ...marketingData,
                        isActive: !marketingData.isActive,
                      })
                    }
                  />
                </div>
              </Stack>
              <div className="w-100 info p-10 pl-0">
                <DialogContentText>
                  Created by : {props.selectedCustomerCriteria.CreatedBy}
                </DialogContentText>
                <DialogContentText>
                  Created date :
                  {props.selectedCustomerCriteria.CreatedDate
                    ? moment(props.selectedCustomerCriteria.CreatedAt).format(
                        "DD-MM-YYYY hh:mm A"
                      )
                    : "N/A"}
                </DialogContentText>
                <DialogContentText>
                  Updated by :
                  {handleUpdatedBy(props.selectedCustomerCriteria.UpdatedBy)}
                </DialogContentText>
                <DialogContentText>
                  Updated date :
                  {props.selectedCustomerCriteria.UpdatedDate
                    ? moment(props.selectedCustomerCriteria.UpdatedAt).format(
                        "DD-MM-YYYY hh:mm A"
                      )
                    : "N/A"}
                </DialogContentText>
              </div>
            </div>
          </div>
        </ValidatorForm>
      )}
    </React.Fragment>
  );
};
const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(CustomerCriteria);
