/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
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
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { handleUpdatedBy } from "../../../../../utils/userAccess";
import { smsTemplateType } from "../../../../../utils/templateType";

let moment = require("moment-timezone");

const EditTemplate = (props) => {
  const {
    open,
    handleCloseEditSmsTemplate,
    handleEditSaveSmsTemplate,
    content,
  } = props;

  const [smsTemplateData, setSmsTemplateData] = useState({
    name: props.selectedSmsTemplate.name,
    contentLanguage: props.selectedSmsTemplate.contentLanguage,
    templateType: props.selectedSmsTemplate.templateType,
    body: props.selectedSmsTemplate.body,
    isActive: props.selectedSmsTemplate.isActive,
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...smsTemplateData };
    commonData[field] = event.target.value;
    return setSmsTemplateData(commonData);
  };

  const handleEditSmsTemplate = () => {
    handleEditSaveSmsTemplate(smsTemplateData, props.selectedSmsTemplate.id);
    handleCloseEditSmsTemplate();
  };

  return (
    <React.Fragment>
      {smsTemplateData.companyId !== null && (
        <Dialog
          open={open}
          onClose={handleCloseEditSmsTemplate}
          className="user-form-dailog"
        >
          <ValidatorForm
            onSubmit={() => handleEditSmsTemplate()}
            autoComplete="off"
            className="popup-layout "
          >
            <Box className="popup-header">
              <DialogTitle>Update Sms Configuration</DialogTitle>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Status</Typography>
                <Switch
                  name="status"
                  checked={smsTemplateData.isActive}
                  onClick={() =>
                    setSmsTemplateData({
                      ...smsTemplateData,
                      isActive: !smsTemplateData.isActive,
                    })
                  }
                />
              </Stack>
            </Box>

            <DialogContent sx={{ maxWidth: "1000px" }} className="popup-body">
              <div className="popup-input-box w-50">
                <Typography>SMS Template Name</Typography>
                <TextValidator
                  fullWidth
                  size="small"
                  margin="normal"
                  type="text"
                  value={smsTemplateData.name}
                  name="name"
                  placeholder="Enter SMS Template Name"
                  sx={{ marginTop: 0 }}
                  onChange={handleChange}
                  validators={["required"]}
                  errorMessages={["SMS Template Name is required"]}
                />
              </div>

              {smsTemplateType.length > 0 && (
                <div className="popup-input-box w-50">
                  <Typography>SMS Template Type</Typography>
                  <FormControl>
                    <Select
                      size="small"
                      value={smsTemplateData.templateType}
                      name="templateType"
                      inputProps={{ "aria-label": "Without label" }}
                      onChange={handleChange}
                    >
                      {smsTemplateType.map((data, index) => (
                        <MenuItem key={index} value={data.id}>
                          {data.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              )}

              <div className="popup-input-box w-100">
                <Typography>Content Language</Typography>
                <FormControl>
                  <Select
                    size="small"
                    value={smsTemplateData.contentLanguage}
                    name="contentLanguage"
                    inputProps={{ "aria-label": "Without label" }}
                    onChange={handleChange}
                  >
                    {content.map((data, index) => (
                      <MenuItem key={index} value={data.id}>
                        {data.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="popup-input-box w-100">
                <Typography>Body</Typography>
                <div className="editor-input-box">
                  <TextValidator
                    fullWidth
                    size="small"
                    margin="normal"
                    type="text"
                    value={smsTemplateData.body}
                    multiline
                    rows={10}
                    name="body"
                    placeholder="Enter Body"
                    sx={{ marginTop: 0 }}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["Body is required"]}
                  />
                </div>
              </div>
              <div className="popup-input-box w-100">
                <Typography>Count : {smsTemplateData.body.length}</Typography>
              </div>

              <div className="popup-input-box w-50 info ">
                <DialogContentText>
                  Created by :{props.selectedSmsTemplate.createdBy}
                </DialogContentText>
                <DialogContentText>
                  Created date :
                  {props.selectedSmsTemplate.createdAt
                    ? moment(props.selectedSmsTemplate.createdAt).format(
                        "DD-MM-YYYY hh:mm A"
                      )
                    : "N/A"}
                </DialogContentText>
                <DialogContentText>
                  Updated by:
                  {handleUpdatedBy(props.selectedSmsTemplate.updatedBy)}
                </DialogContentText>
                <DialogContentText>
                  Updated date :
                  {props.selectedSmsTemplate.updatedAt
                    ? moment(props.selectedSmsTemplate.updatedAt).format(
                        "DD-MM-YYYY hh:mm A"
                      )
                    : "N/A"}
                </DialogContentText>
              </div>
            </DialogContent>

            <DialogActions className="primary-btn popup-btn gap">
              <Button variant="outlined" onClick={handleCloseEditSmsTemplate}>
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
export default EditTemplate;
