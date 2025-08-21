import React from "react";
import { MenuItem, Menu } from "@mui/material";
import { isEmpty } from "lodash";

import "./style.scss";

const Filter = (props) => {
  return (
    <React.Fragment>
      <Menu
        anchorEl={props.anchorEl}
        id="account-menu"
        open={props.filterButton}
        onClose={props.handleClose}
        onClick={props.handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {props.categories.map((category, index) => (
          <div>
            <MenuItem
              onClick={() => props.handleFilterCategory(category)}
              className={
                !isEmpty(props.selectedCategory) &&
                props.selectedCategory.SubCategory &&
                props.selectedCategory.id === category.id
                  ? "select-filter main-filter"
                  : "main-filter"
              }
              key={index}
            >
              <div className="filter">
                <div className="list">{category.name}</div>
              </div>
            </MenuItem>

            <div className="filter-list">
              {category.SubCategory?.map((subCategory) => (
                <MenuItem
                  onClick={() => props.handleFilterSubCategory(subCategory)}
                  className={
                    !isEmpty(props.selectedCategory) &&
                    props.selectedCategory.SubCategory === undefined &&
                    props.selectedCategory.id === subCategory.id
                      ? "select-filter main-filter"
                      : "main-filter"
                  }
                  key={index}
                >
                  <div className="filter">
                    <div className="list">{subCategory.name}</div>
                  </div>
                </MenuItem>
              ))}
            </div>
          </div>
        ))}
      </Menu>
    </React.Fragment>
  );
};

export default Filter;
