/* eslint-disable array-callback-return */
import React, { useEffect } from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import moment from "moment-timezone";
import { uniqueId } from "lodash";

import { getCriteriaFilter, numberFilter } from "../../../../utils/Criteria";

const AddTagging = (props) => {
  const { handleCloseAutoTagging, handleSaveAutoTagging } = props;
  const genderSelection = ["Male", "Female"];
  const privateSelection = ["True", "False"];
  const bookingTypeSelection = [
    "PRIVATE_EVENT",
    "NORMAL_RESERVATION",
    "TICKETING_EVENT",
  ];
  const statusSelection = [
    { id: "BOOKED", value: "Booked" },
    { id: "CONFIRMED", value: "Confirmed" },
    { id: "POSTPONED", value: "Postponed" },
    { id: "CANCELLED", value: "Cancelled" },
    { id: "NOSHOW", value: "Noshow" },
    { id: "SEATED", value: "Seated" },
    { id: "LEFT", value: "Left" },
  ];
  const monthSelection = [
    { id: "01", value: "January" },
    { id: "02", value: "February" },
    { id: "03", value: "March" },
    { id: "04", value: "April" },
    { id: "05", value: "May" },
    { id: "06", value: "June" },
    { id: "07", value: "July" },
    { id: "08", value: "August" },
    { id: "09", value: "September" },
    { id: "10", value: "October" },
    { id: "11", value: "November" },
    { id: "12", value: "December" },
  ];
  const saluationType = [
    {
      code: 0,
      name: "Ms.",
    },
    {
      code: 1,
      name: "Miss.",
    },
    {
      code: 2,
      name: "Mdm.",
    },
    {
      code: 3,
      name: "Mrs.",
    },
    {
      code: 4,
      name: "Dr.",
    },
    {
      code: 5,
      name: "Mr.",
    },
  ];
  const criterias = [
    { fieldName: "Birthday", backEnd: "dob", value: "monthFilter" },
    { fieldName: "Gender", backEnd: "gender", value: "gender" },
    { fieldName: "Address", backEnd: "address", value: "text" },
    { fieldName: "Postal Code", backEnd: "postalCode", value: "text" },
    {
      fieldName: "Activation Date",
      backEnd: "createdAt",
      value: "date",
    },
    { fieldName: "Average Spend", backEnd: "averageSpend", value: "number" },
    { fieldName: "Eat Points", backEnd: "eatPoints", value: "number" },
    {
      fieldName: "Last Transaction Date",
      backEnd: "lastTransactionDate",
      value: "date",
    },
    { fieldName: "Status", backEnd: "status", value: "status" },
    {
      fieldName: "Reservation Date",
      backEnd: "bookingDate",
      value: "date",
    },
    { fieldName: "Meal Type", backEnd: "mealType", value: "mealType" },
    { fieldName: "Booking Type", backEnd: "bookingType", value: "bookingType" },
    {
      fieldName: "Pre Order Items",
      backEnd: "preOrder",
      value: "preOrderItems",
    },
    {
      fieldName: "Private Room",
      backEnd: "isPrivateTableBooked",
      value: "privateBooking",
    },
    {
      fieldName: "Dining Options",
      backEnd: "dinningOptions",
      value: "diningOptions",
    },
    { fieldName: "Occasion", backEnd: "occasion", value: "occasion" },
    { fieldName: "Occasion Date", backEnd: "occasionDate", value: "monthFilter" },

    {
      fieldName: "Dietary Restriction",
      backEnd: "dietaryRestriction",
      value: "dietaryRestriction",
    },
  ];
  const [autoTaggingData, setAutoTaggingData] = useState({
    tagId: "",
    criteria: [],
  });
  const [outletList, setOutletList] = useState([]);

  useEffect(() => {
    if (props.selectedCompany) {
      const outlets = [];
      props.selectedCompany?.Outlet.map((outlet) =>
        outlets.push({ outletId: outlet.id, name: outlet.name })
      );
      if (outlets) {
        setOutletList(outlets);
      }
    }
  }, [props.selectedCompany]);

  const handleAddCriteria = () => {
    const id = uniqueId();
    const tempMarketingData = { ...autoTaggingData };
    tempMarketingData.criteria.push({
      id,
      criteriaValue: monthSelection[0].id,
      criteriaValue1: monthSelection[1].id,
      criteriaType: criterias[0],
      critetiaFilter: numberFilter[0].value,
      criteriaFilterDisplay: numberFilter[0].display,
    });
    setAutoTaggingData({ ...tempMarketingData });
  };

  const handleChangeCriteriaType = (event, criteria) => {
    const fieldName = event.target.value;
    const tempMarketingData = { ...autoTaggingData };
    const findCriteria = criterias.find((data) => data.fieldName === fieldName);

    const findMarketingData = tempMarketingData.criteria.find(
      (data) => data.id === criteria.id
    );
    if (findCriteria && findMarketingData) {
      const criteriaFilterType = getCriteriaFilter(findCriteria.value);

      if (criteriaFilterType) {
        findMarketingData.critetiaFilter = criteriaFilterType[0].value;
        findMarketingData.criteriaFilterDisplay = criteriaFilterType[0].display;
      }

      findMarketingData.criteriaType = findCriteria;

      if (findCriteria.value === "date") {
        findMarketingData.criteriaValue = new Date();
      } else if (findCriteria.value === "monthFilter") {
        findMarketingData.criteriaValue = monthSelection[0].id;
      } else if (findCriteria.value === "gender") {
        findMarketingData.criteriaValue = genderSelection[0];
      } else if (findCriteria.value === "outlet") {
        findMarketingData.criteriaValue = outletList[0];
      } else if (findCriteria.value === "status") {
        findMarketingData.criteriaValue = statusSelection[0].id;
      } else if (findCriteria.value === "salutation") {
        findMarketingData.criteriaValue = saluationType[0].name;
      } else if (findCriteria.value === "mealType") {
        findMarketingData.criteriaValue = props.mealTypes[0].name;
      } else if (findCriteria.value === "privateBooking") {
        findMarketingData.criteriaValue = privateSelection[0];
      } else if (findCriteria.value === "occasion") {
        findMarketingData.criteriaValue = props.outletOccasion[0].name;
      } else if (findCriteria.value === "diningOptions") {
        findMarketingData.criteriaValue = props.diningOptions[0].name;
      } else if (findCriteria.value === "dietaryRestriction") {
        findMarketingData.criteriaValue = props.dietaryRestriction[0].name;
      } else if (findCriteria.value === "preOrderItems") {
        findMarketingData.criteriaValue = props.preorders[0].name;
      } else if (findCriteria.value === "bookingType") {
        findMarketingData.criteriaValue = bookingTypeSelection[0];
      } else {
        findMarketingData.criteriaValue = "";
      }
      setAutoTaggingData({
        ...tempMarketingData,
      });
    }
  };

  const handleChangeCriteriaFilter = (event, criteria) => {
    const criteriaFilterType = getCriteriaFilter(criteria);
    const tempMarketingData = { ...autoTaggingData };
    const findCriterieaType = criteriaFilterType.find(
      (filter) => filter.value === event.target.value
    );
    const findMarketingData = tempMarketingData.criteria.find(
      (data) => data.id === criteria.id
    );
    if (findMarketingData && findCriterieaType) {
      findMarketingData.critetiaFilter = event.target.value;
      findMarketingData.criteriaFilterDisplay = findCriterieaType.display;

      setAutoTaggingData({
        ...tempMarketingData,
      });
    }
  };

  const handleChangeCriteriaValue = (event, criteria, isValue1 = false) => {
    const tempMarketingData = { ...autoTaggingData };
    const findMarketingData = tempMarketingData.criteria.find(
      (data) => data.id === criteria.id
    );
    if (findMarketingData) {
      if (isValue1) {
        findMarketingData.criteriaValue1 = event.target.value;
      } else {
        findMarketingData.criteriaValue = event.target.value;
      }
      setAutoTaggingData({
        ...tempMarketingData,
      });
    }
  };

  const handleChangeOutletValue = (event, criteria) => {
    const tempMarketingData = { ...autoTaggingData };
    const findMarketingData = tempMarketingData.criteria.find(
      (data) => data.id === criteria.id
    );
    const findOutlet = outletList.find(
      (outlet) => outlet.outletId === event.target.value
    );
    if (findOutlet && findMarketingData) {
      findMarketingData.criteriaValue = findOutlet;
      setAutoTaggingData({
        ...tempMarketingData,
      });
    }
  };

  const handleChangeDate = (date, criteria, isValue1 = false) => {
    const tempMarketingData = { ...autoTaggingData };
    const findMarketingData = tempMarketingData.criteria.find(
      (data) => data.id === criteria.id
    );
    if (findMarketingData) {
      if (isValue1) {
        findMarketingData.criteriaValue1 = date;
      } else {
        findMarketingData.criteriaValue = date;
      }

      setAutoTaggingData({
        ...tempMarketingData,
      });
    }
  };

  const handleCategory = (event) => {
    setAutoTaggingData({ ...autoTaggingData, tagId: event.target.value });
  };

  const handleDeleteRow = (criteria) => {
    const tempMarketingData = { ...autoTaggingData };
    const findMarketingData = tempMarketingData.criteria.find(
      (data) => data.id === criteria.id
    );
    if (findMarketingData) {
      let index = tempMarketingData.criteria.indexOf(findMarketingData);
      tempMarketingData.criteria.splice(index, 1);
      setAutoTaggingData({
        ...tempMarketingData,
      });
    }
  };

  const renderCriteriaFilter = (criteria) => {
    const criteriaFilterType = getCriteriaFilter(criteria.criteriaType.value);
    return (
      <FormControl>
        <Select
          size="small"
          value={criteria.critetiaFilter}
          name="criteria_criteria"
          inputProps={{ "aria-label": "Without label" }}
          onChange={(event) => handleChangeCriteriaFilter(event, criteria)}
        >
          {criteriaFilterType.map((data, index) => (
            <MenuItem key={index} value={data.value}>
              {data.display}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const getBirthdayMonth = (backendValue) => {
    const findMonth = monthSelection.find((month) => month.id === backendValue);
    return findMonth.value;
  };

  const handleAddMarketing = () => {
    let tempMarketingData = [];
    const tempData = { ...autoTaggingData };
    tempData.criteria.map((data) => {
      if (data.criteriaType.value === "monthFilter") {
        if (data.critetiaFilter === "BETWEEN") {
          data.criteriaValue = {
            value1: data.criteriaValue,
            value2: data.criteriaValue1,
            displayValue1: getBirthdayMonth(data.criteriaValue),
            displayValue2: getBirthdayMonth(data.criteriaValue1),
          };
        } else {
          data.displayValue = getBirthdayMonth(data.criteriaValue);
        }
      } else if (data.criteriaType.value === "date") {
        if (data.critetiaFilter === "BETWEEN") {
          data.criteriaValue = {
            value1: moment(data.criteriaValue).format("DD-MM-YYYY"),
            value2: moment(data.criteriaValue1).format("DD-MM-YYYY"),
            displayValue1: moment(data.criteriaValue).format("DD-MM-YYYY"),
            displayValue2: moment(data.criteriaValue1).format("DD-MM-YYYY"),
          };
        } else {
          data.displayValue = moment(data.criteriaValue).format("DD-MM-YYYY");
          data.criteriaValue = moment(data.criteriaValue).format("DD-MM-YYYY");
        }
      } else {
        data.displayValue = data.criteriaValue;
      }
      data.displayName = data.criteriaType.fieldName;
      data.criteriaType = data.criteriaType.backEnd;

      tempMarketingData.push({
        displayName: data.displayName,
        fieldName: data.criteriaType,
        criteria: data.critetiaFilter,
        displayCriteria: data.criteriaFilterDisplay,
        value: data.criteriaValue,
        displayValue: data.displayValue,
      });
    });

    const data = { ...tempData, criteria: tempMarketingData };
    handleSaveAutoTagging(data);
    handleCloseAutoTagging();
  };

  return (
    <React.Fragment>
      <ValidatorForm
        onSubmit={() => handleAddMarketing()}
        autoComplete="off"
        className="popup-layout"
      >
        <Box className="popup-header">
          <DialogTitle>Add New Auto Tag</DialogTitle>
        </Box>
        <DialogContent sx={{ width: "800px" }} className="popup-body">
          {autoTaggingData.criteria.length > 0 && (
            <Typography
              sx={{ width: "100%", padding: "0 10px", fontWeight: "bold" }}
            >
              Criteria
            </Typography>
          )}

          {autoTaggingData.criteria.map((criteria) => (
            <React.Fragment>
              <div className="popup-input-box w-100">
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "20px",
                  }}
                >
                  <div className="popup-input-box w-33 justify-end p-0">
                    <FormControl>
                      <Select
                        size="small"
                        value={criteria.criteriaType.fieldName}
                        name="criteria_fieldName"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={(event) =>
                          handleChangeCriteriaType(event, criteria)
                        }
                      >
                        {criterias.map((data, index) => (
                          <MenuItem key={index} value={data.fieldName}>
                            {data.fieldName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="popup-input-box w-33 justify-end p-0">
                    {renderCriteriaFilter(criteria)}
                  </div>

                  {criteria.criteriaType.value === "number" && (
                    <div className="popup-input-box w-33 justify-end p-0">
                      <TextValidator
                        fullWidth
                        size="small"
                        margin="normal"
                        type="number"
                        name="criteria_value"
                        value={criteria.criteriaValue}
                        placeholder="Enter Value"
                        sx={{ marginTop: 0 }}
                        onChange={(event) =>
                          handleChangeCriteriaValue(event, criteria)
                        }
                        validators={["required", "minNumber:1"]}
                        errorMessages={[
                          "Value is required",
                          "Value should be more than 1",
                        ]}
                      />
                    </div>
                  )}

                  {/* starting of regular date selection*/}
                  {criteria.criteriaType.value === "date" &&
                    criteria.criteriaType.fieldName !== "Birthday" && (
                      <div className="date-picker popup-input-box w-30 justify-end p-0">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DesktopDatePicker
                            className="date-pic"
                            value={criteria.criteriaValue}
                            onChange={(newValue) => {
                              handleChangeDate(new Date(newValue), criteria);
                            }}
                            inputFormat="DD-MM-YYYY"
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </LocalizationProvider>
                      </div>
                    )}

                  {criteria.critetiaFilter === "BETWEEN" &&
                    criteria.criteriaType.fieldName !== "Birthday" &&
                    criteria.criteriaType.fieldName !== "Occasion Date" && (
                      <div className="date-picker popup-input-box w-30 justify-end p-0">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DesktopDatePicker
                            className="date-pic"
                            value={criteria.criteriaValue1}
                            onChange={(newValue) => {
                              handleChangeDate(
                                new Date(newValue),
                                criteria,
                                true
                              );
                            }}
                            inputFormat="DD-MM-YYYY"
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </LocalizationProvider>
                      </div>
                    )}

                  {criteria.criteriaType.fieldName === "Birthday" && (
                    <div className="popup-input-box w-30 justify-end p-0">
                      <Select
                        value={criteria.criteriaValue}
                        size="small"
                        name="monthFilter"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={(event) =>
                          handleChangeCriteriaValue(event, criteria)
                        }
                      >
                        {monthSelection.map((month, index) => (
                          <MenuItem key={index} value={month.id}>
                            {month.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  )}

                  {criteria.criteriaType.fieldName === "Birthday" &&
                    criteria.critetiaFilter === "BETWEEN" && (
                      <div className="date-picker popup-input-box w-30 justify-end p-0">
                        <Select
                          value={criteria.criteriaValue1}
                          size="small"
                          name="monthFilter"
                          inputProps={{ "aria-label": "Without label" }}
                          onChange={(event) =>
                            handleChangeCriteriaValue(event, criteria, true)
                          }
                        >
                          {monthSelection.map((status, index) => (
                            <MenuItem key={index} value={status.id}>
                              {status.value}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>
                    )}

                  {criteria.criteriaType.fieldName === "Occasion Date" && (
                    <div className="popup-input-box w-30 justify-end p-0">
                      <Select
                        value={criteria.criteriaValue}
                        size="small"
                        name="Occasion Date"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={(event) =>
                          handleChangeCriteriaValue(event, criteria)
                        }
                      >
                        {monthSelection.map((month, index) => (
                          <MenuItem key={index} value={month.id}>
                            {month.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  )}

                  {criteria.criteriaType.fieldName === "Occasion Date" &&
                    criteria.critetiaFilter === "BETWEEN" && (
                      <div className="date-picker popup-input-box w-30 justify-end p-0">
                        <Select
                          value={criteria.criteriaValue1}
                          size="small"
                          name="Occasion Date"
                          inputProps={{ "aria-label": "Without label" }}
                          onChange={(event) =>
                            handleChangeCriteriaValue(event, criteria, true)
                          }
                        >
                          {monthSelection.map((status, index) => (
                            <MenuItem key={index} value={status.id}>
                              {status.value}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>
                    )}

                  {criteria.criteriaType.value === "text" && (
                    <div className="popup-input-box w-30 justify-end p-0">
                      <TextValidator
                        fullWidth
                        size="small"
                        margin="normal"
                        type="text"
                        name="criteriaValue"
                        value={criteria.criteriaValue}
                        placeholder="Enter Value"
                        sx={{ marginTop: 0 }}
                        onChange={(event) =>
                          handleChangeCriteriaValue(event, criteria)
                        }
                        validators={["required"]}
                        errorMessages={["Value is required"]}
                      />
                    </div>
                  )}
                  {criteria.criteriaType.value === "gender" && (
                    <div className="popup-input-box w-30 justify-end p-0">
                      <Select
                        value={criteria.criteriaValue}
                        size="small"
                        name="contentLanguage"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={(event) =>
                          handleChangeCriteriaValue(event, criteria)
                        }
                      >
                        {genderSelection.map((gender, index) => (
                          <MenuItem key={index} value={gender}>
                            {gender}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  )}

                  {criteria.criteriaType.value === "status" && (
                    <div className="popup-input-box w-30 justify-end p-0">
                      <Select
                        value={criteria.criteriaValue}
                        size="small"
                        name="status"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={(event) =>
                          handleChangeCriteriaValue(event, criteria)
                        }
                      >
                        {statusSelection.map((status, index) => (
                          <MenuItem key={index} value={status.id}>
                            {status.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  )}

                  {criteria.criteriaType.value === "salutation" && (
                    <div className="popup-input-box w-30 justify-end p-0">
                      <Select
                        value={criteria.criteriaValue}
                        size="small"
                        name="salutation"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={(event) =>
                          handleChangeCriteriaValue(event, criteria)
                        }
                      >
                        {saluationType.map((salutaion, index) => (
                          <MenuItem key={index} value={salutaion.name}>
                            {salutaion.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  )}

                  {criteria.criteriaType.value === "privateBooking" && (
                    <div className="popup-input-box w-30 justify-end p-0">
                      <Select
                        value={criteria.criteriaValue}
                        size="small"
                        name="contentLanguage"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={(event) =>
                          handleChangeCriteriaValue(event, criteria)
                        }
                      >
                        {privateSelection.map((gender, index) => (
                          <MenuItem key={index} value={gender}>
                            {gender}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  )}

                  {criteria.criteriaType.value === "mealType" && (
                    <div className="popup-input-box w-30 justify-end p-0">
                      <Select
                        value={criteria.criteriaValue}
                        size="small"
                        name="mealType"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={(event) =>
                          handleChangeCriteriaValue(event, criteria)
                        }
                      >
                        {props.mealTypes.map((mealType, index) => (
                          <MenuItem key={index} value={mealType.name}>
                            {mealType.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  )}

                  {criteria.criteriaType.value === "occasion" && (
                    <div className="popup-input-box w-30 justify-end p-0">
                      <Select
                        value={criteria.criteriaValue}
                        size="small"
                        name="occasion"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={(event) =>
                          handleChangeCriteriaValue(event, criteria)
                        }
                      >
                        {props.outletOccasion.map((mealType, index) => (
                          <MenuItem key={index} value={mealType.name}>
                            {mealType.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  )}

                  {criteria.criteriaType.value === "bookingType" && (
                    <div className="popup-input-box w-30 justify-end p-0">
                      <Select
                        value={criteria.criteriaValue}
                        size="small"
                        name="bookingType"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={(event) =>
                          handleChangeCriteriaValue(event, criteria)
                        }
                      >
                        {bookingTypeSelection.map((bookingType, index) => (
                          <MenuItem key={index} value={bookingType}>
                            {bookingType}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  )}

                  {criteria.criteriaType.value === "diningOptions" && (
                    <div className="popup-input-box w-30 justify-end p-0">
                      <Select
                        value={criteria.criteriaValue}
                        size="small"
                        name="diningOptions"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={(event) =>
                          handleChangeCriteriaValue(event, criteria)
                        }
                      >
                        {props.diningOptions.map((dinniing, index) => (
                          <MenuItem key={index} value={dinniing.name}>
                            {dinniing.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  )}

                  {criteria.criteriaType.value === "dietaryRestriction" && (
                    <div className="popup-input-box w-30 justify-end p-0">
                      <Select
                        value={criteria.criteriaValue}
                        size="small"
                        name="diningOptions"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={(event) =>
                          handleChangeCriteriaValue(event, criteria)
                        }
                      >
                        {props.dietaryRestriction.map((dinniing, index) => (
                          <MenuItem key={index} value={dinniing.name}>
                            {dinniing.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  )}

                  {criteria.criteriaType.value === "preOrderItems" && (
                    <div className="popup-input-box w-30 justify-end p-0">
                      <Select
                        value={criteria.criteriaValue}
                        size="small"
                        name="preorders"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={(event) =>
                          handleChangeCriteriaValue(event, criteria)
                        }
                      >
                        {props.preorders.map((preorder, index) => (
                          <MenuItem key={index} value={preorder.name}>
                            {preorder.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  )}

                  {criteria.criteriaType.value === "outlet" && (
                    <div className="popup-input-box w-30 justify-end p-0">
                      <Select
                        value={criteria.criteriaValue.outletId}
                        size="small"
                        name="contentLanguage"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={(event) =>
                          handleChangeOutletValue(event, criteria)
                        }
                      >
                        {outletList.map((outlet, index) => (
                          <MenuItem key={index} value={outlet.outletId}>
                            {outlet.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  )}

                  {autoTaggingData.criteria.length > 1 && (
                    <DeleteOutlinedIcon
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => handleDeleteRow(criteria)}
                    />
                  )}
                </Box>
              </div>
            </React.Fragment>
          ))}

          <Box sx={{ padding: "10px" }}>
            <Button
              variant="contained"
              onClick={handleAddCriteria}
              disabled={autoTaggingData.criteria.length > 4}
            >
              <AddOutlinedIcon /> Add Criteria
            </Button>
          </Box>

          <div className="popup-input-box w-100">
            <Typography>Tags</Typography>
            {props.tags && (
              <FormControl size="small" sx={{ width: 450 }}>
                <Select
                  id="tagId"
                  margin="normal"
                  type="text"
                  value={autoTaggingData.tagId}
                  name="tagId"
                  onChange={handleCategory}
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
        </DialogContent>
        <DialogActions className="primary-btn popup-btn">
          <Button variant="outlined" onClick={handleCloseAutoTagging}>
            <CloseOutlinedIcon /> Close
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={
              autoTaggingData.criteria.length === 0 ||
              autoTaggingData.tagId === ""
            }
          >
            <AddOutlinedIcon /> Add
          </Button>
        </DialogActions>
      </ValidatorForm>
    </React.Fragment>
  );
};
export default AddTagging;
