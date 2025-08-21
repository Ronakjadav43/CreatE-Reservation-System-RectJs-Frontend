/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import Typography from "@mui/material/Typography";
import {
  Button,
  InputAdornment,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";

import * as UserAction from "../../../Action/AdminDashboard";
import ENVIRONMENT_VARIABLES from "../../../environment.config";
import AddMaterials from "./Add/index";
import Filter from "./Filter/index";

import "./style.scss";
import {
  ActionType,
  Modules,
  handlePermission,
} from "../../../utils/userAccess";
import {
  RESET_ALL_SUBCATEGORY,
  RESET_CATEGORY,
} from "../../../utils/AdminDashboard/Constant";

const Materials = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [materials, setMaterials] = useState([]);
  const [category, setCategory] = useState([]);
  const [categoryId, setCategoryId] = useState([]);
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [timeOut, setTimeOut] = useState(null);
  const [searchData, setSearchData] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const filterButton = Boolean(anchorEl);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const redirect = (url) => {
    navigate(url);
  };

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    materials: state.hotelReducer.materials,
    categories: state.hotelReducer.categories,
    subCategories: state.hotelReducer.subCategories,
    tags: state.hotelReducer.tags,
    permission: state.hotelReducer.permission,
  }));

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      setCategory([]);
      setCategoryId([]);
      props.actions.userAction.getAllMaterials(
        hotelReducer.selectedOutlet.outlet.id
      );
      props.actions.userAction.getTagsByOutletCategory(
        ENVIRONMENT_VARIABLES.Base_MATERIAL_TAGS,
        hotelReducer.selectedOutlet.outlet.id
      );
      props.actions.userAction.getCategory(
        hotelReducer.selectedOutlet.outlet.id
      );
      return () => {
        dispatch({ type: RESET_CATEGORY });
      };
    }
  }, [hotelReducer.selectedOutlet]);

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

  useEffect(() => {
    if (hotelReducer.categories.length > 0) {
      const activeCategories = hotelReducer.categories.filter(
        (data) => data.isActive === true
      );
      setCategory(activeCategories);
      props.actions.userAction.getSubCategoryByCategory(
        hotelReducer.categories[0].id,
        hotelReducer.selectedOutlet.outlet.id
      );
      setCategoryId(activeCategories[0].id);
      return () => {
        dispatch({ type: RESET_ALL_SUBCATEGORY });
      };
    }
  }, [hotelReducer.categories]);

  useEffect(() => {
    if (hotelReducer.subCategories.length > 0) {
      const activeCategories = hotelReducer.subCategories.filter(
        (data) => data.isActive === true
      );
      setCategoryId(activeCategories);
    }
  }, [hotelReducer.subCategories]);

  useEffect(() => {
    if (Array.isArray(hotelReducer.materials)) {
      setMaterials([...hotelReducer.materials]);
    }
  }, [hotelReducer.materials]);

  const handleOpenMaterials = () => {
    setOpen(true);
  };

  const handleCloseMaterials = () => {
    setOpen(false);
  };

  const handleSaveMaterials = (data) => {
    props.actions.userAction.addMaterial(
      data,
      hotelReducer.selectedOutlet.outlet.id
    );
  };

  const searchItems = (value) => {
    clearTimeout(timeOut);
    setTimeOut(
      setTimeout(() => {
        props.actions.userAction.getAllMaterials(
          hotelReducer.selectedOutlet.outlet.id,
          value
        );
      }, 1000)
    );
    setSearchData(value);
  };

  const selectCategory = (event) => {
    setCategoryId([]);
    props.actions.userAction.getSubCategoryByCategory(
      event.target.value,
      hotelReducer.selectedOutlet.outlet.id
    );
    setCategoryId(event.target.value);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterCategory = (category) => {
    setSelectedCategory(category);
    props.actions.userAction.getAllMaterials(
      hotelReducer.selectedOutlet.outlet.id,
      null,
      category.id
    );
    setSearchData("");
    handleClose();
  };

  const handleFilterSubCategory = (subCategory) => {
    setSelectedCategory(subCategory);
    props.actions.userAction.getAllMaterials(
      hotelReducer.selectedOutlet.outlet.id,
      null,
      null,
      subCategory.id
    );
    setSearchData("");
    handleClose();
  };

  return (
    <React.Fragment>
      {open && (
        <AddMaterials
          open={open}
          handleCloseMaterials={handleCloseMaterials}
          handleSaveMaterials={handleSaveMaterials}
          tags={[...tags]}
          category={[...category]}
          categoryId={categoryId}
          selectCategory={selectCategory}
        />
      )}

      <div className="user-groups">
        <h1 className="groups-header">Materials</h1>
        <Box className="user-groups-search">
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <TextField
              className="search-box"
              sx={{ width: "250px" }}
              placeholder="Search"
              size="small"
              value={searchData}
              onChange={(e) => searchItems(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="primary-btn">
              <IconButton
                onClick={handleClick}
                aria-controls={filterButton ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={filterButton ? "true" : undefined}
              >
                <Button variant="contained" className="filter-btn">
                  <ClearAllIcon />
                </Button>
              </IconButton>
              <Filter
                filterButton={filterButton}
                categories={[...category]}
                handleFilterCategory={handleFilterCategory}
                handleFilterSubCategory={handleFilterSubCategory}
                anchorEl={anchorEl}
                handleClose={handleClose}
                selectedCategory={{ ...selectedCategory }}
              />
              <Button
                disabled={handlePermission(
                  hotelReducer.permission.permission,
                  Modules.MATERIALS,
                  ActionType.create,
                  true
                )}
                type="submit"
                variant="outlined"
                onClick={handleOpenMaterials}
              >
                <AddOutlinedIcon /> Add
              </Button>
            </div>
          </Box>
        </Box>

        <div className="training-videos">
          {materials.map((data, index) => (
            <div className="training-videos-card pointers" key={index}>
              <Card
                variant="outlined"
                className="videos-card-inner"
                onClick={() => redirect(`Display/${data.id}`)}
              >
                <div className="videos">
                  <img
                    className="product-image"
                    src={`${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${data.thumbnail}`}
                    alt="training"
                  />
                </div>
                <Box className="card-info">
                  <Typography variant="h5" component="div">
                    {data.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {data.description}
                  </Typography>
                  <div className="primary-btn"></div>
                </Box>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(Materials);
