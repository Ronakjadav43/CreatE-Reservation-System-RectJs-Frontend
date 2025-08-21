/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Card, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import { isEmpty } from "lodash";

import { useNavigate } from "react-router-dom";
import {
  ActionType,
  Modules,
  handlePermission,
} from "../../../../utils/userAccess";
import "./style.scss";

const CustomerList = (props) => {
  const navigate = useNavigate();
  const [customerList, setCustomerList] = useState([]);
  const [filterList, setFilteredList] = useState([]);
  const hotelReducer = useSelector((state) => ({
    permission: state.hotelReducer.permission,
  }));

  const redirect = (url) => {
    navigate(url);
  };

  useEffect(() => {
    const hasPermission = handlePermission(
      hotelReducer.permission.permission,
      Modules.CUSTOMERMANAGEMENT,
      ActionType.read
    );
    if (!hasPermission) {
      redirect("/Admin");
    }
  }, [hotelReducer.permission]);

  const groupNames = (arr) => {
    arr.sort((a, b) =>
      a.name.localeCompare(b.name, "es", { sensitivity: "base" })
    );
    let data = arr.reduce((r, e) => {
      // get first letter of name of current element
      let alphabet = e.name[0];

      // if there is no property in accumulator with this letter create it
      if (!r[alphabet]) r[alphabet] = { alphabet, record: [e] };
      // if there is push current element to children array for that letter
      else r[alphabet].record.push(e);

      // return accumulator
      return r;
    }, {});
    return Object.values(data);
  };

  useEffect(() => {
    if (props.customers) {
      const filterByName = groupNames(props.customers);
      setCustomerList([...props.customers]);
      setFilteredList([...filterByName]);
    }
  }, [props.customers]);

  const searchItems = (value) => {
    if (!isEmpty(value)) {
      const filteredData = customerList.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(value.toLowerCase());
      });
      const filterByName = groupNames(filteredData);
      setFilteredList([...filterByName]);
    } else {
      const filterByName = groupNames(customerList);
      setFilteredList([...filterByName]);
    }
  };

  return (
    <React.Fragment>
      <TextField
        className="search-box"
        sx={{ width: "250px" }}
        size="small"
        placeholder="Search"
        onChange={(e) => searchItems(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Card className="customer-list">
        {filterList.map((records, index) => {
          return (
            <div className="customer-list-group" key={index}>
              <div className="group-header">
                {records.alphabet}&nbsp;({records.record.length})
              </div>
              {records.record.map((customer, index) => (
                <div className="customer-list-inner" Key={index}>
                  <div
                    className={
                      !isEmpty(props.selectedCustomer) &&
                      props.selectedCustomer.id === customer.id
                        ? "select customer-name"
                        : "customer-name"
                    }
                    onClick={() => props.handleChangeCustomer(customer)}
                  >{`${customer.name} ${customer.lastName}`}</div>
                </div>
              ))}
            </div>
          );
        })}
      </Card>
    </React.Fragment>
  );
};

export default CustomerList;
