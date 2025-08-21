import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Select,
  Typography,
  MenuItem,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { smsTemplateType } from "../../../../../utils/templateType";

const AddTemplate = (props) => {
  const { open, handleCloseSmsTemplate, handleSaveSmsTemplate, content } =
    props;

  const [smsTemplateData, setSmsTemplateData] = useState({
    name: "",
    contentLanguage: content[0].id,
    templateType: smsTemplateType[0].id,
    body: "",
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...smsTemplateData };
    commonData[field] = event.target.value;
    return setSmsTemplateData(commonData);
  };

  const handleAddSmsTemplate = () => {
    handleSaveSmsTemplate(smsTemplateData);
    handleCloseSmsTemplate();
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleCloseSmsTemplate}
        className="user-form-dailog"
      >
        <ValidatorForm
          onSubmit={() => handleAddSmsTemplate()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>ADD NEW SMS CONFIGURATION</DialogTitle>
          </Box>
          <DialogContent
            sx={{ width: "1000px", maxHeight: "calc(100vh - 100px)" }}
            className="popup-body"
          >
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

            {props.content.length > 0 && (
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
            )}

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
              <div className="popup-input-box w-100">
                <Typography>Count : {smsTemplateData.body.length}</Typography>
              </div>
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn gap">
            <Button variant="outlined" onClick={handleCloseSmsTemplate}>
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

export default AddTemplate;
