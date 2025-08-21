/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { connect, useDispatch } from "react-redux";
import {
  ADD_OUTLET_TABLE_BY_GROUP,
  ERROR,
  INPROGRESS,
  LOGOUT,
} from "../../../../../utils/AdminDashboard/Constant";
import { clearAccessToken } from "../../../../../utils";
import { bindActionCreators } from "redux";

import * as UserAction from "../../../../../Action/AdminDashboard";
import ConfirmTable from "../../../BookingOverView/ListingView/ConfirmTable";

var reader = new FileReader();

const AddPrivateRoom = (props) => {
  const dispatch = useDispatch();
  const { open, handleClose } = props;
  const [imageDisplay, setImageDisplay] = useState(null);
  const [isImageUpload, setIsImageUpload] = useState(true);
  const [confirmTable, setConfirmTable] = useState(false);

  const [outletTableData, setOutletTableData] = useState({
    name: "",
    minPax: 0,
    maxPax: 0,
    image: null,
    description: "",
    price: "",
    originalPrice: "",
    color: "#000000",
    blockTime: "",
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...outletTableData };
    commonData[field] = event.target.value;
    return setOutletTableData(commonData);
  };

  reader.onload = function (e) {
    setImageDisplay(e.target.result);
  };

  const handleImageUpload = (event) => {
    setOutletTableData({
      ...outletTableData,
      image: event.target.files[0],
    });
    setIsImageUpload(false);
    reader.readAsDataURL(event.target.files[0]);
  };

  const confirmTables = (selectedTables, seatType) => {
    let sectionTableIds = [];
    let noOfPersonList = [];
    let maxCapacity = 0;

    selectedTables.map((table, index) => {
      noOfPersonList.push(table?.Table.noOfPerson);
      sectionTableIds.push(table.id);
      if (index === 0) {
        maxCapacity += table?.Table.noOfPerson;
      } else {
        maxCapacity += table?.Table.noOfPerson;
      }
    });

    noOfPersonList.sort(function (a, b) {
      return a - b;
    });

    const data = {
      ...outletTableData,
      outletTables: sectionTableIds,
      minPax: noOfPersonList[0] + 1,
      maxPax: maxCapacity,
    };

    dispatch({ type: INPROGRESS });
    UserAction.addOutletTableByGroup({ ...data }, seatType)
      .then((response) => {
        if (response.status === 201) {
          handleClose();
          handleCloseConfirmTable();
          setOutletTableData({});
          dispatch({
            type: ADD_OUTLET_TABLE_BY_GROUP,
            data: response.data,
          });
        }
      })

      .catch((error) => {
        handleCloseConfirmTable();
        if (error && error.response) {
          if (error.response.status === 401) {
            clearAccessToken();
            dispatch({
              type: LOGOUT,
            });
          } else {
            dispatch({
              type: ERROR,
              data: { error_msg: error.response.data.message },
            });
          }
        } else {
          dispatch({
            type: ERROR,
            data: { error_msg: error.message.toString() },
          });
        }
      });
  };

  const handleCloseConfirmTable = () => {
    setConfirmTable(false);
  };

  const handleOpenConfirmTable = () => {
    setConfirmTable(true);
  };

  const getBookingTablesAction = () => {
    handleOpenConfirmTable();
  };

  return (
    <React.Fragment>
      {confirmTable && (
        <ConfirmTable
          open={confirmTable}
          handleCloseConfirmTable={handleCloseConfirmTable}
          confirmTables={confirmTables}
          getTableInfo={{ ...outletTableData }}
          bookingType={"PRIVATE_ROOM_CREATION"}
          isSection={false}
        />
      )}

      <Dialog open={open} onClose={handleClose}>
        <ValidatorForm
          onSubmit={() => getBookingTablesAction()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Add Private Room</DialogTitle>
          </Box>
          <DialogContent
            sx={{ width: "600px", maxWidth: "600px" }}
            className="popup-body"
          >
            <div className="popup-input-box w-50">
              <Typography>Name</Typography>
              <TextValidator
                fullWidth
                size="small"
                type="text"
                name="name"
                value={outletTableData.name}
                placeholder="Enter Name"
                sx={{ marginTop: 0 }}
                validators={["required"]}
                onChange={handleChange}
                errorMessages={["Name is required"]}
              />
            </div>

            <div className="popup-input-box w-50">
              <Typography>Unit Price</Typography>
              <TextValidator
                fullWidth
                size="small"
                type="number"
                name="originalPrice"
                value={outletTableData.originalPrice}
                placeholder="Enter Unit Price"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["minNumber:0"]}
                errorMessages={["Unit Price should be more than 0"]}
              />
            </div>

            <div className="popup-input-box w-50">
              <Typography>Deposit Price</Typography>
              <TextValidator
                fullWidth
                size="small"
                type="number"
                name="price"
                value={outletTableData.price}
                placeholder="Enter Deposit Price"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["minNumber:0"]}
                errorMessages={["Deposit Price should be more than 0"]}
              />
            </div>

            <div className="popup-input-box w-50">
              <Typography>Block Time (In Minutes)</Typography>
              <TextValidator
                fullWidth
                size="small"
                type="number"
                name="blockTime"
                value={outletTableData.blockTime}
                placeholder="Enter Block Time"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["required", "minNumber:0"]}
                errorMessages={[
                  "Block Time is required",
                  "Block Time should be more than 0",
                ]}
              />
            </div>

            <div className="popup-input-box w-100">
              <Typography>Description</Typography>
              <TextValidator
                fullWidth
                size="small"
                type="text"
                name="description"
                value={outletTableData.description}
                multiline
                rows={4}
                placeholder="Enter Description"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
              />
            </div>

            <div className="popup-input-box w-50">
              <Typography>Upload Image</Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                {outletTableData.image && (
                  <img
                    className="product-image"
                    src={imageDisplay}
                    alt="demo"
                  />
                )}
                <div className="primary-btn popup-btn">
                  <Button variant="contained" component="label">
                    Upload
                    <input
                      name="image"
                      accept=".jpeg,.jpg,.png/*"
                      hidden
                      type="file"
                      onChange={(event) => handleImageUpload(event)}
                      validators={["required"]}
                    />
                  </Button>
                </div>
              </Stack>
              {isImageUpload && <p className="danger">Image Is Required</p>}
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button
              variant="outlined"
              onClick={handleClose}
              className="close-btn"
            >
              <CloseOutlinedIcon /> Close
            </Button>
            <Button
              type="submit"
              variant="contained"
              className="add-btn"
              disabled={isImageUpload}
            >
              Next
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(AddPrivateRoom);
