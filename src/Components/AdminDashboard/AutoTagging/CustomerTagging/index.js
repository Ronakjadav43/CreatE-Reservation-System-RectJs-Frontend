/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import {
  Button,
  DialogActions,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { connect } from "react-redux";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { bindActionCreators } from "redux";

import * as UserAction from "../../../../Action/AdminDashboard";

const CustomerTagging = (props) => {
  const { handleCloseSelectedAutoTagging } = props;
  const [autoTaggingData, setAutoTaggingData] = useState([]);

  useEffect(() => {
    if (props.selectedAutoTagging) {
      setAutoTaggingData({
        ...autoTaggingData,
        name: props.selectedAutoTagging.name,
        description: props.selectedAutoTagging.description,
        criteria: props.selectedAutoTagging.criteria,
        tagId: props.selectedAutoTagging.tagId,
      });
    }
  }, [props.selectedAutoTagging]);

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...autoTaggingData };
    commonData[field] = event.target.value;
    return setAutoTaggingData(commonData);
  };

  const handleUpdateMarketing = () => {
    props.handleEditMarketing(autoTaggingData);
  };

  return (
    <React.Fragment>
      {autoTaggingData && (
        <ValidatorForm
          onSubmit={() => handleUpdateMarketing()}
          autoComplete="off"
          className="1"
        >
          <DialogActions className="popup-header">
            <div className="costomer-header">
              <DialogTitle style={{ padding: "16px 2px", fontWeight: "700" }}>
                Auto Tagging
              </DialogTitle>
            </div>
            <Stack direction="row" spacing={1} alignItems="center">
              <div className="primary-btn">
                <Button
                  onClick={handleCloseSelectedAutoTagging}
                  variant="outlined"
                >
                  <ArrowBackIcon /> BACK
                </Button>
              </div>
            </Stack>
          </DialogActions>

          <div className="basicinformation">
            <div className="basicinformation-left">
              {autoTaggingData.criteria &&
                autoTaggingData.criteria.length > 0 && (
                  <Typography
                    sx={{
                      width: "100%",
                      padding: "0 10px",
                      fontWeight: "bold",
                    }}
                  >
                    Criteria
                  </Typography>
                )}
              {autoTaggingData.criteria &&
                autoTaggingData.criteria.length > 0 &&
                autoTaggingData.criteria.map((criteria) => (
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
                {autoTaggingData.tagId && (
                  <FormControl size="small" sx={{ width: "100%" }}>
                    <Select
                      disabled
                      id="tagId"
                      margin="normal"
                      type="text"
                      value={autoTaggingData.tagId}
                      name="tagId"
                    >
                      {props.tags.map((Tag, index) => (
                        <MenuItem key={index} value={Tag.id}>
                          {Tag.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
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

export default connect(null, mapDispatchToProps)(CustomerTagging);
