import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import "./style.scss";

var reader = new FileReader();
var readers = new FileReader();

const AddMaterials = (props) => {
  const { open, handleCloseMaterials, handleSaveMaterials, selectCategory } =
    props;
  const [isImageUpload, setIsImageUpload] = useState(false);
  const [isVideoUpload, setIsVideoUpload] = useState(false);
  const [imageDisplay, setImageDisplay] = useState(null);
  const [filename, setFileName] = useState();

  const [materialsData, setMaterialsData] = useState({
    title: "",
    description: "",
    attachment: null,
    thumbnail: null,
    tags: props.tags,
    categoryId: "",
    subCategoryId: "",
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...materialsData };
    commonData[field] = event.target.value;
    return setMaterialsData(commonData);
  };

  const handleFilter = (e) => {
    const value = e.target.value[e.target.value.length - 1];
    let tempData = materialsData.tags.map((data) =>
      data.id === value ? { ...data, isChecked: !data.isChecked } : data
    );
    setMaterialsData({ ...materialsData, tags: tempData });
  };

  const handleCategory = (event) => {
    setMaterialsData({ ...materialsData, categoryId: event.target.value });

    selectCategory(event);
  };

  const handleAddMetrials = () => {
    if (isImageUpload && isVideoUpload) {
      handleSaveMaterials(materialsData);
      handleCloseMaterials();
    }
  };

  const handleImageUpload = (event) => {
    setMaterialsData({
      ...materialsData,
      thumbnail: event.target.files[0],
    });
    setIsImageUpload(true);
    reader.readAsDataURL(event.target.files[0]);
  };

  reader.onload = (e) => {
    setImageDisplay(e.target.result);
  };

  const handleVideoUpload = (events) => {
    setMaterialsData({
      ...materialsData,
      attachment: events.target.files[0],
    });
    setIsVideoUpload(true);
    readers.readAsDataURL(events.target.files[0]);
    setFileName(events.target.files[0].name);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleCloseMaterials}
        className="user-form-dailog"
      >
        <ValidatorForm
          onSubmit={() => handleAddMetrials()}
          autoComplete="off"
          className="popup-layout"
        >
          <DialogContent className="popup-body" sx={{ width: "800px" }}>
            <div className="popup-input-box w-50 p-0">
              <div className="upload-block w-100">
                {materialsData.thumbnail && (
                  <img
                    className="product-image"
                    src={imageDisplay}
                    alt="thumbnail"
                  />
                )}
                <Button
                  className="upload-btn"
                  variant="contained"
                  component="label"
                >
                  <FileUploadOutlinedIcon />
                  <input
                    name="thumbnail"
                    accept=".jpeg,.jpg,.png/*"
                    hidden
                    type="file"
                    onChange={(event) => handleImageUpload(event)}
                    validators={["required"]}
                  />
                </Button>
                {!isImageUpload && (
                  <p className="danger">Upload a New thumbnail</p>
                )}
              </div>

              <div style={{ display: "flex" }} className="w-100">
                <div className="popup-input-box w-50 pl-0">
                  {props.category.length > 0 && (
                    <FormControl sx={{ width: "160px" }} size="small">
                      <Typography>Category</Typography>
                      <Select
                        id="categoryId"
                        value={materialsData.categoryId}
                        name="categoryId"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={handleCategory}
                        required={true}
                      >
                        {props.category.map((Category, index) => (
                          <MenuItem key={index} value={Category.id}>
                            {Category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </div>

                <div className="popup-input-box w-50 pr-0">
                  <Typography>Attachment</Typography>
                  <Stack
                    alignItems="center"
                    spacing={2}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <div className="primary-btn popup-btn p-0 m-0">
                      <Button variant="contained" component="label">
                        Upload
                        <input
                          name="attachment"
                          accept=".jpg, .mp4, .pdf, .png, .jpeg, .gif, .bmp, .tif, .tiff, .ppt, .pptx, .doc, .docx, .xls, .xlsx "
                          hidden
                          type="file"
                          onChange={(event) => handleVideoUpload(event)}
                          validators={["required"]}
                        />
                      </Button>
                    </div>
                    <span className="uploade-img m-0" title={filename}>
                      {filename}
                    </span>
                  </Stack>
                  {!isVideoUpload && (
                    <p className="danger m-0">Attachment Is Required</p>
                  )}
                </div>
              </div>

              <div style={{ display: "flex" }} className="w-100">
                <div className="popup-input-box w-50 pl-0">
                  {props.categoryId.length > 0 && (
                    <FormControl sx={{ width: "160px" }} size="small">
                      <Typography>Sub-Category</Typography>
                      <Select
                        id="subCategoryId"
                        value={materialsData.subCategoryId}
                        name="subCategoryId"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={handleChange}
                        required={true}
                      >
                        {props.categoryId.map((Category, index) => (
                          <MenuItem key={index} value={Category.id}>
                            {Category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </div>
                <div className="popup-input-box w-50 pr-0">
                  <Typography>Tags</Typography>
                  {props.tags && (
                    <FormControl size="small" sx={{ width: 450 }}>
                      <Select
                        multiple
                        margin="normal"
                        type="text"
                        value={materialsData.tags}
                        name="tags"
                        onChange={handleFilter}
                        renderValue={(selected) => {
                          selected = materialsData.tags.filter(
                            (data) => data.isChecked === true
                          );
                          const renderData = selected.map((user) => user.name);
                          return renderData.join(", ");
                        }}
                      >
                        {materialsData.tags.map((tagType) => (
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
            </div>
            <div className="popup-input-box w-50 pr-0">
              <div className="popup-input-box w-100 pr-0">
                <Typography>Title</Typography>
                <TextValidator
                  size="small"
                  fullWidth
                  margin="normal"
                  type="text"
                  name="title"
                  value={materialsData.title}
                  onChange={handleChange}
                  sx={{ marginTop: 0 }}
                  validators={["required"]}
                  errorMessages={["title is required"]}
                />
              </div>
              <div className="popup-input-box w-100 pr-0">
                <Typography>Description</Typography>
                <TextValidator
                  size="small"
                  fullWidth
                  multiline
                  rows={7}
                  margin="normal"
                  type="text"
                  name="description"
                  value={materialsData.description}
                  onChange={handleChange}
                  sx={{ marginTop: 0 }}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions className="primary-btn">
            <Button
              variant="outlined"
              onClick={handleCloseMaterials}
              className="close-btn"
            >
              <CloseOutlinedIcon /> Close
            </Button>
            <Button
              disabled={
                materialsData.categoryId === "" ||
                materialsData.subCategoryId === ""
              }
              type="submit"
              variant="contained"
            >
              <AddOutlinedIcon /> Add
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </React.Fragment>
  );
};
export default AddMaterials;
