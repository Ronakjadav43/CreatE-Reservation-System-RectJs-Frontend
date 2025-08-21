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
import SunEditor, { buttonList } from "suneditor-react";

import "./style.scss";
import "suneditor/dist/css/suneditor.min.css";
import ENVIRONMENT_VARIABLES from "../../../../../environment.config";

const AddEmailTemplate = (props) => {
  const [htmlValue, setHtmlValue] = useState("<p></p>");
  const {
    open,
    handleCloseEmailTemplate,
    handleSaveEmailTemplate,
    content,
    templateType,
  } = props;

  const [emailTemplateData, setEmailTemplateData] = useState({
    name: "",
    templateType: templateType[0].id,
    contentLanguage: content[0].id,
    subject: "",
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...emailTemplateData };
    commonData[field] = event.target.value;
    setEmailTemplateData(commonData);
  };

  const onEditorStateChange = (editorValue) => {
    setHtmlValue(editorValue);
  };

  const handleAddEmailTemplate = () => {
    handleSaveEmailTemplate(emailTemplateData, htmlValue);
    handleCloseEmailTemplate();
  };

  const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        ENVIRONMENT_VARIABLES.Base_API_URL + "/emailtemplate/imageupload"
      );
      const data = new FormData();
      data.append("image", file);
      xhr.send(data);
      xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText);
        resolve({
          data: {
            link: `${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${response.data.link}`,
          },
        });
      });
      xhr.addEventListener("error", () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  };

  const uploadImageCallBack = (files, info,  uploadHandler) => {
    if (files.length > 0 && files[0]) {
      uploadImage(files[0]).then((url) => {
        const response = {
          result: [
            {
              url: `${url.data.link}`,
              name: files[0].name,
              size: files[0].size,
            },
          ],
        };
        uploadHandler(response);
      });
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleCloseEmailTemplate}
        className="user-form-dailog"
      >
        <ValidatorForm
          onSubmit={() => handleAddEmailTemplate()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Add Email Template</DialogTitle>
          </Box>
          <DialogContent
            sx={{ width: "1000px", maxHeight: "calc(100vh - 100px)" }}
            className="popup-body"
          >
            <div className="popup-input-box w-50 pl-0">
              <Typography>Email Template Name</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="name"
                value={emailTemplateData.name}
                placeholder="Enter Email Template Name"
                sx={{ marginTop: 0 }}
                validators={["required"]}
                onChange={handleChange}
                errorMessages={["Email Template Name is required"]}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </div>
            <div className="popup-input-box w-50 pr-0">
              <Typography>Subject</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="subject"
                value={emailTemplateData.subject}
                placeholder="Enter Subject"
                sx={{ marginTop: 0 }}
                validators={["required"]}
                onChange={handleChange}
                errorMessages={["Subject is required"]}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </div>
            {props.templateType.length > 0 && (
              <div className="popup-input-box w-50 pl-0">
                <Typography>Email Template Type</Typography>
                <FormControl>
                  <Select
                    size="small"
                    value={emailTemplateData.templateType}
                    name="templateType"
                    inputProps={{ "aria-label": "Without label" }}
                    onChange={handleChange}
                  >
                    {templateType.map((data, index) => (
                      <MenuItem key={index} value={data.id}>
                        {data.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}

            {props.content.length > 0 && (
              <div className="popup-input-box w-50 pr-0">
                <Typography>Content Language</Typography>
                <FormControl>
                  <Select
                    size="small"
                    value={emailTemplateData.contentLanguage}
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

            <div className="popup-input-editor w-100 pl-0 pr-0">
              <Typography>Body</Typography>

              <div className="editor-input-box w-100">
                <SunEditor
                  name="editorState"
                  setContents={htmlValue}
                  placeholder="Enter Body"
                  min-height="260px"
                  width="100%"
                  setOptions={{
                    height: "100%",
                    buttonList: buttonList.complex,
                  }}
                  onImageUploadBefore={uploadImageCallBack}
                  onChange={onEditorStateChange}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn gap">
            <Button variant="outlined" onClick={handleCloseEmailTemplate}>
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

export default AddEmailTemplate;
