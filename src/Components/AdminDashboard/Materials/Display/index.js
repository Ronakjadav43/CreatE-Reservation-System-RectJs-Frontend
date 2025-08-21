/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Button, Box, DialogActions } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { DocumentViewer } from "react-documents";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  SET_INVISIBLE_DISABLE_OUTLET,
  SET_INVISIBLE_SELECTION,
  SET_VISIBLE_DISABLE_OUTLET,
  SET_VISIBLE_SELECTION,
} from "../../../../utils/AdminDashboard/Constant";

import ENVIRONMENT_VARIABLES from "../../../../environment.config";
import * as UserAction from "../../../../Action/AdminDashboard";
import Edit from "../Edit";
import "./style.scss";

const Display = (props) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [material, setMaterial] = useState(null);
  const [category, setCategory] = useState([]);
  const [categoryId, setCategoryId] = useState([]);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    materials: state.hotelReducer.materials,
    categories: state.hotelReducer.categories,
    subCategories: state.hotelReducer.subCategories,
    tags: state.hotelReducer.tags,
  }));

  const docs = [
    {
      uri: `${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${hotelReducer.materials.attachment}`,
    },
  ];

  useEffect(() => {
    dispatch({
      type: SET_INVISIBLE_SELECTION,
    });
    dispatch({
      type: SET_INVISIBLE_DISABLE_OUTLET,
    });
    return () => {
      dispatch({
        type: SET_VISIBLE_SELECTION,
      });
      dispatch({
        type: SET_VISIBLE_DISABLE_OUTLET,
      });
    };
  }, []);

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      props.actions.userAction.getMaterialById(
        id,
        hotelReducer.selectedOutlet?.outlet.id
      );
      props.actions.userAction.getTagsByOutletCategory(
        ENVIRONMENT_VARIABLES.Base_MATERIAL_TAGS,
        hotelReducer.selectedOutlet.outlet.id
      );
      props.actions.userAction.getCategory(
        hotelReducer.selectedOutlet.outlet.id
      );
    }
  }, [hotelReducer.selectedOutlet]);

  useEffect(() => {
    if (hotelReducer.categories.length > 0) {
      const activeTags = hotelReducer.categories.filter(
        (data) => data.isActive === true
      );
      setCategory(activeTags);
    }
  }, [hotelReducer.categories]);

  useEffect(() => {
    if (hotelReducer.subCategories.length > 0) {
      const activeTags = hotelReducer.subCategories.filter(
        (data) => data.isActive === true
      );
      setCategoryId(activeTags);
    }
  }, [hotelReducer.subCategories]);

  useEffect(() => {
    if (hotelReducer.materials && !Array.isArray(hotelReducer.materials)) {
      setMaterial(hotelReducer.materials);
    }
  }, [hotelReducer.materials]);

  useEffect(() => {
    if (hotelReducer.tags) {
      const mappedTag = hotelReducer.tags
        .filter((tagType) => tagType.isActive === true)
        .map((data) => {
          return { ...data, isChecked: false };
        });
      setTags(mappedTag);
    }
  }, [hotelReducer.tags]);

  const handleEditSaveMaterial = (data) => {
    props.actions.userAction.updateMaterial(
      data,
      id,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleChange = () => {
    navigate("/Admin/Materials");
  };

  const handleOpenEditMaterial = () => {
    setEditOpen(true);
  };

  const handleClosEditMaterial = () => {
    setEditOpen(false);
  };

  const selectCategory = (event) => {
    props.actions.userAction.getSubCategoryByCategory(
      event.target.value,
      hotelReducer.selectedOutlet.outlet.id
    );
    setCategoryId(event.target.value);
  };

  return (
    <div>
      {editOpen && (
        <Edit
          open={editOpen}
          selectedMaterial={{ ...material }}
          handleClosEditMaterial={handleClosEditMaterial}
          handleEditSaveMaterial={handleEditSaveMaterial}
          tags={[...tags]}
          category={[...category]}
          categoryId={categoryId}
          selectCategory={selectCategory}
        />
      )}

      {material && (
        <div className="user-groups">
          <h1 className="groups-header">Materials</h1>
          <h1 className="groups-header-2nd">{hotelReducer.materials.title}</h1>
          <DialogActions
            className="primary-btn"
            sx={{ justifyContent: "flex-end" }}
          >
            <Button onClick={handleChange} variant="outlined">
              <ArrowBackIcon />
              Back
            </Button>
          </DialogActions>
          <div className="videos-layout">
            <Card variant="outlined" className="videos-layout-inner">
              {hotelReducer.materials.type === "video/mp4" ? (
                <div className="videos">
                  <ReactPlayer
                    onPlay
                    url={`${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${hotelReducer.materials.attachment}`}
                    playing={true}
                    controls={true}
                    loop={true}
                    muted={true}
                    volume={1}
                    playsinline={true}
                    width="50vw"
                    height="50vh"
                  />
                </div>
              ) : (
                <div className="videos">
                  {hotelReducer.materials.type === "image/jpeg" ||
                  hotelReducer.materials.type === "image/png" ||
                  hotelReducer.materials.type === "image/gif" ||
                  hotelReducer.materials.type === "image/bmp" ? (
                    <img
                      src={`${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${hotelReducer.materials.attachment}`}
                      alt=""
                    />
                  ) : (
                    <DocumentViewer
                      className="images-hello"
                      url={docs[0].uri}
                    />
                  )}
                </div>
              )}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px",
                }}
              >
                <Box className="videos-card-info" sx={{ padding: "0" }}>
                  <Typography variant="h5" component="div">
                    {hotelReducer.materials.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {hotelReducer.materials.description}
                  </Typography>
                  <div className="primary-btn" />
                </Box>
                <Button
                  variant="outlined"
                  sx={{ width: "160px", gap: "5px" }}
                  onClick={handleOpenEditMaterial}
                >
                  <BorderColorIcon /> Edit
                </Button>
              </Box>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(Display);
