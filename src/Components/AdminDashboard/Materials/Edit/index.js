/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { connect, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useNavigate } from "react-router-dom";

import ENVIRONMENT_VARIABLES from "../../../../environment.config";
import * as UserAction from "../../../../Action/AdminDashboard";
import DeletePopUp from "../../../../CommonComponent/DeletePopUp";
import "./style.scss";
import {
  ActionType,
  Modules,
  handlePermission,
  handleUpdatedBy,
} from "../../../../utils/userAccess";
import moment from "moment-timezone";

var reader = new FileReader();
var readers = new FileReader();

const Edit = (props) => {
  const navigate = useNavigate();
  const { open, handleClosEditMaterial, handleEditSaveMaterial } = props;
  const [deleteOpen, setDeleteOpen] = useState(false);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    materials: state.hotelReducer.materials,
    permission: state.hotelReducer.permission,
  }));

  const [materialsData, setMaterialsData] = useState({
    categoryId: props.selectedMaterial.categoryId,
    subCategoryId: props.selectedMaterial.subCategoryId,
    outlet: props.selectedMaterial.outlet,
    title: props.selectedMaterial.title,
    description: props.selectedMaterial.description,
    attachment: props.selectedMaterial.attachment,
    thumbnail: props.selectedMaterial.thumbnail,
    type: props.selectedMaterial.type,
  });

  const [filename, setFileName] = useState(
    `${props.selectedMaterial.attachment}`
  );

  const [imageDisplay, setImageDisplay] = useState(
    `${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${props.selectedMaterial.thumbnail}`
  );

  useEffect(() => {
    if (props.selectedMaterial) {
      props.actions.userAction.getSubCategoryByCategory(
        props.selectedMaterial.categoryId,
        hotelReducer.selectedOutlet.outlet.id
      );
    }
  }, []);

  useEffect(() => {
    if (props.tags && props.tags.length > 0) {
      const mappedTag = props.tags.map((tagType) => {
        const findTagType = props.selectedMaterial.tags.find(
          (material) => material.name === tagType.name
        );
        if (findTagType) return { ...tagType, isChecked: true };
        else return { ...tagType, isChecked: false };
      });
      setMaterialsData({
        ...materialsData,
        tags: mappedTag,
      });
    }
  }, [props.tags]);

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...materialsData };
    commonData[field] = event.target.value;
    return setMaterialsData(commonData);
  };

  const handleCategory = (event) => {
    setMaterialsData({
      ...materialsData,
      categoryId: event.target.value,
      subCategoryId: null,
    });

    props.selectCategory(event);
  };

  const handleFilter = (e) => {
    const value = e.target.value[e.target.value.length - 1];
    let tempData = materialsData.tags.map((data) =>
      data.id === value ? { ...data, isChecked: !data.isChecked } : data
    );
    setMaterialsData({ ...materialsData, tags: tempData });
  };

  const handleOpenDeleteMaterial = () => {
    setDeleteOpen(true);
  };

  const handleCloseDeleteMaterial = () => {
    setDeleteOpen(false);
  };

  const handleDeleteMaterial = () => {
    props.actions.userAction.deleteMaterial(
      props.selectedMaterial.id,
      hotelReducer.selectedOutlet?.outlet.id
    );
    navigate("/Admin/Materials");
  };

  const handleEditMaterial = () => {
    handleEditSaveMaterial(materialsData, props.selectedMaterial.id);
    handleClosEditMaterial();
  };

  const handleImageUpload = (event) => {
    setMaterialsData({
      ...materialsData,
      thumbnail: event.target.files[0],
    });
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
    readers.readAsDataURL(events.target.files[0]);
    setFileName(events.target.files[0].name);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClosEditMaterial}
        className="user-form-dailog"
      >
        {deleteOpen && (
          <DeletePopUp
            open={deleteOpen}
            data={props.selectedMaterial}
            handleClose={handleCloseDeleteMaterial}
            handleDelete={handleDeleteMaterial}
            message="Confirm To Delete Material"
          />
        )}
        <div>
          {props.selectedMaterial && (
            <Card className="metrial-card">
              <ValidatorForm
                onSubmit={() => handleEditMaterial()}
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
                              />
                            </Button>
                          </div>
                          <span className="uploade-img m-0" title={filename}>
                            {filename}
                          </span>
                        </Stack>
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

                      {materialsData.tags && (
                        <div className="popup-input-box w-50 pr-0">
                          <Typography>Tags</Typography>
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
                                const renderData = selected.map(
                                  (user) => user.name
                                );
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
                        </div>
                      )}
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
                  <div className="popup-input-box w-100 info">
                    <DialogContentText>
                      Created by :{props.selectedMaterial.createdBy}
                    </DialogContentText>
                    <DialogContentText>
                      Created date :
                      {props.selectedMaterial.createdAt
                        ? moment(props.selectedMaterial.createdAt).format(
                            "DD-MM-YYYY hh:mm A"
                          )
                        : "N/A"}
                    </DialogContentText>
                    <DialogContentText>
                      Updated by:
                      {handleUpdatedBy(props.selectedMaterial.updatedBy)}
                    </DialogContentText>
                    <DialogContentText>
                      Updated date :
                      {props.selectedMaterial.updatedAt
                        ? moment(props.selectedMaterial.updatedAt).format(
                            "DD-MM-YYYY hh:mm A"
                          )
                        : "N/A"}
                    </DialogContentText>
                  </div>
                </DialogContent>
                <DialogActions className="primary-btn">
                  <Button
                    disabled={handlePermission(
                      hotelReducer.permission.permission,
                      Modules.MATERIALS,
                      ActionType.delete,
                      true
                    )}
                    variant="outlined"
                    onClick={handleOpenDeleteMaterial}
                    className="close-btn"
                  >
                    <CloseOutlinedIcon /> Delete
                  </Button>
                  <Button
                    disabled={handlePermission(
                      hotelReducer.permission.permission,
                      Modules.MATERIALS,
                      ActionType.update,
                      true
                    )}
                    type="submit"
                    variant="contained"
                  >
                    <AddOutlinedIcon /> Save
                  </Button>
                </DialogActions>
              </ValidatorForm>
            </Card>
          )}
        </div>
      </Dialog>
    </React.Fragment>
  );
};
const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});
export default connect(null, mapDispatchToProps)(Edit);
